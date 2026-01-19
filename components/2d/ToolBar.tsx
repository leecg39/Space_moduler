'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

type Tool = 'select' | 'wall' | 'door' | 'window' | 'delete';

interface ToolBarProps {
  onToolChange?: (tool: Tool) => void;
}

/**
 * 2D 편집 도구 모음 컴포넌트
 */
export function ToolBar({ onToolChange }: ToolBarProps) {
  const [activeTool, setActiveTool] = useState<Tool>('select');

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    onToolChange?.(tool);
  };

  const tools = [
    { id: 'select' as Tool, label: '선택', icon: '⦹', color: 'bg-gray-100 hover:bg-gray-200' },
    { id: 'wall' as Tool, label: '벽', icon: '▬', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700' },
    { id: 'door' as Tool, label: '문', icon: '🚪', color: 'bg-amber-100 hover:bg-amber-200 text-amber-700' },
    { id: 'window' as Tool, label: '창문', icon: '⊞', color: 'bg-sky-100 hover:bg-sky-200 text-sky-700' },
    { id: 'delete' as Tool, label: '삭제', icon: '✕', color: 'bg-red-100 hover:bg-red-200 text-red-700' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`
              px-4 py-3 rounded-lg font-medium transition-all
              ${activeTool === tool.id ? 'ring-2 ring-primary-500 ring-offset-2 ' : ''}
              ${tool.color}
            `}
            title={tool.label}
          >
            <span className="text-xl">{tool.icon}</span>
            <span className="ml-2 hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* 선택된 요소 정보 (추후 구현) */}
      {activeTool === 'select' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            요소를 선택하여 편집하세요.
          </p>
        </div>
      )}

      {/* 벽 그리기 가이드 */}
      {activeTool === 'wall' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            캔버스에서 클릭하고 드래그하여 벽을 그리세요.
          </p>
        </div>
      )}

      {/* 문 배치 가이드 */}
      {activeTool === 'door' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            캔버스에서 클릭하여 문을 배치하세요.
          </p>
        </div>
      )}

      {/* 창문 배치 가이드 */}
      {activeTool === 'window' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            캔버스에서 클릭하여 창문을 배치하세요.
          </p>
        </div>
      )}
    </div>
  );
}
