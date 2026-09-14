/**
 * DEVFORGE AI Centralized Token Cost & Wallet Configuration
 * Do NOT hardcode token costs across individual components.
 */

export const TOKEN_CONFIG = {
  INITIAL_WELCOME_TOKENS: 1500,
  INITIAL_STARTER_TOKENS: 3000,
  get TOTAL_INITIAL_TOKENS() {
    return this.INITIAL_WELCOME_TOKENS + this.INITIAL_STARTER_TOKENS; // 4500
  },
  DAILY_REFILL_AMOUNT: 1000,
  REFILL_COOLDOWN_MS: 24 * 60 * 60 * 1000, // 24 hours

  // Operation Costs
  COSTS: {
    SIMPLE_QUESTION: 5,
    EXPLAIN_CODE: 10,
    BUG_FIX: 15,
    GENERATE_COMPONENT: 25,
    SEVERAL_FILES_REFACTOR: 50,
    PROJECT_PLAN: 20,
    SMALL_PROJECT_BUILD: 100,
    LARGE_PROJECT_BUILD: 200,
    OPTIMIZE_CODE: 30,
    ADD_FEATURE: 45,
    RUN_TEST_SUITE: 10,
  } as const
};

export type TokenActionKey = keyof typeof TOKEN_CONFIG.COSTS;

export function getEstimatedCost(action: TokenActionKey | string, complexity: 'low' | 'medium' | 'high' = 'medium'): number {
  if (action in TOKEN_CONFIG.COSTS) {
    const base = TOKEN_CONFIG.COSTS[action as TokenActionKey];
    if (complexity === 'high') return Math.round(base * 1.5);
    if (complexity === 'low') return Math.max(5, Math.round(base * 0.8));
    return base;
  }
  
  // Fallbacks based on action names
  switch (action.toUpperCase()) {
    case 'EXPLAIN':
      return TOKEN_CONFIG.COSTS.EXPLAIN_CODE;
    case 'FIX':
      return TOKEN_CONFIG.COSTS.BUG_FIX;
    case 'OPTIMIZE':
      return TOKEN_CONFIG.COSTS.OPTIMIZE_CODE;
    case 'ADD_FEATURE':
      return TOKEN_CONFIG.COSTS.ADD_FEATURE;
    case 'REFACTOR':
      return TOKEN_CONFIG.COSTS.SEVERAL_FILES_REFACTOR;
    case 'TEST':
      return TOKEN_CONFIG.COSTS.RUN_TEST_SUITE;
    case 'BUILD':
      return complexity === 'high' ? TOKEN_CONFIG.COSTS.LARGE_PROJECT_BUILD : TOKEN_CONFIG.COSTS.SMALL_PROJECT_BUILD;
    default:
      return 15;
  }
}
