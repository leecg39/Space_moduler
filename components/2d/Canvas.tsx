'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Circle } from 'react-konva';
import { useAppStore } from '@/lib/store';
import type { Wall, Door, Window } from '@/types';

interface Canvas2DProps {
  width: number;
  height: number;
}

/**
 * 2D 캔버스 컴포넌트
 * 평면도 이미지를 배경으로 표시하고 벽/문/창문을 오버레이합니다.
 */
export function Canvas2D({ width, height }: Canvas2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const plan2D = useAppStore((state) => state.plan.plan2D);
  const originalImage = useAppStore((state) => state.plan.originalImage);

  // 이미지 로드 후 캔버스 크기 조정
  useEffect(() => {
    if (containerRef.current && originalImage) {
      const img = new Image();
      img.src = originalImage;
      img.onload = () => {
        const containerWidth = containerRef.current!.clientWidth;
        const scale = Math.min(
          containerWidth / img.width,
          800 / img.height,
          1
        );
        setScale(scale);
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

  // 패닝 시작
  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setLastMousePos({ x: e.evt.clientX, y: e.evt.clientY });
  };

  // 패닝 중
  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    const dx = e.evt.clientX - lastMousePos.x;
    const dy = e.evt.clientY - lastMousePos.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastMousePos({ x: e.evt.clientX, y: e.evt.clientY });
  };

  // 패닝 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
    <div ref={containerRef} className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <Stage
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={offset.x}
        y={offset.y}
        draggable={false}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <Layer>
          {/* 배경 이미지 */}
          <Rect
            x={0}
            y={0}
            width={plan2D.metadata.scale > 0 ? width / plan2D.metadata.scale : width}
            height={plan2D.metadata.scale > 0 ? height / plan2D.metadata.scale : height}
            fillPatternImage={originalImage}
          />
        </Layer>

        <Layer>
          {/* 벽 */}
          {plan2D.walls.map((wall) => {
            const dx = wall.end.x - wall.start.x;
            const dy = wall.end.y - wall.start.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

            return (
              <Line
                key={wall.id}
                points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]}
                stroke="#94A3B8"
                strokeWidth={wall.thickness * 50} // 픽셀로 변환 (가정)
                lineCap="round"
                lineJoin="round"
              />
            );
          })}

          {/* 문 */}
          {plan2D.doors.map((door) => (
            <Rect
              key={door.id}
              x={door.position.x - (door.width * 50) / 2}
              y={door.position.y - 30}
              width={door.width * 50}
              height={60}
              fill="#854D0E"
              stroke="#000"
              strokeWidth={2}
            />
          ))}

          {/* 창문 */}
          {plan2D.windows.map((window) => (
            <Rect
              key={window.id}
              x={window.position.x - (window.width * 50) / 2}
              y={window.position.y - 20}
              width={window.width * 50}
              height={40}
              fill="#0EA5E9"
              stroke="#000"
              strokeWidth={2}
            />
          ))}
        </Layer>
      </Stage>

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
