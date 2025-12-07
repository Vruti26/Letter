'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import data from './data.json';
import { z } from 'zod';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const { letters } = data;

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
};

export type LogsLoginState = {
  error?: string;
};

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
    const cookieStore = cookies();
    cookieStore.set('logs_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    redirect('/logs');
  } else {
    return { error: 'Incorrect password.' };
  }
}

export async function login(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = LoginSchema.safeParse({
    name: formData.get('name'),
    nickname: formData.get('nickname'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields.',
    };
  }

  const { name, nickname } = validatedFields.data;
  
  const lowercaseFirstName = name.toLowerCase().trim().split(' ')[0] as LetterKeys;
  const trimmedNickname = nickname.toLowerCase().trim();

  const user = letters[lowercaseFirstName];

  if (!user) {
    return {
      errors: { credentials: "You don't have a letter for this name." },
      message: 'User not found.',
    };
  }
  
  let isValidNickname = false;
  const userNicknames = user.nickname;

  if (userNicknames) {
    if (Array.isArray(userNicknames)) {
      isValidNickname = userNicknames.map(n => n.toLowerCase()).includes(trimmedNickname);
    } else if (typeof userNicknames === 'string') {
      isValidNickname = userNicknames.toLowerCase() === trimmedNickname;
    }
  }

  if (isValidNickname) {
    const cookieStore = cookies();
    cookieStore.set('user', lowercaseFirstName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return redirect(`/${lowercaseFirstName}/letter`);
  } else {
    // Provide a hint
    let hint = '';
    if (userNicknames) {
      const firstNickname = Array.isArray(userNicknames) ? userNicknames[0] : userNicknames;
      if (firstNickname) {
        hint = `Hint: Your nickname starts with '${firstNickname.charAt(0).toLowerCase()}'.`;
      }
    }
    return {
      errors: { credentials: `Incorrect nickname. ${hint}` },
      message: 'Invalid nickname.',
    };
  }
}

export async function trackLetterOpen(name: string) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = { name, timestamp };

    const key = `log:${timestamp}:${name}`;

    await redis.set(key, JSON.stringify(logEntry));
    console.log(`💌 Letter for ${name} was opened and logged to Upstash Redis at: ${timestamp}`);
  } catch (error)
  {
    console.error('Failed to log letter opening to Upstash Redis:', error);
  }
}
