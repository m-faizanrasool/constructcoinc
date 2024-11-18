// Constants from Excel sheet
const BASE_PERCENTAGE = 10; // B2: 10%

function getPACostPercentage(claimAmount: number, contingencyPercent: number): number {
  // Define the ranges and their corresponding percentages
  const ranges = [
    { min: 0, max: 100000, percentages: { '10-15': 60, '16-20': 55, '21-25': 50, '26+': 45 } },
    { min: 100001, max: 250000, percentages: { '10-15': 55, '16-20': 50, '21-25': 45, '26+': 40 } },
    { min: 250001, max: 500000, percentages: { '10-15': 50, '16-20': 45, '21-25': 40, '26+': 35 } },
    { min: 500001, max: 1000000, percentages: { '10-15': 45, '16-20': 40, '21-25': 35, '26+': 30 } },
    { min: 1000001, max: Infinity, percentages: { '10-15': 40, '16-20': 35, '21-25': 30, '26+': 25 } }
  ];

  // Find the appropriate range for the claim amount
  const range = ranges.find(r => claimAmount >= r.min && claimAmount <= r.max);

  // Determine which percentage bracket to use
  let percentageBracket;
  if (contingencyPercent >= 10 && contingencyPercent <= 15) percentageBracket = '10-15';
  else if (contingencyPercent > 15 && contingencyPercent <= 20) percentageBracket = '16-20';
  else if (contingencyPercent > 20 && contingencyPercent <= 25) percentageBracket = '21-25';
  else percentageBracket = '26+';

  return range ? range.percentages[percentageBracket] : 0;
}

export function calculateResults(claimAmount: number, contingencyPercent: number) {
  const contingencyAmount = claimAmount * (contingencyPercent / 100);
  const paCostPercent = getPACostPercentage(claimAmount, contingencyPercent);
  const paCost = contingencyAmount * (paCostPercent / 100);
  const minimumPaCost = Math.max(paCost, 2700);
  const paProfit = contingencyAmount - minimumPaCost;
  const paPercentage = (paProfit / contingencyAmount) * 100;

  return {
    paCost: minimumPaCost,
    paProfit,
    paPercentage,
    k9Percentage: 100 - paPercentage
  };
}