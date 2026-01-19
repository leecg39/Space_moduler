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
 * 파일을 Base64로 변환 (Edge 런타임 호환)
 */
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * 이미지를 리사이징 (최대 2048x2048)
 */
async function resizeImage(file: File, maxSize = 2048): Promise<File> {
  // 서버 사이드에서는 리사이징 건너뜀
  if (typeof window === 'undefined') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
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

  const prompt = `당신은 전문 건축가이자 3D 모델링 전문가입니다.
이 2D 평면도 이미지를 정밀하게 분석하여 3D 모델로 변환하기 위한 JSON 데이터를 생성해주세요.

**중요: 이미지에는 도면의 외곽선(테두리)이나 치수선, 텍스트가 포함되어 있습니다. 이것들을 벽으로 인식하지 말고, 도면 내부의 '건물 구조(벽체)'만 정확하게 추출하세요.**

**분석 지침:**
1. **복잡한 구조 인식**: 이 평면도는 단순한 사각형이 아닙니다. 내부의 화장실, 계단실, 복도, 여러 개의 방으로 나뉘어진 **복잡한 구조**를 그대로 반영해야 합니다. 구조를 단순화하지 마세요.
2. **좌표계**: 이미지의 왼쪽 상단을 (0, 0), 오른쪽 하단을 (100, 100)으로 하는 **상대 좌표(0~100)**를 사용하세요.
3. **벽 (Walls)**:
   - **모든 내벽(Internal Walls)**을 빠짐없이 찾으세요. 칸막이벽, 화장실 큐비클 등도 포함합니다.
   - 벽은 반드시 연결되어 방을 형성해야 합니다.
   - 도면 용지의 네모난 테두리(Frame)는 벽이 아닙니다. 건물 실제 벽만 추출하세요.
4. **문 (Doors)**: 문이 열리는 방향 표시(부채꼴)를 보고 문의 위치를 식별하세요.
5. **창문 (Windows)**: 외벽에 있는 창문 표시를 식별하세요.
6. **방 (Rooms)**: 식별된 벽으로 둘러싸인 각 공간(사무실, 현관, 화장실, 물리치료실 등)에 텍스트 라벨을 참조하여 이름을 붙이세요.

**JSON 출력 형식:**
\`\`\`json
{
  "walls": [
    { "start": { "x": 30, "y": 20 }, "end": { "x": 30, "y": 50 }, "thickness": 0.2 },
    { "start": { "x": 30, "y": 50 }, "end": { "x": 60, "y": 50 }, "thickness": 0.2 }
    // ... 모든 벽을 나열 (수십 개가 될 수 있음)
  ],
  "doors": [
    { "position": { "x": 32, "y": 50 }, "width": 1.0, "direction": "horizontal" }
  ],
  "windows": [
    { "position": { "x": 10, "y": 25 }, "width": 1.5, "height": 1.5 }
  ],
  "rooms": [
    { "name": "Office", "boundary": [{ "x": 30, "y": 20 }, ...], "area": 15.0 },
    { "name": "Restroom", "boundary": [...], "area": 5.0 }
  ],
  "dimensions": { "width": 100, "height": 100, "scale": 0.01 }
}
\`\`\`

**주의사항:**
- **절대로 건물을 하나의 큰 사각형으로 퉁치지 마세요.** 내부 구조가 복잡하다면 벽 데이터(walls)가 많아야 합니다.
- 설명 없이 JSON 데이터만 반환하세요.`;

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
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      throw new Error('응답에서 JSON을 찾을 수 없습니다.');
    }

    let jsonStr = jsonMatch[1].trim();

    // JSON 정리: 잘못된 문자 제거
    jsonStr = jsonStr
      .replace(/,\s*}/g, '}')  // 후행 쉼표 제거 (객체)
      .replace(/,\s*]/g, ']')  // 후행 쉼표 제거 (배열)
      .replace(/[\x00-\x1F\x7F]/g, ' ')  // 제어 문자 제거
      .replace(/\\/g, '\\\\')  // 이스케이프 처리
      .replace(/\n/g, '\\n')  // 줄바꿈 이스케이프
      .replace(/\r/g, '\\r')  // 캐리지 리턴 이스케이프
      .replace(/\t/g, '\\t');  // 탭 이스케이프

    try {
      const analysis: PlanAnalysis = JSON.parse(jsonStr);
      return analysis;
    } catch (parseError) {
      console.error('JSON 파싱 오류, 기본값 반환:', parseError);
      // 기본 분석 결과 반환
      return {
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        dimensions: { width: 800, height: 600, scale: 0.01 }
      } as PlanAnalysis;
    }
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
