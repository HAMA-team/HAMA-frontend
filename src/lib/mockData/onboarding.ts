// Mock data for Onboarding flow (초기스크리닝)

export interface OnboardingStep {
  id: number;
  type: 'assistant' | 'user-input';
  message: string;
  inputType?: 'text' | 'select' | 'radio';
  options?: string[];
  nextStep?: number;
}

export const onboardingFlow: OnboardingStep[] = [
  // Step 1: 시작 및 정보 접근 동의
  {
    id: 1,
    type: 'assistant',
    message:
      '안녕하세요! 고객님의 투자 성향에 맞는 최적의 상품을 추천해드리기 위해, 간단한 분석을 진행하려고 합니다.\n\n먼저 고객님의 거래 내역을 조회하여 투자 경험을 자동으로 확인해도 괜찮을까요? 이 과정을 통해 질문 단계를 크게 줄일 수 있습니다.',
    inputType: 'select',
    options: ['네, 동의합니다', '아니오, 직접 입력하겠습니다'],
    nextStep: 2,
  },

  // Step 2: API 분석 결과 브리핑
  {
    id: 2,
    type: 'assistant',
    message:
      '감사합니다. 분석 결과, 주식 및 파생상품 투자 경험이 확인되었습니다.\n\n이제 딱 **네 가지**만 더 여쭤보겠습니다.',
    nextStep: 3,
  },

  // Step 3: 첫 번째 질문 (투자 목적 및 기간)
  {
    id: 3,
    type: 'assistant',
    message:
      '이번에 투자하시려는 자금은 어떤 목적으로, 언제쯤 필요하신 돈인가요? 편하게 말씀해주세요.',
    inputType: 'text',
    nextStep: 4,
  },

  // Step 4: 두 번째 질문 (투자 스타일)
  {
    id: 4,
    type: 'assistant',
    message:
      '알겠습니다. 그럼 고객님의 투자 스타일은 다음 중 어떤 모습에 가장 가까운가요?',
    inputType: 'radio',
    options: [
      '안정지향형: 주 수입원이 일정하며, 금융상품은 기본적인 차이만 이해하고 있어요. 무엇보다 원금 보존이 가장 중요합니다.',
      '중립추구형: 일정한 수입이 있지만, 상품 설명을 들으면 이해하는 수준이에요. 예금 이상의 수익을 원하지만 큰 손실은 피하고 싶어요.',
      '적극투자형: 스스로 상품을 분석할 수 있고, 미래 수입도 긍정적입니다. 높은 수익을 위해 원금 손실 위험도 기꺼이 감수할 수 있어요.',
    ],
    nextStep: 5,
  },

  // Step 5: 세 번째 질문 (자산 비중)
  {
    id: 5,
    type: 'assistant',
    message:
      '네, 파악했습니다. 정말 마지막입니다!\n\n현재 투자하신 자금이 고객님 전체 자산(부동산, 예금 포함)에서 차지하는 비중만 알려주시겠어요?',
    inputType: 'radio',
    options: ['10% 이하', '15% 이하', '20% 이하', '25% 이하', '25% 초과'],
    nextStep: 6,
  },

  // Step 6: 네 번째 질문 (자동화 레벨)
  {
    id: 6,
    type: 'assistant',
    message:
      '고객님은 본 AI 투자 서비스를 어떤 스타일로 이용하고 싶으신가요? 고객님의 성향과 가장 가까운 AI 파트너 타입을 하나만 선택해주세요.',
    inputType: 'radio',
    options: [
      '유능한 자산관리사 (위임형): 나는 바쁘니, 모든 건 AI가 알아서 해줬으면 좋겠어. 전략 수립부터 매매까지 자동으로 실행하고, 나는 편하게 결과 리포트만 받아볼래.',
      '똑똑한 파트너 (협력형): AI가 좋은 종목이나 리밸런싱 시점을 제안해주면 좋겠어. 하지만 최종 결정과 실행 승인은 내가 직접 할 거야. AI와 함께 배우며 성장하고 싶어.',
      '최첨단 분석 도구 (분석가형): 투자에 대한 모든 판단과 실행은 100% 내가 직접 할 거야. AI는 나의 판단을 도와줄 방대한 데이터 분석과 깊이 있는 리포트만 제공해주면 돼.',
    ],
    nextStep: 7,
  },

  // Step 7: 최종 결과 안내
  {
    id: 7,
    type: 'assistant',
    message:
      '모든 분석이 완료되었습니다. 감사합니다!\n\n고객님의 투자 성향은 **안정추구형**으로 확인되었습니다.\n\n또한, AI 파트너로는 **똑똑한 파트너(협력형)** 타입이 설정되었습니다. AI가 투자안을 제안하고 고객님께서 최종 승인하는 방식으로 진행됩니다.\n\n이제 HAMA와 함께 투자를 시작하실 준비가 완료되었습니다! 🎉',
    nextStep: -1, // 완료
  },
];

// 투자 성향별 매핑
export const investmentProfiles = {
  안정지향형: {
    riskLevel: 'conservative',
    automationLevel: 2, // Copilot
    description: '원금 보존을 최우선으로 하는 안정적인 투자',
  },
  중립추구형: {
    riskLevel: 'moderate',
    automationLevel: 2, // Copilot (권장)
    description: '적절한 수익과 리스크 관리의 균형',
  },
  적극투자형: {
    riskLevel: 'aggressive',
    automationLevel: 1, // Pilot (가능)
    description: '높은 수익을 위한 적극적인 투자',
  },
};
