'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Line, Circle, Group } from 'react-konva';
import { useAppStore } from '@/lib/store';
import type { Wall, Door, Window } from '@/types';

interface Canvas2DProps {
  width: number;
  height: number;
  tool?: 'select' | 'wall' | 'door' | 'window' | 'delete';
}

// 선택 하이라이트 컴포넌트
function SelectionHighlight({ element, selected }: { element: any; selected: boolean }) {
  if (!selected) return null;

  if (element.type === 'wall') {
    const wall = element as Wall;
    return (
      <>
        <Line
          points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]}
          stroke="#3B82F6"
          strokeWidth={wall.thickness * 50 + 8}
          lineCap="round"
          lineJoin="round"
          opacity={0.3}
        />
        <Circle
          x={wall.start.x}
          y={wall.start.y}
          radius={8}
          fill="#3B82F6"
          stroke="white"
          strokeWidth={2}
          draggable
          onDragMove={(e) => {
            // 핸들 드래그 로직
          }}
        />
        <Circle
          x={wall.end.x}
          y={wall.end.y}
          radius={8}
          fill="#3B82F6"
          stroke="white"
          strokeWidth={2}
          draggable
          onDragMove={(e) => {
            // 핸들 드래그 로직
          }}
        />
      </>
    );
  }

  return null;
}

/**
 * 2D 캔버스 컴포넌트
 * 평면도 이미지를 배경으로 표시하고 벽/문/창문을 오버레이합니다.
 */
