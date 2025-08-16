'use client';

import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface FullScreenLoaderProps {
  isVisible: boolean;
  status: string;
  progress: number;
  isCompleted: boolean;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isVisible,
  status,
  progress,
  isCompleted
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* アイコン表示 */}
        {isCompleted ? (
          // 完了時のチェックマーク
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg animate-bounce-in">
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          // 処理中のスピナー
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <LoadingSpinner size="lg" color="white" />
          </div>
        )}

        {/* ステータステキスト */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {isCompleted ? '送信完了！' : '処理中...'}
          </h2>
          <p className="text-gray-600 text-sm animate-pulse">
            {status}
          </p>
        </div>

        {/* プログレスバー */}
        {!isCompleted && (
          <div className="w-64 mx-auto space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full w-full opacity-30 bg-white animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-gray-500">{Math.round(progress)}% 完了</p>
          </div>
        )}

        {/* 注意書き */}
        {!isCompleted && (
          <p className="text-xs text-gray-400 mt-8">
            処理中はページを閉じないでください
          </p>
        )}

        {/* 完了メッセージ */}
        {isCompleted && (
          <p className="text-sm text-green-600 font-medium mt-4">
            講師確認書を正常に送信しました
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};