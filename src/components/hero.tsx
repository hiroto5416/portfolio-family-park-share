import React from 'react';
import { SearchBar } from './search-bar';

export function Hero() {
  return (
    <section className="bg-background-secondary py-20 mb-12">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-text-primary">
            家族で楽しめる公園を
            <br />
            見つけよう
          </h1>
        </div>
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
