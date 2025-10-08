# CLAUDE.md - HAMA 프론트엔드 개발 가이드

이 문서는 **HAMA (Human-in-the-Loop AI Multiagent Investment System)** 프론트엔드 개발을 위한 Claude Code 활용 가이드입니다.

---

## 🚨 먼저 읽어주세요! (2025-10-07 업데이트)

### 백엔드 현재 구현 상태

**중요**: 백엔드 메이트로부터 공유받은 최신 구현 현황입니다. 프론트 개발 전략을 세우는 데 참고하세요!

- Research 에이전트: ✅ 실제 데이터 (DART + FDR)
- 나머지 에이전트: ⚠️ Mock 데이터
- HITL: ✅ 완전 구현
- 사용자 인증: ❌ 미구현 (불필요)

#### API 엔드포인트 현황

| 엔드포인트 | 상태 | 데이터 | 비고 |
|-----------|------|--------|------|
| `POST /chat/` | ✅ 구현 완료 | 실제/Mock 혼합 | Research는 실제 데이터 |
| `POST /chat/approve` | ✅ 구현 완료 | Mock | HITL 승인 플로우 |
| `GET /chat/history/{id}` | 🔄 추후 구현 | - | 대화 히스토리 |
| 포트폴리오 조회 | 🔄 추후 구현 | Mock | 프론트 개발에 맞춰 구현 |
| 대시보드 API | 🔄 추후 구현 | - | 프론트 개발에 맞춰 구현 |

⚠️ **중요**: 사용자 인증 시스템은 구현되지 않음 (시연 시 불필요)

#### 에이전트별 구현 상태

| 에이전트 | 구현 | 데이터 | 테스트 | 비고 |
|---------|------|--------|--------|------|
| **Master (Supervisor)** | ✅ 완료 | - | ✅ | LLM 기반 의도 파악 + 동적 라우팅 |
| **Research** | ✅ 완료 | ✅ 실제 | ✅ | **DART API + FinanceDataReader** |
| **Strategy** | 🔄 진행중 | 🔄 일부 | ⏸️ | BOK API 연동 예정 |
| **Risk** | 🔄 진행중 | ⚠️ Mock | ⏸️ | 한투 API 연동 대기 |
| **Trading** | 🔄 진행중 | ⚠️ Mock | ⏸️ | 한투 API 연동 대기 |
| **Portfolio** | 🔄 진행중 | ⚠️ Mock | ⏸️ | 한투 API 연동 대기 |
| **General** | 🔄 진행중 | - | ⏸️ | LLM + 프롬프트 기반 |
| **Monitoring** | ❌ 미구현 | - | - | Phase 2 |

**실제 데이터 소스:**
- ✅ **DART API** - 재무제표, 공시 (Research에서 사용 중)
- ✅ **FinanceDataReader** - 주가 데이터 (Research에서 사용 중)
- 🔄 **BOK API** - 거시경제 지표 (연동됨, 미사용)
- ⏸️ **한국투자증권 API** - 실시간 시세, 계좌 정보 (연동 대기)

#### 기타 구현 사항
- ✅ **Redis 캐싱** - 데이터 캐싱 구현됨
- ✅ **PostgreSQL** - 로컬 DB 구현
- 🔄 **모델 최적화** - 현재 Sonnet 4.5만 사용, 라우팅 최적화 예정

### 프론트엔드 개발 전략

#### 핵심 메시지 ⭐

1. **HITL이 가장 중요합니다!**
   - LangGraph interrupt 기반으로 백엔드 구현 완료
   - 프론트엔드는 승인 UI만 잘 만들면 됨
   - **시연의 핵심 기능**

2. **Mock 데이터 전제로 개발하세요**
   - Risk, Trading, Portfolio는 Mock 응답
   - UI/UX에 먼저 집중
   - 실제 데이터 연동은 백엔드가 준비되면 자동으로 됨

3. **Research 에이전트는 실제 데이터 사용**
   - 종목 분석 기능은 **즉시 테스트 가능**
   - DART API + FinanceDataReader 연동됨
   - "삼성전자 분석해줘" → 실제 재무제표 + 주가 데이터 응답

4. **사용자 인증은 구현하지 않습니다**
   - 로그인/회원가입 UI 불필요
   - 한 명의 테스트 사용자로 시연
   - 시간 절약

5. **백엔드 메이트와 긴밀히 소통**
   - 필요한 API는 프론트 개발에 맞춰 추가될 예정
   - 대시보드, 히스토리 등은 요청하면 구현
   - "이런 API 필요해요" → 백엔드 메이트가 추가

