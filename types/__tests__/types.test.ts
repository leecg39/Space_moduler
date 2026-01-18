import { describe, it, expect } from 'vitest';
import type { Wall, Door, Window, FloorPlan, PlanAnalysis, Scene3DConfig } from '@/types';

describe('Type Definitions', () => {
  describe('Wall', () => {
    it('should accept valid wall structure', () => {
      const wall: Wall = {
        id: 'wall-1',
        start: { x: 0, y: 0 },
        end: { x: 5, y: 0 },
        thickness: 0.2,
        height: 2.5,
      };

      expect(wall.id).toBe('wall-1');
      expect(wall.start.x).toBe(0);
      expect(wall.end.y).toBe(0);
      expect(wall.thickness).toBe(0.2);
      expect(wall.height).toBe(2.5);
    });
  });

  describe('Door', () => {
    it('should accept valid door structure', () => {
      const door: Door = {
        id: 'door-1',
        position: { x: 2.5, y: 0 },
        width: 0.9,
        direction: 'horizontal',
        opens: 'left',
      };

      expect(door.id).toBe('door-1');
      expect(door.position.x).toBe(2.5);
      expect(door.width).toBe(0.9);
      expect(door.direction).toBe('horizontal');
      expect(door.opens).toBe('left');
    });

    it('should accept vertical door', () => {
      const door: Door = {
        id: 'door-2',
        position: { x: 5, y: 2.5 },
        width: 0.9,
        direction: 'vertical',
        opens: 'right',
      };

      expect(door.direction).toBe('vertical');
      expect(door.opens).toBe('right');
    });
  });

  describe('Window', () => {
    it('should accept valid window structure', () => {
      const window: Window = {
        id: 'window-1',
        position: { x: 5, y: 2.5 },
        width: 1.2,
        height: 1.5,
        fromFloor: 1.0,
      };

      expect(window.id).toBe('window-1');
      expect(window.position.x).toBe(5);
      expect(window.width).toBe(1.2);
      expect(window.height).toBe(1.5);
      expect(window.fromFloor).toBe(1.0);
    });
  });

  describe('FloorPlan', () => {
    it('should accept valid floor plan structure', () => {
      const floorPlan: FloorPlan = {
        id: 'plan-1',
        name: 'Test Plan',
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        metadata: {
          originalImage: 'test.jpg',
          scale: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      expect(floorPlan.id).toBe('plan-1');
      expect(floorPlan.name).toBe('Test Plan');
      expect(floorPlan.walls).toEqual([]);
      expect(floorPlan.metadata.scale).toBe(1);
    });
  });

  describe('PlanAnalysis', () => {
    it('should accept valid plan analysis structure', () => {
      const analysis: PlanAnalysis = {
        success: true,
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        dimensions: {
          width: 10,
          height: 8,
          scale: 1.5,
        },
        confidence: 0.95,
      };

      expect(analysis.success).toBe(true);
      expect(analysis.dimensions.width).toBe(10);
      expect(analysis.confidence).toBe(0.95);
    });
  });

  describe('Scene3DConfig', () => {
    it('should accept valid 3D scene config', () => {
      const scene: Scene3DConfig = {
        walls: [],
        doors: [],
        windows: [],
        floor: {
          position: [0, 0, 0],
          size: [10, 8, 0.1],
        },
        lighting: {
          ambient: 0.5,
          directional: {
            intensity: 1,
            position: [5, 10, 5],
          },
        },
        camera: {
          position: [5, 5, 5],
          target: [0, 0, 0],
        },
      };

      expect(scene.floor.position).toHaveLength(3);
      expect(scene.lighting.ambient).toBe(0.5);
      expect(scene.camera.position).toEqual([5, 5, 5]);
    });
  });
});
