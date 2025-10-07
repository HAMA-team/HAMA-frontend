import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/chat';
import { formatTime } from '@/lib/utils';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가되면 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            HAMA AI 투자 어시스턴트
          </h2>
          <p className="text-gray-600 mb-6">
            AI가 분석하고, 당신이 결정합니다
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="font-semibold text-blue-900 mb-2">💡 시작 예시:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• "삼성전자 분석해줘"</li>
              <li>• "지금 시장 상황은 어때?"</li>
              <li>• "네이버 10주 매수해줘"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              AI
            </div>
            <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* 아바타 */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
        isUser
          ? 'bg-gray-700 text-white'
          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
      }`}>
        {isUser ? '👤' : 'AI'}
      </div>

      {/* 메시지 */}
      <div className="flex-1 max-w-3xl">
        <div className={`rounded-lg p-4 shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white ml-auto'
            : 'bg-white text-gray-900'
        }`}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
