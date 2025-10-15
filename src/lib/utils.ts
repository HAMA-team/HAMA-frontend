// 유틸리티 함수들
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// 클래스명 결합 (Tailwind 유틸리티 - Shadcn UI 스타일)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 숫자 포맷팅 (3자리마다 쉼표)
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

// 통화 포맷팅
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)}원`;
}

// 퍼센트 포맷팅
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

// 날짜 포맷팅
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 시간 포맷팅
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 날짜+시간 포맷팅
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}
