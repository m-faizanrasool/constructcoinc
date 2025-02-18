import React, { useState } from "react";
import { Calculator, DollarSign, Percent } from "lucide-react";
import { InputField } from "./components/InputField";
import { ResultField } from "./components/ResultField";
import { calculateResults } from "./utils/calculations";

interface CalculationResult {
  paProfit: number;
  paPercentage: number;
  paCostPercent: number;
  contingencyAmount: number;
  paCost: number;
  minimumPaCost: number;
}

function App() {
  const [inputs, setInputs] = useState({
    claimAmount: "",
    contingencyPercent: "",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

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
        paProfit: fullResult.paProfit,
        paPercentage: fullResult.paPercentage,
        paCostPercent: fullResult.paCostPercent,
        contingencyAmount: fullResult.contingencyAmount,
        paCost: fullResult.paCost,
        minimumPaCost: fullResult.minimumPaCost,
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
              <ResultField label="PA Profit" value={result.paProfit} />
              <ResultField
                label="PA Percentage"
                value={result.paPercentage}
                isPercentage
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
