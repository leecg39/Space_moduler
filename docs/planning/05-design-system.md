# Design System

## 서비스명
Space Moduler

## 개요
> **"간결하고 현대적인 인테리어 테크 디자인"**

사용자가 평면도를 3D로 변환하는 과정을 직관적이고 즐겁게 만드는 디자인 시스템입니다.

---

## 디자인 원칙

### 핵심 가치

| 원칙 | 설명 | 예시 |
|------|------|------|
| **단순함 (Simplicity)** | 불필요한 요소 제거, 드래그 1회 완료 | 버튼 최소화 |
| **명확함 (Clarity)** | 다음 단계가 항상 명확함 | 진행 표시, 안내 텍스트 |
| **속도감 (Speed)** | 로딩도 경험으로 만듦 | 애니메이션, 피드백 |
| **신뢰감 (Trust)** | 전문적이고 안정적인 느낌 | 정돈된 레이아웃 |

---

## 색상 시스템

### 프라이머리 컬러

```css
/* 브랜드 컬러 */
--primary-50:  #EEF2FF;
--primary-100: #E0E7FF;
--primary-200: #C7D2FE;
--primary-300: #A5B4FC;
--primary-400: #818CF8;
--primary-500: #6366F1;  /* 메인 브랜드 */
--primary-600: #4F46E5;
--primary-700: #4338CA;
--primary-800: #3730A3;
--primary-900: #312E81;
```

**사용:**
- Primary 500: 주요 버튼, 링크, 하이라이트
- Primary 100: 배경, 호버 상태
- Primary 700: 활성 상태, 눌림 효과

### 뉴트럴 컬러

```css
/* 그레이스케일 */
--gray-50:  #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

**사용:**
- Gray 50: 페이지 배경
- Gray 100: 카드 배경
- Gray 200: 구분선
- Gray 500: 보조 텍스트
- Gray 700: 본문 텍스트
- Gray 900: 제목 텍스트

### 시맨틱 컬러

```css
/* 상태 컬러 */
--success-500: #10B981;  /* 성공, 완료 */
--warning-500: #F59E0B;  /* 경고, 진행 중 */
--error-500:   #EF4444;  /* 에러, 실패 */
--info-500:    #3B82F6;  /* 정보, 안내 */
```

### 특수 컬러 (3D 요소)

```css
/* 3D 시각화 컬러 */
--wall-color:     #94A3B8;  /* 벽 */
--door-color:     #854D0E;  /* 문 */
--window-color:   #0EA5E9;  /* 창문 */
--floor-color:    #F1F5F9;  /* 바닥 */
--highlight-color: #F59E0B; /* 선택 요소 */
```

---

## 타이포그래피

### 폰트 패밀리

```css
/* 기본 폰트: 시스템 폰트 (성능 최적화) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;

/* 코드/숫자 전용 폰트 (추후) */
font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

### 타이포그래피 스케일

| 이름 | 크기 | 높이 | 용도 |
|------|------|------|------|
| **Display** | 48px | 56px | 메인 히어로 |
| **H1** | 36px | 44px | 페이지 제목 |
| **H2** | 30px | 38px | 섹션 제목 |
| **H3** | 24px | 32px | 소제목 |
| **H4** | 20px | 28px | 카드 제목 |
| **Body Large** | 18px | 28px | 강조 본문 |
| **Body** | 16px | 24px | 기본 본문 |
| **Body Small** | 14px | 20px | 보조 텍스트 |
| **Caption** | 12px | 16px | 캡션, 라벨 |

### 폰트 웨이트

```css
--font-light:   300;
--font-regular: 400;
--font-medium:  500;
--font-semibold: 600;
--font-bold:    700;
```

**사용:**
- Regular: 본문 텍스트
- Medium: 라벨, 버튼
- Semibold: 제목, 강조
- Bold: 큰 제목

---

## 스페이싱

### 기본 단위

```css
/* 4px 기반의 8점 그리드 시스템 */
--space-0:   0;
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
```

