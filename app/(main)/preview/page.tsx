'use client';

import { useState } from 'react';
import { Canvas2D } from '@/components/2d/Canvas';
import { ToolBar } from '@/components/2d/ToolBar';
import { useAppStore } from '@/lib/store';

export default function PreviewPage() {
  const [currentTool, setCurrentTool] = useState<'select' | 'wall' | 'door' | 'window' | 'delete'>('select');
  const plan2D = useAppStore((state) => state.plan.plan2D);

  const handleGenerate3D = () => {
    const regenerate3D = useAppStore.getState().regenerate3D;
    regenerate3D();
  };

  if (!plan2D) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-gray-500">평면도를 먼저 업로드해주세요.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">2D 프리뷰</h1>
            <p className="text-gray-600 mt-1">
              인식된 요소: 벽 {plan2D.walls.length}개, 문 {plan2D.doors.length}개, 창문 {plan2D.windows.length}개
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← 뒤로 가기
          </button>
        </div>

        {/* 도구 모음 */}
        <ToolBar onToolChange={(tool) => setCurrentTool(tool)} />

        {/* 캔버스 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Canvas2D width={800} height={600} tool={currentTool} />
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGenerate3D}
            className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium shadow-sm"
          >
            3D로 변환 →
          </button>
        </div>
      </div>
    </main>
  );
}
