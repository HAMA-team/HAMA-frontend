# 채팅 히스토리 UI 백엔드 연동 가이드

## 📋 현재 상태 (2025-10-11)

### ✅ 구현 완료
- 채팅 히스토리 사이드바 UI (280px, 접기/펴기)
- 검색 기능 (제목, 메시지 내용)
- 날짜별 그룹핑 (오늘, 어제, 이번 주, 이번 달, 이전)
- 삭제 버튼 (개별 대화)
- Mock 데이터로 UI 동작 확인

### ❌ 미구현 (백엔드 연동 필요)
1. **대화 목록 조회** - 백엔드 API 없음
2. **대화 선택 시 메시지 로드** - useChat hook에 기능 없음
3. **새 대화 시작 시 히스토리 업데이트** - 실시간 업데이트 로직 없음

---

## 🚨 백엔드에 필요한 API

### 1. 대화 목록 조회 API ⭐ **가장 중요**

현재 **존재하지 않음**. 백엔드 메이트에게 요청 필요.

#### 엔드포인트
```
GET /api/v1/chat/sessions
```

#### 응답 형식
```json
[
  {
    "conversation_id": "abc-123-def-456",
    "title": "삼성전자 투자 상담",
    "last_message": "승인이 완료되었습니다.",
    "last_message_at": "2025-10-11T10:30:00Z",
    "automation_level": 2,
    "message_count": 8
  },
  {
    "conversation_id": "xyz-789",
    "title": "네이버 분석 요청",
    "last_message": "재무 분석 결과입니다...",
    "last_message_at": "2025-10-11T08:15:00Z",
    "automation_level": 2,
    "message_count": 5
  }
]
```

#### 필드 설명
- `conversation_id`: 대화 고유 ID (thread_id)
- `title`: 대화 제목 (첫 번째 사용자 메시지 또는 요약)
- `last_message`: 마지막 메시지 내용 (100자 제한)
- `last_message_at`: 마지막 메시지 시각 (ISO 8601)
- `automation_level`: 자동화 레벨 (1, 2, 3)
- `message_count`: 메시지 개수 (선택)

#### 백엔드 구현 위치
```python
# src/api/routes/chat.py

@router.get("/sessions")
async def get_chat_sessions(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    사용자의 모든 채팅 세션 목록 조회
    (최신순 정렬)
    """
    sessions = db.query(ChatSession).order_by(
        ChatSession.updated_at.desc()
    ).limit(limit).all()

    return [
        {
            "conversation_id": session.id,
            "title": session.title or session.messages[0].content[:50],
            "last_message": session.messages[-1].content[:100],
            "last_message_at": session.updated_at,
            "automation_level": session.automation_level,
            "message_count": len(session.messages)
        }
        for session in sessions
    ]
```

### 2. 대화 히스토리 조회 API ✅ **이미 구현됨**

#### 엔드포인트
```
GET /api/v1/chat/history/{conversation_id}
```

#### 응답 형식 (BackendREADME.md 참조)
```json
{
  "conversation_id": "abc123-def456",
  "automation_level": 2,
  "messages": [
    {
      "role": "user",
      "content": "삼성전자 10주 매수해줘"
    },
    {
      "role": "assistant",
      "content": "🔔 사용자 승인이 필요합니다."
    }
  ]
}
```

### 3. 대화 삭제 API ✅ **이미 구현됨**

#### 엔드포인트
```
DELETE /api/v1/chat/history/{conversation_id}
```

---

## 🔧 프론트엔드 연동 작업

### 1단계: API 클라이언트 추가

#### `src/lib/api/chat.ts`

```typescript
// 대화 목록 조회 (새로 추가)
export async function getChatSessions(
  limit: number = 50
): Promise<ChatSession[]> {
  return apiRequest<ChatSession[]>(`/chat/sessions?limit=${limit}`);
}

// 타입 정의 추가
export interface ChatSession {
  conversation_id: string;
  title: string;
  last_message: string;
  last_message_at: string;
  automation_level: number;
  message_count?: number;
}
```

### 2단계: HistorySidebar 연동

#### `src/components/chat/HistorySidebar.tsx`

```typescript
// Line 36-62의 Mock 데이터를 실제 API로 교체

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

### 3단계: useChat Hook에 메시지 로드 기능 추가

#### `src/hooks/useChat.ts`

```typescript
// 새로운 함수 추가
const loadConversation = useCallback(async (conversationId: string) => {
  setIsLoading(true);
  try {
    const history = await getChatHistory(conversationId);

    // API 응답을 ChatMessage[] 형식으로 변환
    const loadedMessages: ChatMessage[] = history.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date() // API에 timestamp 없으면 현재 시각
    }));

    setMessages(loadedMessages);
    setConversationId(history.conversation_id);
  } catch (error) {
    console.error('Failed to load conversation:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
}, []);

