import { describe, it, expect } from 'vitest';
import { convertPlanToScene3D } from '../utils/conversion';
import type { FloorPlan } from '@/types';

describe('convertPlanToScene3D', () => {
  const mockFloorPlan: FloorPlan = {
    id: 'test-plan-1',
    name: 'Test Floor Plan',
    walls: [
      {
        id: 'wall-1',
        start: { x: 0, y: 0 },
        end: { x: 5, y: 0 },
        thickness: 0.2,
        height: 2.5,
      },
      {
        id: 'wall-2',
        start: { x: 5, y: 0 },
        end: { x: 5, y: 5 },
        thickness: 0.2,
        height: 2.5,
      },
    ],
    doors: [
      {
        id: 'door-1',
        position: { x: 2.5, y: 0 },
        width: 0.9,
        direction: 'horizontal',
        opens: 'left',
      },
    ],
    windows: [
      {
        id: 'window-1',
        position: { x: 5, y: 2.5 },
        width: 1.2,
        height: 1.5,
        fromFloor: 1.0,
      },
    ],
    rooms: [],
    metadata: {
      originalImage: 'test-image.jpg',
      scale: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  it('should convert floor plan to 3D scene config', () => {
    const scene3D = convertPlanToScene3D(mockFloorPlan);

    expect(scene3D).toBeDefined();
    expect(scene3D.walls).toHaveLength(2);
    expect(scene3D.doors).toHaveLength(1);
    expect(scene3D.windows).toHaveLength(1);
    expect(scene3D.floor).toBeDefined();
  });

  it('should generate correct wall meshes', () => {
    const scene3D = convertPlanToScene3D(mockFloorPlan);

    const wall1 = scene3D.walls.find((w) => w.id === 'wall-1');
    expect(wall1).toBeDefined();
    expect(wall1?.position).toHaveLength(3);
    expect(wall1?.size).toHaveLength(3);
  });

  it('should generate correct door meshes', () => {
    const scene3D = convertPlanToScene3D(mockFloorPlan);

    const door1 = scene3D.doors.find((d) => d.id === 'door-1');
    expect(door1).toBeDefined();
    expect(door1?.position).toHaveLength(3);
  });

  it('should generate correct window meshes', () => {
    const scene3D = convertPlanToScene3D(mockFloorPlan);

    const window1 = scene3D.windows.find((w) => w.id === 'window-1');
    expect(window1).toBeDefined();
    expect(window1?.position).toHaveLength(3);
  });

  it('should set default lighting', () => {
    const scene3D = convertPlanToScene3D(mockFloorPlan);

    expect(scene3D.lighting).toBeDefined();
    expect(scene3D.lighting.ambient).toBeGreaterThan(0);
    expect(scene3D.lighting.directional).toBeDefined();
  });

  it('should set default camera position', () => {
    const scene3D = convertPlanToScene3D(mockFloorPlan);

    expect(scene3D.camera).toBeDefined();
    expect(scene3D.camera.position).toHaveLength(3);
    expect(scene3D.camera.target).toHaveLength(3);
  });

  it('should handle empty floor plan', () => {
    const emptyPlan: FloorPlan = {
      id: 'empty-plan',
      name: 'Empty Plan',
      walls: [],
      doors: [],
      windows: [],
      rooms: [],
      metadata: {
        originalImage: '',
        scale: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const scene3D = convertPlanToScene3D(emptyPlan);

    expect(scene3D.walls).toHaveLength(0);
    expect(scene3D.doors).toHaveLength(0);
    expect(scene3D.windows).toHaveLength(0);
    expect(scene3D.floor).toBeDefined();
  });
});
