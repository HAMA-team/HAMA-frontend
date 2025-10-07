# HAMA 페이지별 구성 가이드

## 🎨 디자인 컨셉: 하마(HAMA)

### 핵심 키워드
- **든든함**: 하마처럼 묵직하고 안정적인 느낌
- **신뢰감**: 금융 서비스답게 전문적
- **친근함**: AI 어시스턴트로서 접근성

---

### 색상 팔레트: 하마 보라 테마 🦛

#### CSS 변수
```css
:root {
  /* Primary - 메인 버튼, 강조 */
  --primary: #6366f1;        /* 인디고 (하마스러운 보라) */
  --primary-hover: #4f46e5;  /* 호버 시 */
  
  /* Secondary - 보조 요소 */
  --secondary: #8b5cf6;      /* 보라 (하마 피부색) */
  --secondary-hover: #7c3aed;
  
  /* Accent - 포인트 */
  --accent: #06b6d4;         /* 시안 */
  --accent-hover: #0891b2;
  
  /* Background */
  --bg-main: #ffffff;        /* 메인 배경 */
  --bg-subtle: #faf5ff;      /* 보라빛 화이트 */
  --bg-user: #6366f1;        /* 사용자 메시지 */
  --bg-ai: #f5f3ff;          /* AI 메시지 */
  
  /* Status Colors - 승인/거부/경고 */
  --success: #10b981;        /* 승인, 수익 */
  --warning: #f59e0b;        /* 경고, 대기 */
  --danger: #ef4444;         /* 거부, 손실 */
  
  /* Text */
  --text-primary: #1e293b;   /* 본문 */
  --text-secondary: #64748b; /* 보조 텍스트 */
  --text-muted: #94a3b8;     /* 연한 텍스트 */
  
  /* Border */
  --border: #e2e8f0;
  --border-hover: #cbd5e1;
}
```

#### Tailwind CSS Config (실제 프로젝트 적용)
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
        },
      },
      backgroundColor: {
        'subtle': '#faf5ff',
        'chat-user': '#6366f1',
        'chat-ai': '#f5f3ff',
      },
      textColor: {
        'primary': '#1e293b',
        'secondary': '#64748b',
        'muted': '#94a3b8',
      },
      borderColor: {
        DEFAULT: '#e2e8f0',
        'hover': '#cbd5e1',
      }
    }
  }
}
```

---

### 하마 아이콘 사용법

#### 채팅 메시지에서 사용
```tsx
// AI 메시지
import HamaAvatar from '/assets/hama-avatar.svg';

<div className="flex gap-3">
  <img src={HamaAvatar} className="w-10 h-10" alt="HAMA" />
  <div className="bg-chat-ai rounded-lg p-4 border border-border">
    <p className="text-primary">삼성전자 현재가는 89,000원입니다.</p>
  </div>
</div>

// 사용자 메시지
<div className="flex gap-3 justify-end">
  <div className="bg-chat-user rounded-lg p-4 text-white">
    <p>삼성전자 주가는?</p>
  </div>
  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
    👤
  </div>
</div>
```

#### 헤더/로고에서 사용
```tsx
import HamaBasic from '/assets/hama-basic.svg';

<header className="bg-white border-b border-border">
  <div className="flex items-center gap-2">
    <img src={HamaBasic} className="w-8 h-8" alt="HAMA" />
    <span className="text-xl font-bold text-primary">HAMA</span>
  </div>
</header>
```

#### 로딩 상태
```tsx
import HamaAvatar from '/assets/hama-avatar.svg';

