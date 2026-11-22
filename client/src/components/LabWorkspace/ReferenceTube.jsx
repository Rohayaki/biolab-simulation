import React from 'react';
import TubeLiquid from './TubeLiquid';

export default function ReferenceTube({
  referenceTube,
  tubeState,
  interactive = false,
  onClick,
}) {
  const volume = tubeState?.volume ?? referenceTube?.volume ?? 50;
  const color = tubeState?.color ?? referenceTube?.color ?? '#E8F4FA';
  const effect = tubeState?.effect ?? 'none';
  const label = referenceTube?.label || 'Nước cất';
  const subLabel = interactive ? 'Mẫu đối chứng' : 'Chỉ để so màu';

  return (
    <div
      className={`bg-white/80 rounded-lg border-2 border-dashed border-slate-300 p-4 flex flex-col h-full shadow-sm ${
        interactive ? '' : 'pointer-events-none select-none'
      }`}
    >
      {/* Header card: chuẩn min-h-[48px] pb-2 mb-3 border-b */}
      <div className="border-b border-slate-200 pb-2 mb-3 min-h-[48px] flex flex-col justify-center text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Đối chứng
        </span>
        <p className="text-xs text-slate-400 mt-0.5">Ống nước cất</p>
      </div>

      {/* Phần thân căn đáy flex-1 flex flex-col justify-end items-center */}
      <div className="flex-1 flex flex-col justify-end items-center">
        <div
          role={interactive ? 'button' : undefined}
          onClick={interactive ? onClick : undefined}
          className={`flex flex-col items-center justify-end rounded-lg ${
            interactive
              ? 'cursor-pointer transition-transform hover:-translate-y-1'
              : ''
          }`}
        >
          {/* Khung ống nghiệm chuẩn w-[76px] h-[210px] bo đáy */}
          <div className="relative w-[76px] h-[210px] border-2 border-slate-400 border-t-0 rounded-b-full bg-slate-50/50 overflow-hidden shadow-inner flex flex-col justify-end">
            <TubeLiquid volume={volume} color={color} effect={effect} />
          </div>

          {/* Khối nhãn dưới ống: chiều cao cố định h-14, căn giữa, truncate */}
          <div className="h-14 mt-3 flex flex-col justify-start items-center text-center w-full">
            <span className="text-xs font-semibold text-slate-700 block truncate max-w-[90px]">
              {label}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {subLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
