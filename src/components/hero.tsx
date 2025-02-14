import React from 'react';
import { SearchBar } from './search-bar';

export function Hero() {
  return (
    <section className="bg-background-secondary py-20 mb-12">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-text-primary">
            <span className="md:hidden">
              家族で楽しめる
              <br />
              公園を見つけよう
            </span>
            <span className='hidden md:inline'>
              家族で楽しめる公園を
              <br />
              見つけよう
            </span>
          </h1>
        </div>
        <div className="max-w-2xl mx-auto mt-4">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