### 개발 우선순위 (업데이트)

#### Week 1: 기본 인프라 + Research 연동
- [✅] 프로젝트 셋업 (Vite + React + TypeScript + Tailwind)
- [✅] API 클라이언트 구현
- [✅] 기본 채팅 인터페이스
- [✅] **Research 에이전트 연동** ⭐ (실제 데이터 사용 가능!)
  - "삼성전자 주가는?" → 실제 응답
  - "삼성전자 재무제표 보여줘" → DART API 응답

#### Week 2: HITL 구현 (최우선!) 🔥
- [✅] **HITL 승인 플로우 완벽 구현**
  - ApprovalDialog 컴포넌트
  - useApproval Hook
  - thread_id 관리 (중요!)
- [✅] 매매 승인 UI
  - 주문 상세 정보
  - 리스크 경고 표시
- [ ] 자동화 레벨 선택 UI
- [✅] 에러 처리 및 로딩 상태

#### Week 3: 포트폴리오 대시보드 (Mock 전제)
- [ ] 포트폴리오 조회 UI (Mock 데이터)
- [ ] 간단한 차트 (recharts)
- [ ] 전체 통합 테스트
- [ ] UI/UX 개선

### 시연 시나리오 (MVP 목표)

**이 3가지만 완벽하게 시연하면 성공!**

#### 시나리오 1: 종목 분석 (Research - 실제 데이터) ✅
```
사용자: "삼성전자 분석해줘"
      ↓
AI: [실제 DART + FinanceDataReader 데이터 기반]
    📊 재무 분석
    - 영업이익: 15% 증가
    - PER: 12.5
    
    📈 주가 정보
    - 현재가: 89,000원
    - 52주 최고가: 95,000원
    
    📰 최근 공시
    - [DART API에서 가져온 실제 공시]
```

#### 시나리오 2: 매매 승인 (HITL - 핵심!) 🔥
```
사용자: "삼성전자 10주 매수해줘"
      ↓
AI: "⚠️ 승인이 필요합니다"
      ↓
[ApprovalDialog 표시]
┌──────────────────────────────┐
│ ⚠️ 매매 주문 승인이 필요합니다 │
│                              │
│ 종목: 삼성전자 (005930)      │
│ 주문: 매수 10주              │
│ 예상가: 89,000원             │
│ 총액: 890,000원              │
│                              │
│ [✅ 승인]  [❌ 거부]         │
└──────────────────────────────┘
      ↓
사용자: [✅ 승인] 클릭
      ↓
AI: "✅ 매매가 완료되었습니다"
    (Mock 실행 - 추후 실제 API 연동)
```

#### 시나리오 3: 투자 전략 (Strategy - 기본 동작) ✅
```
사용자: "지금 시장 어때?"
      ↓
AI: [전략 에이전트 분석]
    📊 시장 사이클: 회복 초기 단계
    📈 추천 섹터: IT, 반도체
    💡 투자 전략: 성장주 비중 확대
```

### 백엔드 메이트와 협업하기

#### 필요한 API 요청 프로세스

1. **필요한 API 파악**
   - 예: "포트폴리오 전체 조회 API가 필요해요"
   
2. **백엔드 메이트에게 요청**
   - 어떤 데이터가 필요한지 명확히 전달
   - 예상 응답 형식 공유
   
3. **임시로 Mock 데이터 사용**
   ```typescript
   // 백엔드 API 구현 전까지 Mock 사용
   const mockPortfolio = {
     total_value: 10000000,
     holdings: [...]
   };
   ```

4. **API 구현 후 연동**
   - Mock → 실제 API 호출로 교체

#### 소통이 필요한 순간

| 상황 | 해야 할 일 |
|------|----------|
| API 응답 형식이 문서와 다를 때 | 백엔드 메이트에게 확인 요청 |
| 새로운 엔드포인트 필요 시 | 필요한 데이터 명세 전달 |
| 에러가 계속 발생할 때 | 백엔드 로그 확인 요청 |
| HITL 플로우 이해 안 될 때 | LangGraph interrupt 설명 요청 |

#### 함께 테스트해야 할 부분 ⭐

- **HITL 승인 플로우** - 가장 중요!
  - 프론트: ApprovalDialog 구현
  - 백엔드: interrupt 발생 확인
  - 함께: 전체 플로우 테스트
  
- **Research 에이전트**
  - 실제 데이터 연동 확인
  - 응답 속도 체크
  
- **에러 처리**
  - API 에러 응답 형식 확인
  - 프론트 에러 메시지 표시

