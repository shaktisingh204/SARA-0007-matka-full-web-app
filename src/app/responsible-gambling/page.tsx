

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResponsibleGamblingPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Responsible Gambling
        </h1>
        <p className="text-muted-foreground">
          Play responsibly and within your limits.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Our Commitment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Sara999 is committed to responsible gaming, and we encourage our players to enjoy our games in a safe and responsible manner. Gambling should be an enjoyable pastime, not a way to make money.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Keeping Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We want you to stay in control of your gambling. We recommend that you:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Gamble for entertainment and not as a source of income.</li>
            <li>Only gamble with money you can afford to lose.</li>
            <li>Never chase your losses.</li>
            <li>Keep track of the time and amount of money you spend gambling.</li>
            <li>If you need help, use the self-exclusion tools available or contact customer support.</li>
          </ul>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            If you feel you might have a gambling problem, or if you're concerned about a friend or family member, there are several organizations that can provide free and confidential advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
