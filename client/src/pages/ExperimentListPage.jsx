import React, { useState, useEffect } from 'react';
import ExperimentCard from '../components/ExperimentCard';
import { getExperiments } from '../services/experimentApi';

export default function ExperimentListPage() {
  // Trạng thái cục bộ phục vụ hiển thị 3 trạng thái tĩnh
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExperiments() {
      setIsLoading(true);
      setError(null);

      try {
        const list = await getExperiments();
        if (cancelled) return;
        setExperiments(Array.isArray(list) ? list : []);
      } catch (err) {
        if (cancelled) return;
        setExperiments([]);
        setError(err.message || 'Không thể kết nối tới máy chủ.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadExperiments();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Sinh học 10 - Bài 6: Thực hành nhận biết một số phân tử sinh học
        </h1>
        <p className="text-slate-600 mt-1">
          Chọn một bài thí nghiệm bên dưới để bắt đầu mô phỏng tương tác phòng thí nghiệm ảo.
        </p>
      </header>

      {/* 3 Trạng thái UI tĩnh theo yêu cầu */}

      {/* 1. Trạng thái Đang tải (Loading) */}
      {isLoading && (
        <div className="py-16 text-center text-slate-500">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-base font-medium">Đang tải danh sách thí nghiệm...</p>
        </div>
      )}

      {/* 2. Trạng thái Lỗi tải (Error) */}
      {!isLoading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg my-6 text-center">
          <p className="font-semibold">Không thể tải danh sách thí nghiệm</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* 3. Trạng thái Danh sách rỗng (Empty) */}
      {!isLoading && !error && experiments.length === 0 && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center text-slate-500 my-6">
          <p className="text-lg font-medium text-slate-600">Chưa có bài thí nghiệm nào</p>
          <p className="text-sm mt-1">Dữ liệu bài thí nghiệm đang được chuẩn bị hoặc cơ sở dữ liệu trống.</p>
        </div>
      )}

      {/* Danh sách thẻ Card thí nghiệm (grid 3 cột) */}
      {!isLoading && !error && experiments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <ExperimentCard key={exp._id} experiment={exp} />
          ))}
        </div>
      )}
    </div>
  );
}
