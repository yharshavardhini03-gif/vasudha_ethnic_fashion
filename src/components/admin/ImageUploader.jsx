import React, { useState, useRef } from 'react';
import { Upload, X, Star, ArrowUp, ArrowDown, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export const ImageUploader = ({ images, setImages }) => {
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)
    );

    const newUrls = validFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMain = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const updated = [...prev];
      const [item] = updated.splice(index, 1);
      updated.unshift(item);
      return updated;
    });
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 sm:p-8 border-2 border-dashed transition-all cursor-pointer text-center bg-[#FAF7F2] ${
          dragOver
            ? 'border-[#0C3B10] bg-[#DBAB7D]/20 scale-[1.01]'
            : 'border-[#0C3B10]/20 hover:border-[#DBAB7D]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-full bg-white border border-[#DBAB7D] flex items-center justify-center text-[#0C3B10] mx-auto mb-3 shadow-sm">
          <Upload className="w-6 h-6 text-[#DBAB7D]" />
        </div>
        <h4 className="font-serif text-base font-bold text-[#0C3B10]">
          Drag & Drop Product Images Here
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          Supports JPG, JPEG, PNG, WEBP. Click to browse files from your computer or phone.
        </p>
      </div>

      {/* URL Fallback Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste an image web URL (e.g. Unsplash or Cloudinary)..."
            className="w-full bg-[#FAF7F2] border border-gray-300 pl-9 pr-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
        >
          Add Image
        </button>
      </div>

      {/* Previews Grid */}
      {images.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#0C3B10] mb-2 flex items-center justify-between">
            <span>Uploaded Images ({images.length})</span>
            <span className="text-gray-400 font-normal">First image will be the Main Cover</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-[3/4] overflow-hidden border-2 bg-white group shadow-sm ${
                  idx === 0 ? 'border-[#0C3B10]' : 'border-gray-200'
                }`}
              >
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

                {/* Main Badge */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-[#0C3B10] text-[#DBAB7D] text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shadow">
                    Cover Image
                  </span>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                  <div className="flex justify-between items-center">
                    {idx !== 0 ? (
                      <button
                        type="button"
                        onClick={() => handleSetMain(idx)}
                        className="p-1 bg-[#DBAB7D] text-[#0C3B10] text-[9px] font-bold px-1.5 uppercase hover:bg-white"
                        title="Set as Main Cover"
                      >
                        Set Main
                      </button>
                    ) : <span />}

                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 bg-red-600 text-white hover:bg-red-700"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-2">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        className="p-1 bg-white/20 hover:bg-white text-[#0C3B10] rounded-none"
                        title="Move left"
                      >
                        <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        className="p-1 bg-white/20 hover:bg-white text-[#0C3B10] rounded-none"
                        title="Move right"
                      >
                        <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
