'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import data from './data.json';
import { z } from 'zod';
import { redis } from '@/lib/redis'; // ← using shared redis client

const letters: LettersRecord = data.letters;
type LetterData = {
  nickname: string | string[];
  letter: string;
};

type LettersRecord = Record<string, LetterData>;
type LetterKeys = keyof typeof letters;

const LoginSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  nickname: z.string().min(1, { message: 'Nickname is required.' }),
});

export type State = {
  errors?: {
    name?: string[];
    nickname?: string[];
    credentials?: string;
  };
  message?: string | null;
  name?: string;
  userNotFound?: boolean;
  generatedLetter?: string;
};

export type LogsLoginState = {
  error?: string;
};

/* ---------------------- LOGS LOGIN ---------------------- */

export async function loginToLogs(
  prevState: LogsLoginState,
  formData: FormData
): Promise<LogsLoginState> {
  const password = formData.get('password');
  const logsPassword = process.env.LOGS_PASSWORD;

  if (!logsPassword) {
    console.error('LOGS_PASSWORD environment variable not set.');
    return { error: 'Server configuration error.' };
  }

  if (password === logsPassword) {
    const cookieStore = await cookies(); // FIXED
    cookieStore.set('logs_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
    });
    redirect('/logs');
  } else {
    return { error: 'Incorrect password.' };
  }
}

/* ---------------------- MAIN LETTER LOGIN ---------------------- */

export async function login(prevState: State, formData: FormData): Promise<State> {
  const name = formData.get('name') as string;
  const relationship = formData.get('relationship') as string | null;

  if (relationship) {
    const staticLetters: Record<string, string> = {
      friend: `Hey!\n\nI genuinely appreciate having you as a friend.Hope your day moves smoothly and gives you at least a few reasons to smile.`,
  
      family: `Namaste,\n\nSeeing your name always brings a sense of warmth. You're an important part of my life, and I value the bond we share. No matter how busy life gets, knowing you're around adds a sense of stability. I hope this message reaches you in good spirits and good health.`,
  
      colleague: `Hey,\n\nIt was nice hearing from you. Working with you has always been easy and productive. You bring clarity and effort into every task, and that makes a real difference. Looking forward to more smooth teamwork and good results ahead. Hope your day is going well.`,
  
      teacher: `Hi,\n\nIt’s always meaningful to come across your name. I still remember the clarity and patience with which you taught, and it continues to influence the way I think and work. Thank you for guiding me in ways that still matter today. I hope you’re doing well and staying inspired.`,
  
      "linkdin connection": `Hi ${name},\n\nThanks for connecting here. I've been noticing your updates and the work you’ve been doing—it's genuinely impressive. It’s always nice to come across people who are consistent and passionate about what they do. Looking forward to staying connected and learning from your journey.`
  };
    const letter = staticLetters[relationship] || `Hello ${name}, thanks for reaching out.`

    return {
        name,
        generatedLetter: letter,
    }
  }

  const validatedFields = LoginSchema.safeParse({
    name: formData.get('name'),
    nickname: formData.get('nickname'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields.',
      name: formData.get('name')?.toString(),
    };
  }

  const { nickname } = validatedFields.data;

  const lowercaseFirstName =
    name.toLowerCase().trim().split(' ')[0] as keyof typeof letters;

  const trimmedNickname = nickname.toLowerCase().trim();

  const user = letters[lowercaseFirstName];

  if (!user) {
    return {
      name,
      userNotFound: true,
    };
  }

  /* ------------ NICKNAME CHECK ------------ */
  let isValidNickname = false;
  const userNicknames = user.nickname;

  if (userNicknames) {
    if (Array.isArray(userNicknames)) {
      isValidNickname = userNicknames
        .map((n: string) => n.toLowerCase()) // FIXED TS
        .includes(trimmedNickname);
    } else if (typeof userNicknames === 'string') {
      isValidNickname = userNicknames.toLowerCase() === trimmedNickname;
    }
  }

  /* ------------ SUCCESS LOGIN ------------ */
  if (isValidNickname) {
    const cookieStore = await cookies(); // FIXED
    cookieStore.set('user', lowercaseFirstName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    redirect(`/${lowercaseFirstName}/letter`);
  }

  /* ------------ WRONG NICKNAME (HINT) ------------ */
  let hint = '';

  if (userNicknames) {
    const first =
      Array.isArray(userNicknames) ? userNicknames[0] : userNicknames;

    if (first) {
      if (first.length > 2) {
        const firstChar = first.charAt(0).toLowerCase();
        const lastChar = first.charAt(first.length - 1).toLowerCase();
        const dots = '.'.repeat(first.length - 2);
        hint = `Hint: Your nickname is like '${firstChar}${dots}${lastChar}'.`;
      } else {
        hint = `Hint: Your nickname starts with '${first.charAt(0).toLowerCase()}'.`;
      }
    }
  }

  return {
    errors: { credentials: `Incorrect nickname. ${hint}` },
    message: 'Invalid nickname.',
    name,
  };
}

/* ---------------------- REDIS TRACKING ---------------------- */

export async function trackLetterOpen(name: string) {
  try {
    const timestamp = Date.now();
    const logEntry = { name, timestamp: new Date(timestamp).toISOString() };

    // Use a sorted set 'logs' with timestamp as score
    await redis.zadd('logs', {
      score: timestamp,
      member: JSON.stringify(logEntry),
    });

    console.log(`💌 Letter for ${name} was opened at ${new Date(timestamp).toISOString()}`);
  } catch (error) {
    console.error('Failed to log letter opening to Upstash Redis:', error);
  }
}
