'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getPredictions } from '@/app/actions/predictions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { games } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Predict Numbers
        </>
      )}
    </Button>
  );
}

export function PredictionClient() {
  const initialState = {};
  const [state, dispatch] = useFormState(getPredictions, initialState);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generate Predictions</CardTitle>
          <CardDescription>
            Select a game and provide past results to get AI-powered predictions.
          </CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameType">Game Type</Label>
              <Select name="gameType" required>
                <SelectTrigger id="gameType">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.name}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pastResults">Past Results (Optional)</Label>
              <Textarea
                id="pastResults"
                name="pastResults"
                placeholder="Enter past results, e.g., 123-6, 456-5..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <div className="flex items-center justify-center">
        {state.predictions ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-headline text-center">Prediction Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-around text-center">
                    {state.predictions.map((num, index) => (
                        <div key={index}>
                            <p className="text-sm text-muted-foreground">Prediction {index + 1}</p>
                            <p className="font-headline text-5xl font-bold text-primary">{String(num).padStart(2, '0')}</p>
                        </div>
                    ))}
                </div>
                {state.confidence !== undefined && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Confidence</span>
                            <span className="text-muted-foreground">{Math.round(state.confidence * 100)}%</span>
                        </div>
                        <Progress value={state.confidence * 100} />
                    </div>
                )}
            </CardContent>
          </Card>
        ) : state.error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-center text-muted-foreground">
            <Sparkles className="mx-auto h-12 w-12" />
            <p className="mt-4">Your predictions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
