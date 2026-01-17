'use client';

import { Canvas2D } from '@/components/2d/Canvas';

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">2D 프리뷰</h1>
            <p className="text-gray-600 mt-1">
              인식된 평면도를 확인하고 수정하세요.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← 뒤로 가기
          </button>
        </div>

        {/* 캔버스 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Canvas2D width={800} height={600} />
        </div>

        {/* 도구 모음 (추후 구현) */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                벽 추가
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                문 추가
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                창문 추가
              </button>
            </div>
            <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
              3D로 변환 →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
