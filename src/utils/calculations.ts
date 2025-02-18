// Constants from Excel sheet
const BASE_PERCENTAGE = 10; // B2: 10%

function getPACostPercentage(claimAmount: number, contingencyPercent: number): number {
  // Define the ranges and their corresponding percentages based on the chart
  const ranges = [
    { min: 0, max: 99999.99, percentages: { '<10': 40, '10-15': 50, '16-20': 55, '21-25': 60, '26+': 65 } },
    { min: 100000, max: 249999.99, percentages: { '<10': 45, '10-15': 55, '16-20': 60, '21-25': 65, '26+': 70 } },
    { min: 250000, max: 499999.99, percentages: { '<10': 50, '10-15': 60, '16-20': 65, '21-25': 70, '26+': 75 } },
    { min: 500000, max: 999999.99, percentages: { '<10': 55, '10-15': 65, '16-20': 70, '21-25': 75, '26+': 80 } },
    { min: 1000000, max: Infinity, percentages: { '<10': 60, '10-15': 70, '16-20': 75, '21-25': 80, '26+': 85 } }
  ];

  // Find the appropriate range for the claim amount
  const range = ranges.find(r => claimAmount >= r.min && claimAmount <= r.max);

  // Determine which percentage bracket to use based on contingency percent
  let percentageBracket;
  if (contingencyPercent < 10) percentageBracket = '<10';
  else if (contingencyPercent <= 15) percentageBracket = '10-15';
  else if (contingencyPercent <= 20) percentageBracket = '16-20';
  else if (contingencyPercent <= 25) percentageBracket = '21-25';
  else percentageBracket = '26+';

  return range ? range.percentages[percentageBracket] : 0;
}

export function calculateResults(claimAmount: number, contingencyPercent: number) {
  // Calculate contingency amount (e.g., 25000 * 20% = 5000)
  const contingencyAmount = claimAmount * (contingencyPercent / 100);

  // Get PA cost percentage from the table
  const paCostPercent = getPACostPercentage(claimAmount, contingencyPercent);

  // Calculate PA cost (e.g., 5000 * 50% = 2500)
  const paCost = contingencyAmount * (paCostPercent / 100);

  // Apply minimum PA cost of 2700
  const minimumPaCost = Math.max(paCost, 2700);

  // Calculate PA profit (e.g., 5000 - 3000 = 2000)
  const paProfit = contingencyAmount - minimumPaCost;

  // Calculate PA percentage (e.g., 2000 / 5000 * 100 = 40%)
  const paPercentage = (paProfit / contingencyAmount) * 100;

  // Return all values for transparency
  return {
    contingencyAmount,
    paCostPercent,
    paCost,
    minimumPaCost,
    paProfit,
    paPercentage,
    k9Percentage: 100 - paPercentage
  };
}