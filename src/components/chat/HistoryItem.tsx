import { useState } from 'react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface HistoryItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function HistoryItem({ conversation, isActive, onClick, onDelete }: HistoryItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    onDelete();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className="relative px-3 py-3 cursor-pointer transition-colors border-l-2"
      style={{
        backgroundColor: isActive
          ? 'var(--color-primary-50)'
          : isHovered
          ? 'var(--bg-subtle)'
          : 'transparent',
        borderLeftColor: isActive ? 'var(--color-primary-500)' : 'transparent',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3
            className="text-sm font-medium truncate mb-1"
            style={{
              color: isActive ? 'var(--color-primary-700)' : 'var(--text-primary)',
            }}
          >
            {conversation.title}
          </h3>

          {/* Last Message */}
          <p
            className="text-xs truncate"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {conversation.lastMessage}
          </p>

          {/* Timestamp */}
          <p
            className="text-xs mt-1"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {formatTime(conversation.timestamp)}
          </p>
        </div>

        {/* Delete Button - shown on hover */}
        {(isHovered || isActive) && (
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-red-100 transition-colors flex-shrink-0"
            title="대화 삭제"
            style={{ color: 'var(--color-danger-500)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
