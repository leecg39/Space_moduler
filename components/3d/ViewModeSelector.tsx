'use client';

import { useState } from 'react';

type ViewMode = 'top' | 'front' | 'perspective';

interface ViewModeSelectorProps {
  currentMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  onCameraTransition?: (position: [number, number, number], lookAt: [number, number, number]) => void;
}

/**
 * 뷰 모드 선택기 컴포넌트
 * 상단/정면/3D 뷰 모드를 전환합니다.
 */
export function ViewModeSelector({ currentMode = 'perspective', onViewChange, onCameraTransition }: ViewModeSelectorProps) {
  const [mode, setMode] = useState<ViewMode>(currentMode);

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode);
    onViewChange?.(newMode);

    // 카메라 전환 애니메이션 트리거
    if (onCameraTransition) {
      const preset = CAMERA_PRESETS[newMode];
      onCameraTransition(preset.position, preset.target);
    }
  };

  const modes = [
    { id: 'top' as ViewMode, label: '상면', description: '위에서 본 뷰' },
    { id: 'front' as ViewMode, label: '정면', description: '사람 시점 뷰' },
    { id: 'perspective' as ViewMode, label: '3D', description: '입체감 있는 뷰' },
  ];

  return (
    <div className="flex items-center gap-2">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => handleModeChange(m.id)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${mode === m.id
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          title={m.description}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/**
 * 카메라 설정별 상수
 */
export const CAMERA_PRESETS = {
  top: {
    position: [0, 10, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  front: {
    position: [0, 1.5, 10] as [number, number, number],
    target: [0, 1.5, 0] as [number, number, number],
  },
  perspective: {
    position: [5, 4, 5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
};
