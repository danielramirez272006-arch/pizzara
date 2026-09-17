import React from 'react';
import { HeroBanner } from '../../components/home/hero-banner';
import { PizarrasDestacadas } from '../../components/home/pizarras-destacadas';

export const HomePage = () => {
  return (
    <div className="page home-page">
      <HeroBanner />
      <PizarrasDestacadas />
    </div>
  );
};
