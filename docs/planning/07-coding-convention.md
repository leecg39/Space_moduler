# Coding Convention

## 서비스명
Space Moduler

## 개요
> **"일관성 있는 코드 품질을 위한 컨벤션"**

Next.js + TypeScript + Tailwind CSS 프로젝트를 위한 코딩 규칙입니다.

---

## TypeScript

### 타입 정의

**기본 원칙:**
- `any` 사용 지양
- 인터페이스 > 타입 (객체의 경우)
- 명시적 반환 타입

```typescript
// ✅ 좋음
interface FloorPlan {
  id: string;
  name: string;
  walls: Wall[];
}

function createPlan(name: string): FloorPlan {
  return {
    id: crypto.randomUUID(),
    name,
    walls: [],
  };
}

// ❌ 나쁨
function createPlan(name: any) {
  return {
    id: Math.random(),
    name,
    walls: [],
  };
}
```

### 타입 가져오기 vs 내보내기

```typescript
// ✅ 좋음: type 키워드 사용
export type { Wall, Door, Window } from './types';

// ❌ 나쁨: 혼합 사용
export { type Wall, Door } from './types';
```

### 제네릭

```typescript
// ✅ 좋음: 명확한 제약
function getById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}

// ❌ 나쁨: 과도한 제네릭
function process<T, U, V>(data: T, mapper: (t: T) => U, reducer: (u: U) => V): V {
  // ...
}
```

---

## React

### 컴포넌트 구조

**함수형 컴포넌트 + Hooks:**

```typescript
// ✅ 좋음
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}: ButtonProps) {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
```

### 컴포넌트 이름

**파스칼 케이스 (PascalCase):**

```typescript
// ✅ 좋음
export function FloorPlanViewer() { }
export function WallEditor() { }
export function ThreeScene() { }

// ❌ 나쁨
export function floorPlanViewer() { }
export function wall_editor() { }
```

### Hooks

**카멜 케이스 + "use" 접두사:**

```typescript
// ✅ 좋음
function useFloorPlan() {
  const [plan, setPlan] = useState<FloorPlan | null>(null);

  const updateWall = useCallback((wallId: string, updates: Partial<Wall>) => {
    setPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        walls: prev.walls.map(w =>
          w.id === wallId ? { ...w, ...updates } : w
        ),
      };
    });
  }, []);

  return { plan, updateWall };
}

// ❌ 나쁨
function getFloorPlan() { } // Hook이 아님
function UseFloorPlan() { } // 카멜 케이스 아님
```

### Props 구조 분해

```typescript
// ✅ 좋음
interface Props {
  title: string;
  description: string;
}

export function Card({ title, description }: Props) {
  return <div>{title}</div>;
}

// ❌ 나쁨
export function Card(props: Props) {
  return <div>{props.title}</div>;
}
```

---

## 파일 구조

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   └── api/
│       ├── analyze-plan/
│       │   └── route.ts
│       └── upload/
│           └── route.ts
├── components/
│   ├── ui/                 # 재사용 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── 2d/                 # 2D 관련 컴포넌트
│   │   ├── Canvas.tsx
│   │   ├── WallEditor.tsx
│   │   └── ToolBar.tsx
│   └── 3d/                 # 3D 관련 컴포넌트
│       ├── Scene.tsx
│       └── Controls.tsx
├── lib/
│   ├── utils/              # 유틸리티 함수
│   │   ├── geometry.ts
│   │   └── conversion.ts
│   ├── api/                # API 클라이언트
│   │   └── gemini.ts
│   └── store.ts            # Zustand store
├── hooks/                  # 커스텀 Hooks
│   ├── useFloorPlan.ts
│   └── useCanvas.ts
├── types/                  # 타입 정의
│   ├── floor-plan.ts
│   └── api.ts
└── styles/
    └── globals.css
```

### 파일 이름

**카멜 케이스 (컴포넌트), 케밥 케이스 (유틸리티):**

```
✅ 좋음
components/Button.tsx
components/2d/Canvas.tsx
lib/utils/geometry.ts
lib/api/gemini.ts

❌ 나쁨
components/button.tsx
components/2d/canvas.tsx
lib/utils/Geometry.ts
lib/api/GeminiAPI.ts
```

---

## 명명 규칙

### 변수

**카멜 케이스 (camelCase):**

```typescript
// ✅ 좋음
const floorPlan = new FloorPlan();
const wallCount = walls.length;
const isSelected = true;

// ❌ 나쁨
const Floor_Plan = new FloorPlan();
const wall_count = walls.length;
const is_selected = true;
```

### 상수

**스네이크 케이스 + 대문자 (UPPER_SNAKE_CASE):**

```typescript
// ✅ 좋음
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_WALL_HEIGHT = 2.5; // meters
const API_TIMEOUT = 30000; // ms

// ❌ 나쁨
const MaxFileSize = 10 * 1024 * 1024;
const max_file_size = 10 * 1024 * 1024;
```

### 인터페이스 / 타입

**파스칼 케이스 (PascalCase):**

```typescript
// ✅ 좋음
interface FloorPlan { }
type WallId = string;

// ❌ 나쁨
interface floorPlan { }
type wall_id = string;
```

### 열거형

**파스칼 케이스 + 열거값도 파스칼 케이스:**

```typescript
// ✅ 좋음
enum Tool {
  Wall = 'wall',
  Door = 'door',
  Window = 'window',
}

