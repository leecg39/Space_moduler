import type { FloorPlan } from './floor-plan';

// API 요청/응답 타입

export interface PlanAnalysis {
  walls: FloorPlan['walls'];
  doors: FloorPlan['doors'];
  windows: FloorPlan['windows'];
  rooms: FloorPlan['rooms'];
  dimensions: {
    width: number;
    height: number;
    scale: number; // 픽셀 -> 미터 변환 비율
  };
}

export interface AnalyzePlanRequest {
  image: File;
}

export interface AnalyzePlanResponse {
  success: boolean;
  data?: PlanAnalysis;
  error?: string;
}

export interface UploadImageRequest {
  image: File;
  save: boolean; // 사용자 동의 여부
}

export interface UploadImageResponse {
  success: boolean;
  data?: {
    url: string;
    expiresAt?: Date; // 저장 안 하면 1시간 후 만료
  };
  error?: string;
}

export interface SavePlanRequest {
  plan: FloorPlan;
}

export interface SavePlanResponse {
  success: boolean;
  data?: {
    id: string;
    shareUrl: string;
  };
  error?: string;
}
