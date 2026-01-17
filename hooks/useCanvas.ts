import { useState, useEffect, RefObject } from 'react';

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

    const img = new Image();
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
