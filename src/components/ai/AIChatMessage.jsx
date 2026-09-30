import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles, User, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AIChatMessage = ({ message, onCloseDrawer }) => {
  const isAi = message.sender === 'ai';
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleViewProduct = (product) => {
    onCloseDrawer?.();
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product, product.sizes?.[0] || 'Free Size', product.color, 1);
  };

  return (
    <div className={`flex gap-3 mb-4 animate-fade-in ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 rounded-full bg-[#0C3B10] border border-[#DBAB7D] flex items-center justify-center text-[#DBAB7D] flex-shrink-0 mt-1 shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] ${isAi ? 'text-left' : 'text-right'}`}>
        {/* Chat text bubble */}
        <div
          className={`p-3.5 text-xs sm:text-sm leading-relaxed ${
            isAi
              ? 'bg-[#FAF7F2] text-[#1A1A1A] border border-[#DBAB7D]/40 rounded-none shadow-sm'
              : 'bg-[#0C3B10] text-[#FFFFFF] rounded-none shadow-sm ml-auto font-light'
          }`}
        >
          {message.text}
        </div>

        {/* Product Cards embedded inside the chat if recommended */}
        {isAi && message.products && message.products.length > 0 && (
          <div className="mt-3 space-y-2.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#DBAB7D] flex items-center gap-1">
              <span>✦ Recommended Handpicked Styles</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {message.products.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#0C3B10]/15 p-2.5 flex gap-3 shadow-sm hover:border-[#DBAB7D] transition-colors"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-20 object-cover border border-[#DBAB7D]/30 flex-shrink-0 bg-[#FAF7F2]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-[#DBAB7D] font-bold">
                        {item.category}
                      </div>
                      <h4 className="text-xs font-serif font-semibold text-[#0C3B10] line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="text-xs font-bold text-[#0C3B10] mt-0.5">
                        ₹{item.price.toLocaleString('en-IN')}
                        <span className="text-[10px] text-emerald-700 font-normal ml-1.5">
                          ✓ {item.stock > 0 ? 'In Stock' : 'Pre-order'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleViewProduct(item)}
                        className="flex-1 py-1 px-2 border border-[#0C3B10] text-[#0C3B10] text-[10px] font-bold uppercase tracking-wider hover:bg-[#0C3B10] hover:text-white transition-colors text-center"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-1 px-2 bg-[#DBAB7D] text-[#0C3B10] text-[10px] font-bold uppercase tracking-wider hover:bg-[#0C3B10] hover:text-white transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <span className="text-[9px] text-[#666666]/60 mt-1 block">
          {message.timestamp || 'Just now'}
        </span>
      </div>

      {!isAi && (
        <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#0C3B10]/20 flex items-center justify-center text-[#0C3B10] flex-shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
