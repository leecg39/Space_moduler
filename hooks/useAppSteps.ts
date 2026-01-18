'use client';

import { useAppStore } from '@/lib/store';
import { AppStep } from '@/types';

/**
 * App Step 상태 관리 훅
 * AppStep enum과 기존 store의 currentView를 연결
 */
export function useAppSteps() {
  const currentView = useAppStore((state) => state.ui.currentView);
  const setView = useAppStore((state) => state.setView);

  // currentView를 AppStep으로 매핑
  const appStep: AppStep = (() => {
    switch (currentView) {
      case 'upload':
        return AppStep.LANDING;
      case '2d-preview':
        return AppStep.EDITOR;
      case '3d-view':
        return AppStep.VIEWER;
      default:
        return AppStep.LANDING;
    }
  })();

  // AppStep으로 변경하는 함수
  const setAppStep = (step: AppStep) => {
    switch (step) {
      case AppStep.LANDING:
        setView('upload');
        break;
      case AppStep.EDITOR:
        setView('2d-preview');
        break;
      case AppStep.VIEWER:
        setView('3d-view');
        break;
      case AppStep.ANALYSIS:
        // ANALYSIS는 로딩 상태로 처리
        break;
    }
  };

  // 편의 함수들
  const goToLanding = () => setAppStep(AppStep.LANDING);
  const goToAnalysis = () => setAppStep(AppStep.ANALYSIS);
  const goToEditor = () => setAppStep(AppStep.EDITOR);
  const goToViewer = () => setAppStep(AppStep.VIEWER);

  return {
    appStep,
    setAppStep,
    goToLanding,
    goToAnalysis,
    goToEditor,
    goToViewer,
  };
}
