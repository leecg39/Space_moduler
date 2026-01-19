'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';

// SSR 방지를 위한 동적 import
const ThreeViewer = dynamic(
  () => import('@/components/3d/ThreeViewer').then(mod => mod.ThreeViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-stone-100">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-stone-400 animate-spin">progress_activity</span>
          <p className="text-stone-500 mt-2">3D 뷰어 로딩 중...</p>
        </div>
      </div>
    )
  }
);

interface ViewerPageProps {
  onBack: () => void;
}

const ViewerPage: React.FC<ViewerPageProps> = ({ onBack }) => {
  const [view, setView] = useState<'top' | 'front' | '3d'>('3d');

  // Store에서 데이터 가져오기
  const originalImage = useAppStore((state) => state.plan.originalImage);
  const plan2D = useAppStore((state) => state.plan.plan2D);
  const analysis = useAppStore((state) => state.plan.analysis);

  return (
    <div className="h-screen bg-[#F9F7F2] relative flex flex-col overflow-hidden">
      {/* Main View Area */}
      <div className="absolute inset-0 z-0">
        {view === '3d' ? (
          // 3D 뷰 - ThreeViewer 컴포넌트 사용
          <div className="w-full h-full">
            <ThreeViewer className="w-full h-full" />
          </div>
        ) : view === 'top' ? (
          // 평면 뷰 - 원본 이미지 표시
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,#E5E1D8_0%,#DCD7CC_100%)] flex items-center justify-center">
            <div className="relative w-2/3 max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-8 border-white/40">
              {originalImage ? (
                <img src={originalImage} alt="평면도" className="w-full h-full object-contain bg-white" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                  <p className="text-stone-500">평면도 이미지가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 정면 뷰 - 분석 결과 표시
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,#E5E1D8_0%,#DCD7CC_100%)] flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl max-w-2xl">
              <h3 className="text-xl font-bold mb-4">분석 결과</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-blue-600">{analysis?.walls?.length || 0}</p>
                  <p className="text-sm text-blue-600">벽</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-amber-600">{analysis?.doors?.length || 0}</p>
                  <p className="text-sm text-amber-600">문</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-cyan-600">{analysis?.windows?.length || 0}</p>
                  <p className="text-sm text-cyan-600">창문</p>
                </div>
              </div>
              {analysis?.rooms && analysis.rooms.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">감지된 공간</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.rooms.map((room, i) => (
                      <span key={i} className="px-3 py-1 bg-stone-100 rounded-full text-sm">
                        {room.name || `공간 ${i + 1}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-lg bg-white/80 hover:bg-white transition-colors border border-stone-200 shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="text-stone-700">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48">
                <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Space Moduler</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-stone-700 hover:bg-stone-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-stone-200">저장</button>
          <button className="bg-white/80 hover:bg-white text-stone-800 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm border border-stone-200">공유</button>
          <button className="p-2.5 bg-white/80 rounded-lg hover:bg-white border border-stone-200"><span className="material-symbols-outlined">help</span></button>
        </div>
      </header>

      {/* Left Navigation Buttons */}
      <div className="absolute left-8 top-32 z-40 flex flex-col gap-3">
        <div className="flex flex-col rounded-xl overflow-hidden shadow-lg border border-white/50 bg-white/50 backdrop-blur">
          <button className="p-3.5 hover:bg-white transition-colors border-b border-stone-200/30 text-stone-500"><span className="material-symbols-outlined">zoom_in_map</span></button>
          <button className="p-3.5 hover:bg-white transition-colors border-b border-stone-200/30 text-stone-500"><span className="material-symbols-outlined">zoom_out_map</span></button>
          <button className="p-3.5 hover:bg-white transition-colors text-stone-500"><span className="material-symbols-outlined">center_focus_strong</span></button>
        </div>
      </div>

      {/* Viewer Instructions */}
      <div className="absolute left-8 bottom-32 z-40">
        <div className="flex flex-col gap-3 bg-white/60 backdrop-blur p-5 rounded-2xl shadow-lg border border-white/50">
          <Instruction icon="mouse" text="왼쪽 클릭 + 드래그하여 회전" />
          <Instruction icon="pan_tool" text="오른쪽 클릭 + 드래그하여 이동" />
          <Instruction icon="zoom_in" text="스크롤하여 확대/축소" />
        </div>
      </div>

      {/* Bottom View Switcher */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-white/80 backdrop-blur p-2 rounded-2xl shadow-xl flex items-center justify-between border border-white/50">
          <ViewToggle id="top" label="평면 뷰" active={view === 'top'} onClick={() => setView('top')} />
          <ViewToggle id="front" label="분석 결과" active={view === 'front'} onClick={() => setView('front')} />
          <ViewToggle id="3d" label="3D 뷰" active={view === '3d'} onClick={() => setView('3d')} />
        </div>
      </div>

      {/* Right Furniture Catalog Sidebar */}
      <aside className="absolute right-0 top-0 bottom-0 z-40 w-[380px] p-4 flex flex-col">
        <div className="h-full mt-24 bg-white/80 backdrop-blur rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col">
          <div className="flex border-b border-stone-200/50">
            <button className="flex-1 py-4 text-sm font-bold border-b-2 border-stone-600 text-stone-700 bg-white/30">가구 카탈로그</button>
            <button className="flex-1 py-4 text-sm font-semibold text-stone-400">요소 속성</button>
          </div>

          <div className="p-4 border-b border-stone-100">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
              <input type="text" placeholder="가구 검색..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-stone-400 outline-none" />
            </div>
          </div>

          <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-100">
            <CategoryButton icon="weekend" label="거실" active />
            <CategoryButton icon="bed" label="침실" />
            <CategoryButton icon="countertops" label="주방" />
            <CategoryButton icon="bathtub" label="욕실" />
            <CategoryButton icon="lightbulb" label="조명" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 custom-scrollbar">
            <FurnitureItem title="3인용 모던 소파" size="2100 x 950 x 850" />
            <FurnitureItem title="라운지 암체어" size="850 x 800 x 900" />
            <FurnitureItem title="원목 원형 테이블" size="900 x 900 x 420" />
            <FurnitureItem title="미니멀 거실장" size="1800 x 400 x 450" />
            <FurnitureItem title="패브릭 프레임 침대" size="1600 x 2100 x 1100" />
            <FurnitureItem title="오픈 북케이스" size="1200 x 300 x 1800" />
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-200/30">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-stone-600 text-sm mt-0.5">info</span>
              <p className="text-[11px] leading-relaxed text-stone-500">가구를 드래그하여 화면의 평면에 배치하세요. 배치된 요소의 속성은 상단 탭에서 변경할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const Instruction: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/40 border border-stone-200">
      <span className="material-symbols-outlined text-sm text-stone-700">{icon}</span>
    </div>
    <span className="text-[13px] font-medium text-stone-700">{text}</span>
  </div>
);

const ViewToggle: React.FC<{ id: string; label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-stone-700 text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
  >
    {label}
  </button>
);

const CategoryButton: React.FC<{ icon: string; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex flex-col items-center gap-1 min-w-[56px] p-2 rounded-xl transition-colors ${active ? 'bg-stone-700 text-white' : 'hover:bg-white/50 text-stone-500'}`}>
    <span className="material-symbols-outlined text-lg">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const FurnitureItem: React.FC<{ title: string; size: string }> = ({ title, size }) => (
  <div className="group cursor-move bg-white/40 border border-white/60 p-2 rounded-xl hover:bg-white hover:shadow-md transition-all">
    <div className="aspect-square bg-stone-200 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
      <span className="material-symbols-outlined text-4xl text-stone-400">chair</span>
    </div>
    <p className="text-[11px] font-semibold text-stone-700 truncate">{title}</p>
    <p className="text-[9px] text-stone-400">{size}</p>
  </div>
);

export default ViewerPage;
