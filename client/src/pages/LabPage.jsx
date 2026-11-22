import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LabProvider, useLab, LAB_ACTIONS } from '../context/LabContext';
import { getExperimentById } from '../services/experimentApi';
import LabWorkspace from '../components/LabWorkspace/LabWorkspace';

function LabContent() {
  const { id } = useParams();
  const { state, dispatch } = useLab();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExperiment() {
      setIsLoading(true);
      setError(null);

      try {
        const experimentData = await getExperimentById(id);
        if (cancelled) return;
        dispatch({
          type: LAB_ACTIONS.SET_EXPERIMENT,
          payload: experimentData,
        });
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Không thể tải bài thí nghiệm.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadExperiment();

    return () => {
      cancelled = true;
    };
  }, [id, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center"
          >
            ← Danh sách thí nghiệm
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-base font-semibold text-slate-800">
            {state.experiment?.title || 'Phòng thí nghiệm ảo'}
          </h1>
        </div>
      </nav>

      {/* Main Lab Workspace */}
      <main className="flex-1 p-4 flex flex-col">
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-base font-medium">Đang tải bài thí nghiệm...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg m-6 text-center">
            <p className="font-semibold">Không thể tải bài thí nghiệm</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!isLoading && !error && <LabWorkspace />}
      </main>
    </div>
  );
}

export default function LabPage() {
  return (
    <LabProvider>
      <LabContent />
    </LabProvider>
  );
}
