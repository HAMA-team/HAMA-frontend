# 백엔드 API 요청 사항 - HAMA 프론트엔드

**작성일**: 2025-10-11
**작성자**: 프론트엔드 팀
**브랜치**: `feature/UI-improvement`
**우선순위**: HIGH (MVP 완성 필수)

---

## 📋 목차

1. [요청 개요](#요청-개요)
2. [채팅 히스토리 API](#1-채팅-히스토리-api-최우선)
3. [포트폴리오 API](#2-포트폴리오-api)
4. [대시보드 API](#3-대시보드-api)
5. [기타 개선 사항](#4-기타-개선-사항)
6. [구현 가이드](#구현-가이드)
7. [테스트 방법](#테스트-방법)

---

## 요청 개요

### 현재 상황

프론트엔드에서 다음 UI/UX가 **완성**되었으나, 백엔드 API가 부족하여 Mock 데이터로 동작 중입니다:

| 기능 | 프론트 상태 | 백엔드 상태 | 필요한 API |
|------|-----------|-----------|----------|
| **채팅 히스토리** | ✅ UI 완성 | ⚠️ 부분 구현 | `GET /chat/sessions` |
| **포트폴리오 조회** | ✅ UI 완성 | ❌ 미구현 | `GET /portfolio/` |
| **대시보드** | ✅ UI 완성 | ❌ 미구현 | `GET /dashboard/` |

### 요청 우선순위

1. **🔥 최우선**: 채팅 히스토리 API (`GET /chat/sessions`)
2. **⚠️ 높음**: 포트폴리오 API (`GET /portfolio/`)
3. **💡 중간**: 대시보드 API (`GET /dashboard/`)

---

## 1. 채팅 히스토리 API (최우선)

### 배경

- ✅ 프론트엔드에서 **HistorySidebar, HistoryItem** 컴포넌트 구현 완료
- ✅ 날짜별 그룹핑, 검색, 삭제 기능 모두 구현
- ⚠️ **`GET /chat/sessions` API가 없어서 Mock 데이터로만 동작 중**
- ✅ `GET /chat/history/{id}`, `DELETE /chat/history/{id}`는 이미 구현되어 있음

### 필요한 API

#### `GET /api/v1/chat/sessions` ⭐ **NEW**

**목적**: 사용자의 모든 채팅 세션 목록 조회 (최신순)

**요청**:
```http
GET /api/v1/chat/sessions?limit=50
```

**쿼리 파라미터**:
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `limit` | int | X | 50 | 조회할 최대 세션 개수 |
| `offset` | int | X | 0 | 페이지네이션 오프셋 (Phase 2) |

**응답 예시**:
```json
[
  {
    "conversation_id": "abc-123-def-456",
    "title": "삼성전자 투자 상담",
    "last_message": "승인이 완료되었습니다.",
    "last_message_at": "2025-10-11T10:30:00Z",
    "automation_level": 2,
    "message_count": 8,
    "created_at": "2025-10-11T10:00:00Z"
  },
  {
    "conversation_id": "xyz-789",
    "title": "네이버 분석 요청",
    "last_message": "재무 분석 결과입니다...",
    "last_message_at": "2025-10-11T08:15:00Z",
    "automation_level": 2,
    "message_count": 5,
    "created_at": "2025-10-11T08:00:00Z"
  }
]
```

**필드 설명**:
- `conversation_id` (string, 필수): 대화 고유 ID (thread_id와 동일)
- `title` (string, 필수): 대화 제목
  - 첫 번째 사용자 메시지의 일부 (최대 50자)
  - 또는 수동으로 설정한 제목 (Phase 2)
- `last_message` (string, 필수): 마지막 메시지 내용 (최대 100자)
- `last_message_at` (datetime, 필수): 마지막 메시지 시각 (ISO 8601)
- `automation_level` (int, 필수): 자동화 레벨 (1, 2, 3)
- `message_count` (int, 선택): 메시지 개수
- `created_at` (datetime, 필수): 대화 생성 시각

**정렬**: `last_message_at` 기준 내림차순 (최신 대화가 먼저)

### 백엔드 구현 가이드

#### 데이터베이스 쿼리

```python
# src/api/routes/chat.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import ChatSession, ChatMessage

router = APIRouter()

@router.get("/sessions")
async def get_chat_sessions(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    사용자의 모든 채팅 세션 목록 조회

    - 최신 대화가 먼저 (last_message_at 기준 DESC)
    - limit: 조회할 최대 세션 개수 (기본 50, 최대 100)
    """

    # 세션 조회 (메시지 포함, eager loading)
    sessions = (
        db.query(ChatSession)
        .order_by(ChatSession.updated_at.desc())
        .limit(limit)
        .all()
    )

    result = []
    for session in sessions:
        # 첫 번째 메시지에서 제목 추출
        first_message = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session.id)
            .filter(ChatMessage.role == "user")
            .order_by(ChatMessage.created_at.asc())
            .first()
        )

        # 마지막 메시지
        last_message = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session.id)
            .order_by(ChatMessage.created_at.desc())
            .first()
        )

        # 메시지 개수
        message_count = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session.id)
            .count()
        )

        result.append({
            "conversation_id": session.id,
            "title": session.title or (first_message.content[:50] if first_message else "새 대화"),
            "last_message": last_message.content[:100] if last_message else "",
            "last_message_at": last_message.created_at if last_message else session.created_at,
            "automation_level": session.automation_level or 2,
            "message_count": message_count,
            "created_at": session.created_at
        })

    return result
```

#### 데이터베이스 스키마 확인

현재 `chat_sessions` 테이블에 다음 필드가 있는지 확인:
- ✅ `id` (conversation_id)
- ✅ `created_at`
- ✅ `updated_at`
- ⚠️ `title` (없으면 nullable로 추가)
- ⚠️ `automation_level` (없으면 추가, 기본값 2)

#### 성능 최적화 (선택)

```python
# 서브쿼리로 한 번에 조회 (N+1 문제 해결)
from sqlalchemy import func

last_messages = (
    db.query(
        ChatMessage.session_id,
        func.max(ChatMessage.created_at).label('last_at')
    )
    .group_by(ChatMessage.session_id)
    .subquery()
)

sessions = (
    db.query(ChatSession, last_messages.c.last_at)
    .outerjoin(last_messages, ChatSession.id == last_messages.c.session_id)
    .order_by(last_messages.c.last_at.desc())
    .limit(limit)
    .all()
)
```

### 프론트엔드 연동 방법

프론트엔드에서는 다음과 같이 사용합니다:

```typescript
// src/lib/api/chat.ts

export interface ChatSession {
  conversation_id: string;
  title: string;
  last_message: string;
  last_message_at: string;
  automation_level: number;
  message_count?: number;
  created_at: string;
}

export async function getChatSessions(
  limit: number = 50
): Promise<ChatSession[]> {
  return apiRequest<ChatSession[]>(`/chat/sessions?limit=${limit}`);
}

// src/components/chat/HistorySidebar.tsx (Line 36-62)
const loadConversations = async () => {
  setIsLoading(true);
  try {
    const sessions = await getChatSessions(50);

    const conversations: Conversation[] = sessions.map(session => ({
      id: session.conversation_id,
      title: session.title,
      lastMessage: session.last_message,
      timestamp: new Date(session.last_message_at)
    }));

    setConversations(conversations);
  } catch (error) {
    console.error('Failed to load conversations:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 테스트 시나리오

1. **빈 목록**: 대화 없을 때 `[]` 반환
2. **정렬 확인**: 최신 대화가 먼저
3. **제한 확인**: `limit=10` → 최대 10개 반환
4. **긴 제목/메시지**: 50자/100자 제한 확인

### 우선순위

🔥 **최우선** - 이 API만 구현되면 채팅 히스토리 UI가 완전히 동작합니다!

---

## 2. 포트폴리오 API

### 배경

- ✅ 프론트엔드에서 **Portfolio 페이지** 완성
- ✅ Mock 데이터로 UI 동작 확인 완료
- ❌ 백엔드 API 없음

### 필요한 API

#### `GET /api/v1/portfolio/` ⭐ **NEW**

**목적**: 사용자의 포트폴리오 전체 조회

**요청**:
```http
GET /api/v1/portfolio/
```

**응답 예시**:
```json
{
  "summary": {
    "total_value": 10000000,
    "principal": 8000000,
    "profit": 2000000,
    "profit_rate": 25.0,
    "cash": 2000000,
    "cash_percentage": 20.0,
    "updated_at": "2025-10-11T15:30:00Z"
  },
  "holdings": [
    {
      "stock_code": "005930",
      "stock_name": "삼성전자",
      "quantity": 100,
      "avg_price": 70000,
      "current_price": 73400,
      "market_value": 7340000,
      "profit": 340000,
      "profit_rate": 4.86,
      "weight": 73.4
    },
    {
      "stock_code": "035420",
      "stock_name": "NAVER",
      "quantity": 5,
      "avg_price": 220000,
      "current_price": 234500,
      "market_value": 1172500,
      "profit": 72500,
      "profit_rate": 6.59,
      "weight": 11.7
    }
  ],
  "allocation": {
    "sectors": [
      { "name": "IT", "value": 8512500, "percentage": 85.1 },
      { "name": "금융", "value": 0, "percentage": 0 }
    ],
    "asset_classes": [
      { "name": "주식", "value": 8512500, "percentage": 85.1 },
      { "name": "현금", "value": 2000000, "percentage": 20.0 }
    ]
  }
}
```

**필드 설명**:

**summary** (요약 정보):
- `total_value` (float, 필수): 총 평가액 (주식 + 현금)
- `principal` (float, 필수): 투자 원금
- `profit` (float, 필수): 총 손익 (total_value - principal)
- `profit_rate` (float, 필수): 수익률 (%)
- `cash` (float, 필수): 현금 잔액
- `cash_percentage` (float, 필수): 현금 비율 (%)
- `updated_at` (datetime, 필수): 업데이트 시각

**holdings** (보유 종목):
- `stock_code` (string, 필수): 종목 코드
- `stock_name` (string, 필수): 종목명
- `quantity` (int, 필수): 보유 수량
- `avg_price` (float, 필수): 평균 매수가
- `current_price` (float, 필수): 현재가
- `market_value` (float, 필수): 평가액 (quantity × current_price)
- `profit` (float, 필수): 손익 (market_value - quantity × avg_price)
- `profit_rate` (float, 필수): 수익률 (%)
- `weight` (float, 필수): 비중 (% of total_value)

**allocation** (자산 배분):
- `sectors` (array, 필수): 섹터별 배분
  - `name` (string): 섹터명 (IT, 금융, 헬스케어 등)
  - `value` (float): 금액
  - `percentage` (float): 비율 (%)
- `asset_classes` (array, 필수): 자산 클래스별 배분
  - `name` (string): 자산 클래스 (주식, 채권, 현금 등)
  - `value` (float): 금액
  - `percentage` (float): 비율 (%)

### 백엔드 구현 가이드

#### 데이터베이스 쿼리

```python
# src/api/routes/portfolio.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import Portfolio, Position, Stock
from src.services.stock_data_service import StockDataService

router = APIRouter()

@router.get("/")
async def get_portfolio(
    db: Session = Depends(get_db),
    stock_service: StockDataService = Depends()
):
    """
    사용자 포트폴리오 전체 조회
    """

    # 포트폴리오 조회 (임시로 첫 번째 포트폴리오, Phase 2에서 user_id 기반)
    portfolio = db.query(Portfolio).first()
    if not portfolio:
        return {"error": "Portfolio not found"}

    # 보유 종목 조회
    positions = db.query(Position).filter(Position.portfolio_id == portfolio.id).all()

    holdings = []
    total_stock_value = 0

    for position in positions:
        # 현재가 조회 (FinanceDataReader)
        current_price = await stock_service.get_current_price(position.stock_code)
        market_value = position.quantity * current_price
        profit = market_value - (position.quantity * position.avg_price)
        profit_rate = (profit / (position.quantity * position.avg_price)) * 100

        total_stock_value += market_value

        holdings.append({
            "stock_code": position.stock_code,
            "stock_name": position.stock_name,
            "quantity": position.quantity,
            "avg_price": position.avg_price,
            "current_price": current_price,
            "market_value": market_value,
            "profit": profit,
            "profit_rate": profit_rate,
            "weight": 0  # 나중에 계산
        })

    # 총 평가액
    total_value = total_stock_value + portfolio.cash

    # 비중 계산
    for holding in holdings:
        holding["weight"] = (holding["market_value"] / total_value) * 100

    # 요약 정보
    summary = {
        "total_value": total_value,
        "principal": portfolio.principal,
        "profit": total_value - portfolio.principal,
        "profit_rate": ((total_value - portfolio.principal) / portfolio.principal) * 100,
        "cash": portfolio.cash,
        "cash_percentage": (portfolio.cash / total_value) * 100,
        "updated_at": portfolio.updated_at
    }

    # 섹터 배분 (간단한 버전, Phase 2에서 개선)
    allocation = {
        "sectors": [
            {"name": "IT", "value": total_stock_value, "percentage": (total_stock_value / total_value) * 100}
        ],
        "asset_classes": [
            {"name": "주식", "value": total_stock_value, "percentage": (total_stock_value / total_value) * 100},
            {"name": "현금", "value": portfolio.cash, "percentage": (portfolio.cash / total_value) * 100}
        ]
    }

    return {
        "summary": summary,
        "holdings": holdings,
        "allocation": allocation
    }
```

#### 필요한 데이터베이스 테이블

1. **portfolios** 테이블:
   - `id`, `user_id`, `principal`, `cash`, `created_at`, `updated_at`

2. **positions** 테이블:
   - `id`, `portfolio_id`, `stock_code`, `stock_name`, `quantity`, `avg_price`, `created_at`, `updated_at`

3. **stocks** 테이블 (캐시):
   - `stock_code`, `name`, `current_price`, `sector`, `updated_at`

### 프론트엔드 연동 방법

```typescript
// src/lib/api/portfolio.ts

export interface Portfolio {
  summary: {
    total_value: number;
    principal: number;
    profit: number;
    profit_rate: number;
    cash: number;
    cash_percentage: number;
    updated_at: string;
  };
  holdings: Holding[];
  allocation: Allocation;
}

export async function getPortfolio(): Promise<Portfolio> {
  return apiRequest<Portfolio>('/portfolio/');
}

// src/hooks/usePortfolioData.ts
const { data, isLoading, error } = useQuery('portfolio', getPortfolio);
```

### 테스트 시나리오

1. **빈 포트폴리오**: 보유 종목 없을 때 `holdings: []`
2. **현재가 조회**: FinanceDataReader 연동 확인
3. **수익률 계산**: profit_rate 정확성 검증

### 우선순위

⚠️ **높음** - 포트폴리오 페이지 완전 동작에 필수

---

## 3. 대시보드 API

### 배경

- ✅ 프론트엔드에서 **Dashboard 페이지** 완성
- ✅ Mock 데이터로 UI 동작 확인 완료
- ❌ 백엔드 API 없음

### 필요한 API

#### `GET /api/v1/dashboard/` ⭐ **NEW**

**목적**: 대시보드 요약 정보 조회

**요청**:
```http
GET /api/v1/dashboard/
```

**응답 예시**:
```json
{
  "total_assets": {
    "value": 10000000,
    "profit": 2000000,
    "profit_rate": 25.0,
    "change_24h": 150000,
    "change_24h_rate": 1.5
  },
  "account_connection": {
    "broker": "한국투자증권",
    "account_number": "1234-5678-****",
    "status": "connected",
    "last_synced_at": "2025-10-11T15:00:00Z"
  },
  "automation_settings": {
    "level": 2,
    "level_name": "코파일럿 모드",
    "enabled": true
  },
  "recent_activities": [
    {
      "id": "act-001",
      "type": "trade_buy",
      "icon": "💰",
      "title": "삼성전자 10주 매수",
      "description": "73,400원 × 10주",
      "amount": 734000,
      "timestamp": "2025-10-11T14:30:00Z",
      "status": "completed"
    },
    {
      "id": "act-002",
      "type": "ai_suggestion",
      "icon": "💡",
      "title": "AI 투자 제안",
      "description": "네이버 매도 추천",
      "timestamp": "2025-10-11T12:00:00Z",
      "status": "pending"
    },
    {
      "id": "act-003",
      "type": "alert_risk",
      "icon": "⚠️",
      "title": "리스크 경고",
      "description": "삼성전자 집중도 40% 초과",
      "timestamp": "2025-10-11T10:00:00Z",
      "status": "warning"
    }
  ],
  "top_holdings": [
    {
      "stock_code": "005930",
      "stock_name": "삼성전자",
      "quantity": 100,
      "value": 7340000,
      "profit_rate": 4.86,
      "weight": 73.4
    },
    {
      "stock_code": "035420",
      "stock_name": "NAVER",
      "quantity": 5,
      "value": 1172500,
      "profit_rate": 6.59,
      "weight": 11.7
    }
  ],
  "performance_summary": {
    "today": { "profit": 50000, "profit_rate": 0.5 },
    "week": { "profit": 200000, "profit_rate": 2.0 },
    "month": { "profit": 500000, "profit_rate": 5.0 },
    "year": { "profit": 2000000, "profit_rate": 25.0 }
  }
}
```

**필드 설명**:

**total_assets** (총 자산):
- `value` (float, 필수): 총 평가액
- `profit` (float, 필수): 총 손익
- `profit_rate` (float, 필수): 수익률 (%)
- `change_24h` (float, 선택): 24시간 변동액
- `change_24h_rate` (float, 선택): 24시간 변동률 (%)

**account_connection** (계좌 연결):
- `broker` (string, 필수): 증권사명
- `account_number` (string, 필수): 계좌번호 (마스킹)
- `status` (string, 필수): 연결 상태 (connected | disconnected | error)
- `last_synced_at` (datetime, 필수): 마지막 동기화 시각

**automation_settings** (자동화 설정):
- `level` (int, 필수): 자동화 레벨 (1, 2, 3)
- `level_name` (string, 필수): 레벨명 (파일럿/코파일럿/어드바이저)
- `enabled` (bool, 필수): 활성화 여부

**recent_activities** (최근 활동):
- `id` (string, 필수): 활동 ID
- `type` (string, 필수): 활동 타입
  - `trade_buy`: 매수
  - `trade_sell`: 매도
  - `ai_suggestion`: AI 제안
  - `alert_risk`: 리스크 경고
  - `alert_opportunity`: 기회 알림
- `icon` (string, 필수): 아이콘 (이모지)
- `title` (string, 필수): 제목
- `description` (string, 필수): 설명
- `amount` (float, 선택): 금액 (거래인 경우)
- `timestamp` (datetime, 필수): 시각
- `status` (string, 필수): 상태 (completed | pending | warning | error)

**top_holdings** (상위 보유 종목):
- 포트폴리오 API의 holdings와 동일 (상위 3-5개만)

**performance_summary** (성과 요약):
- `today`, `week`, `month`, `year`: 각 기간별
  - `profit` (float): 손익
  - `profit_rate` (float): 수익률 (%)

### 백엔드 구현 가이드

```python
# src/api/routes/dashboard.py

@router.get("/")
async def get_dashboard(
    db: Session = Depends(get_db)
):
    """
    대시보드 요약 정보 조회
    """

    # 포트폴리오 조회
    portfolio = db.query(Portfolio).first()

    # 총 자산 (포트폴리오 API 재사용)
    portfolio_data = await get_portfolio(db)
    total_assets = {
        "value": portfolio_data["summary"]["total_value"],
        "profit": portfolio_data["summary"]["profit"],
        "profit_rate": portfolio_data["summary"]["profit_rate"],
        "change_24h": 0,  # Phase 2
        "change_24h_rate": 0  # Phase 2
    }

    # 계좌 연결 (임시)
    account_connection = {
        "broker": "한국투자증권",
        "account_number": "1234-5678-****",
        "status": "connected",
        "last_synced_at": portfolio.updated_at
    }

    # 자동화 설정
    automation_settings = {
        "level": portfolio.automation_level or 2,
        "level_name": ["파일럿 모드", "코파일럿 모드", "어드바이저 모드"][portfolio.automation_level - 1],
        "enabled": True
    }

    # 최근 활동 (거래 내역)
    recent_trades = db.query(Transaction).order_by(Transaction.created_at.desc()).limit(5).all()
    recent_activities = [
        {
            "id": f"act-{tx.id}",
            "type": f"trade_{tx.order_type}",
            "icon": "💰" if tx.order_type == "buy" else "📉",
            "title": f"{tx.stock_name} {tx.quantity}주 {['매수', '매도'][tx.order_type == 'sell']}",
            "description": f"{tx.price:,}원 × {tx.quantity}주",
            "amount": tx.price * tx.quantity,
            "timestamp": tx.created_at,
            "status": "completed"
        }
        for tx in recent_trades
    ]

    # 상위 보유 종목 (포트폴리오에서 상위 3개)
    top_holdings = portfolio_data["holdings"][:3]

    # 성과 요약 (간단한 버전)
    performance_summary = {
        "today": {"profit": 0, "profit_rate": 0},  # Phase 2
        "week": {"profit": 0, "profit_rate": 0},   # Phase 2
        "month": {"profit": 0, "profit_rate": 0},  # Phase 2
        "year": {
            "profit": total_assets["profit"],
            "profit_rate": total_assets["profit_rate"]
        }
    }

    return {
        "total_assets": total_assets,
        "account_connection": account_connection,
        "automation_settings": automation_settings,
        "recent_activities": recent_activities,
        "top_holdings": top_holdings,
        "performance_summary": performance_summary
    }
```

### 프론트엔드 연동 방법

```typescript
// src/lib/api/dashboard.ts

export interface Dashboard {
  total_assets: TotalAssets;
  account_connection: AccountConnection;
  automation_settings: AutomationSettings;
  recent_activities: Activity[];
  top_holdings: Holding[];
  performance_summary: PerformanceSummary;
}

export async function getDashboard(): Promise<Dashboard> {
  return apiRequest<Dashboard>('/dashboard/');
}

// src/hooks/useDashboardData.ts
const { data, isLoading, error } = useQuery('dashboard', getDashboard);
```

### 우선순위

💡 **중간** - 포트폴리오 API 이후 구현

---

## 4. 기타 개선 사항

### 4.1. 채팅 메시지 타임스탬프 추가

**현재 문제**:
- `GET /chat/history/{id}` 응답에 메시지 타임스탬프 없음

**요청**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "삼성전자 분석해줘",
      "timestamp": "2025-10-11T10:00:00Z"  // ⭐ 추가
    }
  ]
}
```

### 4.2. Research 에이전트 응답 구조화 (Phase 2)

**현재**: 텍스트만 반환
```json
{
  "message": "📊 재무 분석\n- 영업이익: 15% 증가\n- PER: 12.5"
}
```

**개선** (Phase 2):
```json
{
  "message": "삼성전자 분석 결과입니다.",
  "structured_data": {
    "type": "stock_analysis",
    "stock_code": "005930",
    "financial": {
      "revenue": 302000000000,
      "operating_income": 45000000000,
      "net_income": 30000000000,
      "per": 12.5,
      "roe": 9.8
    },
    "price": {
      "current": 73400,
      "high_52w": 89000,
      "low_52w": 65300
    },
    "disclosures": [
      {
        "date": "2025-01-15",
        "title": "2024년 4분기 실적 발표",
        "url": "https://..."
      }
    ]
  }
}
```

---

## 구현 가이드

### 우선순위별 구현 순서

#### Week 1 (최우선)
1. **채팅 히스토리 API** (`GET /chat/sessions`)
   - 예상 시간: 2-3시간
   - 테스트: Swagger에서 확인
   - 프론트 연동: 즉시 가능

#### Week 2 (높음)
2. **포트폴리오 API** (`GET /portfolio/`)
   - 예상 시간: 4-6시간
   - FinanceDataReader 현재가 조회 연동
   - 테스트: Mock 포트폴리오 생성 후 확인

3. **대시보드 API** (`GET /dashboard/`)
   - 예상 시간: 3-4시간
   - 포트폴리오 API 재사용
   - 거래 내역 연동

### 테스트 방법

#### 1. Swagger UI로 테스트

```bash
# 백엔드 실행
cd HAMA-backend
python -m uvicorn src.main:app --reload

# Swagger 접속
http://localhost:8000/docs
```

#### 2. 프론트엔드에서 테스트

```bash
# 프론트엔드 실행
cd HAMA-frontend
git checkout feature/UI-improvement
git pull origin feature/UI-improvement
npm run dev

# 테스트
1. 채팅 히스토리: 좌측 상단 토글 버튼 클릭
2. 포트폴리오: /portfolio 페이지 접속
3. 대시보드: /dashboard 페이지 접속
```

#### 3. curl로 테스트

```bash
# 채팅 세션 목록
curl http://localhost:8000/api/v1/chat/sessions

# 포트폴리오
curl http://localhost:8000/api/v1/portfolio/

# 대시보드
curl http://localhost:8000/api/v1/dashboard/
```

---

## 📞 소통 방법

### API 구현 중 질문사항

1. **Slack/Discord/Email로 질문**:
   - "포트폴리오 API에서 섹터 정보는 어디서 가져오나요?"
   - "현재가 조회가 너무 느린데 캐싱이 필요한가요?"

2. **GitHub Issue 생성**:
   - 제목: `[백엔드 API] 채팅 세션 목록 조회 API 구현`
   - 라벨: `backend`, `api`, `high-priority`

3. **PR 리뷰 요청**:
   - 백엔드 PR 생성 후 프론트 팀에 리뷰 요청
   - 프론트 팀에서 Swagger로 응답 형식 확인

### 프론트엔드 브랜치

```bash
# 이 브랜치를 pull 받아주세요
git checkout feature/UI-improvement
git pull origin feature/UI-improvement

# 주요 파일:
docs/plan/BACKEND_API_REQUEST.md          # 이 문서
docs/plan/CHAT_HISTORY_INTEGRATION.md     # 채팅 히스토리 상세
src/components/chat/HistorySidebar.tsx    # UI 구현 참고
src/lib/api/chat.ts                       # API 클라이언트 예시
```

---

## ✅ 체크리스트

백엔드 메이트가 확인해야 할 항목:

### 채팅 히스토리 API
- [ ] `GET /chat/sessions` 엔드포인트 추가
- [ ] 응답 형식 일치 확인
- [ ] 정렬 (last_message_at DESC) 확인
- [ ] Swagger 문서 업데이트
- [ ] 프론트 팀에 알림

### 포트폴리오 API
- [ ] `GET /portfolio/` 엔드포인트 추가
- [ ] FinanceDataReader 현재가 조회 연동
- [ ] 수익률 계산 로직 검증
- [ ] Swagger 문서 업데이트
- [ ] 프론트 팀에 알림

### 대시보드 API
- [ ] `GET /dashboard/` 엔드포인트 추가
- [ ] 최근 활동 내역 조회
- [ ] Swagger 문서 업데이트
- [ ] 프론트 팀에 알림

---

## 🎯 최종 목표

이 3가지 API만 구현되면:
- ✅ 채팅 히스토리 UI 완전 동작
- ✅ 포트폴리오 페이지 실제 데이터 표시
- ✅ 대시보드 페이지 실제 데이터 표시
- ✅ **MVP 프론트엔드 100% 완성!**

---

**문서 작성**: 프론트엔드 팀
**작성일**: 2025-10-11
**브랜치**: `feature/UI-improvement`
**우선순위**: HIGH

**백엔드 메이트님, 화이팅! 🚀**
