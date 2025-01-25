import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users } from 'lucide-react';
import { mockCapacityData } from '@/mocks/data';

export function ResourceSuggestion() {
  const { recommendedTeam, recommendationReason } = mockCapacityData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-5 w-5 text-purple-500" />
          AI-Powered Team Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
              <div className="font-medium">Recommended Team</div>
              <div className="text-sm text-muted-foreground mt-1">
                {recommendedTeam.join(', ')}
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
            {recommendationReason}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
