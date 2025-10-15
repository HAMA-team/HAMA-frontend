import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useMockChat } from '@/hooks/useMockChat';
import { useApproval } from '@/hooks/useApproval';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { HistorySidebar } from '@/components/chat/HistorySidebar';
import { AutomationLevel } from '@/types/automation';
import type { TradeApprovalData } from '@/types/chat';
import {
  MessageSquare,
  BarChart3,
  DollarSign,
  TrendingDown,
  RefreshCw,
  Layers,
  Plug,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export function Chat() {
  const [automationLevel] = useState<AutomationLevel>(
    AutomationLevel.COPILOT
  );
  const [isMockMode, setIsMockMode] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const realChat = useChat();
  const { approve, isSubmitting } = useApproval();
  const mockChat = useMockChat();

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
  } = isMockMode ? mockChat : realChat;

  const handleSendMessage = async (message: string) => {
    try {
      await send(message, automationLevel);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleSelectConversation = async (id: string) => {
    console.log('TODO: 대화 로드 구현 필요 - conversation ID:', id);
    alert('대화 로드 기능은 백엔드 연동 후 구현됩니다.');
  };

  const handleNewConversation = () => {
    reset();
  };

  const handleApproval = async (decision: 'approved' | 'rejected') => {
    if (!approvalRequest) return;

    try {
      if (isMockMode) {
        await mockChat.handleMockApproval(decision, userNotes);
      } else {
        await approve(approvalRequest.thread_id, decision, automationLevel, { userNotes });
      }
      clearApproval();
      setUserNotes('');
    } catch (err) {
      console.error('Approval error:', err);
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const tradeData =
    approvalRequest?.type === 'trade_approval'
      ? (approvalRequest.interrupt_data as TradeApprovalData)
      : null;

  return (
    <div className="flex relative h-[calc(100vh-56px)] bg-background">
      {/* 채팅 히스토리 사이드바 */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />

      {/* Mock/API 모드 토글 (우측 하단) */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          onClick={() => {
            setIsMockMode(!isMockMode);
            reset();
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-xs font-medium transition-all hover:shadow-xl backdrop-blur-sm"
          style={{
            backgroundColor: isMockMode ? 'hsl(var(--secondary))' : 'hsl(var(--muted))',
            color: isMockMode ? 'hsl(var(--secondary-foreground))' : 'hsl(var(--muted-foreground))',
            opacity: 0.9,
          }}
          title={isMockMode ? 'Mock 모드 (클릭하여 API 모드로)' : 'API 모드 (클릭하여 Mock 모드로)'}
        >
          {isMockMode ? (
            <>
              <Layers className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Mock</span>
            </>
          ) : (
            <>
              <Plug className="h-3.5 w-3.5" strokeWidth={2} />
              <span>API</span>
            </>
          )}
        </button>
      </div>

      {/* 메시지 영역 */}
      <div
        className="flex flex-col flex-1 transition-all"
        style={{
          marginLeft: isHistoryOpen ? '280px' : '0',
          marginRight: awaitingApproval ? '400px' : '0',
        }}
      >
        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mx-4 mt-4 rounded">
            <p className="text-sm text-destructive">
              <strong>오류:</strong> {error}
            </p>
          </div>
        )}

        {/* 시작 안내 메시지 (메시지가 없을 때만) */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-2xl text-center space-y-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-accent p-4">
                  <MessageSquare className="h-12 w-12 text-accent-foreground" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                HAMA와 대화를 시작하세요
              </h2>
              <p className="text-base text-muted-foreground">
                투자에 관한 모든 것을 물어보세요. AI가 분석하고, 당신이 결정합니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                <button
                  onClick={() => handleSendMessage('삼성전자 분석해줘')}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all text-left"
                >
                  <div className="flex-shrink-0 rounded-md bg-accent p-2">
                    <BarChart3 className="h-5 w-5 text-accent-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      삼성전자 분석해줘
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      종목 분석 및 투자 의견
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSendMessage('삼성전자 10주 매수해줘')}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all text-left"
                >
                  <div className="flex-shrink-0 rounded-md bg-accent p-2">
                    <DollarSign className="h-5 w-5 text-accent-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      삼성전자 10주 매수해줘
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      매수 주문 (HITL 승인)
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSendMessage('네이버 5주 매도해줘')}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all text-left"
                >
                  <div className="flex-shrink-0 rounded-md bg-accent p-2">
                    <TrendingDown className="h-5 w-5 text-accent-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      네이버 5주 매도해줘
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      매도 주문 (HITL 승인)
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSendMessage('리밸런싱 해줘')}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all text-left"
                >
                  <div className="flex-shrink-0 rounded-md bg-accent p-2">
                    <RefreshCw className="h-5 w-5 text-accent-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      리밸런싱 해줘
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      포트폴리오 재조정
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput
          onSend={handleSendMessage}
          disabled={isLoading || awaitingApproval}
          placeholder={
            awaitingApproval ? '승인 대기 중...' : 'HAMA에게 메시지를 보내세요...'
          }
        />
      </div>

      {/* 승인 사이드패널 */}
      <div
        className={`fixed right-0 top-14 h-[calc(100vh-56px)] w-[400px]
                    bg-card border-l border-border shadow-2xl overflow-y-auto p-6
                    transform transition-transform duration-300 ease-out
                    ${awaitingApproval ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {approvalRequest && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 rounded-full bg-yellow-100 p-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                승인이 필요합니다
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-200">
                <p className="text-sm leading-relaxed text-foreground">
                  {approvalRequest.message}
                </p>
              </div>

              {tradeData && (
                <div className="rounded-lg p-4 space-y-3 bg-muted">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      종목
                    </span>
                    <span className="font-semibold text-foreground">
                      {tradeData.stock_name || tradeData.stock_code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      주문
                    </span>
                    <span className="font-semibold text-foreground">
                      {tradeData.order_type === 'buy' ? '매수' : '매도'} {tradeData.quantity}주
                    </span>
                  </div>
                  {tradeData.estimated_total && (
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-sm font-medium text-muted-foreground">
                        총액
                      </span>
                      <span className="font-bold text-lg text-foreground">
                        ₩{tradeData.estimated_total.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  메모 (선택)
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="승인/거부 사유를 입력하세요"
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border pt-4 mt-6">
              <div className="flex gap-2">
                <button
                  onClick={() => handleApproval('approved')}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                  승인
                </button>
                <button
                  onClick={() => handleApproval('rejected')}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="h-4 w-4" strokeWidth={2} />
                  거부
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
