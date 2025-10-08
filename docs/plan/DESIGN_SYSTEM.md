# HAMA Design System

**Human-in-the-Loop AI Multiagent Investment System**

---

## 🎨 1. 브랜드 아이덴티티

### 프로젝트 컨셉
**"든든하고 신뢰할 수 있는 AI 투자 파트너"**

- 🦛 **하마(HAMA)**: 묵직하고 안정적인 느낌
- 💼 **전문성**: 금융 서비스로서의 신뢰감
- 🤝 **친근함**: AI 어시스턴트로서의 접근성

### 톤 앤 매너

| 상황 | 톤 | 예시 |
|------|-----|------|
| 일반 대화 | 친근하고 따뜻함 | "좋은 질문이에요!" |
| 분석 결과 | 전문적이고 명확함 | "재무 분석 결과는 다음과 같습니다" |
| 경고/리스크 | 진지하지만 당황스럽지 않게 | "⚠️ 현재 삼성전자 비중이 높습니다" |
| 승인 요청 | 정중하고 명확함 | "승인이 필요합니다" |
| 성공 | 긍정적이고 격려함 | "✅ 거래가 완료되었습니다!" |

---

## 🎨 2. 색상 시스템

### Primary Colors (메인 브랜드 컬러)

```css
:root {
  /* Primary - 하마 보라 (인디고) */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-300: #a5b4fc;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;  /* 메인 */
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;
  --color-primary-900: #312e81;
}
```

### Secondary Colors (보조 컬러)

```css
:root {
  /* Secondary - 보라 */
  --color-secondary-50: #faf5ff;
  --color-secondary-100: #f3e8ff;
  --color-secondary-200: #e9d5ff;
  --color-secondary-300: #d8b4fe;
  --color-secondary-400: #c084fc;
  --color-secondary-500: #a855f7;
  --color-secondary-600: #9333ea;
  --color-secondary-700: #7e22ce;
  --color-secondary-800: #6b21a8;
  --color-secondary-900: #581c87;
}
```

### Accent Colors (강조 컬러)

```css
:root {
  /* Accent - 시안 (차트, 데이터 시각화) */
  --color-accent-50: #ecfeff;
  --color-accent-100: #cffafe;
  --color-accent-200: #a5f3fc;
  --color-accent-300: #67e8f9;
  --color-accent-400: #22d3ee;
  --color-accent-500: #06b6d4;  /* 메인 */
  --color-accent-600: #0891b2;
  --color-accent-700: #0e7490;
  --color-accent-800: #155e75;
  --color-accent-900: #164e63;
}
```

### Semantic Colors (상태 컬러)

```css
:root {
  /* Success - 승인, 수익, 긍정 */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  /* Warning - 경고, 대기 */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  /* Danger - 거부, 손실, 에러 */
  --color-danger-50: #fef2f2;
  --color-danger-100: #fee2e2;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;
  --color-danger-700: #b91c1c;

  /* Info - 정보 */
  --color-info-50: #eff6ff;
  --color-info-100: #dbeafe;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;
  --color-info-700: #1d4ed8;
}
```

### Neutral Colors (회색 스케일)

```css
:root {
  /* Neutral - 텍스트, 배경, 보더 */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
}
```

### Background Colors

```css
:root {
  --bg-base: #ffffff;              /* 기본 배경 */
  --bg-subtle: #faf5ff;            /* 은은한 보라빛 배경 */
  --bg-muted: #f9fafb;             /* 회색빛 배경 */
  --bg-elevated: #ffffff;          /* 카드, 팝업 */
  
  /* Chat Specific */
  --bg-chat-user: var(--color-primary-500);     /* 사용자 메시지 */
  --bg-chat-assistant: var(--color-gray-50);    /* AI 메시지 */
  --bg-chat-approval: var(--color-warning-50);  /* 승인 요청 */
}
```

### Text Colors

```css
:root {
  --text-primary: #111827;         /* 본문 */
  --text-secondary: #6b7280;       /* 보조 텍스트 */
  --text-tertiary: #9ca3af;        /* 약한 텍스트 */
  --text-disabled: #d1d5db;        /* 비활성 */
  --text-inverse: #ffffff;         /* 다크 배경 위 */
  --text-link: var(--color-primary-600);  /* 링크 */
  --text-link-hover: var(--color-primary-700);
}
```

### Border Colors

