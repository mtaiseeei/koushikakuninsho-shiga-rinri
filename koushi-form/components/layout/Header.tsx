'use client';

import React from 'react';

interface HeaderProps {
  unitName?: string;
}

export const Header: React.FC<HeaderProps> = ({ unitName }) => {
  return (
    <header className="relative overflow-hidden">
      {/* 背景グラデーション - design.mdのプライマリグラデーション仕様 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #667EEA 0%, #4C63D2 100%)',
        }}
      />
      
      {/* オーバーレイパターン for depth */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* 光沢エフェクト */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
        }}
      />
      
      {/* メインコンテンツ */}
      <div className="relative z-10 text-white" style={{ height: '160px' }}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* ロゴアイコンエリア */}
            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <svg 
                className="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            
            {/* タイトル部分 */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                講師確認書フォーム
              </h1>
              {unitName && (
                <p className="text-blue-100 text-sm md:text-base mt-0.5 font-medium">
                  {unitName}
                </p>
              )}
            </div>
          </div>
          
          {/* 右側の装飾要素 */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg 
                className="w-4 h-4 text-blue-200" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="text-sm text-blue-100 font-medium">オンライン申請</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg 
                className="w-4 h-4 text-blue-200" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="text-sm text-blue-100 font-medium">24時間受付</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ボトムシャドウ for depth */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
        }}
      />
    </header>
  );
};