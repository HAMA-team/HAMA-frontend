# CLAUDE.md - HAMA 프론트엔드 개발 가이드

이 문서는 **HAMA (Human-in-the-Loop AI Multiagent Investment System)** 프론트엔드 개발을 위한 Claude Code 활용 가이드입니다.

**최종 업데이트**: 2025-10-11 | **프론트엔드 완성도**: 80% ⬆️

---

## 📊 현재 구현 상태 (2025-10-11 업데이트)

### ✅ **완벽하게 구현된 기능**

| 기능 | 백엔드 상태 | 프론트 상태 | 활용도 | 비고 |
|------|-----------|-----------|--------|------|
| **채팅 API** | ✅ 완성 | ✅ 완성 | **95%** | 실제 API + Mock 모드 지원 |
| **HITL 승인 플로우** | ✅ 완성 | ✅ 완성 | **90%** | thread_id 관리 완벽 |
| **자동화 레벨 (1-3)** | ✅ 완성 | ✅ 완성 | **100%** | UI 선택, 상태 관리 완벽 |
| **Research 에이전트** | ✅ 실제 데이터 | ✅ 준비 완료 | **80%** | DART + FDR 연동 가능 |
| **채팅 히스토리 UI** | ✅ 완성 | ✅ 완성 | **60%** | ⭐ **NEW! Mock 동작, API 연동 대기** |

### 🔄 **부분 구현 / 개선 필요**

| 기능 | 백엔드 상태 | 프론트 상태 | 활용도 | 개선 사항 |
|------|-----------|-----------|--------|----------|
| **채팅 히스토리 API** | ⚠️ 부분 | ✅ UI 완성 | **60%** | `GET /chat/sessions` API 필요 |
| **포트폴리오 API** | 🔄 예정 | ✅ Mock UI | **40%** | 백엔드 API 요청 필요 |
| **대시보드 API** | 🔄 예정 | ✅ Mock UI | **40%** | 백엔드 API 요청 필요 |
| **에러 처리** | ✅ 기본 | ✅ 기본 | **60%** | 세밀한 에러 타입 처리 |
| **Research 응답 UI** | ✅ 완성 | ⚠️ 텍스트만 | **50%** | 구조화된 UI 필요 |

### 🚨 **핵심 발견 사항**

1. ✅ **HITL 플로우 완벽 구현**
   - LangGraph의 `interrupt()` 메커니즘 정확히 이해
   - `thread_id` 관리 및 재사용 완벽
   - 거래 승인, 리밸런싱 승인 모두 지원

2. ✅ **Mock 모드 시스템 훌륭함**
   - 백엔드 없이 전체 시나리오 테스트 가능
   - 실제 API와 동일한 응답 형식
   - UI에서 토글 가능

3. ✅ **채팅 히스토리 UI 구현 완료!** ⭐ NEW (2025-10-11)
   - HistorySidebar, HistoryItem 컴포넌트 완성
   - 날짜별 그룹핑, 검색 기능 추가
   - Mock 데이터로 UI 동작 확인 완료
   - ⚠️ 백엔드 `GET /chat/sessions` API 필요 (CHAT_HISTORY_INTEGRATION.md 참조)

4. 🔄 **포트폴리오/대시보드는 Mock 전용**
   - UI는 완성되었으나 백엔드 API 미연동
   - 백엔드 메이트에게 API 명세 요청 필요

---

## 🎯 즉시 해야 할 일 (우선순위별)

### 🔥 **우선순위 HIGH** (이번 주 완료)

#### ✅ 1. 채팅 히스토리 UI 구현 **[완료!]**
```typescript
// 구현된 컴포넌트:
src/components/chat/
  ├── HistorySidebar.tsx    ✅ 완성 (280px, 접기/펴기, 날짜 그룹핑)
  ├── HistoryItem.tsx        ✅ 완성 (hover, 삭제 버튼)
  └── Chat.tsx               ✅ 통합 완료

// 구현된 기능:
- ✅ 대화 목록 표시 (Mock 데이터)
- ✅ 날짜별 그룹핑 (오늘, 어제, 이번 주, 이번 달, 이전)
- ✅ 검색 기능 (제목, 메시지 내용)
- ✅ 개별 대화 삭제
- ✅ 슬라이드 애니메이션
- ⚠️ 백엔드 API 연동 대기 중 (GET /chat/sessions 필요)
```

