'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Canvas2D = dynamic(
  () => import('@/components/2d/Canvas').then((mod) => mod.Canvas2D),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-stone-400">캔버스 로딩 중...</div> }
);

interface EditorPageProps {
  onOpen3D: () => void;
  onBack: () => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ onOpen3D, onBack }) => {
  const [selectedTool, setSelectedTool] = useState('select');

  return (
    <div className="h-screen bg-[#f5f2eb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-stone-200 bg-[#ece8df] z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48">
                <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold">Space Moduler</h2>
          </div>
          <div className="h-6 w-px bg-stone-300 mx-2"></div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-stone-500">프로젝트</span>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-stone-800">평면도 A</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 pr-6 border-r border-stone-300">
            <button className="flex items-center gap-1 text-stone-400 hover:text-stone-700">
              <span className="material-symbols-outlined text-[20px]">undo</span>
              <span className="text-xs font-medium">실행 취소</span>
            </button>
            <button className="flex items-center gap-1 text-stone-400 hover:text-stone-700">
              <span className="material-symbols-outlined text-[20px]">redo</span>
              <span className="text-xs font-medium">다시 실행</span>
            </button>
          </div>
          <button
            onClick={onOpen3D}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            3D로 변환
          </button>
          <div className="w-10 h-10 rounded-full bg-cover" style={{ backgroundImage: 'url("https://picsum.photos/100/100?u=1")' }}></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2 p-2 rounded-xl bg-white/90 border border-stone-200 backdrop-blur shadow-xl">
          <ToolButton id="select" icon="near_me" label="선택 (V)" active={selectedTool === 'select'} onClick={() => setSelectedTool('select')} />
          <ToolButton id="wall" icon="edit_square" label="벽 (W)" active={selectedTool === 'wall'} onClick={() => setSelectedTool('wall')} />
          <ToolButton id="door" icon="sensor_door" label="문 (D)" active={selectedTool === 'door'} onClick={() => setSelectedTool('door')} />
          <ToolButton id="window" icon="window" label="창문 (N)" active={selectedTool === 'window'} onClick={() => setSelectedTool('window')} />
          <ToolButton id="room" icon="texture" label="방 (R)" active={selectedTool === 'room'} onClick={() => setSelectedTool('room')} />
          <div className="h-px bg-stone-200 my-1 mx-2"></div>
          <ToolButton id="delete" icon="delete" label="삭제 (Del)" className="text-red-500 hover:bg-red-50" active={false} onClick={() => { }} />
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative canvas-grid bg-[#fdfbf7] flex items-center justify-center p-12">
          {/* Canvas2D Component - Uses real data from store */}
          <div className="relative w-full h-full bg-white border border-stone-200 rounded shadow-inner max-w-4xl">
            <Canvas2D
              width={800}
              height={600}
              tool={selectedTool as 'select' | 'wall' | 'door' | 'window' | 'delete'}
            />
          </div>

          <div className="absolute bottom-6 right-[340px] flex flex-col gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-t-lg bg-white border border-stone-200 hover:bg-stone-50"><span className="material-symbols-outlined">add</span></button>
            <button className="w-10 h-10 flex items-center justify-center rounded-b-lg bg-white border border-stone-200 hover:bg-stone-50 -mt-[1px]"><span className="material-symbols-outlined">remove</span></button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-stone-200 mt-2 hover:bg-stone-50"><span className="material-symbols-outlined">fullscreen</span></button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur rounded-full border border-stone-200 flex items-center gap-3 shadow-sm">
            <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
            <p className="text-[11px] font-medium">팁: <span className="bg-stone-100 px-1 rounded">Shift</span>를 누른 상태에서 벽을 90도 각도로 고정할 수 있습니다.</p>
          </div>
        </main>

        {/* Right Property Sidebar */}
        <aside className="w-[320px] bg-[#ece8df] border-l border-stone-300 p-6 flex flex-col gap-8 shadow-lg z-10 overflow-y-auto">
          <div>
            <h1 className="text-base font-bold mb-1">속성</h1>
            <p className="text-xs text-stone-500">선택됨: 벽 세그먼트 #14</p>
          </div>

          <div className="flex flex-col gap-6">
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-4">치수</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-stone-400 block mb-1">길이 (m)</label>
                  <input type="text" defaultValue="4.50" className="w-full bg-white border border-stone-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 block mb-1">두께 (cm)</label>
                  <input type="text" defaultValue="12" className="w-full bg-white border border-stone-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-blue-600" />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-4">자재</h3>
              <div className="flex flex-col gap-2">
                <MaterialOption label="일반 콘크리트" color="#d6d3d1" active />
                <MaterialOption label="붉은 벽돌" color="#b45309" />
              </div>
            </section>
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/30 border border-stone-200 cursor-pointer hover:bg-white/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-stone-500 text-lg">layers</span>
                <p className="text-xs font-medium">레이어: 외벽</p>
              </div>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm shadow-md shadow-blue-200">
              변경 사항 적용
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ToolButton: React.FC<{ id: string, icon: string, label: string, active: boolean, onClick: () => void, className?: string }> = ({ icon, label, active, onClick, className }) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-3 rounded-lg transition-colors group relative ${active ? 'bg-blue-600 text-white' : 'text-stone-600 hover:bg-stone-100'} ${className}`}
  >
    <span className="material-symbols-outlined">{icon}</span>
    <span className="absolute left-full ml-3 px-2 py-1 bg-white border border-stone-200 text-stone-800 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none whitespace-nowrap z-50">
      {label}
    </span>
  </button>
);

const MaterialOption: React.FC<{ label: string; color: string; active?: boolean }> = ({ label, color, active }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border ${active ? 'bg-white border-blue-400 shadow-sm' : 'bg-white/30 border-transparent hover:bg-white/60'} cursor-pointer`}>
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full border border-stone-200" style={{ backgroundColor: color }}></div>
      <span className="text-xs font-medium">{label}</span>
    </div>
    {active && <span className="material-symbols-outlined text-blue-600 text-sm">check_circle</span>}
  </div>
);

export default EditorPage;