### LangGraph HITL 이해하기 (중요!)

#### LangGraph의 Interrupt란?

백엔드가 LangGraph의 `interrupt()` 함수를 사용하여 HITL을 구현했습니다.

**동작 원리:**
```python
# 백엔드 (LangGraph)
def approval_node(state):
    # Interrupt 발생 - 실행 일시 중지
    user_decision = interrupt({
        "type": "trade_approval",
        "order_id": "ORDER_123",
        "message": "승인이 필요합니다"
    })
    
    # 사용자 승인 후 재개
    return {"approved": True}
```

**프론트엔드 관점:**

1. **첫 번째 API 호출** (`POST /chat/`)
   ```json
   {
     "requires_approval": true,
     "approval_request": {
       "thread_id": "abc-123",  // ⭐ 중요: 재개할 때 필요
       "interrupt_data": { ... }
     }
   }
   ```

2. **승인 다이얼로그 표시**
   - `interrupt_data`의 정보로 UI 구성

3. **사용자 승인 후** (`POST /chat/approve`)
   ```json
   {
     "thread_id": "abc-123",  // ⭐ 동일한 thread_id
     "decision": "approved"
   }
   ```

4. **LangGraph 재개**
   - 백엔드가 중단된 지점부터 계속 실행
   - 매매 실행 완료

#### 프론트엔드 구현 포인트

```typescript
// ⭐ 핵심: thread_id를 반드시 저장하고 재사용
const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

// 1. 채팅 응답 처리
const response = await sendMessage(...);
if (response.requires_approval) {
  setCurrentThreadId(response.approval_request.thread_id);
  // ApprovalDialog 표시
}

// 2. 승인 처리
const handleApproval = async (decision) => {
  await submitApproval({
    thread_id: currentThreadId,  // ⭐ 동일한 thread_id
    decision: decision
  });
  setCurrentThreadId(null);
};
```

#### 주의사항

❌ **잘못된 구현:**
```typescript
// 새로운 메시지로 승인 - HITL 재개 안 됨!
await sendMessage("네, 승인합니다");
```

✅ **올바른 구현:**
```typescript
// approve API + thread_id 사용
await submitApproval({
  thread_id: approvalRequest.thread_id,
  decision: "approved"
});
```

### 추가 FAQ

#### Q: Mock 데이터로 개발하면 나중에 다시 수정해야 하나요?
**A**: 아니요! API 클라이언트만 잘 만들면 자동으로 연동됩니다.

```typescript
// src/lib/api/chat.ts
export async function sendMessage(request: ChatRequest) {
  // API 엔드포인트만 호출
  // 백엔드가 Mock을 반환하든 실제 데이터를 반환하든
  // 프론트 코드는 동일하게 동작
  return apiRequest<ChatResponse>('/chat/', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}
```

#### Q: Research 에이전트가 실제 데이터를 쓴다는데 어떻게 테스트하나요?
**A**: 백엔드 실행 후 바로 테스트 가능합니다!

```bash
# 터미널에서
curl -X POST http://localhost:8000/api/v1/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "삼성전자 분석해줘",
    "automation_level": 2
  }'

# 실제 DART + FinanceDataReader 데이터 응답 확인
```

#### Q: 백엔드 메이트에게 뭘 물어봐야 하나요?
**A**: 이런 것들을 물어보세요.

1. **API 응답 형식**
   - "포트폴리오 API 응답 형식이 어떻게 되나요?"
   
2. **HITL 동작**
   - "approval_request.thread_id를 어떻게 사용하나요?"
   - "interrupt가 정확히 언제 발생하나요?"
   
3. **에러 응답**
   - "API 에러 응답 형식이 어떻게 되나요?"
   
4. **새 기능 요청**
   - "대화 히스토리 조회 API가 필요한데 언제 구현 가능할까요?"
   - "대시보드용 요약 데이터 API가 필요해요"

---







## 📋 프로젝트 개요

### 프로젝트 정보

- **이름**: HAMA Frontend
- **목적**: 개인 투자자를 위한 AI 투자 어시스턴트 웹 인터페이스
- **핵심 컨셉**: "AI가 분석하고, 당신이 결정한다"
- **당신의 역할**: 프론트엔드 개발 (백엔드는 캡스톤 메이트가 담당)
- **플랫폼**: 웹 (React 기반)

### 핵심 가설

> 투자자는 귀찮은 정보 분석은 하기 싫어하지만, 종목 선택과 매매 실행은 직접 하고 싶어한다.

### 백엔드 정보

