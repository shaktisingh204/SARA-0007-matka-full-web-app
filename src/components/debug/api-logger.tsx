
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogStore } from '@/lib/store';
import { X, Terminal } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function ApiLogger() {
  const { logs, clearLogs, isOpen, toggle } = useLogStore();

  if (!isOpen) {
    return (
       <Button
        onClick={toggle}
        className="fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        <Terminal className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-full max-w-md shadow-2xl">
      <Collapsible defaultOpen>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Terminal className="h-5 w-5" />
              <CardTitle className="text-lg">API Log</CardTitle>
            </div>
          </CollapsibleTrigger>
          <div className="flex items-center gap-2">
             <Button onClick={clearLogs} variant="ghost" size="sm">
              Clear
            </Button>
            <Button onClick={toggle} variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0 max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No API calls logged yet.</p>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="font-semibold text-sm">{log.title}</h4>
                    <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
                      <code>{JSON.stringify(log.data, null, 2)}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
