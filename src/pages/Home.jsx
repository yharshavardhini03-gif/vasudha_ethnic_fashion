import React from 'react';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { BrandStory } from '../components/home/BrandStory';
import { Testimonials } from '../components/home/Testimonials';

export const Home = ({ onOpenAI }) => {
  return (
    <div className="animate-fade-in">
      <Hero onOpenAI={onOpenAI} />
      <TrustStrip />
      <CategorySection />
      <FeaturedSection />
      <BrandStory />
      <Testimonials />
    </div>
  );
};
