/**
 * 평면도 분석 API 엔드포인트
 *
 * POST /api/analyze-plan
 * 평면도 이미지를 받아 Gemini Vision API로 분석합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzePlan } from '@/lib/api/gemini';
import type { AnalyzePlanResponse } from '@/types';

export const runtime = 'edge';
export const maxDuration = 30; // AI 처리 시간 고려

export async function POST(request: NextRequest) {
  try {
    // 1. FormData 파싱
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        {
          success: false,
          error: '이미지 파일이 없습니다.',
        } as AnalyzePlanResponse,
        { status: 400 }
      );
    }

    // 2. 파일 타입 검증
    const supportedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!supportedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        {
          success: false,
          error: '지원하지 않는 파일 형식입니다. JPG, PNG, PDF만 가능합니다.',
        } as AnalyzePlanResponse,
        { status: 400 }
      );
    }

    // 3. 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `파일이 너무 큽니다. 최대 ${maxSize / 1024 / 1024}MB까지 가능합니다.`,
        } as AnalyzePlanResponse,
        { status: 400 }
      );
    }

    // 4. Gemini API 호출 (AbortSignal 지원)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60초 타임아웃

    const analysis = await analyzePlan({
      image: imageFile,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 5. 성공 응답
    return NextResponse.json({
      success: true,
      data: analysis,
    } as AnalyzePlanResponse);

  } catch (error) {
    console.error('평면도 분석 오류:', error);

    // AbortError 처리
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          error: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
        } as AnalyzePlanResponse,
        { status: 408 }
      );
    }

    // 기타 에러
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      } as AnalyzePlanResponse,
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 지원 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
