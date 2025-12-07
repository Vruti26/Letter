'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginToLogs, type LogsLoginState } from '@/lib/actions';
import { KeyRound, AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Verifying...' : 'Unlock Logs'}
      <KeyRound className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function LogsLoginPage() {
  const initialState: LogsLoginState = { error: undefined };
  const [state, dispatch] = useActionState(loginToLogs, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-indigo-950/20 to-background p-4">
      <form action={dispatch} className="glass-card z-10 w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold text-primary">Access Logs</h2>
          <p className="text-white/80 mt-2">
            This area is protected. Please enter the password to continue.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/90">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-transparent focus:bg-background/50"
          />
        </div>

        <SubmitButton />

        {state?.error && (
          <div
            className="flex items-center space-x-2 text-sm text-destructive-foreground bg-destructive/80 p-3 rounded-md"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4" />
            <p>{state.error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