- **API URL**: `http://localhost:8000/api/v1`
- **기술**: FastAPI + LangGraph (멀티 에이전트 AI)
- **완성도**: 80% (API는 거의 완성)
- **문서**: `docs\plan\프론트엔드 통합 가이드.md` 참조

---

## 🎯 핵심 기능 (프론트엔드가 구현해야 할 것)

### 1. 대화형 채팅 인터페이스 (Chat Interface)

- 사용자가 자연어로 투자 질문 및 지시
- AI 에이전트의 응답 표시
- 실시간 스트리밍 응답 (Phase 2)

### 2. HITL (Human-in-the-Loop) 승인 플로우 ⭐ 중요!

- **매매 주문 승인**: "삼성전자 10주 매수해줘" → 승인 요청 → 사용자 승인 → 실행
- **리밸런싱 승인**: 포트폴리오 조정 시 사용자 확인
- **승인 UI**: 주문 내역, 리스크 경고, 대안 제시

### 3. 자동화 레벨 설정 (Automation Level)

```
Level 1 (Pilot)   → 거의 자동 실행
Level 2 (Copilot) → 매매/리밸런싱만 승인 필요 ⭐ 기본값
Level 3 (Advisor) → 모든 결정 승인 필요
```

### 4. 온보딩 프로세스

- 투자 목표 설정
- 위험 성향 파악
- 투자 기간 설정
- 자동화 레벨 선택
- 초기 포트폴리오 구성

---

## 🛠️ 기술 스택 (권장)

### 필수

- **React** 18+ (TypeScript 필수)
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링

### 상태 관리

- **Zustand** (권장) - 간단한 전역 상태 관리
- 또는 **Jotai** / **Redux Toolkit**

### HTTP 클라이언트

- **Fetch API** (네이티브)
- 또는 **Axios**

### UI 컴포넌트 (선택)

- **shadcn/ui** (권장) - Tailwind 기반 컴포넌트
- 또는 **Chakra UI** / **Material-UI**

### 추가 라이브러리

- **React Router** - 라우팅
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증
- **date-fns** - 날짜 처리
- **recharts** - 차트/그래프 (포트폴리오 시각화)

---

## 📂 프로젝트 구조 (권장)

```
hama-frontend/
├── src/
│   ├── app/                    # Next.js App Router (또는 pages/)
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 홈 (대시보드)
│   │   ├── chat/               # 채팅 페이지
│   │   ├── portfolio/          # 포트폴리오
│   │   └── settings/           # 설정
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx       ⭐ 메인 채팅
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── ApprovalDialog.tsx      ⭐ HITL 승인 UI
│   │   ├── onboarding/
│   │   │   ├── OnboardingFlow.tsx
│   │   │   ├── RiskAssessment.tsx
│   │   │   └── AutomationLevelSelector.tsx
│   │   ├── portfolio/
│   │   │   ├── PortfolioOverview.tsx
│   │   │   ├── HoldingsList.tsx
│   │   │   └── PerformanceChart.tsx
│   │   └── ui/                 # shadcn/ui 컴포넌트
│   ├── lib/
│   │   ├── api/
│   │   │   ├── chat.ts         ⭐ 채팅 API 호출
│   │   │   ├── approval.ts     ⭐ 승인 API
│   │   │   └── types.ts        # TypeScript 타입
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useChat.ts          ⭐ 채팅 로직 훅
│   │   ├── useApproval.ts      ⭐ 승인 로직 훅
│   │   └── useAutomationLevel.ts
│   ├── store/
│   │   ├── chatStore.ts        # Zustand 스토어
│   │   ├── userStore.ts
│   │   └── portfolioStore.ts
│   └── types/
│       ├── chat.ts
│       ├── approval.ts
│       └── api.ts
├── public/
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔑 핵심 타입 정의 (TypeScript)

### 채팅 관련

```typescript
// src/types/chat.ts

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  automation_level: 1 | 2 | 3;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  requires_approval: boolean;
  approval_request?: ApprovalRequest;
  metadata?: {
    intent?: string;
    agents_called?: string[];
    automation_level: number;
  };
}

export interface ApprovalRequest {
  type: 'trade_approval' | 'rebalancing' | 'portfolio_adjustment';
  thread_id: string;
  interrupt_data: TradeApprovalData | RebalancingData;
  message: string;
}

export interface TradeApprovalData {
  type: 'trade_approval';
  order_id: string;
  stock_code: string;
  stock_name?: string;
  quantity: number;
  order_type: 'buy' | 'sell';
  estimated_price?: number;
  estimated_total?: number;
  message: string;
}
```

### 승인 관련

```typescript
// src/types/approval.ts

