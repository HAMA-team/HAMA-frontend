import { useState } from 'react';
import type { ApprovalRequest, TradeApprovalData, RebalancingData } from '@/types/chat';
import { formatCurrency, formatNumber } from '@/lib/utils';

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center gap-3 p-6 border-b">
          <span className="text-3xl">⚠️</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">승인이 필요합니다</h2>
            <p className="text-sm text-gray-600">
              {request.type === 'trade_approval' && '매매 주문'}
              {request.type === 'rebalancing' && '포트폴리오 리밸런싱'}
              {request.type === 'portfolio_adjustment' && '포트폴리오 조정'}
            </p>
          </div>
        </div>

        {/* 메시지 */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{request.message}</p>

          {/* 거래 상세 정보 */}
          {request.type === 'trade_approval' && (
            <TradeDetails data={request.interrupt_data as TradeApprovalData} />
          )}

          {/* 리밸런싱 상세 정보 */}
          {request.type === 'rebalancing' && (
            <RebalancingDetails data={request.interrupt_data as RebalancingData} />
          )}

          {/* 메모 입력 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모 (선택사항)
            </label>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="승인/거부 이유를 입력하세요"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => onReject(userNotes)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-white border-2 border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '처리 중...' : '❌ 거부'}
          </button>
          <button
            onClick={() => onApprove(userNotes)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '처리 중...' : '✅ 승인'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 거래 상세 정보 컴포넌트
function TradeDetails({ data }: { data: TradeApprovalData }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">종목</span>
        <span className="font-bold text-gray-900">
          {data.stock_name || data.stock_code}
          <span className="text-sm text-gray-500 ml-1">({data.stock_code})</span>
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">주문</span>
        <span className={`font-bold ${
          data.order_type === 'buy' ? 'text-red-600' : 'text-blue-600'
        }`}>
          {data.order_type === 'buy' ? '매수' : '매도'} {formatNumber(data.quantity)}주
        </span>
      </div>

      {data.estimated_price && (
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">예상가</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(data.estimated_price)}
          </span>
        </div>
      )}

      {data.estimated_total && (
        <div className="flex justify-between items-center pt-3 border-t border-blue-200">
          <span className="text-gray-700 font-bold">총액</span>
          <span className="text-xl font-bold text-blue-700">
            {formatCurrency(data.estimated_total)}
          </span>
        </div>
      )}
    </div>
  );
}

// 리밸런싱 상세 정보 컴포넌트
function RebalancingDetails({ data }: { data: RebalancingData }) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-purple-900 mb-3">변경 내역:</p>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data.changes.map((change, index) => (
          <div key={index} className="bg-white rounded p-3 text-sm">
            <div className="font-semibold text-gray-900 mb-1">
              {change.stock_name || change.stock_code}
            </div>
            <div className="flex justify-between text-gray-600">
              <span>
                {change.current_weight.toFixed(1)}% → {change.target_weight.toFixed(1)}%
              </span>
              <span className={`font-semibold ${
                change.action === 'buy' ? 'text-red-600' :
                change.action === 'sell' ? 'text-blue-600' :
                'text-gray-500'
              }`}>
                {change.action === 'buy' && '매수'}
                {change.action === 'sell' && '매도'}
                {change.action === 'hold' && '유지'}
                {change.quantity && ` ${formatNumber(change.quantity)}주`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
