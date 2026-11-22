import React from 'react';
import { useLab, LAB_ACTIONS, TOOL_ACTION_MAP } from '../../context/LabContext';
import StepProgress from './StepProgress';
import SourceZone from './SourceZone';
import ReferenceTube from './ReferenceTube';
import ActionZone from './ActionZone';
import ErrorModal from './ErrorModal';
import CompletionScreen from './CompletionScreen';

const POUR_PREFIX = 'pour_from:';

function getPourSourceId(activeTool) {
  if (typeof activeTool !== 'string' || !activeTool.startsWith(POUR_PREFIX)) {
    return null;
  }
  return activeTool.slice(POUR_PREFIX.length);
}

export default function LabWorkspace() {
  const { state, dispatch } = useLab();
  const { experiment, currentStep, activeTool, tubes, status, errorMessage } = state;
  const refTubeId = experiment?.reference_tube?.id;
  const isReferenceInteractive = Boolean(
    refTubeId && experiment?.steps?.some((s) => s.target === refTubeId)
  );

  const handleSelectTool = (toolId) => {
    if (status !== 'playing') return;
    if (getPourSourceId(activeTool)) return;

    dispatch({
      type: LAB_ACTIONS.SELECT_TOOL,
      payload: activeTool === toolId ? null : toolId,
    });
  };

  const scoreAction = (actionName, requiredTool, targetId) => {
    const step = experiment?.steps?.[currentStep];
    if (!step) return;

    const isCorrect =
      step.action === actionName &&
      step.required_tool === requiredTool &&
      step.target === targetId;

    if (isCorrect) {
      dispatch({ type: LAB_ACTIONS.APPLY_STEP_SUCCESS });
      return;
    }

    dispatch({
      type: LAB_ACTIONS.APPLY_STEP_ERROR,
      payload: step.error_message,
    });
  };

  const handleActOnTube = (tubeId) => {
    if (status !== 'playing' || !experiment) return;

    const isRefTube = tubeId === refTubeId;
    if (isRefTube && !isReferenceInteractive) return;

    const pourSourceId = getPourSourceId(activeTool);

    if (activeTool === null) {
      if (isRefTube) return;
      const hasMultipleTubes = (experiment.tubes || []).length >= 2;
      const tubeVolume = tubes[tubeId]?.volume || 0;
      if (hasMultipleTubes && tubeVolume > 0) {
        dispatch({
          type: LAB_ACTIONS.SELECT_TOOL,
          payload: `${POUR_PREFIX}${tubeId}`,
        });
      }
      return;
    }

    if (pourSourceId === tubeId) {
      dispatch({ type: LAB_ACTIONS.SELECT_TOOL, payload: null });
      return;
    }

    if (pourSourceId) {
      scoreAction('pour', pourSourceId, tubeId);
      return;
    }

    const selectedTool = (experiment.tools || []).find((tool) => tool.id === activeTool);
    const mappedAction = selectedTool ? TOOL_ACTION_MAP[selectedTool.type] : null;
    if (!mappedAction) return;

    scoreAction(mappedAction, activeTool, tubeId);
  };

  const handleCloseModal = () => {
    dispatch({ type: LAB_ACTIONS.CLOSE_ERROR_MODAL });
  };

  const handleResetLab = () => {
    dispatch({ type: LAB_ACTIONS.RESET_LAB });
  };

  // Chuyển tubes dạng Map hoặc Array từ state / experiment
  const tubeList = experiment?.tubes?.map((t) => ({
    ...t,
    ...(tubes[t.id] || {}),
  })) || [];

  let activeToolName = null;
  if (activeTool) {
    const pourSourceId = getPourSourceId(activeTool);
    if (pourSourceId) {
      const sourceTube = (experiment?.tubes || []).find((tube) => tube.id === pourSourceId);
      activeToolName = sourceTube?.label || pourSourceId;
    } else {
      const selectedTool = (experiment?.tools || []).find((tool) => tool.id === activeTool);
      activeToolName = selectedTool?.name || null;
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full max-w-7xl mx-auto w-full">
      {/* 1. Thanh tiến trình các bước ở trên */}
      <StepProgress
        steps={experiment?.steps || []}
        currentStep={currentStep}
      />

      {/* Banner hoàn thành thí nghiệm (nằm giữa StepProgress và lưới 3 cột) */}
      {status === 'completed' && (
        <CompletionScreen
          title={experiment?.title || ''}
          onReset={handleResetLab}
        />
      )}

      {/* 2. Bố cục 3 cột: grid grid-cols-[minmax(0,1fr)_128px_minmax(0,1fr)] gap-3 */}
      <div className="flex-1 grid grid-cols-[minmax(0,1fr)_128px_minmax(0,1fr)] gap-3 min-h-[460px]">
        {/* Cột trái: Kho vật tư (Source Zone) */}
        <SourceZone
          tools={experiment?.tools || []}
          activeTool={activeTool}
          onSelectTool={handleSelectTool}
        />

        {/* Cột giữa: Ống đối chứng (Reference Tube) */}
        <ReferenceTube
          referenceTube={experiment?.reference_tube}
          tubeState={refTubeId ? tubes[refTubeId] : undefined}
          interactive={isReferenceInteractive}
          onClick={() => refTubeId && handleActOnTube(refTubeId)}
        />

        {/* Cột phải: Bàn thí nghiệm (Action Zone) */}
        <ActionZone
          tubes={tubeList}
          activeTool={activeTool}
          toolName={activeToolName}
          onActOnTube={handleActOnTube}
        />
      </div>

      {/* Modal báo lỗi khi thao tác sai bước */}
      <ErrorModal
        isOpen={status === 'error'}
        message={errorMessage}
        onClose={handleCloseModal}
      />
    </div>
  );
}