export type ApprovalDecision = 'approved' | 'rejected' | 'modified';

export interface ApprovalRequestPayload {
  thread_id: string;
  decision: ApprovalDecision;
  automation_level: 1 | 2 | 3;
  modifications?: Record<string, any>;
  user_notes?: string;
}

export interface ApprovalResponse {
  status: ApprovalDecision;
  message: string;
  conversation_id: string;
  result?: {
    order_id: string;
    status: 'executed' | 'cancelled';
    [key: string]: any;
  };
}
```

### 자동화 레벨

```typescript
// src/types/automation.ts

export enum AutomationLevel {
  PILOT = 1,      // 거의 자동
  COPILOT = 2,    // 매매/리밸런싱 승인 (기본값)
  ADVISOR = 3     // 모든 결정 승인
}

export interface AutomationLevelConfig {
  level: AutomationLevel;
  label: string;
  description: string;
  icon: string;
  interventionFrequency: string;
}

export const AUTOMATION_LEVELS: AutomationLevelConfig[] = [
  {
    level: AutomationLevel.PILOT,
    label: '파일럿 모드',
    description: 'AI가 거의 모든 것을 처리',
    icon: '✈️',
    interventionFrequency: '월 1회 확인'
  },
  {
    level: AutomationLevel.COPILOT,
    label: '코파일럿 모드',
    description: 'AI가 제안, 큰 결정만 승인',
    icon: '🤝',
    interventionFrequency: '주 1-2회 알림'
  },
  {
    level: AutomationLevel.ADVISOR,
    label: '어드바이저 모드',
    description: 'AI는 정보만 제공, 사용자 결정',
    icon: '📊',
    interventionFrequency: '일일 검토 가능'
  }
];
```

---

## 🎨 UI/UX 가이드라인

### 채팅 인터페이스 디자인

#### 메시지 레이아웃

```
┌─────────────────────────────────────┐
│  [사용자 프로필]                     │
│  ┌─────────────────────────────┐   │
│  │ 사용자 메시지               │   │
│  └─────────────────────────────┘   │
│                                     │
│  [AI 아바타]                        │
│  ┌─────────────────────────────┐   │
│  │ AI 응답                      │   │
│  │                              │   │
│  │ 📊 데이터 카드 (선택)        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### HITL 승인 다이얼로그

```
┌──────────────────────────────────────┐
│  ⚠️ 매매 주문 승인이 필요합니다       │
├──────────────────────────────────────┤
│                                      │
│  종목: 삼성전자 (005930)             │
│  주문: 매수 10주                     │
│  예상가: 89,000원                    │
│  총액: 890,000원                     │
│                                      │
│  ┌────────────────────────────┐     │
│  │ 🔍 리스크 경고               │     │
│  │ 현재 삼성전자 보유: 25%      │     │
│  │ 매수 후 예상 비중: 43% ⚠️   │     │
│  └────────────────────────────┘     │
│                                      │
│  [✅ 승인]  [❌ 거부]  [✏️ 수정]    │
└──────────────────────────────────────┘
```

### 색상 가이드 (Tailwind)

```typescript
// 중요도별 색상
const colors = {
  // 일반 메시지
  user: 'bg-blue-500 text-white',
  assistant: 'bg-gray-100 text-gray-900',
  
  // 승인 상태
  approval_needed: 'bg-yellow-50 border-yellow-300',
  approved: 'bg-green-50 border-green-300',
  rejected: 'bg-red-50 border-red-300',
  
  // 리스크 레벨
  risk_low: 'text-green-600',
  risk_medium: 'text-yellow-600',
  risk_high: 'text-red-600',
};
```

---

## 🔌 API 통합 (핵심 코드)

### API 클라이언트 설정

```typescript
// src/lib/api/client.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(
        error.detail || `HTTP ${response.status}`,
        response.status,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('네트워크 오류가 발생했습니다.');
  }
}
```

### 채팅 API

```typescript
// src/lib/api/chat.ts

import { apiRequest } from './client';
import type { ChatRequest, ChatResponse } from '@/types/chat';

export async function sendMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/chat/', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getChatHistory(
  conversationId: string
): Promise<ChatResponse[]> {
  return apiRequest<ChatResponse[]>(`/chat/history/${conversationId}`);
}

export async function deleteChatHistory(
  conversationId: string
): Promise<void> {
  return apiRequest(`/chat/history/${conversationId}`, {
    method: 'DELETE',
  });
}
```

### 승인 API

