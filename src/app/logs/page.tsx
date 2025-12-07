import { Redis } from '@upstash/redis';
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
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const keys = await redis.keys('log:*');
    if (keys.length === 0) {
      return [];
    }
    const items: (string | null)[] = await redis.mget(...keys);

    const logs: LogEntry[] = items
      .filter((item): item is string => item !== null)
      .map((item) => JSON.parse(item));

    // Sort logs by timestamp, newest first
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return logs;
  } catch (error) {
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
