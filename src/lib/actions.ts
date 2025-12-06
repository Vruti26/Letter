'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import data from './data.json';
import { z } from 'zod';
import { kv } from '@vercel/kv';

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
  if (user.nickname) {
    if (Array.isArray(user.nickname)) {
      isValidNickname = user.nickname.map(n => n.toLowerCase()).includes(trimmedNickname);
    } else if (typeof user.nickname === 'string') {
      isValidNickname = user.nickname.toLowerCase() === trimmedNickname;
    }
  }

  if (isValidNickname) {
    cookies().set('user', lowercaseFirstName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect(`/${lowercaseFirstName}/letter`);
  } else {
    // Provide a hint
    let hint = '';
    if (user.nickname) {
      const firstNickname = Array.isArray(user.nickname) ? user.nickname[0] : user.nickname;
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

    await kv.set(key, JSON.stringify(logEntry));
    console.log(`💌 Letter for ${name} was opened and logged to Vercel KV at: ${timestamp}`);
  } catch (error) {
    console.error('Failed to log letter opening to Vercel KV:', error);
  }
}
