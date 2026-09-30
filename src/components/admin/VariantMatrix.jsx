import React from 'react';
import { Layers, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

export const VariantMatrix = ({
  sizes,
  colors,
  variants,
  setVariants
}) => {
  // Ensure variants are present for every size x color combination
  const getStock = (size, color) => {
    const v = variants.find((item) => item.size === size && item.color === color);
    return v ? v.stock : 0;
  };

  const handleCellChange = (size, color, value) => {
    const stockVal = Math.max(0, parseInt(value, 10) || 0);

    setVariants((prev) => {
      const existingIdx = prev.findIndex((v) => v.size === size && v.color === color);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], stock: stockVal };
        return updated;
      } else {
        return [...prev, { size, color, stock: stockVal }];
      }
    });
  };

  const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);

  if (sizes.length === 0 || colors.length === 0) {
    return (
      <div className="p-6 bg-[#FAF7F2] border border-[#0C3B10]/10 text-center text-xs text-gray-500">
        Please select at least one Size and one Color above to generate the inventory matrix.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#0C3B10]/10">
        <div className="flex items-center gap-2 text-[#0C3B10] font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#DBAB7D]" />
          <span>Variant Stock Matrix ({sizes.length} Sizes × {colors.length} Colors)</span>
        </div>

        {/* Calculated Total Stock and Status */}
        <div className="flex items-center gap-3">
          <div className="text-xs">
            Total Inventory: <strong className="font-serif text-base text-[#0C3B10]">{totalStock} Units</strong>
          </div>
          {totalStock === 0 ? (
            <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase">
              Out of Stock
            </span>
          ) : totalStock <= 5 ? (
            <span className="px-2.5 py-0.5 bg-[#DBAB7D] text-[#0C3B10] text-[10px] font-bold uppercase shadow-sm">
              Low Stock Warning
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
              ✓ In Stock
            </span>
          )}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto border border-[#0C3B10]/10 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0C3B10] text-[#FFFFFF]">
            <tr>
              <th className="p-3 font-semibold tracking-wider">SIZE \ COLOR</th>
              {colors.map((col) => (
                <th key={col} className="p-3 font-semibold tracking-wider text-center">
                  {col}
                </th>
              ))}
              <th className="p-3 font-semibold tracking-wider text-right">SIZE TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sizes.map((sz) => {
              const sizeTotal = colors.reduce((sum, col) => sum + getStock(sz, col), 0);

              return (
                <tr key={sz} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="p-3 font-bold text-[#0C3B10] bg-[#FAF7F2]/80">{sz}</td>
                  {colors.map((col) => {
                    const currentStock = getStock(sz, col);

                    return (
                      <td key={col} className="p-2.5 text-center">
                        <input
                          type="number"
                          min="0"
                          value={currentStock}
                          onChange={(e) => handleCellChange(sz, col, e.target.value)}
                          className="w-16 mx-auto bg-[#FAF7F2] border border-gray-300 px-2 py-1 text-xs font-bold text-[#0C3B10] text-center focus:outline-none focus:border-[#0C3B10]"
                        />
                      </td>
                    );
                  })}
                  <td className="p-3 font-bold text-[#0C3B10] text-right bg-[#FAF7F2]/50">
                    {sizeTotal} units
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-400">
        Tip: Quantities typed into the matrix automatically synchronize with customer size selectors and Vasudha AI.
      </p>
    </div>
  );
};
