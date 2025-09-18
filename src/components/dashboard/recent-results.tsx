import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { results } from "@/lib/data";

export function RecentResults() {
  const recentResults = results.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead className="text-center">Open</TableHead>
              <TableHead className="text-center">Jodi</TableHead>
              <TableHead className="text-right">Close</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-medium">{result.gameName}</TableCell>
                <TableCell className="text-center">
                  <span className="font-mono">{result.openPana}</span>
                  <span className="font-bold text-primary">-{result.openSingle}</span>
                </TableCell>
                <TableCell className="text-center font-bold font-mono text-lg text-accent">{result.jodi}</TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-primary">{result.closeSingle}-</span>
                  <span className="font-mono">{result.closePana}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
