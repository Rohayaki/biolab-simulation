import React from 'react';
import { Link } from 'react-router-dom';

export default function ExperimentCard({ experiment }) {
  const { _id, title, description } = experiment || {};

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{title || 'Tên bài thí nghiệm'}</h2>
        <p className="text-sm text-slate-600 line-clamp-3 mb-4">{description || 'Mô tả bài thí nghiệm...'}</p>
      </div>
      <div>
        <Link
          to={`/experiments/${_id || ''}`}
          className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Bắt đầu
        </Link>
      </div>
    </div>
  );
}