**문서:** `docs/plan/CHAT_HISTORY_INTEGRATION.md` 참조

#### 2. 포트폴리오 & 대시보드 API 연동 **[다음 우선순위]**
```typescript
// 백엔드 메이트에게 요청할 API:

1. GET /api/v1/portfolio/
   - 보유 종목 리스트 (종목코드, 수량, 평가액)
   - 총 평가액, 투자 원금, 손익률
   - 자산 배분 비율, 현금 잔액

2. GET /api/v1/dashboard/
   - 계좌 연결 상태
   - 최근 활동 (거래, AI 제안, 경고)
   - 포트폴리오 요약 (상위 3-5 종목)
```

#### 3. Research 에이전트 응답 구조화
```typescript
// 현재: 텍스트 응답만
<MessageBubble content={response.message} />

// 개선: 구조화된 UI
<StockAnalysisCard>
  <FinancialTable data={...} />  // 재무 데이터 테이블
  <PriceChart data={...} />       // 주가 차트
  <DisclosureList items={...} />  // 공시 리스트
</StockAnalysisCard>
```

### ⚠️ **우선순위 MEDIUM** (다음 주)

#### 4. 승인 결과 메시지 개선
```typescript
// 현재: 기본 메시지
"✅ 승인 완료 - 매매가 실행되었습니다."

// 개선: 상세 정보 포함
"✅ 삼성전자 10주 매수 완료
   체결가: 73,400원
   총액: 734,000원
   시간: 14:32:15"
```

#### 5. 에러 처리 고도화
```typescript
// 에러 타입별 처리
if (error.status === 401) {
  // 인증 만료
} else if (error.status === 500) {
  // 서버 오류
} else if (error.status === 429) {
  // Rate Limit
}
```

#### 6. 로딩 상태 개선
```typescript
// 에이전트별 상태 표시
"🔍 Research 에이전트가 분석 중..."
"📊 Strategy 에이전트가 전략 수립 중..."
"💰 Trading 에이전트가 주문 준비 중..."
```

### 💡 **우선순위 LOW** (Phase 2)

- WebSocket 실시간 알림
- 다크 모드
- 모바일 반응형
- 성능 최적화 (React.memo, useMemo)

---

## 🚀 백엔드 현재 구현 상태

### API 엔드포인트 현황

| 엔드포인트 | 상태 | 프론트 연동 | 비고 |
|-----------|------|-----------|------|
| `POST /chat/` | ✅ 완성 | ✅ 완료 | Research는 실제 데이터 |
| `POST /chat/approve` | ✅ 완성 | ✅ 완료 | HITL 승인 플로우 |
| `GET /chat/history/{id}` | ✅ 완성 | ❌ UI 없음 | **즉시 구현 필요** |
| `DELETE /chat/history/{id}` | ✅ 완성 | ❌ UI 없음 | 히스토리 삭제 |
| 포트폴리오 조회 | 🔄 예정 | ⏸️ 대기 | 백엔드 API 요청 |
| 대시보드 API | 🔄 예정 | ⏸️ 대기 | 백엔드 API 요청 |

### 에이전트별 구현 상태

| 에이전트 | 구현 | 데이터 | 프론트 활용 |
|---------|------|--------|-----------|
| **Master (Supervisor)** | ✅ 완료 | - | ✅ 라우팅 활용 |
| **Research** | ✅ 완료 | ✅ 실제 | ✅ **즉시 테스트 가능** |
| **Strategy** | 🔄 진행중 | 🔄 일부 | 🔄 기본 동작 |
| **Risk** | 🔄 진행중 | ⚠️ Mock | 🔄 Mock 응답 |
| **Trading** | 🔄 진행중 | ⚠️ Mock | ✅ HITL 구현 |
| **Portfolio** | 🔄 진행중 | ⚠️ Mock | 🔄 Mock UI |
| **General** | 🔄 진행중 | - | ✅ 기본 QA |

