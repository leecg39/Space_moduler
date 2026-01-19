import type { FloorPlan } from './floor-plan';
import type { PlanAnalysis } from './api';

// Zustand 스토어 타입

export interface UIState {
  currentView: 'upload' | '2d-preview' | '3d-view';
  isLoading: boolean;
  loadingMessage: string;
  loadingProgress: number; // 0-100
  sidebarOpen: boolean;
}

export interface PlanState {
  originalImage: string | null;
  originalFile: File | null;
  analysis: PlanAnalysis | null;
  plan2D: FloorPlan | null;
  plan3D: Scene3DConfig | null;
}

export interface UserSettings {
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
  autoSave: boolean;
}

export interface AppStore {
  // UI 상태
  ui: UIState;

  // 데이터 상태
  plan: PlanState;

  // 사용자 설정
  settings: UserSettings;

  // 액션
  setView: (view: UIState['currentView']) => void;
  setLoading: (loading: boolean, message?: string, progress?: number) => void;
  setOriginalImage: (image: string, file?: File) => void;
  setAnalysis: (analysis: PlanAnalysis) => void;
  updatePlan2D: (updates: Partial<FloorPlan>) => void;
  regenerate3D: () => void;
  setSettings: (settings: Partial<UserSettings>) => void;
}

// 3D 씬 설정 (Three.js용)
export interface Scene3DConfig {
  walls: WallMesh3D[];
  doors: DoorMesh3D[];
  windows: WindowMesh3D[];
  floor: FloorMesh3D;
  lighting: {
    ambient: number;
    directional: {
      intensity: number;
      position: [number, number, number];
    };
  };
  camera: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface WallMesh3D {
  id: string;
  position: [number, number, number];
  size: [number, number, number]; // width, height, thickness
  rotation: [number, number, number];
}

export interface DoorMesh3D {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}

export interface WindowMesh3D {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}

export interface FloorMesh3D {
  position: [number, number, number];
  size: [number, number, number]; // width, depth (height is negligible)
}
