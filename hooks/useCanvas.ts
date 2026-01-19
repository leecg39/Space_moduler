import { useState, useEffect, useRef, RefObject, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { Wall, Door, Window } from '@/types';

interface UseCanvasSizeResult {
  width: number;
  height: number;
  containerRef: RefObject<HTMLDivElement>;
}

/**
 * 캔버스 크기를 계산하는 커스텀 훅
 */
export function useCanvasSize(imageUrl: string | null): UseCanvasSizeResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    const img = new window.Image();
    img.src = imageUrl;

    img.onload = () => {
      const containerWidth = containerRef.current!.clientWidth;
      const containerHeight = 600; // 고정 높이

      const imageRatio = img.width / img.height;
      const containerRatio = containerWidth / containerHeight;

      let finalWidth = containerWidth;
      let finalHeight = containerHeight;

      if (imageRatio > containerRatio) {
        // 이미지가 더 넓음
        finalHeight = containerWidth / imageRatio;
      } else {
        // 이미지가 더 높음
        finalWidth = containerHeight * imageRatio;
      }

      setSize({ width: finalWidth, height: finalHeight });
    };
  }, [imageUrl]);

  return { ...size, containerRef };
}

interface UseCanvasEditReturn {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  handleElementClick: (e: any, id: string) => void;
  handleElementDrag: (e: any, id: string) => void;
  handleElementDragEnd: (e: any, id: string) => void;
  handleDelete: (id: string) => void;
  handleResize: (e: any, id: string, handle: 'start' | 'end') => void;
}

/**
 * 2D 캔버스 편집 기능을 관리하는 훅
 * 요소 선택, 이동, 삭제, 크기 조정 기능을 제공합니다.
 */
export function useCanvasEdit(): UseCanvasEditReturn {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<'start' | 'end' | null>(null);

  const plan2D = useAppStore((state) => state.plan.plan2D);
  const updatePlan2D = useAppStore((state) => state.updatePlan2D);

  // 요소 클릭 핸들러
  const handleElementClick = useCallback((e: any, id: string) => {
    e.cancelBubble = true;
    setSelectedId(id);
  }, []);

  // 요소 드래그 시작
  const handleElementDrag = useCallback((e: any, id: string) => {
    if (!plan2D) return;

    const pos = e.target.getStage().getPointerPosition();
    const element = findElementById(id);
    if (!element) return;

    const offsetX = pos.x - element.position?.x || element.start.x;
    const offsetY = pos.y - element.position?.y || element.start.y;
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  }, [plan2D]);

  // 요소 드래그 중
  const handleElementDragMove = useCallback((e: any, id: string) => {
    if (!isDragging || !plan2D) return;

    const pos = e.target.getStage().getPointerPosition();
    const dx = pos.x - dragOffset.x;
    const dy = pos.y - dragOffset.y;

    updatePlan2D((prev) => {
      if (!prev) return prev;

      const updated = { ...prev };

      // 벽 이동
      if (updated.walls) {
        updated.walls = updated.walls.map(wall => {
          if (wall.id === id) {
            return {
              ...wall,
              start: { x: wall.start.x + dx, y: wall.start.y + dy },
              end: { x: wall.end.x + dx, y: wall.end.y + dy }
            };
          }
          return wall;
        });
      }

      // 문/창문 이동
      if (updated.doors) {
        updated.doors = updated.doors.map(door => {
          if (door.id === id) {
            return { ...door, position: { x: dx, y: dy } };
          }
          return door;
        });
      }

      if (updated.windows) {
        updated.windows = updated.windows.map(window => {
          if (window.id === id) {
            return { ...window, position: { x: dx, y: dy } };
          }
          return window;
        });
      }

      return updated;
    });
  }, [isDragging, dragOffset, plan2D, updatePlan2D]);

  // 요소 드래그 종료
  const handleElementDragEnd = useCallback((e: any, id: string) => {
    setIsDragging(false);
  }, []);

  // 요소 삭제
  const handleDelete = useCallback((id: string) => {
    if (!plan2D) return;

    updatePlan2D((prev) => {
      if (!prev) return prev;

      const updated = { ...prev };

      // 벽 삭제
      if (updated.walls) {
        updated.walls = updated.walls.filter(wall => wall.id !== id);
      }

      // 문 삭제
      if (updated.doors) {
        updated.doors = updated.doors.filter(door => door.id !== id);
      }

      // 창문 삭제
      if (updated.windows) {
        updated.windows = updated.windows.filter(window => window.id !== window.id);
      }

      return updated;
    });

    setSelectedId(null);
  }, [plan2D, updatePlan2D]);

  // 크기 조정 시작
  const handleResizeStart = useCallback((e: any, id: string, handle: 'start' | 'end') => {
    e.cancelBubble = true;
    setIsResizing(true);
    setResizeHandle(handle);
  }, []);

  // 크기 조정 중
  const handleResizeMove = useCallback((e: any, id: string) => {
    if (!isResizing || !plan2D || !resizeHandle) return;

    const pos = e.target.getStage().getPointerPosition();

    updatePlan2D((prev) => {
      if (!prev) return prev;

      const updated = { ...prev };

      // 벽 크기 조정
      if (updated.walls) {
        updated.walls = updated.walls.map(wall => {
          if (wall.id === id) {
            if (resizeHandle === 'start') {
              return { ...wall, start: { x: pos.x, y: pos.y } };
            } else {
              return { ...wall, end: { x: pos.x, y: pos.y } };
            }
          }
          return wall;
        });
      }

      return updated;
    });
  }, [isResizing, resizeHandle, plan2D, updatePlan2D]);

  // 크기 조정 종료
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  // ID로 요소 찾기
  const findElementById = (id: string) => {
    if (!plan2D) return null;

    // 벽 검색
    const wall = plan2D.walls?.find(w => w.id === id);
    if (wall) return { ...wall, type: 'wall' as const };

    // 문 검색
    const door = plan2D.doors?.find(d => d.id === id);
    if (door) return { ...door, type: 'door' as const, position: { x: door.position.x, y: door.position.y } };

    // 창문 검색
    const window = plan2D.windows?.find(w => w.id === id);
    if (window) return { ...window, type: 'window' as const, position: { x: window.position.x, y: window.position.y } };

    return null;
  };

  return {
    selectedId,
    setSelectedId,
    handleElementClick,
    handleElementDrag,
    handleElementDragEnd,
    handleDelete,
    handleResize: handleResizeStart,
  };
}
