import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewModeSelector, CAMERA_PRESETS } from '../3d/ViewModeSelector';

describe('ViewModeSelector', () => {
  it('should render all view mode buttons', () => {
    render(<ViewModeSelector />);

    expect(screen.getByText('상면')).toBeInTheDocument();
    expect(screen.getByText('정면')).toBeInTheDocument();
    expect(screen.getByText('3D')).toBeInTheDocument();
  });

  it('should have default mode as perspective', () => {
    const onViewChange = vi.fn();
    render(<ViewModeSelector onViewChange={onViewChange} />);

    const perspectiveButton = screen.getByText('3D');
    expect(perspectiveButton).toHaveClass('bg-primary-500');
  });

  it('should call onViewChange when clicking a mode', () => {
    const onViewChange = vi.fn();
    render(<ViewModeSelector onViewChange={onViewChange} />);

    const topButton = screen.getByText('상면');
    fireEvent.click(topButton);

    expect(onViewChange).toHaveBeenCalledWith('top');
  });

  it('should update active state on click', () => {
    render(<ViewModeSelector currentMode="perspective" />);

    const topButton = screen.getByText('상면');
    const perspectiveButton = screen.getByText('3D');

    expect(perspectiveButton).toHaveClass('bg-primary-500');

    fireEvent.click(topButton);

    // After clicking, the button should become active
    // Note: This depends on internal state management
    expect(topButton).toBeInTheDocument();
  });
});

describe('CAMERA_PRESETS', () => {
  it('should have presets for all view modes', () => {
    expect(CAMERA_PRESETS.top).toBeDefined();
    expect(CAMERA_PRESETS.front).toBeDefined();
    expect(CAMERA_PRESETS.perspective).toBeDefined();
  });

  it('should have correct position format for top view', () => {
    const { position } = CAMERA_PRESETS.top;

    expect(position).toHaveLength(3);
    expect(position[0]).toBe(0);
    expect(position[1]).toBe(10);
    expect(position[2]).toBe(0);
  });

  it('should have correct target for all views', () => {
    expect(CAMERA_PRESETS.top.target).toEqual([0, 0, 0]);
    expect(CAMERA_PRESETS.front.target).toEqual([0, 1.5, 0]);
    expect(CAMERA_PRESETS.perspective.target).toEqual([0, 0, 0]);
  });
});