**실제 데이터 소스:**
- ✅ **DART API** - 재무제표, 공시 (Research 사용 중)
- ✅ **FinanceDataReader** - 주가 데이터 (Research 사용 중)
- 🔄 **BOK API** - 거시경제 지표 (연동됨, 미사용)
- ⏸️ **한국투자증권 API** - 실시간 시세 (Phase 2)

---

## 💡 프론트엔드 개발 전략

### 핵심 메시지 ⭐

1. **HITL이 가장 중요합니다!** ✅ **완벽 구현 완료**
   - LangGraph interrupt 기반으로 백엔드 구현 완료
   - 프론트엔드도 `thread_id` 관리 완벽 구현
   - **시연의 핵심 기능**

2. **Mock 모드가 훌륭합니다!** ✅ **완벽 동작**
   - 백엔드 없이 전체 시나리오 테스트 가능
   - UI/UX 개발에 집중 가능
   - 실제 API와 토글 가능

3. **Research 에이전트는 실제 데이터 사용** ✅ **즉시 테스트 가능**
   - "삼성전자 분석해줘" → 실제 DART + FDR 데이터
   - 백엔드 실행 후 바로 테스트
   - 응답 구조화 UI만 개선하면 완벽

4. **채팅 히스토리만 구현하면 됩니다** ⚠️ **즉시 필요**
   - 백엔드 API 완성
   - 프론트 UI만 없음
   - 이번 주 완료 목표

5. **포트폴리오/대시보드는 백엔드 API 요청**
   - Mock UI 완성
   - 백엔드 메이트에게 API 명세 요청
   - API 완성되면 즉시 연동 가능

---

## 🎯 시연 시나리오 (MVP 완성)

### ✅ 시나리오 1: 종목 분석 (Research - 실제 데이터)
```
사용자: "삼성전자 분석해줘"
      ↓
AI: [실제 DART + FinanceDataReader 데이터 기반]
    📊 재무 분석
    - 영업이익: 15% 증가
    - PER: 12.5

    📈 주가 정보
    - 현재가: 73,400원
    - 52주 최고가: 89,000원

    📰 최근 공시
    - [DART API에서 가져온 실제 공시]
```

**구현 상태:** ✅ 완료 (응답 UI 개선 필요)

### ✅ 시나리오 2: 매매 승인 (HITL - 핵심!)
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
│ 예상가: 73,400원             │
│ 총액: 734,000원              │
│                              │
│ [✅ 승인]  [❌ 거부]         │
└──────────────────────────────┘
      ↓
사용자: [✅ 승인] 클릭
      ↓
AI: "✅ 매매가 완료되었습니다"
```

**구현 상태:** ✅ 완벽 구현 (결과 메시지 개선 필요)

### ✅ 시나리오 3: 리밸런싱 (HITL 고급)
```
사용자: "리밸런싱 해줘"
      ↓
AI: 변경 내역 표시
    - 삼성전자: 35% → 25% (매도 5주)
    - 신한지주: 20% → 30% (매수 3주)
      ↓
[승인 다이얼로그] → 사용자 승인
      ↓
AI: "✅ 리밸런싱 완료"
```

**구현 상태:** ✅ 완벽 구현

---

## 🔧 백엔드 메이트와 협업하기

### 즉시 요청할 API (우선순위순)

#### 1. 포트폴리오 API
```
Q: "포트폴리오 조회 API가 필요한데, 응답 형식이 어떻게 되나요?"

