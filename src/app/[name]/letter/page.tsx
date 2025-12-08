import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import data from '@/lib/data.json';
import { LetterDisplay } from '@/components/letter-display';
import type { Metadata } from 'next';
import { trackLetterOpen } from '@/lib/actions';

type LetterKeys = keyof typeof data.letters;

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const name = params.name.charAt(0).toUpperCase() + params.name.slice(1);
  return {
    title: `A Letter for ${name}`,
  };
}

export default function LetterPage({ params }: { params: { name: string } }) {
  const requestedUser = params.name.toLowerCase() as LetterKeys;
  const user = data.letters[requestedUser];

  // If a letter does not exist for the requested user, render a 404 page.
  // This check is crucial to prevent build errors when an invalid user is accessed.
  if (!user) {
    notFound();
  }

  const userCookie = cookies().get('user');
  const loggedInUser = userCookie?.value;

  // If the user is not logged in or is trying to access someone else's letter,
  // redirect them to the login page.
  if (!loggedInUser || loggedInUser !== requestedUser) {
    redirect('/login');
  }

  // After successful validation, track the letter opening.
  trackLetterOpen(params.name);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background via-indigo-950/50 to-background">
      <LetterDisplay letterContent={user.letter} userName={params.name} />
    </main>
  );
}
