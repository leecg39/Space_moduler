import { useMemo } from 'react';
import type { FloorMesh3D } from '@/types';

interface FloorMeshProps {
  config: FloorMesh3D;
}

/**
 * 바닥 3D 메시 컴포넌트
 */
export function FloorMesh({ config }: FloorMeshProps) {
  const geometry = useMemo(() => {
    return {
      args: config.size,
    };
  }, [config.size]);

  const material = useMemo(() => {
    return {
      color: '#f1f5f9',
    };
  }, []);

  return (
    <mesh
      position={config.position}
      rotation={[-Math.PI / 2, 0, 0]}
      {...geometry}
    >
      <meshStandardMaterial {...material} />
    </mesh>
  );
}
