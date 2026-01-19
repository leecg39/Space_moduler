/**
 * 2D → 3D 변환 유틸리티
 *
 * 2D 평면도 좌표를 3D 월드 좌표로 변환합니다.
 */

import type { Point2D, Point3D, Wall, Door, Window, FloorPlan } from '@/types';
import type { WallMesh3D, DoorMesh3D, WindowMesh3D, FloorMesh3D } from '@/types';

// 기본 상수
export const WALL_HEIGHT = 2.5; // 미터
export const DOOR_HEIGHT = 2.1; // 미터
export const WINDOW_HEIGHT = 1.5; // 미터
export const WINDOW_FROM_FLOOR = 1.0; // 미터

/**
 * 2D 좌표를 3D 좌표로 변환
 * (x, y) → (x, 0, -y)
 */
export function convert2DTo3D(point2d: Point2D, scale: number): Point3D {
  return {
    x: point2d.x * scale,
    y: 0,
    z: -point2d.y * scale,
  };
}

/**
 * 2D 벽을 3D 메시로 변환
 */
export function convertWallToMesh3D(wall: Wall, scale: number): WallMesh3D {
  const start3D = convert2DTo3D(wall.start, scale);
  const end3D = convert2DTo3D(wall.end, scale);

  const dx = end3D.x - start3D.x;
  const dz = end3D.z - start3D.z;
  const length = Math.sqrt(dx * dx + dz * dz);

  // 회전 (Y축 중심)
  const angle = Math.atan2(dz, dx);

  return {
    id: wall.id,
    position: [start3D.x + dx / 2, WALL_HEIGHT / 2, start3D.z + dz / 2],
    size: [length, WALL_HEIGHT, wall.thickness],
    rotation: [0, angle, 0],
  };
}

/**
 * 2D 문을 3D 메시로 변환
 */
export function convertDoorToMesh3D(door: Door, scale: number): DoorMesh3D {
  const pos3D = convert2DTo3D(door.position, scale);

  return {
    id: door.id,
    position: [pos3D.x, DOOR_HEIGHT / 2, pos3D.z],
    size: [door.width * scale, DOOR_HEIGHT, 0.1],
    rotation: door.direction === 'horizontal' ? [0, 0, 0] : [0, Math.PI / 2, 0],
  };
}

/**
 * 2D 창문을 3D 메시로 변환
 */
export function convertWindowToMesh3D(window: Window, scale: number): WindowMesh3D {
  const pos3D = convert2DTo3D(window.position, scale);

  return {
    id: window.id,
    position: [pos3D.x, WINDOW_FROM_FLOOR + WINDOW_HEIGHT / 2, pos3D.z],
    size: [window.width * scale, WINDOW_HEIGHT, 0.1],
    rotation: [0, 0, 0],
  };
}

/**
 * 방 경계에서 바닥 메시 생성
 * 모든 방의 경계를 고려하여 바닥 크기를 계산합니다.
 */
export function createFloorMesh3D(rooms: FloorPlan['rooms'], scale: number): FloorMesh3D {
  if (rooms.length === 0) {
    // 기본 크기 반환
    return {
      position: [0, 0, 0],
      size: [10, 10, 0.01],
    };
  }

  // 모든 방의 경계를 사용하여 바닥 크기 계산
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  rooms.forEach(room => {
    room.boundary.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
  });

  // 3D 좌표계에서는 Y가 Z로 변환됨 (음수값)
  const centerX = (minX + maxX) / 2 * scale;
  const centerZ = -(minY + maxY) / 2 * scale;
  const width = (maxX - minX) * scale;
  const depth = (maxY - minY) * scale;

  return {
    position: [centerX, 0, centerZ],
    size: [width, depth, 0.01],
  };
}

/**
 * 전체 평면도를 3D 씬 설정으로 변환
 */
export function convertPlanToScene3D(plan: FloorPlan) {
  const scale = plan.metadata.scale;

  return {
    walls: plan.walls.map((wall) => convertWallToMesh3D(wall, scale)),
    doors: plan.doors.map((door) => convertDoorToMesh3D(door, scale)),
    windows: plan.windows.map((window) => convertWindowToMesh3D(window, scale)),
    floor: createFloorMesh3D(plan.rooms, scale),
    lighting: {
      ambient: 0.5,
      directional: {
        intensity: 1.0,
        position: [5, 10, 5] as [number, number, number],
      },
    },
    camera: {
      position: [5, 4, 5] as [number, number, number],
      target: [0, 0, 0] as [number, number, number],
    },
  };
}
