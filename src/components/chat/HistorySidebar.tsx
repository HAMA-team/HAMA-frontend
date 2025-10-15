import { useState, useEffect } from 'react';
import { deleteChatHistory } from '@/lib/api/chat';
import { HistoryItem } from './HistoryItem';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export function HistorySidebar({
  isOpen,
  onToggle,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: HistorySidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // TODO: 백엔드 API 연동 필요
      // 현재 백엔드에 "대화 목록 조회" API가 없음
      // 필요한 API: GET /api/v1/chat/sessions
      // 응답 형식:
      // [
      //   {
      //     "conversation_id": "abc-123",
      //     "title": "삼성전자 투자 상담",  // 첫 메시지 또는 요약
      //     "last_message": "승인이 완료되었습니다.",
      //     "last_message_at": "2025-10-11T10:30:00Z",
      //     "automation_level": 2
      //   }
      // ]
      //
      // 백엔드 구현 후 아래 주석 해제:
      // const response = await fetch('/api/v1/chat/sessions');
      // const data = await response.json();
      // const conversations = data.map(session => ({
      //   id: session.conversation_id,
      //   title: session.title,
      //   lastMessage: session.last_message,
      //   timestamp: new Date(session.last_message_at)
      // }));
      // setConversations(conversations);

      // 임시 Mock 데이터
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          title: '삼성전자 투자 상담',
          lastMessage: '삼성전자 10주 매수 완료되었습니다.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
          id: 'conv-2',
          title: '네이버 분석 요청',
          lastMessage: '네이버의 재무 분석 결과입니다...',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        },
        {
          id: 'conv-3',
          title: '포트폴리오 리밸런싱',
          lastMessage: '리밸런싱 계획을 수립했습니다.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
          id: 'conv-4',
          title: 'SK하이닉스 주가 조회',
          lastMessage: 'SK하이닉스의 현재 주가는...',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        },
        {
          id: 'conv-5',
          title: '투자 전략 상담',
          lastMessage: '장기 투자 전략에 대해 말씀드리겠습니다.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 대화를 삭제하시겠습니까?')) return;

    try {
      await deleteChatHistory(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));

      // If deleted conversation was current, start new conversation
      if (id === currentConversationId) {
        onNewConversation();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      alert('대화 삭제 중 오류가 발생했습니다.');
    }
  };

  // Filter conversations by search query
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by date
  const groupedConversations = groupConversationsByDate(filteredConversations);

  // Render toggle button when closed
  if (!isOpen) {
    return (
      <>
        <button
          onClick={onToggle}
          className="fixed left-4 top-20 z-20 p-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
          style={{
            backgroundColor: 'var(--color-primary-500)',
            color: 'white',
          }}
          title="채팅 히스토리 보기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </button>
      </>
    );
  }

  return (
    <div
      className="fixed left-0 top-[64px] w-[280px] border-r flex flex-col transition-transform duration-300 ease-out"
      style={{
        backgroundColor: 'white',
        borderColor: 'var(--border-default)',
        height: 'calc(100vh - 64px)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        zIndex: 30,
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            대화 기록
          </h2>
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="히스토리 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* New Conversation Button */}
        <button
          onClick={onNewConversation}
          className="btn btn-primary w-full text-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          새 대화
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="relative">
          <input
            type="text"
            placeholder="대화 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input text-sm pl-9"
            style={{ width: '100%' }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {searchQuery ? '검색 결과가 없습니다.' : '대화 기록이 없습니다.'}
            </p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([dateGroup, convs]) => (
            <div key={dateGroup}>
              {/* Date Group Header */}
              <div
                className="px-4 py-2 text-xs font-semibold sticky top-0 z-10"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {dateGroup}
              </div>

              {/* Conversations in this group */}
              <div>
                {convs.map(conv => (
                  <HistoryItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === currentConversationId}
                    onClick={() => onSelectConversation(conv.id)}
                    onDelete={() => handleDelete(conv.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper function to group conversations by date
function groupConversationsByDate(conversations: Conversation[]) {
  const groups: Record<string, Conversation[]> = {
    '오늘': [],
    '어제': [],
    '이번 주': [],
    '이번 달': [],
    '이전': [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  conversations.forEach(conv => {
    const convDate = new Date(conv.timestamp);
    const convDay = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());

    if (convDay.getTime() === today.getTime()) {
      groups['오늘'].push(conv);
    } else if (convDay.getTime() === yesterday.getTime()) {
      groups['어제'].push(conv);
    } else if (convDate >= weekAgo) {
      groups['이번 주'].push(conv);
    } else if (convDate >= monthAgo) {
      groups['이번 달'].push(conv);
    } else {
      groups['이전'].push(conv);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
}
