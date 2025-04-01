import React from 'react';
import { SearchSection } from './search-section';

export function Hero() {
  return (
    <section className="bg-background-secondary py-12">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-text-primary">
            <span className="md:hidden">
              家族で楽しめる
              <br />
              公園を見つけよう
            </span>
            <span className="hidden md:inline">
              家族で楽しめる公園を
              <br />
              見つけよう
            </span>
          </h1>
        </div>
        <div className="max-w-2xl mx-auto mt-3">
          <SearchSection />
        </div>
      </div>
    </section>
  );
}
