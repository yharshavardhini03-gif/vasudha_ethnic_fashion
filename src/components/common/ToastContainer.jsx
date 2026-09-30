import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-[#DBAB7D] flex-shrink-0" />;
        let borderStyle = "border-[#DBAB7D]/40 bg-[#0C3B10] text-[#FFFFFF]";

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
          borderStyle = "border-red-500/40 bg-[#0C3B10] text-[#FFFFFF]";
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-[#DBAB7D] flex-shrink-0" />;
          borderStyle = "border-[#DBAB7D]/40 bg-[#0C3B10] text-[#FFFFFF]";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-none border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-fade-up ${borderStyle}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-xs sm:text-sm font-medium tracking-wide leading-tight">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 transition-colors ml-2"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