{isLoading && (
  <div className="flex flex-col items-center gap-2">
    <img 
      src={HamaAvatar} 
      className="w-16 h-16 animate-bounce" 
      alt="Loading" 
    />
    <p className="text-secondary text-sm">HAMA가 생각 중...</p>
  </div>
)}
```

---

---

## 📱 페이지별 상세 구성

### 1. 채팅 인터페이스 (`/chat`) ⭐ 메인

**URL**: `/chat`  
**용도**: 핵심 기능 - AI와 대화하며 투자 분석 및 매매

#### 레이아웃
```
┌─────────────────────────────────────────┐
│  🦛 HAMA  [자동화 레벨: 코파일럿 ▼]     │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  [AI 메시지]                            │
│  삼성전자 현재가는 89,000원...          │
│                                         │
│              [사용자 메시지]            │
│              삼성전자 10주 매수해줘     │
│                                         │
│  [AI 메시지 + 승인 요청]                │
│  ⚠️ 승인이 필요합니다                   │
│  ┌───────────────────────────┐         │
│  │ 종목: 삼성전자            │         │
│  │ 수량: 10주                │         │
│  │ [✅ 승인] [❌ 거부]       │         │
│  └───────────────────────────┘         │
│                                         │
│                                         │ ← Messages Area
│                                         │   (scroll)
├─────────────────────────────────────────┤
│ [메시지 입력창]              [전송 →]  │ ← Input
└─────────────────────────────────────────┘
```

#### 주요 컴포넌트
1. **ChatHeader**
   - 🦛 HAMA 로고
   - 자동화 레벨 표시 (Dropdown)
   - 새 대화 버튼

2. **MessageList**
   - 사용자 메시지 (오른쪽, 파란색)
   - AI 메시지 (왼쪽, 회색)
   - 타임스탬프
   - 로딩 인디케이터 (AI 응답 중)

3. **ApprovalCard** (메시지 안에 포함)
   - 주문/리밸런싱 상세 정보
   - 리스크 경고 (있으면)
   - 승인/거부 버튼

4. **MessageInput**
   - 텍스트 입력창
   - 전송 버튼
   - 파일 첨부 (Phase 2)

#### 특별 UI 요소
- **Typing Indicator**: AI가 답변 생성 중일 때
  ```
  HAMA가 입력 중... ●●●
  ```

- **Quick Actions** (입력창 위):
  ```
  [💡 종목 추천] [📊 포트폴리오 분석] [📈 시장 전망]
  ```

---

### 2. 대시보드 (`/`) 

**URL**: `/`  
**용도**: 한눈에 보는 투자 현황

#### 레이아웃
```
┌─────────────────────────────────────────┐
│  🦛 HAMA Dashboard                      │ ← Header
├─────────────────────────────────────────┤
│  총 자산                                │
│  ₩10,000,000                            │
│  +5.2% (↑ ₩500,000)                    │
│                                         │
├──────────────┬──────────────────────────┤
│ 📊 포트폴리오│ 📈 최근 거래             │
│              │                          │
│ 삼성전자 35% │ 2025-10-07              │
│ SK하이닉스   │ 삼성전자 10주 매수      │
│ NAVER       │ ₩890,000                │
│              │                          │
├──────────────┴──────────────────────────┤
│  [💬 HAMA와 대화하기]  [📊 상세보기]   │
└─────────────────────────────────────────┘
```

#### 주요 섹션
1. **Portfolio Summary**
   - 총 자산
   - 수익률 (색깔로 표시: 초록/빨강)
   - 간단한 파이 차트 (Option)

2. **Holdings List**
   - 상위 3-5개 종목
   - 비중 표시

3. **Recent Trades**
   - 최근 3개 거래
   - 날짜, 종목, 금액

4. **Quick Actions**
   - "HAMA와 대화하기" → `/chat`
   - "포트폴리오 상세보기" → `/portfolio`

---

### 3. 포트폴리오 (`/portfolio`)

**URL**: `/portfolio`  
**용도**: 보유 종목 상세 정보

#### 레이아웃
```
┌─────────────────────────────────────────┐
│  📊 내 포트폴리오                       │
├─────────────────────────────────────────┤
│  총 평가액: ₩10,000,000                 │
│  투자 원금: ₩9,500,000                  │
│  평가 손익: +₩500,000 (+5.2%)          │
├─────────────────────────────────────────┤
│                                         │
│  [차트 영역 - recharts]                 │
│  (수익률 그래프 or 자산 배분 파이차트)   │
│                                         │
├─────────────────────────────────────────┤
│  보유 종목                              │
│                                         │
│  삼성전자 (005930)           35%       │
│  10주 | 평가: ₩890,000 | +2.3%         │
│                                         │
│  SK하이닉스 (000660)         25%       │
│  5주 | 평가: ₩625,000 | +8.7%          │
│                                         │
│  NAVER (035420)              20%       │
│  3주 | 평가: ₩540,000 | -1.2%          │
│                                         │
│  현금                        20%       │
│  ₩2,000,000                             │
├─────────────────────────────────────────┤
│  [리밸런싱 요청] [종목 추가]            │
└─────────────────────────────────────────┘
```

#### 주요 컴포넌트
1. **PortfolioSummary**
   - 총 평가액, 원금, 손익
   - 색깔로 표시

2. **PerformanceChart** (recharts 사용)
   - 수익률 추이 그래프
   - 또는 자산 배분 파이차트

3. **HoldingsList**
   - 각 종목별 카드
   - 종목명, 코드, 비중, 수량, 평가액, 수익률

4. **Actions**
   - "리밸런싱 요청" → HITL 발생
   - "종목 추가" → `/chat`으로 이동

---

### 4. 설정 (`/settings`)

**URL**: `/settings`  
**용도**: 자동화 레벨 및 기본 설정

#### 레이아웃
```
┌─────────────────────────────────────────┐
│  ⚙️ 설정                                │
├─────────────────────────────────────────┤
│  자동화 레벨                            │
│                                         │
│  ○ ✈️ 파일럿 모드                      │
│    AI가 거의 모든 것을 처리            │
│                                         │
│  ● 🤝 코파일럿 모드 (현재)             │
│    AI가 제안, 큰 결정만 승인           │
│                                         │
│  ○ 📊 어드바이저 모드                  │
│    AI는 정보만 제공, 사용자 결정       │
│                                         │
├─────────────────────────────────────────┤
│  투자 성향                              │
│  ● 중립 (밸런스형)                     │
│  ○ 공격적 (성장형)                     │
│  ○ 보수적 (안정형)                     │
│                                         │
├─────────────────────────────────────────┤
│  알림 설정 (Phase 2)                    │
│  □ 매매 완료 시 알림                   │
│  □ 리스크 경고 알림                    │
│                                         │
├─────────────────────────────────────────┤
│  [저장]                                │
└─────────────────────────────────────────┘
```

#### 주요 섹션
1. **Automation Level Selector**
   - 3가지 옵션 라디오 버튼
   - 각 레벨 설명

2. **Investment Profile**
   - 투자 성향 선택
   - (온보딩에서 설정한 내용)

3. **Notifications** (Phase 2)
   - 알림 On/Off

---

### 5. 온보딩 (`/onboarding`) - 선택사항

**URL**: `/onboarding`  
**용도**: 최초 사용자 설정

#### 플로우
```
1단계: 환영 화면
   🦛 "안녕하세요, HAMA입니다!"
   [시작하기 →]