필요한 데이터:
{
  "total_value": 10000000,
  "principal": 8000000,
  "profit": 2000000,
  "profit_rate": 25.0,
  "holdings": [
    {
      "stock_code": "005930",
      "stock_name": "삼성전자",
      "quantity": 100,
      "avg_price": 70000,
      "current_price": 73400,
      "value": 7340000,
      "profit_rate": 4.86
    }
  ],
  "cash": 2000000,
  "cash_percentage": 20
}
```

#### 2. 대시보드 API
```
Q: "대시보드용 요약 데이터 API가 필요해요"

필요한 데이터:
{
  "total_assets": { "value": 10000000, "profit": 2000000 },
  "account_connection": { "broker": "한국투자증권", "status": "connected" },
  "automation_level": { "level": 2, "name": "코파일럿" },
  "recent_activities": [
    { "type": "trade_buy", "content": "삼성전자 10주 매수", "timestamp": "..." }
  ]
}
```

#### 3. 채팅 히스토리 테스트
```
Q: "대화 히스토리 API 테스트하려는데, conversation_id 어떻게 얻나요?"

확인 필요:
- GET /chat/history/{conversation_id} 테스트
- DELETE /chat/history/{conversation_id} 테스트
```

### 소통이 필요한 순간

| 상황 | 해야 할 일 |
|------|----------|
| API 응답 형식이 문서와 다를 때 | 백엔드 메이트에게 확인 요청 |
| 새로운 엔드포인트 필요 시 | 필요한 데이터 명세 전달 |
| 에러가 계속 발생할 때 | 백엔드 로그 확인 요청 |
| HITL 플로우 이해 안 될 때 | LangGraph interrupt 설명 요청 |

---

## 🔑 LangGraph HITL 이해하기 (완벽 구현 완료!)

### ✅ 프론트엔드 구현 상태

**thread_id 관리:** ✅ 완벽
```typescript
// src/hooks/useChat.ts
if (response.requires_approval && response.approval_request) {
  setAwaitingApproval(true);
  setApprovalRequest(response.approval_request); // thread_id 포함
}

