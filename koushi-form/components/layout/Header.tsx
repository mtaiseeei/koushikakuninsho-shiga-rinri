'use client';

import React from 'react';

interface HeaderProps {
  unitName?: string;
}

export const Header: React.FC<HeaderProps> = ({ unitName }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            講師確認書フォーム
          </h1>
          {unitName && (
            <p className="text-blue-100 text-lg">
              {unitName}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};