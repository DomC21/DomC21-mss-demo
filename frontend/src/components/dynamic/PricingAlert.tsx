import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockCapacityData } from '@/mocks/data';

export function PricingAlert() {
  const { currentCapacity, surgeMultiplier, discountMultiplier } = mockCapacityData;

  if (currentCapacity < 20) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertTitle className="text-red-800 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          High-Demand Pricing
        </AlertTitle>
        <AlertDescription className="text-red-700">
          Availability is below 20%. A {((surgeMultiplier - 1) * 100).toFixed(0)}% surge price has been applied.
        </AlertDescription>
      </Alert>
    );
  }

  if (currentCapacity > 50) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertTitle className="text-green-800 flex items-center gap-2">
          <TrendingDown className="h-4 w-4" />
          Special Discount
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Availability is above 50%. A {((1 - discountMultiplier) * 100).toFixed(0)}% discount has been applied.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
