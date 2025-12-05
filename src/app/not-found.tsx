import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedNotFound } from '@/components/animated-not-found';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 overflow-hidden">
      <AnimatedNotFound />
      <h1 className="mt-8 text-4xl md:text-6xl font-headline font-bold text-primary">
        Letter Not Found
      </h1>
      <p className="mt-4 text-lg text-foreground/80">
        The page you are looking for might have been lost in the mail.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return to Sender</Link>
      </Button>
    </div>
  );
}
