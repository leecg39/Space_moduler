import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore, FloorPlan, PlanAnalysis } from '@/types';
import { convertPlanToScene3D } from '@/lib/utils/conversion';

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // UI 상태 초기값
      ui: {
        currentView: 'upload',
        isLoading: false,
        loadingMessage: '',
        loadingProgress: 0,
        sidebarOpen: true,
      },

      // 데이터 상태 초기값
      plan: {
        originalImage: null,
        originalFile: null,
        analysis: null,
        plan2D: null,
        plan3D: null,
      },

      // 사용자 설정 초기값
      settings: {
        unit: 'metric',
        theme: 'light',
        autoSave: true,
      },

      // 액션: 뷰 변경
      setView: (view) =>
        set((state) => ({
          ui: { ...state.ui, currentView: view },
        })),

      // 액션: 로딩 상태 설정
      setLoading: (loading, message = '', progress = 0) =>
        set((state) => ({
          ui: {
            ...state.ui,
            isLoading: loading,
            loadingMessage: message,
            loadingProgress: progress,
          },
        })),

      // 액션: 원본 이미지 설정
      setOriginalImage: (image, file) =>
        set((state) => ({
          plan: {
            ...state.plan,
            originalImage: image,
            originalFile: file || null,
          },
        })),

      // 액션: 분석 결과 설정
      setAnalysis: (analysis) =>
        set((state) => {
          // 분석 결과를 기반으로 2D 평면도 생성
          const plan2D: FloorPlan = {
            id: crypto.randomUUID(),
            name: '새 평면도',
            walls: analysis.walls,
            doors: analysis.doors,
            windows: analysis.windows,
            rooms: analysis.rooms,
            metadata: {
              originalImage: state.plan.originalImage || '',
              scale: analysis.dimensions.scale,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };

          return {
            plan: {
              ...state.plan,
              analysis,
              plan2D,
            },
            ui: {
              ...state.ui,
              currentView: '2d-preview',
            },
          };
        }),

      // 액션: 2D 평면도 업데이트
      updatePlan2D: (updates) =>
        set((state) => ({
          plan: {
            ...state.plan,
            plan2D: state.plan.plan2D
              ? {
                  ...state.plan.plan2D,
                  ...updates,
                  metadata: {
                    ...state.plan.plan2D.metadata,
                    updatedAt: new Date(),
                  },
                }
              : null,
          },
        })),

      // 액션: 3D 재생성
      regenerate3D: () =>
        set((state) => {
          if (!state.plan.plan2D) {
            return state;
          }

          // 2D 평면도를 3D로 변환
          const plan3D = convertPlanToScene3D(state.plan.plan2D);

          return {
            plan: {
              ...state.plan,
              plan3D,
            },
            ui: {
              ...state.ui,
              currentView: '3d-view',
            },
          };
        }),

      // 액션: 설정 업데이트
      setSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),
    }),
    {
      name: 'space-moduler-store',
      // persist할 부분 지정 (plan은 제외 - 너무 큼)
      partialize: (state) => ({
        settings: state.settings,
        ui: {
          currentView: state.ui.currentView,
          sidebarOpen: state.ui.sidebarOpen,
        },
      }),
    }
  )
);
