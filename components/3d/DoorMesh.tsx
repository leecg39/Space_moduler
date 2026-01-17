import type { DoorMesh3D } from '@/types';

interface DoorMeshProps {
  config: DoorMesh3D;
}

/**
 * 문 3D 메시 컴포넌트
 */
export function DoorMesh({ config }: DoorMeshProps) {
  return (
    <mesh position={config.position} rotation={config.rotation}>
      <boxGeometry args={config.size} />
      <meshStandardMaterial color="#854D0E" />
    </mesh>
  );
}
