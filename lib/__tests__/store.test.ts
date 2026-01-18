import { describe, it, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import type { AppStore, FloorPlan, PlanAnalysis } from '@/types';

// Simple store recreation for testing
const createTestStore = () => create<AppStore>((set, get) => ({
  ui: {
    currentView: 'upload',
    isLoading: false,
    loadingMessage: '',
    loadingProgress: 0,
    sidebarOpen: true,
  },
  plan: {
    originalImage: null,
    originalFile: null,
    analysis: null,
    plan2D: null,
    plan3D: null,
  },
  settings: {
    unit: 'metric',
    theme: 'light',
    autoSave: true,
  },
  setView: (view) =>
    set((state) => ({
      ui: { ...state.ui, currentView: view },
    })),
  setLoading: (loading, message = '', progress = 0) =>
    set((state) => ({
      ui: {
        ...state.ui,
        isLoading: loading,
        loadingMessage: message,
        loadingProgress: progress,
      },
    })),
  setOriginalImage: (image, file) =>
    set((state) => ({
      plan: {
        ...state.plan,
        originalImage: image,
        originalFile: file || null,
      },
    })),
  setAnalysis: (analysis) => set((state) => {
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
  regenerate3D: () => set((state) => state),
  setSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    })),
}));

describe('AppStore', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('UI State', () => {
    it('should have initial UI state', () => {
      const state = store.getState();
      expect(state.ui.currentView).toBe('upload');
      expect(state.ui.isLoading).toBe(false);
      expect(state.ui.sidebarOpen).toBe(true);
    });

    it('should update view using setView', () => {
      const { setView } = store.getState();

      setView('2d-preview');

      const state = store.getState();
      expect(state.ui.currentView).toBe('2d-preview');
    });

    it('should set loading state', () => {
      const { setLoading } = store.getState();

      setLoading(true, 'Loading...', 50);

      const state = store.getState();
      expect(state.ui.isLoading).toBe(true);
      expect(state.ui.loadingMessage).toBe('Loading...');
      expect(state.ui.loadingProgress).toBe(50);
    });

    it('should clear loading state', () => {
      const { setLoading } = store.getState();

      setLoading(true);
      setLoading(false);

      const state = store.getState();
      expect(state.ui.isLoading).toBe(false);
    });
  });

  describe('Plan State', () => {
    it('should have initial plan state', () => {
      const state = store.getState();
      expect(state.plan.originalImage).toBeNull();
      expect(state.plan.analysis).toBeNull();
      expect(state.plan.plan2D).toBeNull();
    });

    it('should set original image', () => {
      const { setOriginalImage } = store.getState();
      const imageData = 'data:image/jpeg;base64,test';

      setOriginalImage(imageData);

      const state = store.getState();
      expect(state.plan.originalImage).toBe(imageData);
    });

    it('should set original file', () => {
      const { setOriginalImage } = store.getState();
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      setOriginalImage('data:image/jpeg;base64,test', file);

      const state = store.getState();
      expect(state.plan.originalFile).toBe(file);
    });
  });

  describe('Settings', () => {
    it('should have initial settings', () => {
      const state = store.getState();
      expect(state.settings.unit).toBe('metric');
      expect(state.settings.theme).toBe('light');
      expect(state.settings.autoSave).toBe(true);
    });

    it('should update settings', () => {
      const { setSettings } = store.getState();

      setSettings({ unit: 'imperial', theme: 'dark' });

      const state = store.getState();
      expect(state.settings.unit).toBe('imperial');
      expect(state.settings.theme).toBe('dark');
      expect(state.settings.autoSave).toBe(true); // unchanged
    });
  });

  describe('updatePlan2D', () => {
    it('should update plan2D fields', () => {
      const { setOriginalImage, setAnalysis, updatePlan2D } = store.getState();

      // Setup initial state
      setOriginalImage('test-image.jpg');

      const mockAnalysis: PlanAnalysis = {
        success: true,
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        dimensions: { width: 10, height: 10, scale: 1 },
        confidence: 0.9,
      };

      setAnalysis(mockAnalysis);

      // Update plan2D
      updatePlan2D({ name: 'Updated Plan' });

      const state = store.getState();
      expect(state.plan.plan2D?.name).toBe('Updated Plan');
    });

    it('should update metadata timestamp', () => {
      const { setOriginalImage, setAnalysis, updatePlan2D } = store.getState();

      setOriginalImage('test-image.jpg');

      const mockAnalysis: PlanAnalysis = {
        success: true,
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        dimensions: { width: 10, height: 10, scale: 1 },
        confidence: 0.9,
      };

      setAnalysis(mockAnalysis);

      const beforeUpdate = state.plan.plan2D?.metadata.updatedAt;

      // Wait a bit to ensure timestamp changes
      setTimeout(() => {
        updatePlan2D({ name: 'Updated' });

        const state = store.getState();
        expect(state.plan.plan2D?.metadata.updatedAt).not.toBe(beforeUpdate);
      }, 10);
    });
  });
});
