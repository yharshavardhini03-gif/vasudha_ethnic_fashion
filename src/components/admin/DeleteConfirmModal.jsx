import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border-2 border-red-500/40 max-w-md w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-serif text-xl font-bold text-[#0C3B10]">
            Remove Product?
          </h3>
          <p className="text-xs text-gray-600">
            Are you sure you want to remove <strong className="text-[#0C3B10]">"{productName}"</strong> from your store catalog? This action will immediately unlist it from customer searches and Vasudha AI.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md"
          >
            REMOVE PRODUCT
          </button>
        </div>
      </div>
    </div>
  );
};
