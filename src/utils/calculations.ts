// Constants from Excel sheet
const BASE_PERCENTAGE = 10; // B2: 10%
const MINIMUM_K9_FEE = 2700; // This is a minimum for K9, not PA

function getPASharePercentage(claimAmount: number, contingencyPercent: number): number {
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
  // Calculate contingency amount (e.g., 100000 * 10% = 10000)
  const contingencyAmount = claimAmount * (contingencyPercent / 100);

  // Get PA share percentage directly from the table
  const initialPaSharePercent = getPASharePercentage(claimAmount, contingencyPercent);

  // Calculate initial PA share amount
  let paShare = contingencyAmount * (initialPaSharePercent / 100);

  // Calculate initial K9 share amount
  let k9Share = contingencyAmount - paShare;

  // Store initial values for detailed steps
  const initialPaShare = paShare;
  const initialK9Share = k9Share;

  // Apply minimum K9 fee rule
  if (k9Share < MINIMUM_K9_FEE && contingencyAmount > MINIMUM_K9_FEE) {
    // If K9 share would be less than minimum fee but contingency can cover it
    k9Share = MINIMUM_K9_FEE;
    // Recalculate PA share
    paShare = contingencyAmount - MINIMUM_K9_FEE;
  }

  // Calculate final percentages based on actual amounts
  const paSharePercent = (paShare / contingencyAmount) * 100;
  const k9SharePercent = (k9Share / contingencyAmount) * 100;

  // Return all values including initial values for detailed steps
  return {
    contingencyAmount,
    initialPaSharePercent,
    initialPaShare,
    initialK9Share,
    paSharePercent,
    paShare,
    k9SharePercent,
    k9Share,
    minimumK9Fee: MINIMUM_K9_FEE
  };
}