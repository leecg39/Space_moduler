'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppStore } from '@/lib/store';
import { FloorMesh } from './FloorMesh';
import { WallMesh } from './WallMesh';
import { DoorMesh } from './DoorMesh';
import { WindowMesh } from './WindowMesh';
import { ViewModeSelector, CAMERA_PRESETS } from './ViewModeSelector';
import type { ViewMode } from '@/types';
import { useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 카메라 전환 애니메이션 컴포넌트
 */
function CameraTransition({ targetPosition, targetLookAt, onViewChange }: {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  onViewChange?: (position: [number, number, number], lookAt: [number, number, number]) => void;
}) {
  const cameraRef = useState<THREE.PerspectiveCamera | null>(null)[0];
  const controlsRef = useState<OrbitControls | null>(null)[0];
  const [, setIsTransitioning] = useState(false);

  const handleCameraTransition = useCallback((position: [number, number, number], lookAt: [number, number, number]) => {
    if (cameraRef) {
      cameraRef.position.set(...position);
    }
    if (controlsRef) {
      controlsRef.target.set(...lookAt);
    }
    setIsTransitioning(true);
    onViewChange?.(position, lookAt);

    // 전환 완료 후 상태 업데이트
    setTimeout(() => setIsTransitioning(false), 300);
  }, [cameraRef, controlsRef, onViewChange]);

  // Expose transition function via ref
  useState<{ transition: typeof handleCameraTransition }>({ transition: handleCameraTransition });

  return (
    <>
      <perspectiveCamera ref={cameraRef} position={targetPosition} fov={50} />
      <OrbitControls ref={controlsRef} target={targetLookAt} enableDamping dampingFactor={0.05} />
    </>
  );
}

/**
 * Three.js 3D 씬 컴포넌트
 * 평면도를 3D로 렌더링합니다.
 */
export function Scene3D() {
  const plan3D = useAppStore((state) => state.plan.plan3D);
  const [viewMode, setViewMode] = useState<ViewMode>('perspective');
  const [selectedElement, setSelectedElement] = useState<{ type: string; id: string; name: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드 마운트 체크
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleElementClick = useCallback((type: string, id: string, name: string) => {
    setSelectedElement({ type, id, name });
  }, []);

  const handleCameraTransition = useCallback((_position: [number, number, number], _lookAt: [number, number, number]) => {
    // 카메라 전환 로직이 CameraTransition 컴포넌트에서 처리됨
  }, []);

  // SSR에서는 로딩 UI 표시
  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">3D 뷰어 로딩 중...</p>
      </div>
    );
  }

  if (!plan3D) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">3D 모델을 생성하는 중입니다...</p>
      </div>
    );
  }

  // 뷰 모드에 따른 카메라 설정
  const cameraConfig = CAMERA_PRESETS[viewMode];

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden relative">
      <Canvas
        shadows
        style={{ background: '#f0f0f0' }}
      >
        {/* 카메라 전환 애니메이션 */}
        <CameraTransition
          targetPosition={cameraConfig.position}
          targetLookAt={cameraConfig.target}
          onViewChange={handleCameraTransition}
        />

        {/* 조명 */}
        <ambientLight intensity={plan3D.lighting.ambient} />
        <directionalLight
          position={plan3D.lighting.directional.position}
          intensity={plan3D.lighting.directional.intensity}
          castShadow
        />

        {/* 3D 모델 */}
        <group>
          {/* 바닥 */}
          <FloorMesh config={plan3D.floor} />

          {/* 벽 */}
          {plan3D.walls.map((wall) => (
            <WallMesh
              key={wall.id}
              config={wall}
              onClick={() => handleElementClick('wall', wall.id, wall.name)}
            />
          ))}

          {/* 문 */}
          {plan3D.doors.map((door) => (
            <DoorMesh
              key={door.id}
              config={door}
              onClick={() => handleElementClick('door', door.id, door.name)}
            />
          ))}

          {/* 창문 */}
          {plan3D.windows.map((window) => (
            <WindowMesh
              key={window.id}
              config={window}
              onClick={() => handleElementClick('window', window.id, window.name)}
            />
          ))}
        </group>
      </Canvas>

      {/* 뷰 모드 컨트롤 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <ViewModeSelector
          currentMode={viewMode}
          onViewChange={handleViewChange}
          onCameraTransition={handleCameraTransition}
        />
      </div>

      {/* 요소 정보 팝업 */}
      {selectedElement && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800">{selectedElement.name}</h3>
            <button
              onClick={() => setSelectedElement(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p>타입: {selectedElement.type}</p>
            <p>ID: {selectedElement.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}
