'use client';

import { useEffect, useState } from 'react';

/**
 * 로딩 스크린 컴포넌트
 * AI 분석 진행 상황을 보여주는 애니메이션
 */

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export function LoadingScreen({ message = '처리 중...', progress = 0 }: LoadingScreenProps) {
  const [dots, setDots] = useState('');
  const [scanPosition, setScanPosition] = useState(0);

  // 점 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 스캔 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 진행 상황에 따른 메시지 변화
  const getLoadingMessage = () => {
    if (progress < 20) return '벽을 찾는 중';
    if (progress < 50) return '문과 창문을 찾는 중';
    if (progress < 80) return '공간을 분석하는 중';
    return '거의 완료...';
  };

  const displayMessage = message || getLoadingMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-95 backdrop-blur-sm">
      <div className="text-center">
        {/* 스캔 애니메이션 */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* 그리드 배경 */}
          <div className="absolute inset-0 border-2 border-gray-200 rounded-lg">
            {/* 수직선 */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 border-l border-gray-200"
                style={{ left: `${i * 11.11}%` }}
              />
            ))}
            {/* 수평선 */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${i * 11.11}%` }}
              />
            ))}
          </div>

          {/* 스캔 라인 */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent transition-all duration-100"
            style={{ top: `${scanPosition}%` }}
          />

          {/* 하이라이트 박스 */}
          <div
            className="absolute w-16 h-16 border-2 border-primary-500 rounded shadow-lg"
            style={{
              top: `${Math.min(scanPosition, 84)}%`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* 메시지 */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          AI가 평면도를 분석 중입니다{dots}
        </h2>

        {/* 상세 메시지 */}
        <p className="text-gray-600 mb-6">{displayMessage}</p>

        {/* 진행 바 */}
        <div className="w-full max-w-md mx-auto">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>진행률</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* 예상 시간 */}
        {progress < 100 && (
          <p className="mt-4 text-sm text-gray-500">
            예상 시간: {Math.ceil((100 - progress) / 10)}초
          </p>
        )}
      </div>
    </div>
  );
}
