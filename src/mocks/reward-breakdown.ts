import { faker } from '@faker-js/faker';

export function generateMockRewardBreakdown(numTokens: number = 100) {
  // Generate random token addresses
  const generateTokenAddress = () =>
    `0x${faker.string.hexadecimal({ length: 40 }).slice(2)}`;

  // Total USD value to distribute (let's say $1,000,000)
  const totalUsdValue = 1000000;

  // Generate random percentages that sum to 100
  let remainingPercentage = 100;
  const percentages = Array.from({ length: numTokens - 1 }, () => {
    // Pareto distribution for more realistic token distribution
    const percentage = remainingPercentage * Math.random() ** 2 * 0.3;
    remainingPercentage -= percentage;
    return percentage;
  });
  percentages.push(remainingPercentage); // Add remaining percentage

  // Sort percentages in descending order for more realistic distribution
  percentages.sort((a, b) => b - a);

  return percentages.map((percentage) => {
    const usdValue = (totalUsdValue * percentage) / 100;
    const tokenAmount = usdValue * (0.8 + Math.random() * 0.4); // Random token/USD ratio
    const count = Math.floor(tokenAmount * (0.01 + Math.random() * 0.02)); // Random count based on amount

    return {
      token: generateTokenAddress(),
      tokenAmount: Number(tokenAmount.toFixed(8)),
      usdValue: Number(usdValue.toFixed(2)),
      count: Math.max(1, count), // Ensure at least 1 count
      percentage: Number(percentage.toFixed(8))
    };
  });
}

// Example usage:
export const mockRewardBreakdown = generateMockRewardBreakdown(100);
