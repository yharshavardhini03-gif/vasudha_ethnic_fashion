import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

export const SizeGuideModal = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState('inches'); // 'inches' or 'cm'

  if (!isOpen) return null;

  const sizeChart = [
    { size: 'XS', bust: unit === 'inches' ? '32-34' : '81-86', waist: unit === 'inches' ? '26-28' : '66-71', hip: unit === 'inches' ? '36-38' : '91-96', length: unit === 'inches' ? '46-48' : '116-121' },
    { size: 'S', bust: unit === 'inches' ? '34-36' : '86-91', waist: unit === 'inches' ? '28-30' : '71-76', hip: unit === 'inches' ? '38-40' : '96-101', length: unit === 'inches' ? '46-48' : '116-121' },
    { size: 'M', bust: unit === 'inches' ? '36-38' : '91-96', waist: unit === 'inches' ? '30-32' : '76-81', hip: unit === 'inches' ? '40-42' : '101-106', length: unit === 'inches' ? '48-50' : '121-127' },
    { size: 'L', bust: unit === 'inches' ? '38-40' : '96-101', waist: unit === 'inches' ? '32-34' : '81-86', hip: unit === 'inches' ? '42-44' : '106-111', length: unit === 'inches' ? '48-50' : '121-127' },
    { size: 'XL', bust: unit === 'inches' ? '40-42' : '101-106', waist: unit === 'inches' ? '34-36' : '86-91', hip: unit === 'inches' ? '44-46' : '111-116', length: unit === 'inches' ? '50-52' : '127-132' },
    { size: 'XXL', bust: unit === 'inches' ? '42-44' : '106-111', waist: unit === 'inches' ? '36-38' : '91-96', hip: unit === 'inches' ? '46-48' : '116-121', length: unit === 'inches' ? '50-52' : '127-132' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFFFF] border border-[#DBAB7D]/40 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#0C3B10] hover:text-[#DBAB7D] p-1 transition-colors"
          aria-label="Close Size Guide"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 text-[#DBAB7D] mb-1">
          <Ruler className="w-5 h-5" />
          <span className="text-xs tracking-[0.2em] uppercase font-semibold">Boutique Fit Standard</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif text-[#0C3B10] mb-2">
          Vasudha Size & Measurement Guide
        </h3>
        <p className="text-sm text-[#666666] mb-6">
          Our silhouettes are tailored with classic Indian boutique ease. If you fall between sizes, we recommend selecting the larger size for tailored alteration ease.
        </p>

        {/* Unit Switcher */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex border border-[#0C3B10]/20 p-1 bg-[#FAF7F2]">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-semibold tracking-wider transition-all ${
                unit === 'inches'
                  ? 'bg-[#0C3B10] text-[#FFFFFF]'
                  : 'text-[#0C3B10] hover:text-[#DBAB7D]'
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-semibold tracking-wider transition-all ${
                unit === 'cm'
                  ? 'bg-[#0C3B10] text-[#FFFFFF]'
                  : 'text-[#0C3B10] hover:text-[#DBAB7D]'
              }`}
            >
              CENTIMETERS
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#0C3B10]/10 mb-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0C3B10] text-[#FFFFFF]">
              <tr>
                <th className="p-3 font-semibold tracking-wider">SIZE</th>
                <th className="p-3 font-semibold tracking-wider">BUST ({unit.toUpperCase()})</th>
                <th className="p-3 font-semibold tracking-wider">WAIST ({unit.toUpperCase()})</th>
                <th className="p-3 font-semibold tracking-wider">HIP ({unit.toUpperCase()})</th>
                <th className="p-3 font-semibold tracking-wider">KURTA LENGTH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C3B10]/10">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-3 font-bold text-[#0C3B10]">{row.size}</td>
                  <td className="p-3 text-[#1A1A1A]">{row.bust}</td>
                  <td className="p-3 text-[#1A1A1A]">{row.waist}</td>
                  <td className="p-3 text-[#1A1A1A]">{row.hip}</td>
                  <td className="p-3 text-[#666666]">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Saree Note */}
        <div className="bg-[#FAF7F2] p-4 border-l-2 border-[#DBAB7D] text-xs text-[#0C3B10] leading-relaxed flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#DBAB7D] flex-shrink-0 mt-0.5" />
          <div>
            <strong>Sarees:</strong> All sarees are standard 5.5 meters length and include an unstitched 0.8 meter matching pure fabric blouse piece unless specified otherwise.
          </div>
        </div>
      </div>
    </div>
  );
};