```typescript
// src/lib/api/approval.ts

import { apiRequest } from './client';
import type { ApprovalRequestPayload, ApprovalResponse } from '@/types/approval';

export async function submitApproval(
  request: ApprovalRequestPayload
): Promise<ApprovalResponse> {
  return apiRequest<ApprovalResponse>('/chat/approve', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
```

---

## 🪝 핵심 React Hooks

### useChat Hook (⭐ 가장 중요)

```typescript
// src/hooks/useChat.ts

import { useState, useCallback } from 'react';
import { sendMessage } from '@/lib/api/chat';
import type { ChatMessage, ChatResponse, ApprovalRequest } from '@/types/chat';
import { AutomationLevel } from '@/types/automation';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest | null>(null);

  const send = useCallback(async (
    message: string,
    automationLevel: AutomationLevel = AutomationLevel.COPILOT
  ) => {
    // 사용자 메시지 추가
    setMessages(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await sendMessage({
        message,
        conversation_id: conversationId || undefined,
        automation_level: automationLevel,
      });

      // conversation_id 저장
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // 승인 필요 여부 체크
      if (response.requires_approval && response.approval_request) {
        setAwaitingApproval(true);
        setApprovalRequest(response.approval_request);
      }

      // AI 응답 추가
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      }]);

      return response;
    } catch (error) {
      console.error('Chat error:', error);
      
      // 에러 메시지 추가
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date()
      }]);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const clearApproval = useCallback(() => {
    setAwaitingApproval(false);
    setApprovalRequest(null);
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    clearApproval();
  }, [clearApproval]);

  return {
    messages,
    conversationId,
    isLoading,
    awaitingApproval,
    approvalRequest,
    send,
    clearApproval,
    reset,
  };
}
```

### useApproval Hook

```typescript
// src/hooks/useApproval.ts

import { useState, useCallback } from 'react';
import { submitApproval } from '@/lib/api/approval';
import type { ApprovalDecision } from '@/types/approval';
import { AutomationLevel } from '@/types/automation';

export function useApproval() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approve = useCallback(async (
    threadId: string,
    decision: ApprovalDecision,
    automationLevel: AutomationLevel,
    options?: {
      modifications?: Record<string, any>;
      userNotes?: string;
    }
  ) => {
    setIsSubmitting(true);

    try {
      const response = await submitApproval({
        thread_id: threadId,
        decision,
        automation_level: automationLevel,
        modifications: options?.modifications,
        user_notes: options?.userNotes,
      });

      return response;
    } catch (error) {
      console.error('Approval error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    approve,
    isSubmitting,
  };
}
```

---

## 🧩 핵심 컴포넌트 구현

### ChatInterface (메인 채팅)

```typescript
// src/components/chat/ChatInterface.tsx

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useApproval } from '@/hooks/useApproval';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ApprovalDialog } from './ApprovalDialog';
import { AutomationLevel } from '@/types/automation';

export function ChatInterface() {
  const [automationLevel, setAutomationLevel] = useState<AutomationLevel>(
    AutomationLevel.COPILOT
  );

  const {
    messages,
    isLoading,
    awaitingApproval,
    approvalRequest,
    send,
    clearApproval,
  } = useChat();

  const { approve, isSubmitting } = useApproval();

  const handleSendMessage = async (message: string) => {
    await send(message, automationLevel);
  };

  const handleApproval = async (
    decision: 'approved' | 'rejected',
    userNotes?: string
  ) => {
    if (!approvalRequest) return;

    try {
      const response = await approve(
        approvalRequest.thread_id,
        decision,
        automationLevel,
        { userNotes }
      );

      // 승인 결과를 메시지로 추가
      // (실제로는 useChat의 messages에 추가하는 로직 필요)
      
      clearApproval();
    } catch (error) {
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="border-b p-4">
        <h1 className="text-xl font-bold">HAMA AI 투자 어시스턴트</h1>
        {/* 자동화 레벨 선택 */}
      </div>

      {/* 메시지 리스트 */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* 입력창 */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={isLoading || awaitingApproval}
      />

      {/* 승인 다이얼로그 */}
      {awaitingApproval && approvalRequest && (
        <ApprovalDialog
          request={approvalRequest}
          onApprove={(notes) => handleApproval('approved', notes)}
          onReject={(notes) => handleApproval('rejected', notes)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
```

### ApprovalDialog (승인 UI)

