import type { Point2D } from './geometry';

// 평면도 요소
export interface Wall {
  id: string;
  start: Point2D;
  end: Point2D;
  thickness: number; // 미터
  height: number; // 기본 2.5m
}

export interface Door {
  id: string;
  position: Point2D;
  width: number; // 미터
  direction: 'horizontal' | 'vertical';
  opens: 'left' | 'right' | 'both';
}

export interface Window {
  id: string;
  position: Point2D;
  width: number;
  height: number; // 기본 1.5m
  fromFloor: number; // 바닥에서 높이, 기본 1m
}

export interface Room {
  id: string;
  name: string; // "거실", "안방" 등
  boundary: Point2D[];
  area: number; // 제곱미터
}

// 전체 평면도
export interface FloorPlan {
  id: string;
  name: string;
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  rooms: Room[];
  metadata: {
    originalImage: string; // URL
    scale: number; // 픽셀 -> 미터
    createdAt: Date;
    updatedAt: Date;
  };
}

// 편집 가능한 요소 타입
export type EditableElement = Wall | Door | Window;

// 요소 선택 상태
export interface SelectionState {
  selectedId: string | null;
  selectedType: 'wall' | 'door' | 'window' | null;
}