// return에 추가
return {
  messages,
  conversationId,
  isLoading,
  awaitingApproval,
  approvalRequest,
  send,
  clearApproval,
  reset,
  loadConversation, // ⭐ 새로 추가
};
```

### 4단계: Chat.tsx에서 대화 선택 구현

#### `src/pages/Chat.tsx`

```typescript
// Line 30에서 loadConversation 추출
const {
  messages,
  isLoading,
  awaitingApproval,
  approvalRequest,
  error,
  send,
  clearApproval,
  reset,
  conversationId,
  loadConversation, // ⭐ 새로 추가
} = isMockMode ? mockChat : realChat;

// Line 43-59의 handleSelectConversation 수정
const handleSelectConversation = async (id: string) => {
  try {
    await loadConversation(id);
    // 성공적으로 로드되면 자동으로 messages 상태 업데이트됨
  } catch (err) {
    console.error('대화 로드 실패:', err);
    alert('대화를 불러오는 중 오류가 발생했습니다.');
  }
};
```

### 5단계: 새 대화 시작 시 히스토리 업데이트

#### `src/pages/Chat.tsx`

```typescript
// 새 메시지 전송 후 히스토리 갱신
const handleSendMessage = async (message: string) => {
  try {
    await send(message, automationLevel);

    // 첫 메시지인 경우 히스토리 사이드바 갱신
    if (messages.length === 0) {
      // HistorySidebar의 loadConversations 호출
      // 방법 1: HistorySidebar에 ref 전달
      // 방법 2: 전역 상태로 대화 목록 관리
      // 방법 3: 일정 시간마다 자동 갱신
    }
  } catch (err) {
    console.error('Send message error:', err);
  }
};
```

**권장 방법**: 전역 상태 관리 (Zustand)

```typescript
// src/store/chatStore.ts
interface ChatStore {
  conversations: Conversation[];
  loadConversations: () => Promise<void>;
  addConversation: (conv: Conversation) => void;
  removeConversation: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  loadConversations: async () => {
    const sessions = await getChatSessions();
    const conversations = sessions.map(...); // 변환
    set({ conversations });
  },
  addConversation: (conv) => set((state) => ({
    conversations: [conv, ...state.conversations]
  })),
  removeConversation: (id) => set((state) => ({
    conversations: state.conversations.filter(c => c.id !== id)
  })),
}));
```

---

## ✅ 백엔드 연동 후 동작 확인

### 테스트 시나리오

1. **대화 목록 로드**
   - 페이지 로드 시 히스토리 사이드바에 이전 대화 목록 표시
   - 최신 대화가 맨 위에 (날짜별 그룹핑)

2. **대화 선택**
   - 히스토리 항목 클릭 시 해당 대화의 메시지 로드
   - 메시지 영역에 전체 대화 내용 표시

3. **새 대화 시작**
   - "새 대화" 버튼 클릭 시 빈 화면
   - 첫 메시지 전송 시 히스토리에 새 항목 추가

4. **대화 삭제**
   - 삭제 버튼 클릭 시 확인 다이얼로그
   - 확인 후 히스토리 목록에서 제거

5. **검색**
   - 검색창에 키워드 입력 시 실시간 필터링
   - 제목 및 마지막 메시지 내용 검색

---

## 📝 백엔드 메이트에게 전달할 내용

### 요청 사항

"채팅 히스토리 UI를 구현했는데, **대화 목록 조회 API**가 필요합니다."

### 필요한 API 스펙

```
GET /api/v1/chat/sessions?limit=50

Response:
[
  {
    "conversation_id": "abc-123",
    "title": "삼성전자 투자 상담",
    "last_message": "승인이 완료되었습니다.",
    "last_message_at": "2025-10-11T10:30:00Z",
    "automation_level": 2
  }
]
```

### 참고 사항

- `chat_sessions` 테이블에서 조회
- `updated_at` 기준 내림차순 정렬
- `title`이 없으면 첫 메시지 내용 사용 (50자 제한)
- `last_message`는 마지막 메시지 내용 (100자 제한)

---

## 🎯 요약

### 현재 상황
- ✅ UI는 완성됨 (Mock 데이터로 동작 확인)
- ❌ 백엔드 "대화 목록 조회 API" 없음
- ❌ useChat hook에 대화 로드 기능 없음

### 백엔드 연동 시 작업
1. 백엔드에 `GET /api/v1/chat/sessions` API 추가
2. 프론트에 `getChatSessions()` 함수 추가
3. `HistorySidebar.loadConversations()` 실제 API 연동
4. `useChat.loadConversation()` 함수 추가
5. `Chat.handleSelectConversation()` 구현
6. (선택) Zustand로 전역 상태 관리

### 예상 작업 시간
- 백엔드 API 구현: 1-2시간
- 프론트 연동: 2-3시간
- 테스트 및 버그 수정: 1-2시간
- **총 4-7시간**

---

**작성일**: 2025-10-11
**작성자**: 프론트엔드 팀
**상태**: 백엔드 API 대기 중
