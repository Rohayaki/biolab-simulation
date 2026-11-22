import React from 'react';

export default function SourceZone({ tools = [], activeTool = null, onSelectTool }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-full shadow-sm">
      <div className="border-b border-slate-200 pb-2 mb-3 min-h-[48px] flex flex-col justify-center">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
          Kho vật tư (chỉ đọc)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Click để cầm dụng cụ hoặc hoá chất</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {tools.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Không có dụng cụ nào</p>
        ) : (
          tools.map((tool) => {
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool.id)}
                className={`w-full text-left p-3 rounded-md border text-sm transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold ring-2 ring-blue-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{tool.name}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