// src/hooks/useApproval.ts
const response = await submitApproval({
  thread_id: threadId,  // 동일한 thread_id 사용
  decision,
  automation_level: automationLevel
});
```

**승인 플로우:** ✅ 완벽
1. 채팅 API 호출 → `requires_approval: true` 수신
2. ApprovalDialog 표시 (thread_id 저장)
3. 사용자 승인/거부
4. Approval API 호출 (동일한 thread_id)
5. LangGraph 재개 → 결과 반환

### LangGraph의 Interrupt 동작

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

**프론트엔드 대응:**
1. `POST /chat/` → `requires_approval: true` + `thread_id` 수신
2. 승인 다이얼로그 표시
3. `POST /chat/approve` with `thread_id` → LangGraph 재개

---

## 📂 현재 프로젝트 구조

```
hama-frontend/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx       ✅ 완성
│   │   │   ├── MessageList.tsx         ✅ 완성
│   │   │   ├── MessageInput.tsx        ✅ 완성
│   │   │   ├── ApprovalDialog.tsx      ✅ 완성 (HITL)
│   │   │   ├── HistorySidebar.tsx      ✅ 완성 ⭐ NEW
│   │   │   └── HistoryItem.tsx         ✅ 완성 ⭐ NEW
│   │   ├── layout/
│   │   │   ├── Layout.tsx              ✅ 완성
│   │   │   └── Header.tsx              ✅ 완성
│   │   └── settings/
│   │       └── SettingsModal.tsx       ✅ 완성
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               ✅ 완성
│   │   │   ├── chat.ts                 ✅ 완성
│   │   │   ├── approval.ts             ✅ 완성
│   │   │   └── mock.ts                 ✅ 완성
│   │   ├── mockData/
│   │   │   ├── dashboard.ts            ✅ Mock 데이터
│   │   │   └── portfolio.ts            ✅ Mock 데이터
│   │   └── utils.ts                    ✅ 완성
│   ├── hooks/
│   │   ├── useChat.ts                  ✅ 완성
│   │   ├── useApproval.ts              ✅ 완성
│   │   ├── useMockChat.ts              ✅ Mock 모드
│   │   ├── useDashboardData.ts         🔄 Mock 전용
│   │   └── usePortfolioData.ts         🔄 Mock 전용
│   ├── types/
│   │   ├── chat.ts                     ✅ 완성
│   │   ├── approval.ts                 ✅ 완성
│   │   ├── automation.ts               ✅ 완성
│   │   └── api.ts                      ✅ 완성
│   ├── pages/
│   │   ├── Welcome.tsx                 ✅ 완성
│   │   ├── Onboarding.tsx              ✅ 완성
│   │   ├── Dashboard.tsx               ✅ Mock UI
│   │   ├── Chat.tsx                    ✅ 완성
│   │   └── Portfolio.tsx               ✅ Mock UI
│   └── App.tsx                          ✅ 완성
├── docs/
│   └── plan/
│       ├── PRD.md
│       ├── 프론트엔드 통합 가이드.md
│       ├── BackendREADME.md
│       ├── PAGES.md
│       ├── DESIGN_SYSTEM.md
│       ├── 페이지별_상세_기획안.md
│       └── CHAT_HISTORY_INTEGRATION.md  ⭐ NEW
├── .env.local                           ✅ 설정 완료
└── package.json                         ✅ 의존성 완료
```

---

## 🎨 구현된 핵심 기능 상세

### 1. 채팅 API 연동 ✅

**구현 파일:**
- `src/lib/api/chat.ts` - API 함수
- `src/hooks/useChat.ts` - 채팅 로직 Hook
- `src/components/chat/ChatInterface.tsx` - UI 컴포넌트

**특징:**
- ✅ 실제 API + Mock 모드 토글
- ✅ conversation_id 관리
- ✅ 에러 처리
- ✅ 로딩 상태

### 2. HITL 승인 플로우 ✅

**구현 파일:**
- `src/lib/api/approval.ts` - 승인 API
- `src/hooks/useApproval.ts` - 승인 Hook
- `src/components/chat/ApprovalDialog.tsx` - 승인 UI

**특징:**
- ✅ thread_id 관리 완벽
- ✅ 거래 승인 (TradeApprovalData)
- ✅ 리밸런싱 승인 (RebalancingData)
- ✅ 승인/거부/수정 모든 decision 지원
- ✅ 사용자 메모 입력

### 3. 자동화 레벨 ✅

**구현 파일:**
- `src/types/automation.ts` - 타입 정의
- `src/components/chat/ChatInterface.tsx` - UI 선택

**특징:**
- ✅ Level 1 (Pilot), 2 (Copilot), 3 (Advisor)
- ✅ 아이콘, 설명 포함
- ✅ API 요청 시 자동 포함

### 4. Mock 모드 시스템 ✅

**구현 파일:**
- `src/lib/api/mock.ts` - Mock 시나리오
- `src/hooks/useMockChat.ts` - Mock Hook

**특징:**
- ✅ 4가지 시나리오 (분석, 매수, 매도, 리밸런싱)
- ✅ 실제 API와 동일한 응답 형식
- ✅ UI에서 토글 가능

---

## 🚨 누락/개선 필요 사항

### ✅ 1. 채팅 히스토리 UI **[구현 완료!]** ⭐

**현재 상태:**
- ✅ UI 컴포넌트 완성
- ✅ Mock 데이터로 동작 확인
- ✅ 날짜별 그룹핑, 검색 기능
- ⚠️ 백엔드 `GET /chat/sessions` API 필요

**구현된 컴포넌트:**
```typescript
src/components/chat/
  ├── HistorySidebar.tsx    ✅ 완성
  ├── HistoryItem.tsx        ✅ 완성
  └── Chat.tsx               ✅ 통합 완료