export function Canvas2D({ width, height, tool = 'select' }: Canvas2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<{ id: string; startPos: { x: number; y: number } } | null>(null);
  const [drawingWall, setDrawingWall] = useState<{ start: { x: number; y: number } | null }>({
    start: null,
  });

  const plan2D = useAppStore((state) => state.plan.plan2D);
  const originalImage = useAppStore((state) => state.plan.originalImage);
  const updatePlan2D = useAppStore((state) => state.updatePlan2D);

  // 선택된 요소 찾기
  const findSelectedElement = useCallback(() => {
    if (!selectedId || !plan2D) return null;

    const wall = plan2D.walls?.find(w => w.id === selectedId);
    if (wall) return { ...wall, type: 'wall' as const };

    const door = plan2D.doors?.find(d => d.id === selectedId);
    if (door) return { ...door, type: 'door' as const };

    const window = plan2D.windows?.find(w => w.id === selectedId);
    if (window) return { ...window, type: 'window' as const };

    return null;
  }, [selectedId, plan2D]);

  const selectedElement = findSelectedElement();

  // 이미지 로드 후 캔버스 크기 조정
  useEffect(() => {
    if (containerRef.current && originalImage) {
      const img = new Image();
      img.src = originalImage;
      img.onload = () => {
        const containerWidth = containerRef.current!.clientWidth;
        const newScale = Math.min(
          containerWidth / img.width,
          800 / img.height,
          1
        );
        setScale(newScale);
      };
    }
  }, [originalImage]);

  // 휠 줌
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const oldScale = scale;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(Math.max(0.1, Math.min(newScale, 5)));
  };

  // 요소 클릭 핸들러
  const handleElementClick = useCallback((e: any, id: string) => {
    e.cancelBubble = true;

    if (tool === 'delete') {
      // 요소 삭제
      if (plan2D) {
        const updated = { ...plan2D };
        updated.walls = updated.walls?.filter(w => w.id !== id) || [];
        updated.doors = updated.doors?.filter(d => d.id !== id) || [];
        updated.windows = updated.windows?.filter(w => w.id !== id) || [];
        updatePlan2D(updated);
      }
      setSelectedId(null);
    } else if (tool === 'select') {
      setSelectedId(id);
    }
  }, [tool, plan2D, updatePlan2D]);

  // 요소 드래그 시작
  const handleElementDragStart = useCallback((e: any, id: string) => {
    if (tool !== 'select') return;
    e.cancelBubble = true;

    const pos = e.target.getStage().getPointerPosition();
    setDraggedElement({
      id,
      startPos: { x: pos.x, y: pos.y }
    });
  }, [tool]);

  // 요소 드래그 중
  const handleElementDragMove = useCallback((e: any) => {
    if (!draggedElement || !plan2D) return;

    const pos = e.target.getStage().getPointerPosition();
    const dx = pos.x - draggedElement.startPos.x;
    const dy = pos.y - draggedElement.startPos.y;

    const updated = { ...plan2D };

    // 벽 이동
    updated.walls = updated.walls?.map(wall => {
      if (wall.id === draggedElement.id) {
        return {
          ...wall,
          start: { x: wall.start.x + dx, y: wall.start.y + dy },
          end: { x: wall.end.x + dx, y: wall.end.y + dy }
        };
      }
      return wall;
    }) || [];

    // 문 이동
    updated.doors = updated.doors?.map(door => {
      if (door.id === draggedElement.id) {
        return {
          ...door,
          position: { x: door.position.x + dx, y: door.position.y + dy }
        };
      }
      return door;
    }) || [];

    // 창문 이동
    updated.windows = updated.windows?.map(win => {
      if (win.id === draggedElement.id) {
        return {
          ...win,
          position: { x: win.position.x + dx, y: win.position.y + dy }
        };
      }
      return win;
    }) || [];

    updatePlan2D(updated);
    setDraggedElement({
      ...draggedElement,
      startPos: { x: pos.x, y: pos.y }
    });
  }, [draggedElement, plan2D, updatePlan2D]);

  // 요소 드래그 종료
  const handleElementDragEnd = useCallback(() => {
    setDraggedElement(null);
  }, []);

  // 배경 클릭 (선택 해제)
  const handleStageClick = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  }, []);

  // 캔버스 클릭 핸들러 (새 요소 추가)
  const handleCanvasClick = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    if (tool === 'wall') {
      if (!drawingWall.start) {
        setDrawingWall({ start: { x: pos.x, y: pos.y } });
      } else {
        const newWall: Wall = {
          id: crypto.randomUUID(),
          start: drawingWall.start!,
          end: { x: pos.x, y: pos.y },
          thickness: 0.2,
          height: 2.5,
        };
        updatePlan2D({ walls: [...(plan2D?.walls || []), newWall] });
        setDrawingWall({ start: null });
      }
    } else if (tool === 'door') {
      const newDoor: Door = {
        id: crypto.randomUUID(),
        position: { x: pos.x, y: pos.y },
        width: 0.9,
        direction: 'horizontal',
        opens: 'left',
      };
      updatePlan2D({ doors: [...(plan2D?.doors || []), newDoor] });
    } else if (tool === 'window') {
      const newWindow: Window = {
        id: crypto.randomUUID(),
        position: { x: pos.x, y: pos.y },
        width: 1.2,
        height: 1.5,
        fromFloor: 1.0,
      };
      updatePlan2D({ windows: [...(plan2D?.windows || []), newWindow] });
    }
  };

  // Delete 키 핸들링
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && plan2D) {
          const updated = { ...plan2D };
          updated.walls = updated.walls?.filter(w => w.id !== selectedId) || [];
          updated.doors = updated.doors?.filter(d => d.id !== selectedId) || [];
          updated.windows = updated.windows?.filter(w => w.id !== selectedId) || [];
          updatePlan2D(updated);
          setSelectedId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, plan2D, updatePlan2D]);

  if (!plan2D || !originalImage) {
    return (
      <div
        ref={containerRef}
        className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <p className="text-gray-500">평면도를 업로드해주세요.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full border border-gray-200 rounded-lg overflow-hidden relative">
      <Stage
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={offset.x}
        y={offset.y}
        draggable={false}
        onWheel={handleWheel}
        onDragMove={handleElementDragMove}
        onDragEnd={handleElementDragEnd}
        onClick={handleStageClick}
        style={{ cursor: tool === 'select' ? 'default' : 'crosshair' }}
      >
        <Layer>
          {/* 배경 이미지 */}
          <Rect
            x={0}
            y={0}
            width={plan2D.metadata.scale > 0 ? width / plan2D.metadata.scale : width}
            height={plan2D.metadata.scale > 0 ? height / plan2D.metadata.scale : height}
            fillPatternImage={originalImage}
            onClick={handleCanvasClick}
          />
        </Layer>

        <Layer>
          {/* 벽 */}
          {plan2D.walls?.map((wall) => {
            const isSelected = selectedId === wall.id;
            return (
              <Group key={wall.id}>
                <Line
                  points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]}
                  stroke={isSelected ? '#3B82F6' : '#94A3B8'}
                  strokeWidth={wall.thickness * 50}
                  lineCap="round"
                  lineJoin="round"
                  onClick={(e) => handleElementClick(e, wall.id)}
                  onDragStart={(e) => handleElementDragStart(e, wall.id)}
                  draggable={tool === 'select' && isSelected}
                />
                {isSelected && (
                  <>
                    <Circle
                      x={wall.start.x}
                      y={wall.start.y}
                      radius={8}
                      fill="#3B82F6"
                      stroke="white"
                      strokeWidth={2}
                    />
                    <Circle
                      x={wall.end.x}
                      y={wall.end.y}
                      radius={8}
                      fill="#3B82F6"
                      stroke="white"
                      strokeWidth={2}
                    />
                  </>
                )}
              </Group>
            );
          }) || []}

          {/* 문 */}
          {plan2D.doors?.map((door) => {
            const isSelected = selectedId === door.id;
            return (
              <Rect
                key={door.id}
                x={door.position.x - (door.width * 50) / 2}
                y={door.position.y - 30}
                width={door.width * 50}
                height={60}
                fill={isSelected ? '#3B82F6' : '#854D0E'}
                stroke={isSelected ? '#3B82F6' : '#000'}
                strokeWidth={isSelected ? 4 : 2}
                onClick={(e) => handleElementClick(e, door.id)}
                onDragStart={(e) => handleElementDragStart(e, door.id)}
                draggable={tool === 'select' && isSelected}
              />
            );
          }) || []}

          {/* 창문 */}
          {plan2D.windows?.map((win) => {
            const isSelected = selectedId === win.id;
            return (
              <Rect
                key={win.id}
                x={win.position.x - (win.width * 50) / 2}
                y={win.position.y - 20}
                width={win.width * 50}
                height={40}
                fill={isSelected ? '#3B82F6' : '#0EA5E9'}
                stroke={isSelected ? '#3B82F6' : '#000'}
                strokeWidth={isSelected ? 4 : 2}
                onClick={(e) => handleElementClick(e, win.id)}
                onDragStart={(e) => handleElementDragStart(e, win.id)}
                draggable={tool === 'select' && isSelected}
              />
            );
          }) || []}

          {/* 벽 그리기 중인 선 */}
          {drawingWall.start && (
            <Line
              points={[
                drawingWall.start.x,
                drawingWall.start.y,
                drawingWall.start.x + 50,
                drawingWall.start.y
              ]}
              stroke="#3B82F6"
              strokeWidth={10}
              lineCap="round"
              dash={[10, 10]}
            />
          )}
        </Layer>
      </Stage>

      {/* 선택된 요소 정보 표시 */}
      {selectedId && selectedElement && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <h3 className="text-sm font-bold mb-2">
            {selectedElement.type === 'wall' && '벽'}
            {selectedElement.type === 'door' && '문'}
            {selectedElement.type === 'window' && '창문'}
          </h3>
          <p className="text-xs text-gray-600 mb-1">ID: {selectedId.slice(0, 8)}...</p>
          {selectedElement.type === 'wall' && (
            <p className="text-xs text-gray-600">
              길이: {Math.sqrt(
                Math.pow(selectedElement.end.x - selectedElement.start.x, 2) +
                Math.pow(selectedElement.end.y - selectedElement.start.y, 2)
              ).toFixed(1)}px
            </p>
          )}
          {(selectedElement.type === 'door' || selectedElement.type === 'window') && (
            <p className="text-xs text-gray-600">
              너비: {selectedElement.width}m
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">Delete 키로 삭제</p>
        </div>
      )}

      {/* 컨트롤 바 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={() => setScale((s) => Math.max(0.1, s / 1.2))}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          -
        </button>
        <span className="text-sm font-medium w-16 text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale((s) => Math.min(5, s * 1.2))}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          +
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <button
          onClick={() => {
            setScale(1);
            setOffset({ x: 0, y: 0 });
          }}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
