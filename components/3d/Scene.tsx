'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { useAppStore } from '@/lib/store';
import { FloorMesh } from './FloorMesh';
import { WallMesh } from './WallMesh';
import { DoorMesh } from './DoorMesh';
import { WindowMesh } from './WindowMesh';
import { ViewModeSelector, CAMERA_PRESETS } from './ViewModeSelector';
import type { ViewMode } from '@/types';
import { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * 3D 요소 클릭 핸들러 컴포넌트
 */
function ElementClickHandler({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  const handlePointerDown = () => setSelected(!selected);

  return (
    <mesh
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    >
      {children}
      {hovered && (
        <meshBasicMaterial attach="material" color="hotpink" transparent opacity={0.3} />
      )}
      {selected && (
        <meshBasicMaterial attach="material" color="yellow" transparent opacity={0.5} />
      )}
    </mesh>
  );
}

/**
 * 카메라 전환 애니메이션 컴포넌트
 */
function CameraTransition({ targetPosition, targetLookAt }: {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [currentLookAt, setCurrentLookAt] = useState<[number, number, number]>([0, 0, 0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useFrame(() => {
    if (!cameraRef.current || !controlsRef.current || !isTransitioning) return;

    // 카메라 위치 보간
    const newPosition = new THREE.Vector3(...currentPosition);
    const targetPos = new THREE.Vector3(...targetPosition);
    newPosition.lerp(targetPos, 0.1);
    setCurrentPosition([newPosition.x, newPosition.y, newPosition.z]);
    cameraRef.current.position.set(...currentPosition);

    // 타겟 보간
    const newLookAt = new THREE.Vector3(...currentLookAt);
    const targetLook = new THREE.Vector3(...targetLookAt);
    newLookAt.lerp(targetLook, 0.1);
    setCurrentLookAt([newLookAt.x, newLookAt.y, newLookAt.z]);
    controlsRef.current.target.set(...currentLookAt);

    // 전환 완료 체크
    if (newPosition.distanceTo(targetPos) < 0.1 &&
        newLookAt.distanceTo(targetLook) < 0.1) {
      setIsTransitioning(false);
    }
  });

  const startTransition = (position: [number, number, number], lookAt: [number, number, number]) => {
    setCurrentPosition(position);
    setCurrentLookAt(lookAt);
    setIsTransitioning(true);
  };

  return (
    <>
      <perspectiveCamera ref={cameraRef} position={currentPosition} fov={50} />
      <OrbitControls ref={controlsRef} target={currentLookAt} enableDamping dampingFactor={0.05} />
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

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleElementClick = (type: string, id: string, name: string) => {
    setSelectedElement({ type, id, name });
  };

  if (!plan3D) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
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
            <ElementClickHandler key={wall.id}>
              <WallMesh config={wall} onClick={() => handleElementClick('wall', wall.id, wall.name)} />
            </ElementClickHandler>
          ))}

          {/* 문 */}
          {plan3D.doors.map((door) => (
            <ElementClickHandler key={door.id}>
              <DoorMesh config={door} onClick={() => handleElementClick('door', door.id, door.name)} />
            </ElementClickHandler>
          ))}

          {/* 창문 */}
          {plan3D.windows.map((window) => (
            <ElementClickHandler key={window.id}>
              <WindowMesh config={window} onClick={() => handleElementClick('window', window.id, window.name)} />
            </ElementClickHandler>
          ))}
        </group>
      </Canvas>

      {/* 뷰 모드 컨트롤 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <ViewModeSelector
          currentMode={viewMode}
          onViewChange={handleViewChange}
          onCameraTransition={(position, lookAt) => {
            // 카메라 전환 애니메이션 시작
            // (CameraTransition 컴포넌트가 자동으로 위치를 업데이트)
          }}
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