### 컴포넌트별 스페이싱

| 컴포넌트 | Padding | Margin |
|----------|---------|--------|
| **버튼** | 12px 24px | 0 |
| **카드** | 24px | 16px (간격) |
| **입력필드** | 12px 16px | 8px (하단) |
| **모달** | 32px | N/A |

---

## 레이아웃

### 컨테이너

```css
/* 최대 너비 */
--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;
--container-2xl: 1536px;

/* 기본 컨테이너 */
.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

### 그리드

```css
/* 12컬럼 그리드 */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

/* 예시: 사이드바 + 메인 */
.sidebar {
  grid-column: span 3;
}

.main {
  grid-column: span 9;
}
```

### 화면 레이아웃

```
┌─────────────────────────────────────────────────────┐
│  Header (64px)                                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Main Content (flex-grow)                            │
│  ┌────────────┬─────────────────────────────────┐   │
│  │            │                                 │   │
│  │ Sidebar    │  Canvas                        │   │
│  │ (240px)    │  (flex-grow)                   │   │
│  │            │                                 │   │
│  └────────────┴─────────────────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 컴포넌트

### 버튼

```css
/* 프라이머리 버튼 */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* 세컨더리 버튼 */
.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  /* ... */
}
```

### 카드

```css
.card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### 입력필드

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

### 로딩 스피너

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 아이콘

### 아이콘 시스템

**라이브러리:** Lucide React (또는 Heroicons)

```typescript
import { Upload, Home, Settings, Share } from 'lucide-react';

// 사용
<Upload className="w-6 h-6" />
```

### 아이콘 크기

```css
--icon-xs:  16px;
--icon-sm:  20px;
--icon-md:  24px;
--icon-lg:  32px;
--icon-xl:  48px;
```

---

## 애니메이션

### 기본 원칙

```css
/* 이징 함수 */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* 지속 시간 */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
```

### 트랜지션

```css
/* 호버 효과 */
.hover-effect {
  transition: all var(--duration-base) var(--ease-out);
}

/* 페이드 인 */
.fade-in {
  animation: fadeIn var(--duration-slow) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 로딩 애니메이션

```css
/* 프로그레스 바 */
.progress-bar {
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary-500);
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
```

---

## 다크 모드 (옵션)

### 다크 모드 컬러

```css
[data-theme="dark"] {
  --gray-50:  #111827;
  --gray-100: #1F2937;
  --gray-200: #374151;
  --gray-700: #E5E7EB;
  --gray-800: #F3F4F6;
  --gray-900: #F9FAFB;
}
```

### 구현

```typescript
// 테마 전환
const toggleTheme = () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
};
```

---

## 반응형 디자인

### 브레이크포인트

```css
/* Tailwind 기본 브레이크포인트 */
--breakpoint-sm:  640px;
--breakpoint-md:  768px;
--breakpoint-lg:  1024px;
--breakpoint-xl:  1280px;
--breakpoint-2xl: 1536px;
```

### 미디어 쿼리

```css
/* 모바일 퍼스트 */
.component {
  /* 기본: 모바일 스타일 */
  padding: var(--space-4);
}

@media (min-width: 768px) {
  /* 태블릿 이상 */
  .component {
    padding: var(--space-6);
  }
}
```

---

## 접근성

### 포커스 상태

```css
/* 명확한 포커스 표시 */
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* 버튼 포커스 */
.btn-primary:focus-visible {
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
}
```

### 대비율

| 컬러 조합 | 대비율 | WCAG 등급 |
|----------|--------|----------|
| Primary 500 on White | 4.5:1 | AA |
| Gray 700 on White | 9.5:1 | AAA |
| Gray 500 on White | 4.6:1 | AA |

---

## Tailwind CSS 설정

### tailwind.config.js

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          // ...
          500: '#6366F1',
          // ...
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2026-01-18 | 초안 작성 | Claude (Socrates) |
