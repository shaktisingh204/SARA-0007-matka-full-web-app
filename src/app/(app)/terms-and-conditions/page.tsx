
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground">
          Last updated: July 30, 2024
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            By using our application, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, do not use the application.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            You must be at least 18 years old to create an account and use our services. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Prohibited Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            You may not access or use the application for any purpose other than that for which we make the application available. Prohibited activity includes, but is not limited to: criminal or tortious activity, fraud, and transmitting viruses or other harmful material.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
