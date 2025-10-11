# 🎨 HAMA Frontend

**Human-in-the-Loop AI Multiagent Investment System**

> "AI가 분석하고, 당신이 결정한다"

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**완성도: 80%** | **Phase: 1 (MVP)** | **Status: Active Development**

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [핵심 기능](#-핵심-기능)
- [기술 스택](#-기술-스택)
- [빠른 시작](#-빠른-시작)
- [프로젝트 구조](#-프로젝트-구조)
- [구현 상태](#-구현-상태)
- [백엔드 연동](#-백엔드-연동)
- [개발 가이드](#-개발-가이드)
- [문서](#-문서)
- [로드맵](#-로드맵)

---

## 🎯 프로젝트 개요

**HAMA Frontend**는 개인 투자자를 위한 **AI 투자 어시스턴트 웹 인터페이스**입니다.

### 핵심 가설
> **투자자는 귀찮은 정보 분석은 하기 싫어하지만, 종목 선택과 매매 실행은 직접 하고 싶어한다.**

### Vision
- 🤖 **AI가 분석**: 종목 리서치, 재무 분석, 시장 전망
- 👤 **당신이 결정**: 매매 실행, 포트폴리오 구성
- ⚖️ **유연한 자동화**: 3단계 자동화 레벨 (Pilot / Copilot / Advisor)

### 주요 특징
- ✅ **대화형 인터페이스**: 자연어로 투자 상담 및 매매 지시
- ✅ **HITL 승인 시스템**: 중요한 결정은 사용자 승인 필요
- ✅ **실시간 데이터**: DART + FinanceDataReader 연동
- ✅ **Mock 모드**: 백엔드 없이 전체 시나리오 테스트 가능

---

## ✨ 핵심 기능

### 1. **대화형 채팅 인터페이스** 💬

```
사용자: "삼성전자 분석해줘"
  ↓
AI: [실제 DART + FinanceDataReader 데이터 기반]
    📊 재무 분석 (영업이익, PER, ROE)
    📈 주가 정보 (현재가, 52주 최고/최저)
    📰 최근 공시 (실제 DART 데이터)
```

**구현 상태:** ✅ 완료
- ✅ MessageList, MessageInput 컴포넌트
- ✅ 실시간 로딩 상태
- ✅ 에러 처리
- ✅ Mock 모드 토글

### 2. **HITL (Human-in-the-Loop) 승인 플로우** 🔔

```
사용자: "삼성전자 10주 매수해줘"
  ↓
AI: "⚠️ 승인이 필요합니다"
  ↓
[승인 다이얼로그 표시]
┌──────────────────────────────┐
│ ⚠️ 매매 주문 승인이 필요합니다 │
│                              │
│ 종목: 삼성전자 (005930)      │
│ 주문: 매수 10주              │
│ 예상가: 73,400원             │
│ 총액: 734,000원              │
│                              │
│ [✅ 승인]  [❌ 거부]         │
└──────────────────────────────┘
  ↓
사용자: 승인 또는 거부 선택
  ↓
AI: "✅ 매매가 완료되었습니다"
```

**구현 상태:** ✅ 완벽 구현
- ✅ ApprovalDialog 컴포넌트
- ✅ thread_id 관리 (LangGraph interrupt)
- ✅ 승인/거부/수정 모든 decision 지원
- ✅ 사용자 메모 입력

### 3. **자동화 레벨 선택** ⚙️

**3단계 자동화 레벨:**
```
Level 1 (Pilot)   → 거의 자동 실행
Level 2 (Copilot) → 매매/리밸런싱만 승인 필요 ⭐ (기본값)
Level 3 (Advisor) → 모든 결정 승인 필요
```

**구현 상태:** ✅ 완료
- ✅ 레벨별 아이콘, 설명
- ✅ UI 선택 기능
- ✅ API 요청 시 자동 포함

### 4. **채팅 히스토리** 📚 ⭐ NEW (2025-10-11)

```
┌────────────────────┐
│  📚 대화 기록      │
├────────────────────┤
│  [🔍 검색...]     │
│  [➕ 새 대화]     │
├────────────────────┤
│  📅 오늘           │
│  • 삼성전자 투자..  │
│  • 네이버 분석..   │
├────────────────────┤
│  📅 어제           │
│  • 포트폴리오 ..   │
└────────────────────┘
```

**구현 상태:** ✅ UI 완성, ⚠️ API 연동 대기
- ✅ HistorySidebar 컴포넌트 (280px, 접기/펴기)
- ✅ 날짜별 그룹핑 (오늘, 어제, 이번 주, 이번 달, 이전)
- ✅ 검색 기능 (제목, 메시지 내용)
- ✅ 개별 대화 삭제
- ⚠️ 백엔드 `GET /chat/sessions` API 필요

### 5. **포트폴리오 & 대시보드** 📊

**포트폴리오 페이지:**
- 총 평가액, 투자 원금, 손익률
- 보유 종목 리스트
- 섹터별 / 자산별 배분

**대시보드 페이지:**
- 계좌 연결 상태
- 최근 활동 (거래, AI 제안, 경고)
- 성과 요약

**구현 상태:** ✅ UI 완성, ❌ 백엔드 API 없음
- ✅ 완전한 UI/UX (Mock 데이터)
- ❌ 백엔드 API 연동 대기

---

## 🛠️ 기술 스택

### **Frontend Core**
- **React** 18.3 - 선언형 UI 라이브러리
- **TypeScript** 5.5 - 타입 안정성
- **Vite** 5.4 - 빠른 빌드 도구

### **Styling**
- **Tailwind CSS** 3.4 - 유틸리티 우선 CSS 프레임워크
- **PostCSS** - CSS 후처리
- **Autoprefixer** - 벤더 프리픽스 자동 추가

### **State & Routing**
- **React Router** v6 - 클라이언트 사이드 라우팅
- **Zustand** - 경량 상태 관리

### **Forms & Validation**
- **React Hook Form** - 고성능 폼 관리
- **Zod** - TypeScript 우선 스키마 검증

### **Utilities**
- **date-fns** - 날짜 포맷팅 및 계산
- **Recharts** - React 차트 라이브러리

### **Development**
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅 (선택)

---

## 🚀 빠른 시작

### **1. 사전 요구사항**

- Node.js 18.0+
- npm 9.0+
- 백엔드 서버 실행 (선택, Mock 모드 가능)

### **2. 설치**

```bash
# 저장소 클론
git clone https://github.com/your-org/HAMA-frontend.git
cd HAMA-frontend

# 의존성 설치
npm install
```

### **3. 환경 변수 설정**

`.env.local` 파일 생성:

```bash
# 백엔드 API URL
VITE_API_URL=http://localhost:8000/api/v1

# WebSocket URL (Phase 2)
# VITE_WS_URL=ws://localhost:8000/ws
```

### **4. 개발 서버 실행**

```bash
# 개발 서버 (Hot Reload)
npm run dev
```

**서버 주소:**
- 프론트엔드: http://localhost:5173

**Mock 모드:**
- 백엔드 없이도 전체 UI 테스트 가능
- 채팅 페이지 우측 하단 "🎭 Mock" 버튼으로 토글

### **5. 빌드**

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### **6. 린팅**

```bash
# ESLint 실행
npm run lint
```

---

## 📂 프로젝트 구조

```
HAMA-frontend/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── MessageList.tsx         ✅ 메시지 리스트
│   │   │   ├── MessageInput.tsx        ✅ 메시지 입력
│   │   │   ├── HistorySidebar.tsx      ✅ 대화 히스토리 ⭐ NEW
│   │   │   └── HistoryItem.tsx         ✅ 대화 항목 ⭐ NEW
│   │   ├── onboarding/
│   │   │   ├── Welcome.tsx             ✅ 환영 화면
│   │   │   ├── RiskAssessment.tsx      ✅ 투자 성향 진단
│   │   │   └── GoalSetting.tsx         ✅ 목표 설정
│   │   ├── portfolio/
│   │   │   ├── PortfolioOverview.tsx   ✅ 포트폴리오 요약
│   │   │   ├── HoldingsList.tsx        ✅ 보유 종목
│   │   │   └── AllocationChart.tsx     ✅ 자산 배분 차트
│   │   ├── dashboard/
│   │   │   ├── AccountCard.tsx         ✅ 계좌 정보
│   │   │   ├── ActivityFeed.tsx        ✅ 최근 활동
│   │   │   └── PerformanceCard.tsx     ✅ 성과 요약
│   │   ├── layout/
│   │   │   ├── Layout.tsx              ✅ 전체 레이아웃
│   │   │   └── Header.tsx              ✅ 헤더
│   │   └── settings/
│   │       └── SettingsModal.tsx       ✅ 설정 모달
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               ✅ API 클라이언트
│   │   │   ├── chat.ts                 ✅ 채팅 API
│   │   │   ├── approval.ts             ✅ 승인 API
│   │   │   └── mock.ts                 ✅ Mock 데이터
│   │   ├── mockData/
│   │   │   ├── dashboard.ts            ✅ 대시보드 Mock
│   │   │   └── portfolio.ts            ✅ 포트폴리오 Mock
│   │   └── utils.ts                    ✅ 유틸리티
│   ├── hooks/
│   │   ├── useChat.ts                  ✅ 채팅 Hook
│   │   ├── useApproval.ts              ✅ 승인 Hook
│   │   ├── useMockChat.ts              ✅ Mock 채팅 Hook
│   │   ├── useDashboardData.ts         🔄 Mock 전용
│   │   └── usePortfolioData.ts         🔄 Mock 전용
│   ├── types/
│   │   ├── chat.ts                     ✅ 채팅 타입
│   │   ├── approval.ts                 ✅ 승인 타입
│   │   ├── automation.ts               ✅ 자동화 레벨
│   │   └── api.ts                      ✅ API 타입
│   ├── pages/
│   │   ├── Welcome.tsx                 ✅ 웰컴 페이지
│   │   ├── Signup.tsx                  ✅ 회원가입
│   │   ├── Onboarding.tsx              ✅ 온보딩
│   │   ├── Dashboard.tsx               ✅ 대시보드
│   │   ├── Chat.tsx                    ✅ 채팅
│   │   └── Portfolio.tsx               ✅ 포트폴리오
│   ├── styles/
│   │   └── globals.css                 ✅ 전역 스타일
│   ├── App.tsx                          ✅ 메인 앱
│   └── main.tsx                         ✅ 엔트리 포인트
├── docs/
│   └── plan/
│       ├── PRD.md                       📄 제품 요구사항
│       ├── 프론트엔드 통합 가이드.md    📄 API 통합 가이드
│       ├── BackendREADME.md             📄 백엔드 이해
│       ├── PAGES.md                     📄 페이지 구성
│       ├── DESIGN_SYSTEM.md             📄 디자인 시스템
│       ├── 페이지별_상세_기획안.md      📄 페이지 기획
│       ├── CHAT_HISTORY_INTEGRATION.md  📄 히스토리 연동 ⭐ NEW
│       └── BACKEND_API_REQUEST.md       📄 API 요청 사항 ⭐ NEW
├── public/
│   └── vite.svg
├── .env.local                           🔧 환경 변수
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── CLAUDE.md                            📚 개발 가이드
└── README.md                            📚 이 문서
```

---

## 📊 구현 상태

### ✅ **완벽하게 구현된 기능**

| 기능 | 상태 | 활용도 | 비고 |
|------|------|--------|------|
| **채팅 API** | ✅ 완성 | **95%** | 실제 API + Mock 모드 지원 |
| **HITL 승인 플로우** | ✅ 완성 | **90%** | thread_id 관리 완벽 |
| **자동화 레벨** | ✅ 완성 | **100%** | UI 선택, 상태 관리 완벽 |
| **Research 에이전트** | ✅ 완성 | **80%** | DART + FDR 연동 가능 |
| **채팅 히스토리 UI** | ✅ 완성 | **60%** | Mock 동작, API 연동 대기 |
| **온보딩 플로우** | ✅ 완성 | **100%** | 투자 성향, 목표 설정 |
| **포트폴리오 UI** | ✅ 완성 | **40%** | Mock UI, API 연동 대기 |
| **대시보드 UI** | ✅ 완성 | **40%** | Mock UI, API 연동 대기 |

### 🔄 **백엔드 API 연동 대기 중**

| API | 우선순위 | 필요성 | 문서 |
|-----|---------|--------|------|
| `GET /chat/sessions` | 🔥 최우선 | 채팅 히스토리 | BACKEND_API_REQUEST.md |
| `GET /portfolio/` | ⚠️ 높음 | 포트폴리오 | BACKEND_API_REQUEST.md |
| `GET /dashboard/` | 💡 중간 | 대시보드 | BACKEND_API_REQUEST.md |

### 📈 **전체 완성도**

| 컴포넌트 | 완성도 | 비고 |
|---------|--------|------|
| **UI/UX** | 🟢 95% | 거의 완성 |
| **채팅 기능** | 🟢 95% | HITL 포함 완벽 |
| **히스토리 UI** | 🟢 90% | API 연동만 남음 |
| **포트폴리오 UI** | 🟢 95% | API 연동만 남음 |
| **대시보드 UI** | 🟢 95% | API 연동만 남음 |
| **API 연동** | 🟡 60% | 채팅만 완료 |
| **테스트** | 🟡 50% | 수동 테스트 중심 |

**전체: 80%** 🎯

---

## 🔌 백엔드 연동

### API 엔드포인트

**백엔드 URL:** `http://localhost:8000/api/v1`

### 구현된 API

#### ✅ **POST `/chat/`** - 대화 처리

**요청:**
```json
{
  "message": "삼성전자 10주 매수해줘",
  "conversation_id": "optional-thread-id",
  "automation_level": 2
}
```

**응답 (HITL 발생 시):**
```json
{
  "message": "🔔 사용자 승인이 필요합니다.",
  "conversation_id": "abc123-def456",
  "requires_approval": true,
  "approval_request": {
    "type": "trade_approval",
    "thread_id": "abc123-def456",
    "interrupt_data": {
      "order_id": "ORDER_a1b2c3d4",
      "stock_code": "005930",
      "quantity": 10,
      "order_type": "buy"
    }
  }
}
```

#### ✅ **POST `/chat/approve`** - 승인/거부

**요청:**
```json
{
  "thread_id": "abc123-def456",
  "decision": "approved",
  "automation_level": 2,
  "user_notes": "좋은 타이밍"
}
```

**응답:**
```json
{
  "status": "approved",
  "message": "승인 완료 - 매매가 실행되었습니다.",
  "result": {
    "order_id": "ORDER_a1b2c3d4",
    "status": "executed"
  }
}
```

#### ✅ **GET `/chat/history/{id}`** - 대화 히스토리 조회

#### ✅ **DELETE `/chat/history/{id}`** - 대화 삭제

### 백엔드 API 요청 사항

프론트엔드에서 구현 완료했으나 백엔드 API가 없는 기능:

1. **채팅 세션 목록** (`GET /chat/sessions`) - 🔥 최우선
2. **포트폴리오 조회** (`GET /portfolio/`) - ⚠️ 높음
3. **대시보드 조회** (`GET /dashboard/`) - 💡 중간

**상세 스펙:** `docs/plan/BACKEND_API_REQUEST.md` 참조

### Mock 모드

백엔드 없이 전체 UI 테스트 가능:

- 채팅 페이지 우측 하단 "🎭 Mock" 버튼 클릭
- 4가지 시나리오 테스트:
  1. "삼성전자 분석해줘" - 일반 분석
  2. "삼성전자 10주 매수해줘" - 매수 승인
  3. "네이버 5주 매도해줘" - 매도 승인
  4. "리밸런싱 해줘" - 포트폴리오 조정

---

## 💻 개발 가이드

### 개발 시작 전

1. **CLAUDE.md 읽기** - 전체 개발 가이드
2. **DESIGN_SYSTEM.md 읽기** - 디자인 시스템 이해
3. **프론트엔드 통합 가이드.md 읽기** - API 통합 방법

### 주요 컨벤션

#### TypeScript 타입

```typescript
// ✅ 좋은 예: 명시적 타입
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ❌ 나쁜 예: any 사용
const message: any = {...};
```

#### API 호출

```typescript
// ✅ 좋은 예: 에러 처리 + 타입 안전성
try {
  const data = await apiRequest<ChatResponse>('/chat/', {...});
} catch (error) {
  if (error instanceof APIError) {
    toast.error(error.message);
  }
}

// ❌ 나쁜 예: 에러 처리 없음
const data = await fetch('/api/chat').then(r => r.json());
```

#### 컴포넌트 구조

```typescript
// ✅ 좋은 예: Props 인터페이스 정의
interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  // ...
}
```

### 디자인 시스템

**색상 변수** (Tailwind):
```css
/* Primary (Indigo) */
--color-primary-50: #eef2ff;
--color-primary-500: #6366f1;
--color-primary-700: #4338ca;

/* Secondary (Purple) */
--color-secondary-500: #a855f7;

/* Success (Green) */
--color-success-500: #10b981;

/* Danger (Red) */
--color-danger-500: #ef4444;
```

**Spacing**:
- 기본: `4px` 단위 (`space-1` = 0.25rem = 4px)
- 페이지 패딩: `p-6` (24px)
- 카드 간격: `gap-4` (16px)

**Typography**:
- 제목: `text-2xl font-bold`
- 본문: `text-base`
- 설명: `text-sm text-gray-600`

### Git 커밋 컨벤션

```bash
# 형식
<type>: <subject>

# 타입
Feat:     새로운 기능
Fix:      버그 수정
Refactor: 리팩토링
Docs:     문서 수정
Chore:    기타 변경

# 예시
Feat: 채팅 히스토리 UI 구현
Fix: 승인 다이얼로그 버튼 클릭 오류 수정
Refactor: useChat Hook 로직 개선
Docs: README 업데이트
```

---

## 📚 문서

### 필수 읽기

| 문서 | 설명 | 중요도 |
|------|------|--------|
| **CLAUDE.md** | 전체 개발 가이드 | 🔥🔥🔥 |
| **docs/plan/PRD.md** | 제품 요구사항 정의 | 🔥🔥 |
| **docs/plan/DESIGN_SYSTEM.md** | 디자인 시스템 | 🔥🔥 |
| **docs/plan/프론트엔드 통합 가이드.md** | API 통합 방법 | 🔥🔥 |
| **docs/plan/페이지별_상세_기획안.md** | 페이지 상세 기획 | 🔥 |

### API 연동 문서

| 문서 | 설명 |
|------|------|
| **CHAT_HISTORY_INTEGRATION.md** | 채팅 히스토리 연동 가이드 |
| **BACKEND_API_REQUEST.md** | 백엔드 API 요청 사항 (백엔드 팀 전달용) |

### 외부 문서

- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Vite 공식 문서](https://vitejs.dev/)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)

---

## 🗺️ 로드맵

### **Phase 1 (현재) - MVP 완성** 🔵 80% 완료

#### ✅ 완료된 항목
- [x] 프로젝트 셋업 (Vite + React + TypeScript + Tailwind)
- [x] API 클라이언트 구현
- [x] 채팅 인터페이스 (MessageList, MessageInput)
- [x] HITL 승인 플로우 (ApprovalDialog, thread_id 관리)
- [x] 자동화 레벨 선택 UI
- [x] Mock 모드 시스템
- [x] 채팅 히스토리 UI (HistorySidebar, HistoryItem)
- [x] 온보딩 플로우 (투자 성향, 목표 설정)
- [x] 포트폴리오 UI (Mock 데이터)
- [x] 대시보드 UI (Mock 데이터)
- [x] 에러 처리 및 로딩 상태 (기본)

#### 🔄 진행 중
- [ ] **채팅 히스토리 백엔드 연동** (백엔드 API 대기)
- [ ] **포트폴리오 백엔드 연동** (백엔드 API 대기)
- [ ] **대시보드 백엔드 연동** (백엔드 API 대기)

#### 💡 개선 필요
- [ ] Research 응답 구조화 (현재 텍스트만)
- [ ] 승인 결과 메시지 개선
- [ ] 에러 처리 고도화 (타입별 처리)

### **Phase 2 - 고도화** 🔵 예정

- [ ] WebSocket 실시간 알림
- [ ] 대화 이력 저장 (localStorage)
- [ ] 포트폴리오 차트 개선 (recharts)
- [ ] 다크 모드
- [ ] 반응형 디자인 (모바일)
- [ ] 성능 최적화 (React.memo, useMemo)
- [ ] 단위 테스트 (Vitest)
- [ ] E2E 테스트 (Playwright)

### **Phase 3 - 확장** ⚪ 계획 중

- [ ] 사용자 인증 시스템 (JWT)
- [ ] 다국어 지원 (i18n)
- [ ] PWA (Progressive Web App)
- [ ] 알림 시스템
- [ ] 사용자 설정 고도화

---

## 🧪 테스트

### 현재 테스트 방법

#### 1. Mock 모드로 테스트

```bash
npm run dev

# 브라우저에서
http://localhost:5173/chat

# 우측 하단 "🎭 Mock" 버튼 클릭
# 다음 메시지 테스트:
1. "삼성전자 분석해줘"
2. "삼성전자 10주 매수해줘"
3. "네이버 5주 매도해줘"
4. "리밸런싱 해줘"
```

#### 2. 백엔드 연동 테스트

```bash
# 백엔드 실행 (별도 터미널)
cd ../HAMA-backend
python -m uvicorn src.main:app --reload

# 프론트엔드 실행
npm run dev

# 채팅 페이지에서 "🔌 API" 모드로 테스트
```

### 테스트 시나리오

#### 시나리오 1: 종목 분석
1. 채팅 페이지 접속
2. "삼성전자 분석해줘" 입력
3. Research 에이전트 응답 확인 (실제 데이터)

#### 시나리오 2: 매매 승인 (HITL)
1. "삼성전자 10주 매수해줘" 입력
2. 승인 다이얼로그 표시 확인
3. 주문 상세 정보 확인
4. "승인" 또는 "거부" 클릭
5. 결과 메시지 확인

#### 시나리오 3: 채팅 히스토리
1. 좌측 상단 토글 버튼 클릭
2. 대화 목록 표시 확인
3. 검색 기능 테스트
4. 대화 삭제 테스트

### Phase 2 테스트

```bash
# 단위 테스트 (예정)
npm run test

# E2E 테스트 (예정)
npm run test:e2e
```

---

## 🤝 기여

이 프로젝트는 캡스톤 프로젝트로 진행 중입니다.

### 개발 팀

- **프론트엔드**: UI/UX 개발, API 연동
- **백엔드**: LangGraph 멀티 에이전트, FastAPI

### 협업 방법

1. **브랜치 전략**:
   - `main`: 프로덕션
   - `feature/UI-improvement`: 프론트엔드 개발 (현재)

2. **코드 리뷰**:
   - PR 생성 후 팀원 리뷰
   - 최소 1명 승인 필요

3. **백엔드 협업**:
   - API 요청: `docs/plan/BACKEND_API_REQUEST.md` 참조
   - Swagger: http://localhost:8000/docs

---

## 📞 연락처

### 이슈 & 질문

- **GitHub Issues**: [프로젝트 Issues](https://github.com/your-org/HAMA-frontend/issues)
- **문서**: `docs/` 디렉토리 참조
- **개발 가이드**: `CLAUDE.md`

### 백엔드 팀 협업

- **API 문서**: http://localhost:8000/docs
- **API 요청**: `docs/plan/BACKEND_API_REQUEST.md`
- **히스토리 연동**: `docs/plan/CHAT_HISTORY_INTEGRATION.md`

---

## 📝 라이선스

MIT License

---

## 🎯 최종 체크리스트

### 프론트엔드 개발 시작 전 확인사항

- [ ] Node.js 18+ 설치 확인
- [ ] `npm install` 완료
- [ ] `.env.local` 파일 생성
- [ ] `CLAUDE.md` 읽기
- [ ] `DESIGN_SYSTEM.md` 읽기
- [ ] Mock 모드로 전체 UI 테스트

### 백엔드 연동 시 확인사항

- [ ] 백엔드 서버 실행 중 (`http://localhost:8000`)
- [ ] API 문서 확인 (`http://localhost:8000/docs`)
- [ ] `.env.local`에 API URL 설정
- [ ] 채팅 페이지에서 API 모드 테스트

### 배포 전 확인사항

- [ ] `npm run build` 성공
- [ ] `npm run preview` 테스트
- [ ] 모든 페이지 동작 확인
- [ ] 에러 처리 확인
- [ ] 반응형 디자인 확인 (선택)

---

**Built with ❤️ using React & TypeScript**

**최종 업데이트**: 2025-10-11
**프론트엔드 완성도**: 80% ⭐⭐⭐⭐☆
**다음 목표**: 백엔드 API 연동 완료 → MVP 100% 🎯

**Let's build something amazing! 🚀**
