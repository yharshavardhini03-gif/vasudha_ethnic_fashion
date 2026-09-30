import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      name: "Dr. Ananya Mukherjee",
      location: "Kolkata",
      occasion: "Bridal Reception",
      text: "The Kanjivaram silk saree I ordered for my reception was magnificent. The gold zari has a subtle, regal glow that photographs like a dream. Vasudha AI also helped me pick the right matching jewelry!",
      rating: 5,
      item: "Royal Emerald Kanjivaram Saree"
    },
    {
      name: "Sneha Kapoor",
      location: "Mumbai",
      occasion: "Sister's Sangeet",
      text: "I transitioned from their WhatsApp store to this website, and the experience is pure luxury. The 32-kali Chanderi Anarkali has an unbelievable flare. The express delivery arrived in 3 days in Mumbai.",
      rating: 5,
      item: "Zari Embroidered Anarkali Set"
    },
    {
      name: "Meera & Siddharth Iyer",
      location: "Bengaluru",
      occasion: "Festive Diwali",
      text: "Unmatched fabric authenticity. In a world of synthetic copies, Vasudha provides genuine pure silks with Silk Mark certification. Their team is warm, attentive, and deeply knowledgeable.",
      rating: 5,
      item: "Pastel Meadow Organza Saree"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FFFFFF] border-b border-[#0C3B10]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-[#DBAB7D] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patron Experiences</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0C3B10] font-normal tracking-tight">
            Loved By Connoisseurs
          </h2>
          <div className="w-16 h-0.5 bg-[#DBAB7D] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-[#666666] font-light">
            Real stories from our cherished community celebrating their most memorable milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 bg-[#FAF7F2] border border-[#0C3B10]/10 relative flex flex-col justify-between hover:border-[#DBAB7D] transition-colors"
            >
              <Quote className="w-8 h-8 text-[#DBAB7D]/40 mb-4" />

              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#DBAB7D] text-[#DBAB7D]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#1A1A1A] font-light leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#0C3B10]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#0C3B10]">
                    {rev.name}
                  </h4>
                  <span className="text-[11px] text-[#666666]">
                    {rev.location} • {rev.occasion}
                  </span>
                </div>
                <span className="text-[10px] bg-white border border-[#DBAB7D]/40 text-[#0C3B10] px-2 py-0.5 font-medium">
                  Verified Patron
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
