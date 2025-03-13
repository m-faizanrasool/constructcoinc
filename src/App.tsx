import React, { useState } from "react";
import {
  Calculator,
  DollarSign,
  Percent,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { InputField } from "./components/InputField";
import { ResultField } from "./components/ResultField";
import { calculateResults } from "./utils/calculations";

interface CalculationResult {
  contingencyAmount: number;
  paSharePercent: number;
  paShare: number;
  k9SharePercent: number;
  k9Share: number;
  initialPaSharePercent?: number;
  initialPaShare?: number;
  initialK9Share?: number;
  minimumK9Fee?: number;
}

function App() {
  const [inputs, setInputs] = useState({
    claimAmount: "",
    contingencyPercent: "",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailedSteps, setShowDetailedSteps] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    const claimAmount =
      name === "claimAmount"
        ? parseFloat(value) || 0
        : parseFloat(inputs.claimAmount) || 0;
    const contingencyPercent =
      name === "contingencyPercent"
        ? parseFloat(value) || 0
        : parseFloat(inputs.contingencyPercent) || 0;

    if (claimAmount && contingencyPercent) {
      const fullResult = calculateResults(claimAmount, contingencyPercent);
      setResult({
        contingencyAmount: fullResult.contingencyAmount,
        paSharePercent: fullResult.paSharePercent,
        paShare: fullResult.paShare,
        k9SharePercent: fullResult.k9SharePercent,
        k9Share: fullResult.k9Share,
        initialPaSharePercent: fullResult.initialPaSharePercent,
        initialPaShare: fullResult.initialPaShare,
        initialK9Share: fullResult.initialK9Share,
        minimumK9Fee: fullResult.minimumK9Fee,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/logo.png"
            alt="Company Logo"
            className="w-auto object-contain"
            style={{ height: "200px" }}
          />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Calculator className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Profit Calculator
          </h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <InputField
              label="Claim Amount"
              name="claimAmount"
              value={inputs.claimAmount}
              icon={DollarSign}
              onChange={handleInputChange}
              formatNumber={true}
            />

            <InputField
              label="Contingency Percentage"
              name="contingencyPercent"
              value={inputs.contingencyPercent}
              icon={Percent}
              onChange={handleInputChange}
              step="0.1"
              formatNumber={false}
            />
          </div>

          {result && (
            <>
              <div className="mt-8 space-y-4 p-4 bg-yellow-50 rounded-lg">
                {/* <ResultField
                  label="Contingency Amount"
                  value={result.contingencyAmount}
                />
                <ResultField
                  label="PA Cost %"
                  value={result.paCostPercent}
                  isPercentage
                />
                <ResultField label="PA Cost" value={result.paCost} />
                <ResultField
                  label="Minimum PA Cost"
                  value={result.minimumPaCost}
                /> */}
                <ResultField label="PA Profit" value={result.paShare} />
                <ResultField
                  label="PA Share Percent"
                  value={result.paSharePercent}
                  isPercentage
                />
                {/* <ResultField
                  label="K9 Share Percent"
                  value={result.k9SharePercent}
                  isPercentage
                /> */}
                {/* <ResultField label="K9 Share" value={result.k9Share} /> */}
              </div>

              {/* Detailed calculation steps */}
              <div className="mt-4">
                <button
                  onClick={() => setShowDetailedSteps(!showDetailedSteps)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-700">
                    Show Calculation Steps
                  </span>
                  {showDetailedSteps ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {showDetailedSteps && (
                  <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg text-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Calculation Summary
                    </h3>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">
                        Based on a $
                        {parseFloat(inputs.claimAmount).toLocaleString()} claim
                        settlement with a{" "}
                        {parseFloat(inputs.contingencyPercent)}% contingency
                        fee, the gross payout amount is $
                        {result.contingencyAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        .
                        <br />
                        {result.initialK9Share &&
                        result.minimumK9Fee &&
                        result.initialK9Share < result.minimumK9Fee ? (
                          <>
                            Based on the fee structure, the PA's initial share
                            is {result.initialPaSharePercent}% ($
                            {result.initialPaShare?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            ). Incorporating the minimum $
                            {result.minimumK9Fee.toLocaleString()} K9 fee, the
                            PA's share would be $
                            {result.paShare.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            ($
                            {result.contingencyAmount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            - ${result.minimumK9Fee.toLocaleString()})
                          </>
                        ) : (
                          <>
                            Based on the fee structure, the PA's share is{" "}
                            {result.initialPaSharePercent}% ($
                            {result.initialPaShare?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            ). This results in a final PA share of $
                            {result.paShare.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            and K9 share of $
                            {result.k9Share.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            .
                          </>
                        )}
                      </p>
                    </div>

                    {/* Simple results table */}
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="font-medium text-gray-700">
                          Contingency Amount:
                        </div>
                        <div className="font-semibold text-right">
                          $
                          {result.contingencyAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>

                        <div className="font-medium text-gray-700">
                          PA Share:
                        </div>
                        <div className="font-semibold text-green-700 text-right">
                          $
                          {result.paShare.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          ({result.paSharePercent.toFixed(1)}%)
                        </div>

                        <div className="font-medium text-gray-700">
                          K9 Share:
                        </div>
                        <div className="font-semibold text-blue-700 text-right">
                          $
                          {result.k9Share.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          ({result.k9SharePercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info note about minimum fee */}
              {/* <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-blue-700">
                    The calculated split includes the minimum fee of $2,700 to
                    K9 Public Adjusters when applicable, as part of the total
                    payout distribution.
                  </p>
                </div>
              </div> */}
            </>
          )}
        </div>

        {/* Graph Section with click to enlarge */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Fee Structure Graph
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <img
              src="/assets/pricing-graph.jpg"
              alt="Fee Structure Graph"
              className="w-full h-auto cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
            <p className="text-center text-xs text-gray-500 mt-2">
              Click image to enlarge
            </p>
          </div>
        </div>

        {/* Add disclosure at the bottom of the page */}
        <div className="mt-10 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Disclosure:</h3>
          <p className="text-sm text-gray-600">
            The K9 Public Adjusters payout calculator is for estimation purposes
            only. Actual payouts may vary due to policy terms, carrier
            deductions, additional expenses or other terms and conditions. K9
            Public Adjusters is not liable for discrepancies between estimates
            and final settlements. Public Adjusters should verify all figures
            independently.
          </p>
        </div>
      </div>

      {/* Modal for enlarged image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-5xl bg-white rounded-lg overflow-hidden">
            {/* Header with close button */}
            <div className="flex justify-between items-center bg-gray-100 p-3 border-b">
              <h3 className="font-medium text-gray-800">Fee Structure Graph</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Image container */}
            <div className="p-4 bg-white">
              <img
                src="/assets/pricing-graph.jpg"
                alt="Fee Structure Graph (Enlarged)"
                className="max-w-full max-h-[80vh] object-contain mx-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
