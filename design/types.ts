
export enum AppStep {
  LANDING = 'LANDING',
  ANALYSIS = 'ANALYSIS',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface ProjectInfo {
  id: string;
  name: string;
  thumbnail?: string;
}
