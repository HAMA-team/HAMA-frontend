# HAMA Frontend

**HAMA (Human-in-the-Loop AI Multiagent Investment System)** 프론트엔드

> AI가 분석하고, 당신이 결정한다

## 🚀 프로젝트 상태

✅ **초기 설정 완료!**

- Vite + React 18 + TypeScript
- Tailwind CSS
- React Router
- Zustand (상태 관리)
- API 클라이언트 구조
- TypeScript 타입 정의

## 📦 설치 및 실행

### 사전 요구사항

- **Node.js** 18.0 이상
- **npm** 9.0 이상

### 의존성 설치

```bash
npm install
```

> 전체 의존성 목록은 `package.json` 또는 `requirements.txt` 참조

### 개발 서버 실행

```bash
npm run dev
```

서버 실행 후 http://localhost:5173 접속

### 빌드

```bash
npm run build
```

### 빌드 미리보기

```bash
npm run preview
```

### 린팅

```bash
npm run lint
```

## 📂 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── chat/           # 채팅 인터페이스
│   ├── onboarding/     # 온보딩 플로우
│   ├── portfolio/      # 포트폴리오
│   └── ui/             # 공통 UI 컴포넌트
├── lib/                # 유틸리티 & API
│   ├── api/           # API 클라이언트
│   │   ├── client.ts  # API 기본 설정
│   │   ├── chat.ts    # 채팅 API
│   │   └── approval.ts # 승인 API
│   ├── constants.ts   # 상수
│   └── utils.ts       # 유틸리티 함수
├── hooks/             # Custom Hooks
├── store/             # Zustand 스토어
├── types/             # TypeScript 타입
│   ├── chat.ts
│   ├── approval.ts
│   ├── automation.ts
│   └── api.ts
└── App.tsx            # 메인 앱
```

## 🔧 환경 변수

`.env.local` 파일 생성 (또는 `.env.example` 복사):

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

## 📋 다음 단계

### Week 1: 기본 인프라 + Research 연동
- [ ] 기본 채팅 인터페이스 구현
- [ ] useChat Hook 구현
- [ ] MessageList, MessageInput 컴포넌트
- [ ] Research 에이전트 연동 (실제 데이터!)

### Week 2: HITL 구현 (최우선!) 🔥
- [ ] HITL 승인 플로우
- [ ] ApprovalDialog 컴포넌트
- [ ] useApproval Hook
- [ ] thread_id 관리
- [ ] 자동화 레벨 선택 UI

### Week 3: 포트폴리오 대시보드
- [ ] 포트폴리오 조회 UI
- [ ] 간단한 차트
- [ ] 전체 통합 테스트

## 🎯 핵심 기능

### 1. 대화형 채팅 인터페이스
사용자가 자연어로 투자 질문 및 지시

### 2. HITL (Human-in-the-Loop) 승인 플로우 ⭐
매매 주문 승인 → 사용자 확인 → 실행

### 3. 자동화 레벨
- Level 1 (Pilot): 거의 자동
- Level 2 (Copilot): 매매만 승인 (기본값)
- Level 3 (Advisor): 모든 결정 승인

## 📚 참고 문서

- `CLAUDE.md` - 전체 개발 가이드
- `docs/plan/PRD.md` - 제품 요구사항
- `docs/plan/프론트엔드 통합 가이드.md` - API 통합 방법

## 🛠️ 기술 스택

### Core
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구

### Styling
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **PostCSS** - CSS 후처리
- **Autoprefixer** - 벤더 프리픽스 자동 추가

### State & Routing
- **React Router v6** - 클라이언트 사이드 라우팅
- **Zustand** - 경량 상태 관리

### Forms & Validation
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### Utilities
- **date-fns** - 날짜 처리
- **Recharts** - 차트/그래프 (포트폴리오 시각화)

> 전체 의존성 목록은 `requirements.txt` 참조

## 🔗 백엔드 연동

백엔드 API: `http://localhost:8000/api/v1`

- Research 에이전트: ✅ 실제 데이터 (DART + FinanceDataReader)
- HITL: ✅ 완전 구현
- 나머지 에이전트: Mock 데이터 (추후 연동)

## 📄 라이선스

MIT
