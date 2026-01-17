'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppStore } from '@/lib/store';
import { FloorMesh } from './FloorMesh';
import { WallMesh } from './WallMesh';
import { DoorMesh } from './DoorMesh';
import { WindowMesh } from './WindowMesh';

/**
 * Three.js 3D 씬 컴포넌트
 * 평면도를 3D로 렌더링합니다.
 */
export function Scene3D() {
  const plan3D = useAppStore((state) => state.plan.plan3D);

  if (!plan3D) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">3D 모델을 생성하는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: plan3D.camera.position, fov: 50 }}
        shadows
        style={{ background: '#f0f0f0' }}
      >
        {/* 조명 */}
        <ambientLight intensity={plan3D.lighting.ambient} />
        <directionalLight
          position={plan3D.lighting.directional.position}
          intensity={plan3D.lighting.directional.intensity}
          castShadow
        />

        {/* 카메라 컨트롤 */}
        <OrbitControls
          target={plan3D.camera.target}
          enableDamping
          dampingFactor={0.05}
        />

        {/* 3D 모델 */}
        <group>
          {/* 바닥 */}
          <FloorMesh config={plan3D.floor} />

          {/* 벽 */}
          {plan3D.walls.map((wall) => (
            <WallMesh key={wall.id} config={wall} />
          ))}

          {/* 문 */}
          {plan3D.doors.map((door) => (
            <DoorMesh key={door.id} config={door} />
          ))}

          {/* 창문 */}
          {plan3D.windows.map((window) => (
            <WindowMesh key={window.id} config={window} />
          ))}
        </group>

        {/* 카메라 타겟 표시 (디버깅용) */}
        <mesh position={plan3D.camera.target}>
          <sphereGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#ff0000" wireframe />
        </mesh>
      </Canvas>

      {/* 뷰 모드 컨트롤 (추후 구현) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">
          상면
        </button>
        <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">
          정면
        </button>
        <button className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-sm">
          3D
        </button>
      </div>
    </div>
  );
}
