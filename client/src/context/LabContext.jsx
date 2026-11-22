import React, { createContext, useContext, useReducer } from 'react';

// Ánh xạ hành động tương tác theo tool.type (không đổi từ DB)
export const TOOL_ACTION_MAP = {
  chemical: 'inject',
  heater: 'heat',
  shaker: 'shake',
};

// Trạng thái ban đầu theo chuẩn bio-lab-workspace-ui
export const initialState = {
  experiment: null,        // document từ GET /experiments/:id
  currentStep: 0,          // chỉ số trong experiment.steps (0-based)
  activeTool: null,        // null | tool.id | 'pour_from:<tube_id>'
  tubes: {},               // { [tube_id]: { volume, color, effect } }, nạp từ experiment.tubes (KHÔNG gồm reference_tube)
  status: 'idle',          // 'idle' | 'playing' | 'error' | 'completed'
  errorMessage: '',        // error_message của bước hiện tại khi thao tác sai
};

// Danh sách các Action Types
export const LAB_ACTIONS = {
  SET_EXPERIMENT: 'SET_EXPERIMENT',
  SELECT_TOOL: 'SELECT_TOOL',
  APPLY_STEP_SUCCESS: 'APPLY_STEP_SUCCESS',
  APPLY_STEP_ERROR: 'APPLY_STEP_ERROR',
  CLOSE_ERROR_MODAL: 'CLOSE_ERROR_MODAL',
  RESET_LAB: 'RESET_LAB',
};

function buildTubesFromExperiment(experiment) {
  const tubes = {};
  if (!experiment) return tubes;

  if (Array.isArray(experiment.tubes)) {
    for (const tube of experiment.tubes) {
      tubes[tube.id] = {
        volume: tube.initial_volume,
        color: tube.initial_color,
        effect: 'none',
      };
    }
  }

  if (experiment.reference_tube?.id) {
    tubes[experiment.reference_tube.id] = {
      volume: experiment.reference_tube.volume,
      color: experiment.reference_tube.color,
      effect: 'none',
    };
  }

  return tubes;
}

function startExperiment(experiment) {
  return {
    experiment,
    currentStep: 0,
    activeTool: null,
    tubes: buildTubesFromExperiment(experiment),
    status: 'playing',
    errorMessage: '',
  };
}

function labReducer(state, action) {
  switch (action.type) {
    case LAB_ACTIONS.SET_EXPERIMENT: {
      return startExperiment(action.payload);
    }

    case LAB_ACTIONS.SELECT_TOOL: {
      return {
        ...state,
        activeTool: action.payload,
      };
    }

    case LAB_ACTIONS.APPLY_STEP_SUCCESS: {
      const experiment = state.experiment;
      const steps = experiment?.steps || [];
      const step = steps[state.currentStep];
      if (!step) return state;

      const update = step.success_ui_update || {};
      const targetId = step.target;
      const currentTarget = state.tubes[targetId] || {
        volume: 0,
        color: '#E8F4FA',
        effect: 'none',
      };

      const nextTubes = {
        ...state.tubes,
        [targetId]: {
          volume: Math.min(100, (currentTarget.volume || 0) + (update.addedVolume || 0)),
          color: update.colorCode ?? currentTarget.color,
          effect: update.effect ?? 'none',
        },
      };

      if (step.action === 'pour') {
        const sourceId = step.required_tool;
        nextTubes[sourceId] = {
          ...(nextTubes[sourceId] || { color: '#E8F4FA', effect: 'none' }),
          volume: 0,
        };
      }

      const nextStepIndex = state.currentStep + 1;
      const isCompleted = nextStepIndex >= steps.length;

      return {
        ...state,
        tubes: nextTubes,
        activeTool: null,
        currentStep: nextStepIndex,
        status: isCompleted ? 'completed' : 'playing',
        errorMessage: '',
      };
    }

    case LAB_ACTIONS.APPLY_STEP_ERROR: {
      return {
        ...state,
        activeTool: null,
        status: 'error',
        errorMessage: action.payload || '',
      };
    }

    case LAB_ACTIONS.CLOSE_ERROR_MODAL: {
      return {
        ...state,
        status: 'playing',
        errorMessage: '',
      };
    }

    case LAB_ACTIONS.RESET_LAB: {
      if (!state.experiment) return { ...initialState };
      return startExperiment(state.experiment);
    }

    default:
      return state;
  }
}

const LabContext = createContext(null);

export function LabProvider({ children }) {
  const [state, dispatch] = useReducer(labReducer, initialState);

  return (
    <LabContext.Provider value={{ state, dispatch }}>
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
}
