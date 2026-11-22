import React from 'react';

export default function ErrorModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-l-4 border-red-500 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-full flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">Thao tác chưa chính xác!</h3>
            <p className="text-sm text-slate-600 mt-2">
              {message || 'Vui lòng kiểm tra lại thứ tự và dụng cụ cần thao tác cho bước này.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-md transition-colors text-sm shadow-sm"
          >
            Đã hiểu và thử lại
          </button>
        </div>
      </div>
    </div>
  );
}
