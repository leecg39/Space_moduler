'use client';

import React, { useEffect, useState } from 'react';

interface AnalysisPageProps {
  onComplete: () => void;
  onCancel: () => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ onComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          onComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#f9f6ef] flex flex-col">
      <header className="flex items-center justify-between px-10 py-4 border-b border-stone-200">
        <div className="flex items-center gap-4">
          <div className="text-primary-violet">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48">
              <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold">Space Moduler</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white/50 rounded-lg hover:bg-white"><span className="material-symbols-outlined">settings</span></button>
          <button className="p-2 bg-white/50 rounded-lg hover:bg-white"><span className="material-symbols-outlined">help</span></button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">AI 분석 진행 중</h2>
          <p className="text-stone-500">2D 평면도를 정교한 3D 환경으로 변환하고 있습니다</p>
        </div>

        <div className="relative w-full aspect-video bg-stone-200 rounded-2xl overflow-hidden shadow-2xl mb-12 border-4 border-white">
          <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: 'url("https://picsum.photos/1200/800?grayscale")' }}></div>
          {/* Scanning Bar Animation */}
          <div className="absolute w-full h-1 bg-primary-violet/80 shadow-[0_0_20px_4px_#6467f2] animate-scan z-10"></div>

          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary-violet rounded-full animate-pulse shadow-[0_0_10px_#6467f2]"></div>
            <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-primary-violet rounded-full animate-pulse shadow-[0_0_10px_#6467f2] delay-300"></div>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xl font-bold">{progress < 50 ? '벽면 찾는 중...' : progress < 80 ? '가구 식별 중...' : '공간 최적화 중...'}</p>
              <p className="text-sm text-stone-500">{progress < 50 ? '3단계 중 1단계: 구조 추출' : progress < 80 ? '3단계 중 2단계: 가구 배치' : '3단계 중 3단계: 렌더링 준비'}</p>
            </div>
            <p className="text-lg font-bold text-primary-violet">{progress}%</p>
          </div>
          <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-violet transition-all duration-300 shadow-[0_0_15px_rgba(100,103,242,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-stone-400">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <p className="text-sm">예상 소요 시간: {Math.max(0, Math.floor((100 - progress) / 5))}초</p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="mt-12 flex items-center gap-2 px-6 py-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-white transition-all text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          분석 취소
        </button>
      </main>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default AnalysisPage;
