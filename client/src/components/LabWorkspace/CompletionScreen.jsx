import React from 'react';
import { Link } from 'react-router-dom';

export default function CompletionScreen({ title, onReset }) {
  return (
    <div className="w-full bg-emerald-50 rounded-lg border border-emerald-200 p-3 shadow-sm mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-emerald-900">
          Chúc mừng bạn đã hoàn thành thí nghiệm: <strong>{title}</strong>
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-md text-xs transition-colors border border-slate-300"
        >
          Làm lại bài này
        </button>
        <Link
          to="/"
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm"
        >
          Trở về danh sách thí nghiệm
        </Link>
      </div>
    </div>
  );
}
