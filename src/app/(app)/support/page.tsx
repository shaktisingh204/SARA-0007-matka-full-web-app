import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Clock } from 'lucide-react';

export default function SupportPage() {
    return (
        <div className="container p-4 pb-24 md:p-6 lg:p-8 space-y-6 max-w-lg mx-auto">
            <div>
                <h1 className="text-2xl font-bold mb-2">Support & Help</h1>
                <p className="text-muted-foreground">
                    Need assistance? Our support team is here to help you.
                </p>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Contact Support</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">Phone / WhatsApp</p>
                        <p className="text-xl font-bold mt-1">+91 99999 99999</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Email Support</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">Email Address</p>
                        <p className="font-bold mt-1 text-primary">support@matkacalc.com</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Business Hours</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Our support team is available from 10:00 AM to 10:00 PM (IST), Monday through Sunday.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
