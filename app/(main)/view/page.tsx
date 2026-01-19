'use client';

import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';

const Scene3D = dynamic(() => import('@/components/3d/Scene').then(mod => ({ default: mod.Scene3D })), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-800 flex items-center justify-center">로딩 중...</div>
});

export default function ViewPage() {
  const plan3D = useAppStore((state) => state.plan.plan3D);

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">3D 뷰어</h1>
            <p className="text-gray-400 mt-1">
              평면도를 3D로 확인하세요.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
          >
            ← 뒤로 가기
          </button>
        </div>

        {/* 3D 뷰어 */}
        <Scene3D />

        {/* 요약 정보 */}
        {plan3D && (
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400">
              <span className="text-white font-medium">요약:</span> 벽 {plan3D.walls.length}개, 문 {plan3D.doors.length}개, 창문 {plan3D.windows.length}개
            </p>
          </div>
        )}

        {/* 안내 */}
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">인터랙션 가이드</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• 드래그: 회전</li>
            <li>• 스크롤: 줌 인/아웃</li>
            <li>• Shift + 드래그: 이동</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
