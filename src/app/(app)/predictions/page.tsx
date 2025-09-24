

import { PredictionClient } from "@/components/predictions/prediction-client";

export default function PredictionsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Number Prediction
        </h1>
        <p className="text-muted-foreground">
          Leverage our proprietary algorithm to get number predictions.
        </p>
      </div>
      <PredictionClient />
    </div>
  );
}
