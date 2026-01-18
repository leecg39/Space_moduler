import type { WindowMesh3D } from '@/types';

interface WindowMeshProps {
  config: WindowMesh3D;
  onClick?: (id: string, name: string) => void;
}

/**
 * 창문 3D 메시 컴포넌트
 */
export function WindowMesh({ config, onClick }: WindowMeshProps) {
  const handleClick = () => {
    onClick?.(config.id, config.name);
  };

  return (
    <mesh
      position={config.position}
      rotation={config.rotation}
      onClick={handleClick}
    >
      <boxGeometry args={config.size} />
      <meshStandardMaterial color="#0EA5E9" transparent opacity={0.7} />
    </mesh>
  );
}
