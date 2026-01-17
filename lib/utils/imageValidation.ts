/**
 * 이미지 파일 검증 유틸리티
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

// 지원되는 파일 형식
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf'] as const;

// 최대 파일 크기 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 최소 이미지 너비
export const MIN_IMAGE_WIDTH = 500;

/**
 * 파일 형식 검증
 */
export function validateFileType(file: File): ValidationResult {
  if (!SUPPORTED_FORMATS.includes(file.type as any)) {
    return {
      valid: false,
      error: '지원하지 않는 형식입니다. JPG, PNG, PDF만 가능합니다.',
    };
  }
  return { valid: true };
}

/**
 * 파일 크기 검증
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `파일이 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 가능합니다.`,
    };
  }
  return { valid: true };
}

/**
 * 이미지 크기 검증
 */
export async function validateImageDimensions(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    // PDF는 크기 검증 건너뜀
    if (file.type === 'application/pdf') {
      resolve({ valid: true });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width < MIN_IMAGE_WIDTH) {
        resolve({
          valid: false,
          error: `이미지 해상도가 너무 낮습니다. 최소 너비 ${MIN_IMAGE_WIDTH}px 이상 필요합니다.`,
        });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: '이미지를 불러오는 데 실패했습니다.',
      });
    };

    img.src = url;
  });
}

/**
 * 파일 전체 검증
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  // 1. 파일 형식 검증
  const formatResult = validateFileType(file);
  if (!formatResult.valid) return formatResult;

  // 2. 파일 크기 검증
  const sizeResult = validateFileSize(file);
  if (!sizeResult.valid) return sizeResult;

  // 3. 이미지 크기 검증
  const dimensionsResult = await validateImageDimensions(file);
  if (!dimensionsResult.valid) return dimensionsResult;

  return { valid: true };
}

/**
 * 파일에서 이미지 정보 추출
 */
export async function getImageInfo(file: File): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    if (file.type === 'application/pdf') {
      // PDF는 기본 크기 반환
      resolve({
        file,
        url,
        width: 1920,
        height: 1080,
      });
      return;
    }

    const img = new Image();

    img.onload = () => {
      resolve({
        file,
        url,
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 불러오는 데 실패했습니다.'));
    };

    img.src = url;
  });
}

/**
 * 파일을 Data URL로 변환
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('파일을 읽는 데 실패했습니다.'));
    };

    reader.readAsDataURL(file);
  });
}