2단계: 투자 목표 설정
   □ 단기 수익 (1년 이내)
   □ 중장기 성장 (3-5년)
   □ 노후 준비 (10년+)

3단계: 위험 성향 파악
   □ 공격적 (높은 수익, 높은 리스크)
   □ 중립 (밸런스)
   □ 보수적 (안정성 우선)

4단계: 자동화 레벨 선택
   [파일럿] [코파일럿] [어드바이저]

5단계: 완료
   "설정이 완료되었습니다!"
   [HAMA와 대화 시작 →]
```

---

## 🗺️ 라우팅 구조

```typescript
// src/app/layout.tsx 또는 App.tsx

const routes = [
  {
    path: '/',
    element: <Dashboard />,
    name: '대시보드'
  },
  {
    path: '/chat',
    element: <ChatInterface />,
    name: '채팅' // ⭐ 메인
  },
  {
    path: '/portfolio',
    element: <Portfolio />,
    name: '포트폴리오'
  },
  {
    path: '/settings',
    element: <Settings />,
    name: '설정'
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
    name: '온보딩' // 최초 1회만
  }
];
```

---

## 🧭 내비게이션 (공통)

### Top Navigation (Header)
```
┌─────────────────────────────────────────┐
│ 🦛 HAMA   [대시보드][채팅][포트폴리오][설정] │
└─────────────────────────────────────────┘
```

### Mobile Navigation (하단)
```
┌─────────────────────────────────────────┐
│  [🏠]    [💬]    [📊]    [⚙️]          │
│  홈      채팅    포트    설정            │
└─────────────────────────────────────────┘
```

---

## 📐 레이아웃 컴포넌트

```typescript
// src/components/layout/MainLayout.tsx

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-subtle">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      <Footer /> {/* 선택 */}
    </div>
  );
}

// src/components/layout/Header.tsx
export function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-primary">
            🦛 HAMA
          </h1>
          <nav className="hidden md:flex gap-4">
            <NavLink to="/">대시보드</NavLink>
            <NavLink to="/chat">채팅</NavLink>
            <NavLink to="/portfolio">포트폴리오</NavLink>
          </nav>
        </div>
        <div>
          <NavLink to="/settings">⚙️</NavLink>
        </div>
      </div>
    </header>
  );
}
```

---

## 🎨 공통 디자인 패턴

### 카드 컴포넌트
```typescript
// 통일된 카드 스타일
<div className="bg-white rounded-lg shadow-sm border p-6">
  {children}
</div>
```

### 버튼
```typescript
// Primary Button
<button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg">
  승인
</button>

// Secondary Button
<button className="bg-secondary hover:bg-secondary-hover text-white px-4 py-2 rounded-lg">
  거부
</button>
```

### 수익률 표시
```typescript
{profitRate > 0 ? (
  <span className="text-success">↑ +{profitRate}%</span>
) : (
  <span className="text-danger">↓ {profitRate}%</span>
)}
```

---

## ✅ MVP 페이지 우선순위

**꼭 만들어야 할 것:**
1. ✅ `/chat` - 채팅 인터페이스 (가장 중요!)
2. ✅ `/` - 대시보드 (간단하게)
3. ✅ `/settings` - 자동화 레벨 선택

**여유 있으면:**
4. ⭐ `/portfolio` - 포트폴리오 상세
5. ⭐ `/onboarding` - 온보딩 플로우

**Phase 2:**
6. `/history` - 대화/거래 이력
7. `/analytics` - 심화 분석

---

이 가이드를 CLAUDE.md에 추가하거나 별도 파일(`PAGES.md`)로 저장하세요!