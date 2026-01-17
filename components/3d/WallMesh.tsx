import type { WallMesh3D } from '@/types';

interface WallMeshProps {
  config: WallMesh3D;
}

/**
 * 벽 3D 메시 컴포넌트
 */
export function WallMesh({ config }: WallMeshProps) {
  return (
    <mesh
      position={config.position}
      rotation={config.rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={config.size} />
      <meshStandardMaterial color="#94A3B8" />
    </mesh>
  );
}
