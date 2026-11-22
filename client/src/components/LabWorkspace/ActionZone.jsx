import React from 'react';
import TestTube from './TestTube';

export default function ActionZone({ tubes = [], activeTool = null, toolName = null, onActOnTube }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-full shadow-sm">
      {/* Header card: chuẩn min-h-[48px] pb-2 mb-3 border-b */}
      <div className="border-b border-slate-200 pb-2 mb-3 min-h-[48px] flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
            Bàn thí nghiệm
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Click vào ống nghiệm để thao tác</p>
        </div>
        {activeTool && (
          <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-medium truncate max-w-[200px]">
            Đang cầm: {toolName || activeTool}
          </span>
        )}
      </div>

      {/* Phần thân flex-1 flex flex-col justify-end, bỏ đệm thừa không đối xứng */}
      <div className="flex-1 flex items-end justify-around overflow-x-auto">
        {tubes.length === 0 ? (
          <p className="text-xs text-slate-400 italic mb-auto">Không có ống nghiệm nào trên bàn</p>
        ) : (
          tubes.map((tube) => (
            <TestTube
              key={tube.id}
              tube={tube}
              onClick={() => onActOnTube(tube.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
