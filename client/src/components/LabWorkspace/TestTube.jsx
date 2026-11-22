import React from 'react';
import TubeLiquid from './TubeLiquid';

export default function TestTube({ tube, isTarget = false, onClick }) {
  const volume = tube?.volume ?? tube?.initial_volume ?? 0;
  const color = tube?.color ?? tube?.initial_color ?? '#E8F4FA';
  const effect = tube?.effect || 'none';
  const label = tube?.label || tube?.id || 'Ống nghiệm';

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col items-center justify-end cursor-pointer transition-transform hover:-translate-y-1 rounded-lg ${
        isTarget ? 'ring-2 ring-blue-400 bg-blue-50/50' : ''
      }`}
    >
      {/* Khung ống nghiệm: kích thước chuẩn w-[76px] h-[210px], bo đáy tròn */}
      <div className="relative w-[76px] h-[210px] border-2 border-slate-400 border-t-0 rounded-b-full bg-slate-50 overflow-hidden shadow-inner flex flex-col justify-end">
        <TubeLiquid volume={volume} color={color} effect={effect} />
      </div>

      {/* Khối nhãn dưới ống: chiều cao cố định h-14 đồng bộ với ReferenceTube, căn giữa, truncate */}
      <div className="h-14 mt-3 flex flex-col justify-start items-center text-center w-full">
        <span className="text-xs font-semibold text-slate-700 block truncate max-w-[90px]">
          {label}
        </span>
        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
          {volume}%
        </span>
      </div>
    </div>
  );
}
