'use client';

import { useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  validateImageFile,
  getImageInfo,
  fileToDataUrl,
  type ValidationResult,
} from '@/lib/utils/imageValidation';
import type { AnalyzePlanResponse } from '@/types';

/**
 * 이미지 업로드 컴포넌트
 * 드래그 앤 드롭 또는 파일 선택으로 2D 평면도 이미지 업로드
 */
export function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const setOriginalImage = useAppStore((state) => state.setOriginalImage);
  const setAnalysis = useAppStore((state) => state.setAnalysis);
  const setLoading = useAppStore((state) => state.setLoading);

  // 드래그 오버 처리
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // 드래그 떠남 처리
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // 드롭 처리
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setError(null);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const file = files[0];
      await processFile(file);
    },
    []
  );

  // 파일 선택 처리
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);

      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      await processFile(file);
    },
    []
  );

  // 파일 처리
  const processFile = async (file: File) => {
    // 로딩 시작
    setLoading(true, '파일을 검증 중...', 0);
    setError(null);

    try {
      // 1. 파일 검증
      setUploadProgress(20);
      const validationResult: ValidationResult = await validateImageFile(file);

      if (!validationResult.valid) {
        setError(validationResult.error || '파일 검증에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 2. 이미지 정보 추출
      setUploadProgress(40);
      const imageInfo = await getImageInfo(file);

      // 3. Data URL 변환
      setUploadProgress(60);
      const dataUrl = await fileToDataUrl(file);
      setOriginalImage(dataUrl, file);

      // 4. Gemini API 호출
      setLoading(true, 'AI가 평면도를 분석 중...', 70);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze-plan', {
        method: 'POST',
        body: formData,
      });

      const result: AnalyzePlanResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || '평면도 분석에 실패했습니다.');
      }

      // 5. 분석 결과 저장
      setUploadProgress(100);
      setAnalysis(result.data);

      // 잠시 후 로딩 해제
      setTimeout(() => {
        setLoading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일 처리에 실패했습니다.';
      setError(errorMessage);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 w-full max-w-2xl h-64
          flex items-center justify-center
          transition-all duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-700 mb-2">평면도 이미지를 여기에 드래그하세요</p>
          <p className="text-sm text-gray-500 mb-4">또는</p>
          <label>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              파일 선택
            </button>
          </label>

          {/* 업로드 진행률 */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4 w-full max-w-xs mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">⚠️ {error}</p>
            </div>
          )}

          {/* 파일 정보 안내 */}
          <p className="mt-4 text-sm text-gray-500">
            지원 형식: JPG, PNG, PDF (최대 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