```typescript
// src/components/chat/ApprovalDialog.tsx

import { useState } from 'react';
import type { ApprovalRequest, TradeApprovalData } from '@/types/chat';

interface ApprovalDialogProps {
  request: ApprovalRequest;
  onApprove: (notes?: string) => void;
  onReject: (notes?: string) => void;
  isSubmitting: boolean;
}

export function ApprovalDialog({
  request,
  onApprove,
  onReject,
  isSubmitting,
}: ApprovalDialogProps) {
  const [userNotes, setUserNotes] = useState('');

  // 거래 승인인 경우에만 상세 정보 표시
  const isTradeApproval = request.type === 'trade_approval';
  const tradeData = isTradeApproval
    ? (request.interrupt_data as TradeApprovalData)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-xl font-bold">승인이 필요합니다</h2>
        </div>

        {/* 메시지 */}
        <p className="text-gray-700 mb-4">{request.message}</p>

        {/* 거래 상세 정보 */}
        {tradeData && (
          <div className="bg-gray-50 rounded p-4 mb-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">종목</span>
              <span className="font-semibold">
                {tradeData.stock_name || tradeData.stock_code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">주문</span>
              <span className="font-semibold">
                {tradeData.order_type === 'buy' ? '매수' : '매도'} {tradeData.quantity}주
              </span>
            </div>
            {tradeData.estimated_price && (
              <div className="flex justify-between">
                <span className="text-gray-600">예상가</span>
                <span className="font-semibold">
                  {tradeData.estimated_price.toLocaleString()}원
                </span>
              </div>
            )}
            {tradeData.estimated_total && (
              <div className="flex justify-between">
                <span className="text-gray-600">총액</span>
                <span className="font-semibold text-blue-600">
                  {tradeData.estimated_total.toLocaleString()}원
                </span>
              </div>
            )}
          </div>
        )}

        {/* 메모 입력 */}
        <textarea
          className="w-full border rounded p-2 mb-4"
          placeholder="메모 (선택사항)"
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          rows={2}
        />

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(userNotes)}
            disabled={isSubmitting}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            ✅ 승인
          </button>
          <button
            onClick={() => onReject(userNotes)}
            disabled={isSubmitting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            ❌ 거부
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 개발 우선순위

### Phase 1: MVP (2-3주)

#### Week 1

- [ ] 프로젝트 셋업 (Vite + React + TypeScript + Tailwind)
- [ ] API 클라이언트 구현
- [ ] 기본 채팅 인터페이스
- [ ] useChat Hook 구현
- [ ] MessageList, MessageInput 컴포넌트

#### Week 2

- [ ] HITL 승인 플로우 구현
- [ ] ApprovalDialog 컴포넌트
- [ ] useApproval Hook
- [ ] 자동화 레벨 선택 UI
- [ ] 에러 처리 및 로딩 상태

#### Week 3

- [ ] 온보딩 플로우 (투자 성향 진단)
- [ ] 포트폴리오 대시보드 (간단한 버전)
- [ ] 전체 통합 테스트
- [ ] UI/UX 개선

### Phase 2: 고도화 (3-4주)

- [ ] WebSocket 실시간 알림
- [ ] 포트폴리오 차트 (recharts)
- [ ] 대화 이력 저장/불러오기
- [ ] 사용자 인증 (JWT)
- [ ] 반응형 디자인
- [ ] 다크 모드

---

## 🧪 테스트 전략

### 단위 테스트 (Vitest)

```typescript
// src/hooks/__tests__/useChat.test.ts

import { renderHook, act } from '@testing-library/react';
import { useChat } from '../useChat';

describe('useChat', () => {
  it('should send message and update state', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send('삼성전자 주가는 얼마야?');
    });

    expect(result.current.messages).toHaveLength(2); // user + assistant
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[1].role).toBe('assistant');
  });

  it('should handle approval request', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send('삼성전자 10주 매수해줘');
    });

    expect(result.current.awaitingApproval).toBe(true);
    expect(result.current.approvalRequest).toBeDefined();
  });
});
```

### E2E 테스트 (Playwright - 선택)

```typescript
// e2e/chat-flow.spec.ts

import { test, expect } from '@playwright/test';

test('complete investment workflow', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 메시지 입력
  await page.fill('[data-testid="message-input"]', '삼성전자 10주 매수해줘');
  await page.click('[data-testid="send-button"]');

  // 승인 다이얼로그 대기
  await expect(page.locator('[data-testid="approval-dialog"]')).toBeVisible();

  // 승인 버튼 클릭
  await page.click('[data-testid="approve-button"]');

  // 성공 메시지 확인
  await expect(page.locator('text=승인 완료')).toBeVisible();
});
```

---

## 🚨 주의사항 및 Best Practices

### API 호출

```typescript
// ❌ 나쁜 예 - 에러 처리 없음
const response = await fetch('/api/chat', { ... });
const data = await response.json();

