import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import data from '@/lib/data.json';
import { LetterDisplay } from '@/components/letter-display';
import type { Metadata } from 'next';
import { trackLetterOpen } from '@/lib/actions'; // 

type LetterKeys = keyof typeof data.letters;

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const name = params.name.charAt(0).toUpperCase() + params.name.slice(1);
  return {
    title: `A Letter for ${name}`,
  };
}

export default function LetterPage({ params }: { params: { name: string } }) {
  const userCookie = cookies().get('user');
  const loggedInUser = userCookie?.value;
  const requestedUser = params.name.toLowerCase() as LetterKeys;
  
  const user = data.letters[requestedUser];

  // 1. Check if a letter exists for the requested user.
  // 2. Check if a user is logged in.
  // 3. Check if the logged-in user matches the requested user.
  if (!user || !loggedInUser || loggedInUser !== requestedUser) {
    // If any check fails, redirect to login. This is more user-friendly than a 404
    // as they might just need to log in to see the content.
    redirect('/login');
  }

  // After successful validation, track the letter opening.
  trackLetterOpen(params.name); // 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background via-indigo-950/50 to-background">
      <LetterDisplay letterContent={user.letter} userName={params.name} />
    </main>
  );
}