```css
:root {
  --border-subtle: #f3f4f6;        /* 가장 연한 보더 */
  --border-default: #e5e7eb;       /* 기본 보더 */
  --border-strong: #d1d5db;        /* 강조 보더 */
  --border-focus: var(--color-primary-500);  /* 포커스 */
}
```

---

## 📝 3. 타이포그래피

### Font Family

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, "Noto Sans", sans-serif, 
               "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", 
               "Noto Color Emoji";
  
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Monaco, 
               Consolas, "Liberation Mono", "Courier New", monospace;
}

body {
  font-family: var(--font-sans);
}
```

### Font Size Scale

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Font Weight

```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Typography Classes (Tailwind Style)

```css
/* Headings */
.text-h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.text-h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.text-h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

.text-h4 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

/* Body */
.text-body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}

.text-body-sm {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

/* Labels */
.text-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
}

/* Caption */
.text-caption {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}
```

---

## 📏 4. 간격 (Spacing System)

### 8px 기반 스케일

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### 여백 규칙

| 용도 | 간격 | 예시 |
|------|------|------|
| 컴포넌트 내부 padding | 16px (space-4) | 버튼, 카드 |
| 섹션 간 간격 | 24px (space-6) | 대시보드 위젯 |
| 페이지 상하 여백 | 32px (space-8) | 페이지 컨테이너 |
| 텍스트 간격 | 8px (space-2) | 제목과 본문 사이 |
| 아이콘과 텍스트 | 8px (space-2) | 버튼 내부 |
| 폼 요소 간격 | 16px (space-4) | input, label |

---

## 📐 5. 레이아웃

### Container

```css
.container {
  width: 100%;
  max-width: 1280px;  /* Desktop */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Sizes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }
```

### Grid System

```css
.grid {
  display: grid;
  gap: var(--space-6);  /* 24px */
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
```

### Breakpoints (반응형)

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## 🧩 6. 컴포넌트 스타일

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  border-radius: var(--rounded-lg);
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
}

/* Primary Button */
.btn-primary {
  background-color: var(--color-primary-500);
  color: var(--text-inverse);
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
}

.btn-primary:active {
  background-color: var(--color-primary-700);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--color-secondary-500);
  color: var(--text-inverse);
}

/* Success Button */
.btn-success {
  background-color: var(--color-success-500);
  color: var(--text-inverse);
}

/* Danger Button */
.btn-danger {
  background-color: var(--color-danger-500);
  color: var(--text-inverse);
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.btn-ghost:hover {
  background-color: var(--color-gray-100);
}

/* Sizes */
.btn-sm {
  padding: var(--space-2) var(--space-3);  /* 8px 12px */
  font-size: var(--text-sm);
}

.btn-lg {
  padding: var(--space-4) var(--space-6);  /* 16px 24px */
  font-size: var(--text-lg);
}
```

### Cards

```css
.card {
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--rounded-xl);
  padding: var(--space-6);  /* 24px */
  box-shadow: var(--shadow-sm);
  transition: box-shadow 200ms ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-compact {
  padding: var(--space-4);  /* 16px */
}

.card-header {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-4);
  color: var(--text-primary);
}

.card-body {
  color: var(--text-secondary);
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  font-size: var(--text-base);
  color: var(--text-primary);
  background-color: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--rounded-lg);
  transition: all 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:disabled {
  background-color: var(--color-gray-100);
  color: var(--text-disabled);
  cursor: not-allowed;
}
```

### Chat Messages

```css
.message {
  display: flex;
  gap: var(--space-3);  /* 12px */
  padding: var(--space-3);
  border-radius: var(--rounded-xl);
  max-width: 80%;
}

.message-user {
  margin-left: auto;
  background-color: var(--bg-chat-user);
  color: var(--text-inverse);
  border-bottom-right-radius: var(--rounded-sm);
}

.message-assistant {
  background-color: var(--bg-chat-assistant);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-bottom-left-radius: var(--rounded-sm);
}

.message-approval {
  background-color: var(--bg-chat-approval);
  border: 1px solid var(--color-warning-200);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);  /* 4px 8px */
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--rounded-full);
}

.badge-success {
  background-color: var(--color-success-100);
  color: var(--color-success-700);
}

.badge-warning {
  background-color: var(--color-warning-100);
  color: var(--color-warning-700);
}