// ✅ 좋은 예 - 에러 처리 + 타입 안전성
try {
  const data = await apiRequest<ChatResponse>('/chat/', { ... });
  // ...
} catch (error) {
  if (error instanceof APIError) {
    // 사용자에게 적절한 에러 메시지 표시
    toast.error(error.message);
  }
}
```

### 상태 관리

```typescript
// ❌ 나쁜 예 - 불필요한 전역 상태
const [messages, setMessages] = useGlobalState('messages');

// ✅ 좋은 예 - 필요한 곳에만 상태 유지
// Chat 컴포넌트에서만 필요한 상태는 로컬에
const [messages, setMessages] = useState<ChatMessage[]>([]);

// 여러 컴포넌트에서 공유해야 하는 상태만 전역으로
const { automationLevel, setAutomationLevel } = useUserStore();
```

### 승인 플로우

```typescript
// ⚠️ 중요: HITL 승인은 반드시 순차적으로
if (response.requires_approval) {
  // 1. 승인 UI 표시
  setAwaitingApproval(true);
  
  // 2. 사용자 액션 대기
  // 3. 승인 API 호출
  // 4. 결과 처리
  
  // 새로운 메시지는 승인 완료 후에만 가능
}
```

### 환경 변수

```bash
# .env.local (Git에 커밋하지 말 것!)
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
```

---

## 📚 참고 자료

### 필수 읽기

1. **docs\plan\PRD.md** - 제품 요구사항 (전체 기능 이해)
2. **docs\plan\프론트엔드 통합 가이드.md** - API 통합 방법
3. **docs\plan\BackendREADME.md (백엔드)** - 백엔드 이해
4. **docs\plan\PAGES.md** - 페이지 구성 및 디자인 가이드 🎨

### API 문서

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 기술 문서

- [React 공식 문서](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🤔 FAQ

### Q1: 백엔드 API가 아직 완성되지 않았다면?

**A**: Mock 데이터로 먼저 개발하세요.

```typescript
// src/lib/api/mock.ts
export const mockChatResponse: ChatResponse = {
  message: "삼성전자의 현재 주가는 89,000원입니다.",
  conversation_id: "mock-123",
  requires_approval: false,
  metadata: {
    intent: "stock_inquiry",
    agents_called: ["research_agent"],
    automation_level: 2
  }
};

// 개발 중에는 Mock 사용
const response = import.meta.env.DEV 
  ? mockChatResponse 
  : await apiRequest(...);
```

### Q2: HITL 플로우가 복잡한데 어떻게 테스트하나요?

**A**: Storybook을 활용하세요.

```typescript
// ApprovalDialog.stories.tsx
export const TradeApproval: Story = {
  args: {
    request: {
      type: 'trade_approval',
      thread_id: 'test-123',
      interrupt_data: {
        order_id: 'ORDER_123',
        stock_code: '005930',
        quantity: 10,
        order_type: 'buy',
        estimated_total: 890000,
      },
      message: '매매 주문 승인이 필요합니다.'
    }
  }
};
```

### Q3: 자동화 레벨을 어디에 저장하나요?

**A**: Phase 1에서는 localStorage, Phase 2에서는 백엔드 DB.

```typescript
// src/hooks/useAutomationLevel.ts
export function useAutomationLevel() {
  const [level, setLevel] = useState<AutomationLevel>(() => {
    const saved = localStorage.getItem('automation_level');
    return saved ? Number(saved) : AutomationLevel.COPILOT;
  });

  const updateLevel = (newLevel: AutomationLevel) => {
    setLevel(newLevel);
    localStorage.setItem('automation_level', String(newLevel));
  };

  return { level, updateLevel };
}
```

---

## 🎯 최종 체크리스트

프론트엔드 개발 시작 전에 확인하세요:

- [ ] 백엔드 API가 실행 중인가? (`http://localhost:8000`)
- [ ] API 문서를 확인했는가? (`/docs`)
- [ ] TypeScript 타입을 정의했는가?
- [ ] HITL 플로우를 이해했는가?
- [ ] 자동화 레벨 개념을 이해했는가?
- [ ] 에러 처리 전략이 있는가?
- [ ] 테스트 계획을 세웠는가?

---

**작성일**: 2025-10-07  
**작성자**: HAMA 프론트엔드 팀  
**백엔드 완성도**: 80%  
**프론트엔드 목표**: MVP 3주 내 완성

**Good luck! 🚀**