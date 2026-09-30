import React from 'react';
import { ShieldCheck, Award, Smartphone, Truck, Sparkles } from 'lucide-react';

export const TrustStrip = () => {
  const trustFeatures = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#DBAB7D]" />,
      title: "Authentic Styles",
      desc: "100% genuine handloom & silk mark certified"
    },
    {
      icon: <Award className="w-5 h-5 text-[#DBAB7D]" />,
      title: "Premium Quality",
      desc: "Pure zari, organic cotton & master tailoring"
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#DBAB7D]" />,
      title: "Easy Ordering",
      desc: "Seamless WhatsApp, AI & online checkout"
    },
    {
      icon: <Truck className="w-5 h-5 text-[#DBAB7D]" />,
      title: "Fast Delivery",
      desc: "3–5 days express dispatch across India"
    }
  ];

  return (
    <section className="bg-[#FFFFFF] border-b border-[#0C3B10]/10 py-6 sm:py-8 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {trustFeatures.map((feat, index) => (
            <div
              key={index}
              className="flex items-start gap-3.5 group p-2 hover:bg-[#FAF7F2] transition-colors"
            >
              <div className="p-2.5 bg-[#FAF7F2] border border-[#DBAB7D]/40 group-hover:bg-[#0C3B10] group-hover:border-[#0C3B10] transition-colors flex-shrink-0">
                {React.cloneElement(feat.icon, {
                  className: "w-5 h-5 text-[#0C3B10] group-hover:text-[#DBAB7D] transition-colors"
                })}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-[#0C3B10] uppercase tracking-wider">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-[#666666] leading-tight mt-0.5 font-light">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
