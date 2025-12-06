'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import data from './data.json';
import { z } from 'zod';

const { letters } = data;

// Define a type for the keys of the letters object for type safety
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
  const lowercaseName = name.toLowerCase().trim() as LetterKeys;
  const trimmedNickname = nickname.toLowerCase().trim();

  const user = letters[lowercaseName];

  let isValidNickname = false;
  if (user && user.nickname) {
    if (Array.isArray(user.nickname)) {
      isValidNickname = user.nickname.map(n => n.toLowerCase()).includes(trimmedNickname);
    } else if (typeof user.nickname === 'string') {
      isValidNickname = user.nickname.toLowerCase() === trimmedNickname;
    }
  }

  if (user && isValidNickname) {
    cookies().set('user', lowercaseName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect(`/${lowercaseName}/letter`);
  } else {
    return {
      errors: { credentials: "The name or nickname you entered is incorrect. Please try again." },
      message: 'Invalid credentials.',
    };
  }
}
