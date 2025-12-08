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
    console.log("Fetching logs...");

    // --- Fetch from new sorted set format ---
    const newLogEntries: string[] = await redis.zrange('logs', 0, -1, { rev: true });
    const newLogs: LogEntry[] = newLogEntries.map((entry) => JSON.parse(entry));
    console.log(`Found ${newLogs.length} logs in the new format.`);

    // --- Fetch from old key format using SCAN for safety ---
    console.log("Scanning for old log keys...");
    const oldLogKeys: string[] = [];
    let cursor = 0;
    do {
      const [nextCursor, keys] = await redis.scan(cursor, { match: 'log:*', count: 100 });
      cursor = nextCursor;
      oldLogKeys.push(...keys);
    } while (cursor !== 0);
    console.log(`Found ${oldLogKeys.length} old log keys.`);

    let oldLogs: LogEntry[] = [];
    if (oldLogKeys.length > 0) {
      console.log("Fetching old log items...");
      // Use mget in batches to avoid hitting command size limits
      const batchSize = 100;
      for (let i = 0; i < oldLogKeys.length; i += batchSize) {
        const batchKeys = oldLogKeys.slice(i, i + batchSize);
        const items: (string | null)[] = await redis.mget(...batchKeys);
        const parsedItems = items
          .filter((item): item is string => item !== null)
          .map((item) => {
            try {
              return JSON.parse(item);
            } catch (e) {
              console.error('Failed to parse old log item:', item);
              return null;
            }
          })
          .filter((log): log is LogEntry => log !== null);
        oldLogs.push(...parsedItems);
      }
      console.log(`Successfully parsed ${oldLogs.length} old log entries.`);
    }

    // --- Combine and de-duplicate logs ---
    const allLogs = [...newLogs, ...oldLogs];
    console.log(`Total logs before de-duplication: ${allLogs.length}`);
    const uniqueLogs = Array.from(new Map(allLogs.map(log => [log.timestamp, log])).values());
    console.log(`Total logs after de-duplication: ${uniqueLogs.length}`);

    // Sort logs by timestamp, newest first
    uniqueLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    console.log("Log fetching complete.");
    return uniqueLogs;

  } catch (error) {
    console.error("A critical error occurred while fetching logs:", error);
    return []; // Return an empty array on error
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