.badge-danger {
  background-color: var(--color-danger-100);
  color: var(--color-danger-700);
}
```

---

## 🎭 7. 그림자 (Shadow)

```css
:root {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
               0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
```

### Elevation Scale

| Level | Shadow | 용도 |
|-------|--------|------|
| 0 | none | 기본 |
| 1 | shadow-sm | 카드 |
| 2 | shadow-md | 호버 카드, 드롭다운 |
| 3 | shadow-lg | 다이얼로그 |
| 4 | shadow-xl | 모달 |
| 5 | shadow-2xl | 팝오버 |

---

## 🔲 8. 보더 라운드 (Border Radius)

```css
:root {
  --rounded-none: 0;
  --rounded-sm: 0.125rem;    /* 2px */
  --rounded-base: 0.25rem;   /* 4px */
  --rounded-md: 0.375rem;    /* 6px */
  --rounded-lg: 0.5rem;      /* 8px */
  --rounded-xl: 0.75rem;     /* 12px */
  --rounded-2xl: 1rem;       /* 16px */
  --rounded-3xl: 1.5rem;     /* 24px */
  --rounded-full: 9999px;
}
```

### 사용 가이드

| 컴포넌트 | Radius | 비고 |
|---------|--------|------|
| 버튼 | rounded-lg (8px) | |
| 카드 | rounded-xl (12px) | |
| 입력창 | rounded-lg (8px) | |
| 배지 | rounded-full | |
| 아바타 | rounded-full | |
| 다이얼로그 | rounded-2xl (16px) | |
| 메시지 버블 | rounded-xl (12px) | 한쪽 모서리는 sm |

---

## ⏱️ 9. 애니메이션

### Duration

```css
:root {
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
}
```

### Easing

```css
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Transitions

```css
.transition-all {
  transition: all var(--duration-base) var(--ease-in-out);
}

.transition-colors {
  transition: background-color var(--duration-base) var(--ease-in-out),
              border-color var(--duration-base) var(--ease-in-out),
              color var(--duration-base) var(--ease-in-out);
}

.transition-transform {
  transition: transform var(--duration-base) var(--ease-in-out);
}
```

---

## 🎯 10. 특수 컴포넌트

### Approval Dialog

```css
.approval-dialog {
  background-color: var(--bg-elevated);
  border: 2px solid var(--color-warning-300);
  border-radius: var(--rounded-2xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-xl);
  max-width: 480px;
}

.approval-dialog-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.approval-dialog-content {
  background-color: var(--color-gray-50);
  border-radius: var(--rounded-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.approval-dialog-actions {
  display: flex;
  gap: var(--space-2);
}
```

### Loading States

```css
.loading-spinner {
  border: 2px solid var(--color-gray-200);
  border-top-color: var(--color-primary-500);
  border-radius: var(--rounded-full);
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 25%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--rounded-lg);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 📱 11. 반응형 디자인 원칙

### Mobile First

기본은 모바일, 큰 화면은 확장

```css
/* Mobile (기본) */
.grid { grid-template-columns: 1fr; }

/* Tablet */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### Breakpoint 가이드

| 디바이스 | 범위 | 가이드 |
|---------|------|--------|
| Mobile | < 640px | 세로 스크롤, 버튼 크게 |
| Tablet | 640px - 1024px | 2컬럼 레이아웃 |
| Desktop | > 1024px | 3-4컬럼 레이아웃, 사이드바 |

---

## ✅ 12. 디자인 체크리스트

### 색상

- [ ] Primary 색상 일관성 유지
- [ ] Success/Warning/Danger 적절히 사용
- [ ] Contrast ratio 4.5:1 이상 (접근성)

### 간격

- [ ] 8px 스케일 준수
- [ ] 컴포넌트 간 일관된 간격
- [ ] 페이지 여백 충분히

### 타이포그래피

- [ ] 폰트 크기 스케일 준수
- [ ] 적절한 line-height
- [ ] 텍스트 계층 명확히

### 컴포넌트

- [ ] 버튼 크기 일관성
- [ ] 호버/포커스 상태 정의
- [ ] 로딩 상태 표시

### 반응형

- [ ] Mobile에서 잘 동작
- [ ] Tablet에서 잘 동작
- [ ] Desktop에서 잘 동작

---

## 📝 Tailwind CSS Config

위 디자인 시스템을 Tailwind CSS에 적용하는 설정:

```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // ... 나머지 색상
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'base': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
    },
  },
}
```

---

**Version**: 1.0  
**Last Updated**: 2025-10-09  
**Maintainer**: HAMA Frontend Team