import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <div className="flex flex-col items-center max-w-md w-full bg-card rounded-xl p-8 shadow-sm border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                    <FileQuestion className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-2">404 - Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Button asChild className="w-full">
                    <Link href="/dashboard">Return Home</Link>
                </Button>
            </div>
        </div>
    );
}
