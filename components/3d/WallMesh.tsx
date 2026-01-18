import type { WallMesh3D } from '@/types';

interface WallMeshProps {
  config: WallMesh3D;
  onClick?: (id: string, name: string) => void;
}

/**
 * 벽 3D 메시 컴포넌트
 */
export function WallMesh({ config, onClick }: WallMeshProps) {
  const handleClick = () => {
    onClick?.(config.id, config.name);
  };

  return (
    <mesh
      position={config.position}
      rotation={config.rotation}
      castShadow
      receiveShadow
      onClick={handleClick}
    >
      <boxGeometry args={config.size} />
      <meshStandardMaterial color="#94A3B8" />
    </mesh>
  );
}
