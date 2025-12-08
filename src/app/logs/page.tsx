import { redis } from '@/lib/redis';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

type LogEntry = {
  name: string;
  timestamp: string;
};

async function getLogs() {
  try {
    // Fetch all logs from the sorted set, newest first
    const logEntries: string[] = await redis.zrange('logs', 0, -1, {
      rev: true, // newest first
    });

    if (logEntries.length === 0) {
      return [];
    }

    const logs: LogEntry[] = logEntries.map((entry) => JSON.parse(entry));

    return logs;
  } catch (error) {
    // If there is an error, we will log it and return an empty array
    // This is better than throwing an error, which would crash the page.
    console.error("Failed to fetch logs:", error);
    return [];
  }
}

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 pt-12">
      <div className="w-full max-w-3xl glass-card p-6">
        <h1 className="text-3xl font-headline font-bold text-primary mb-6 text-center">
          Letter Opening Log
        </h1>
        <Table>
          <TableCaption>A log of every time a letter has been opened.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Who</TableHead>
              <TableHead>When</TableHead>
              <TableHead className="text-right">Full Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.timestamp}>
                  <TableCell className="font-medium capitalize">{log.name}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No letters have been opened yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