// ❌ 나쁨
enum tool {
  WALL = 'wall',
  DOOR = 'door',
}
```

---

## 코드 스타일

### 들여쓰기

**2 스페이스:**

```typescript
// ✅ 좋음
function createWall() {
  if (condition) {
    doSomething();
  }
}

// ❌ 나쁨
function createWall()
{
    if( condition )
    {
        doSomething();
    }
}
```

### 세미콜론

**항상 사용:**

```typescript
// ✅ 좋음
const x = 1;
const y = 2;

// ❌ 나쁨
const x = 1
const y = 2
```

### 따옴표

**작은따옴표 ('):**

```typescript
// ✅ 좋음
const message = 'Hello';

// ❌ 나쁨
const message = "Hello";

// ✅ 예외: 템플릿 리터럴
const message = `Hello ${name}`;
```

---

## 주석

### JSDoc

**함수/컴포넌트에 JSDoc 사용:**

```typescript
/**
 * 2D 좌표를 3D 좌표로 변환합니다.
 *
 * @param point2d - 2D 좌표 {x, y}
 * @param scale - 변환 비율 (픽셀 -> 미터)
 * @returns 3D 좌표 {x, y, z}
 *
 * @example
 * ```ts
 * const point3d = convert2DTo3D({ x: 100, y: 200 }, 0.01);
 * // { x: 1, y: 0, z: 2 }
 * ```
 */
function convert2DTo3D(
  point2d: Point2D,
  scale: number
): Point3D {
  return {
    x: point2d.x * scale,
    y: 0,
    z: -point2d.y * scale,
  };
}
```

### 인라인 주석

```typescript
// ✅ 좋음: "왜"를 설명
// 사용자가 선택을 취소하면 기본값으로 초기화
const selectedTool = Tool.Select;

// ❌ 나쁨: "무엇"을 설명
const selectedTool = Tool.Select; // 선택된 도구
```

### TODO 주석

```typescript
// TODO: 2026-02-01 - 현재는 단순 박스로, 추후 텍스처 적용 필요
const wallMesh = new BoxGeometry(1, WALL_HEIGHT, 1);
```

---

## 임포트

### 순서

1. React 관련
2. 외부 라이브러리
3. 내부 컴포넌트
4. 유틸리티/타입
5. CSS (있는 경우)

```typescript
// ✅ 좋음
import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Button } from '@/components/ui/Button';
import { convert2DTo3D } from '@/lib/utils/geometry';
import type { FloorPlan } from '@/types';
import './WallEditor.css';

// ❌ 나쁨: 순서 없음
import './WallEditor.css';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
```

### 별칭 (as)

```typescript
// ✅ 좋음: 충돌 방지
import { Camera as ThreeCamera } from 'three';
import { Camera as ReactCamera } from '@/components/3d/Camera';

// ❌ 나쁨: 의미 없는 별칭
import { Button as Btn } from '@/components/ui/Button';
```

---

## 에러 핸들링

### try-catch

```typescript
// ✅ 좋음: 구체적인 에러 처리
async function uploadImage(file: File): Promise<string> {
  try {
    const url = await api.upload(file);
    return url;
  } catch (error) {
    if (error instanceof ApiError) {
      showToast(`업로드 실패: ${error.message}`);
    } else {
      showToast('업로드 중 알 수 없는 오류가 발생했습니다');
    }
    throw error; // 에러 다시 던지기
  }
}

// ❌ 나쁨: 에러 무시
async function uploadImage(file: File): Promise<string> {
  try {
    return await api.upload(file);
  } catch (error) {
    // 아무것도 안 함
  }
}
```

### 에러 타입

```typescript
// ✅ 좋음: 커스텀 에러 클래스
class PlanAnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'PlanAnalysisError';
  }
}

// 사용
throw new PlanAnalysisError(
  '이미지 분석에 실패했습니다',
  'ANALYSIS_FAILED',
  { originalError: error }
);
```

---

## 테스트

### 테스트 파일 이름

**`.test.ts` 또는 `.spec.ts` 접미사:**

```
✅ 좋음
lib/utils/geometry.test.ts
components/Button.test.tsx

❌ 나쁨
lib/utils/geometryTest.ts
test/geometry.ts
```

### 테스트 구조

```typescript
// ✅ 좋음: AAA 패턴 (Arrange, Act, Assert)
describe('convert2DTo3D', () => {
  it('should convert 2D point to 3D point', () => {
    // Arrange
    const point2d = { x: 100, y: 200 };
    const scale = 0.01;

    // Act
    const result = convert2DTo3D(point2d, scale);

    // Assert
    expect(result).toEqual({ x: 1, y: 0, z: -2 });
  });
});
```

---

## Git 커밋 메시지

### 컨벤션

**Conventional Commits:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 | `feat(2d): add wall drawing tool` |
| `fix` | 버그 수정 | `fix(3d): correct wall height calculation` |
| `docs` | 문서 | `docs: update API documentation` |
| `style` | 코드 스타일 | `style: format code with prettier` |
| `refactor` | 리팩토링 | `refactor(api): simplify error handling` |
| `test` | 테스트 | `test(utils): add geometry tests` |
| `chore` | 기타 | `chore: upgrade dependencies` |

### 예시

```
feat(2d): add wall drawing tool

- Implement click-and-drag wall creation
- Add wall preview while drawing
- Support wall editing after creation

Closes #123
```

---

## ESLint & Prettier

### ESLint 규칙

```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error"
  }
}
```

### Prettier 설정

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2026-01-18 | 초안 작성 | Claude (Socrates) |
