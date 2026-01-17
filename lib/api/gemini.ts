/**
 * Gemini 3.0 Pro Vision API 클라이언트
 *
 * 평면도 이미지를 분석하여 벽/문/창문 좌표를 추출합니다.
 */

import type { PlanAnalysis } from '@/types';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string;
      }>;
    };
  }>;
}

export interface AnalyzePlanOptions {
  image: File;
  signal?: AbortSignal;
}

/**
 * 파일을 Base64로 변환
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Data URL 제거 (data:image/jpeg;base64,...)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지를 리사이징 (최대 2048x2048)
 */
async function resizeImage(file: File, maxSize = 2048): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // 이미 작으면 리사이징 안 함
      if (width <= maxSize && height <= maxSize) {
        resolve(file);
        return;
      }

      // 비율 유지하면서 리사이징
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);

      // Canvas로 리사이징
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 컨텍스트를 가져올 수 없습니다.'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Blob으로 변환
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('이미지 리사이징에 실패했습니다.'));
          return;
        }
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve(resizedFile);
      }, file.type, 0.9);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 불러오는 데 실패했습니다.'));
    };

    img.src = url;
  });
}

/**
 * Gemini API 호출
 */
export async function analyzePlan(options: AnalyzePlanOptions): Promise<PlanAnalysis> {
  const { image, signal } = options;

  // 1. 이미지 리사이징
  const resizedImage = await resizeImage(image);

  // 2. Base64 변환
  const base64Image = await fileToBase64(resizedImage);

  // 3. API 요청
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const prompt = `이 2D 평면도 이미지를 분석해서 JSON 형식으로 반환해주세요.

다음 정보를 추출해주세요:
1. walls: 벽의 배열 (각 벽은 start: {x, y}, end: {x, y}, thickness: 미터)
2. doors: 문의 배열 (각 문은 position: {x, y}, width: 미터, direction: "horizontal"|"vertical")
3. windows: 창문의 배열 (각 창문은 position: {x, y}, width: 미터, height: 미터)
4. rooms: 방의 배열 (각 방은 name: 문자열, boundary: [{x, y}, ...], area: 제곱미터)
5. dimensions: { width: 픽셀, height: 픽셀, scale: 픽셀당미터 }

중요:
- 좌표는 이미지 왼쪽 상단이 (0, 0)입니다.
- scale은 픽셀을 미터로 변환하는 비율입니다 (예: 0.01 = 100픽셀 = 1미터).
- 벽 두께는 기본 0.2m, 문 높이는 기본 2.1m, 창문 높이는 기본 1.5m입니다.
- 방이 없는 경우 빈 배열을 반환하세요.

JSON만 반환해주세요. 다른 설명은 필요 없습니다.`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: image.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API 오류: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    // 응답 파싱
    const text = data.candidates[0]?.content?.parts[0]?.text;
    if (!text) {
      throw new Error('Gemini API 응답이 비어있습니다.');
    }

    // JSON 추출 (markdown 코드 블록 제거)
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || text.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      throw new Error('응답에서 JSON을 찾을 수 없습니다.');
    }

    const jsonStr = jsonMatch[1];
    const analysis: PlanAnalysis = JSON.parse(jsonStr);

    return analysis;
  } catch (error) {
    if (signal?.aborted) {
      throw new Error('요청이 취소되었습니다.');
    }
    throw error;
  }
}

/**
 * 캐싱을 위한 키 생성
 */
export function getCacheKey(file: File): string {
  return `plan-analysis-${file.name}-${file.size}-${file.lastModified}`;
}
