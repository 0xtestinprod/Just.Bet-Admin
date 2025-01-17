export interface GamePerformanceStats {
  winRatio: number;
  frequency: number;
  winsPercentage: number;
  averageBetSize: number;
  revenue: number;
  profit: number;
  losses: number;
  profitLossRatio: number;
  profitPercent: number;
  game: {
    name: string;
  };
}

export interface TokenPerformance {
  address: string;
  name: string;
  gameStats: GamePerformanceStats[];
}

export const mockTokens: TokenPerformance[] = [
  {
    address: '0x1234...5678',
    name: 'ETH',
    gameStats: [
      {
        game: { name: 'Poker' },
        winRatio: 0.48,
        frequency: 1000,
        winsPercentage: 48,
        averageBetSize: 50,
        revenue: 2500,
        profit: 1250,
        losses: 1250,
        profitLossRatio: 1,
        profitPercent: 0.5
      },
      {
        game: { name: 'Blackjack' },
        winRatio: 0.49,
        frequency: 1500,
        winsPercentage: 49,
        averageBetSize: 25,
        revenue: 3750,
        profit: 1875,
        losses: 1875,
        profitLossRatio: 1,
        profitPercent: 0.5
      }
    ]
  },
  {
    address: '0x9876...5432',
    name: 'USDT',
    gameStats: [
      {
        game: { name: 'Roulette' },
        winRatio: 0.47,
        frequency: 800,
        winsPercentage: 47,
        averageBetSize: 10,
        revenue: 800,
        profit: 400,
        losses: 400,
        profitLossRatio: 1,
        profitPercent: 0.5
      },
      {
        game: { name: 'Slots' },
        winRatio: 0.45,
        frequency: 5000,
        winsPercentage: 45,
        averageBetSize: 1,
        revenue: 5000,
        profit: 2500,
        losses: 2500,
        profitLossRatio: 1,
        profitPercent: 0.5
      }
    ]
  }
  // Add more mock tokens here...
];

// Generate 50 more mock tokens
for (let i = 0; i < 50; i++) {
  mockTokens.push({
    address: `0x${Math.random().toString(16).substr(2, 40)}`,
    name: `TOKEN${i + 1}`,
    gameStats: [
      {
        game: { name: 'RandomGame' },
        winRatio: Math.random(),
        frequency: Math.floor(Math.random() * 10000),
        winsPercentage: Math.random() * 100,
        averageBetSize: Math.random() * 100,
        revenue: Math.random() * 10000,
        profit: Math.random() * 5000,
        losses: Math.random() * 5000,
        profitLossRatio: Math.random() * 2,
        profitPercent: Math.random()
      }
    ]
  });
}
