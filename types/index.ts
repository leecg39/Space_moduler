// 모든 타임 내보내기

export * from './geometry';
export * from './geometry-3d';
export * from './floor-plan';
export * from './api';
export * from './store';

// App Step Enum
export enum AppStep {
  LANDING = 'LANDING',
  ANALYSIS = 'ANALYSIS',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

// Project Info
export interface ProjectInfo {
  id: string;
  name: string;
  thumbnail?: string;
}
