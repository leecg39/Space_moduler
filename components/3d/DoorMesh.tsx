import type { DoorMesh3D } from '@/types';

interface DoorMeshProps {
  config: DoorMesh3D;
  onClick?: (id: string, name: string) => void;
}

/**
 * 문 3D 메시 컴포넌트
 */
export function DoorMesh({ config, onClick }: DoorMeshProps) {
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
      <meshStandardMaterial color="#854D0E" />
    </mesh>
  );
}
