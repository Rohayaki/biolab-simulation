import React from 'react';

export default function StepProgress({ steps = [], currentStep = 0 }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm mb-3">
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.step_order || idx}
              className={`flex items-center justify-center px-4 py-1.5 rounded text-xs font-medium transition-all duration-500 ${
                isDone
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isCurrent
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 font-bold'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {/* Nhãn Bước N có whitespace-nowrap, không hiển thị action/required_tool/target/error_message để tránh lộ đáp án */}
              <span className="whitespace-nowrap">
                Bước {step.step_order || idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
