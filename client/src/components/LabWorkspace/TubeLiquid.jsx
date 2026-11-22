import React from 'react';

const PRECIPITATE_TEXTURE = [
  'radial-gradient(circle at 20% 45%, rgba(255, 255, 255, 0.28) 1px, transparent 1.5px)',
  'radial-gradient(circle at 65% 35%, rgba(0, 0, 0, 0.28) 1.2px, transparent 1.8px)',
  'radial-gradient(circle at 42% 70%, rgba(255, 255, 255, 0.22) 1px, transparent 1.6px)',
  'radial-gradient(circle at 82% 65%, rgba(0, 0, 0, 0.25) 1px, transparent 1.6px)',
  'radial-gradient(circle at 30% 25%, rgba(0, 0, 0, 0.22) 1px, transparent 1.5px)',
  'radial-gradient(circle at 55% 55%, rgba(255, 255, 255, 0.2) 0.9px, transparent 1.4px)',
].join(', ');

const PRECIPITATE_CLIP =
  'polygon(0% 24%, 14% 8%, 28% 20%, 44% 5%, 60% 18%, 76% 4%, 90% 16%, 100% 10%, 100% 100%, 0% 100%)';

export default function TubeLiquid({
  volume = 0,
  color = '#E8F4FA',
  effect = 'none',
}) {
  const hasPrecipitate = effect === 'precipitate' && volume > 0;

  return (
    <div
      className="relative w-full transition-all duration-500 ease-in-out"
      style={{
        height: `${volume}%`,
        backgroundColor: color,
      }}
    >
      {/* Hiệu ứng bong bóng khí (bubbles) */}
      {effect === 'bubbles' && (
        <div className="absolute inset-0 flex justify-around items-center overflow-hidden opacity-75">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
          <span className="w-1 h-1 bg-white rounded-full animate-bounce delay-200"></span>
        </div>
      )}

      {/* Hiệu ứng kết tủa đáy ống (precipitate): lớp cặn hạt lồi lõm, tông đậm theo màu chất lỏng */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none transition-all duration-500 ease-out"
        style={{
          height: hasPrecipitate ? '18%' : '0%',
          minHeight: hasPrecipitate ? '14px' : '0px',
          opacity: hasPrecipitate ? 1 : 0,
          backgroundColor: color,
          filter: 'brightness(0.7)',
          backgroundImage: PRECIPITATE_TEXTURE,
          backgroundSize: '24px 18px',
          clipPath: PRECIPITATE_CLIP,
        }}
      />

      {/* Hiệu ứng huyền phù đục (cloudy) */}
      {effect === 'cloudy' && (
        <div className="absolute inset-0 border-t-2 border-slate-300/80 bg-gradient-to-b from-slate-200/60 via-slate-100/75 to-slate-300/70 backdrop-blur-[1px] overflow-hidden">
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/80 blur-[2px]" />
          <div className="absolute top-7 right-2 w-8 h-5 rounded-full bg-white/75 blur-[3px]" />
          <div className="absolute bottom-6 left-3 w-7 h-6 rounded-full bg-white/80 blur-[2px]" />
          <div className="absolute bottom-2 right-3 w-5 h-4 rounded-full bg-slate-200/70 blur-[2px]" />
        </div>
      )}
    </div>
  );
}