```

**문서:** `docs/plan/CHAT_HISTORY_INTEGRATION.md` 참조

### 🔄 2. 포트폴리오/대시보드 API 연동

**현재 상태:**
- ✅ Mock UI 완성
- ❌ 백엔드 API 미연동

**필요한 작업:**
1. 백엔드 메이트에게 API 명세 요청
2. `src/lib/api/portfolio.ts` 생성
3. Hook 수정 (Mock → 실제 API)

### ⚠️ 3. Research 응답 구조화

**현재:**
```typescript
<MessageBubble content={response.message} />
```

**개선:**
```typescript
<StockAnalysisCard>
  <FinancialTable />
  <PriceChart />
  <DisclosureList />
</StockAnalysisCard>
```

### 💡 4. 에러 처리 고도화

**현재:** 기본 에러 메시지만
**개선:** 에러 타입별 처리 (401, 500, 429 등)

---

## 📚 참고 문서

### 필수 읽기

1. **docs/plan/PRD.md** - 제품 요구사항
2. **docs/plan/프론트엔드 통합 가이드.md** - API 통합 방법
3. **docs/plan/BackendREADME.md** - 백엔드 이해
4. **docs/plan/PAGES.md** - 페이지 구성 및 디자인

### API 문서

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 기술 문서

- [React 공식 문서](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org/)

---

## 🎯 최종 체크리스트

### ✅ 완료된 항목

- [x] 프로젝트 셋업 (Vite + React + TypeScript + Tailwind)
- [x] API 클라이언트 구현
- [x] 기본 채팅 인터페이스
- [x] useChat Hook 구현
- [x] HITL 승인 플로우 구현
- [x] ApprovalDialog 컴포넌트
- [x] useApproval Hook
- [x] 자동화 레벨 선택 UI
- [x] Mock 모드 시스템
- [x] 에러 처리 및 로딩 상태 (기본)
- [x] 포트폴리오 대시보드 UI (Mock)
- [x] 온보딩 플로우

### 🔄 진행 중 / 즉시 필요

- [x] **채팅 히스토리 UI** ✅ 완료! (2025-10-11)
- [ ] **채팅 히스토리 백엔드 API** (`GET /chat/sessions` 요청 필요)
- [ ] **포트폴리오 API 연동** (백엔드 API 요청)
- [ ] **대시보드 API 연동** (백엔드 API 요청)
- [ ] **Research 응답 구조화**
- [ ] **승인 결과 메시지 개선**
- [ ] **에러 처리 고도화**

### 🚀 Phase 2

- [ ] WebSocket 실시간 알림
- [ ] 다크 모드
- [ ] 모바일 반응형
- [ ] 성능 최적화

---

## 📞 도움이 필요할 때

### 백엔드 메이트에게 물어볼 것

1. **포트폴리오 API 응답 형식이 어떻게 되나요?**
2. **대시보드용 요약 데이터 API가 필요해요**
3. **대화 히스토리 API 테스트하려는데, conversation_id는 어떻게 얻나요?**
4. **Research 에이전트 응답을 구조화하고 싶은데, 어떤 형식으로 데이터를 받을 수 있나요?**

### Claude Code에게 물어볼 것

1. "채팅 히스토리 사이드바 UI 구현해줘"
2. "포트폴리오 API 클라이언트 만들어줘"
3. "에러 처리를 타입별로 세밀하게 개선해줘"
4. "Research 응답을 구조화된 카드로 표시해줘"

---

**최종 업데이트**: 2025-10-11
**프론트엔드 완성도**: 80% ⭐⭐⭐⭐☆ (⬆️ +5%)

**최근 완료:**
- ✅ 채팅 히스토리 UI 구현 (HistorySidebar, HistoryItem)
- ✅ 날짜별 그룹핑 및 검색 기능
- ✅ CHAT_HISTORY_INTEGRATION.md 문서 작성

**다음 목표**:
1. 백엔드 API 요청 (`GET /chat/sessions`, 포트폴리오, 대시보드)
2. 포트폴리오/대시보드 API 연동
3. Research 응답 구조화

**Great work! Keep going! 🚀**
