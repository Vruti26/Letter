"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import data from "./data.json";
import { z } from "zod";
import { redis } from "@/lib/redis"; // ← using shared redis client

const letters: LettersRecord = data.letters;
type LetterData = {
  nickname: string | string[];
  letter: string;
};

type LettersRecord = Record<string, LetterData>;
type LetterKeys = keyof typeof letters;

const LoginSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  nickname: z.string().min(1, { message: "Nickname is required." }),
});

export type State = {
  errors?: {
    name?: string[];
    nickname?: string[];
    credentials?: string;
  };
  message?: string | null;
  name?: string;
};

export type LogsLoginState = {
  error?: string;
};

/* ---------------------- LOGS LOGIN ---------------------- */

export async function loginToLogs(
  prevState: LogsLoginState,
  formData: FormData
): Promise<LogsLoginState> {
  const password = formData.get("password");
  const logsPassword = process.env.LOGS_PASSWORD;

  if (!logsPassword) {
    console.error("LOGS_PASSWORD environment variable not set.");
    return { error: "Server configuration error." };
  }

  if (password === logsPassword) {
    const cookieStore = await cookies(); // FIXED
    cookieStore.set("logs_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
    });
    redirect("/logs");
  } else {
    return { error: "Incorrect password." };
  }
}

/* ---------------------- MAIN LETTER LOGIN ---------------------- */

export async function login(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = LoginSchema.safeParse({
    name: formData.get("name"),
    nickname: formData.get("nickname"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields.",
      name: formData.get("name")?.toString(),
    };
  }

  const { name, nickname } = validatedFields.data;

  const lowercaseFirstName =
    name.toLowerCase().trim().split(" ")[0] as keyof typeof letters;

  const trimmedNickname = nickname.toLowerCase().trim();

  const user = letters[lowercaseFirstName];

  if (!user) {
    return {
      errors: { credentials: "You don't have a letter for this name." },
      message: "User not found.",
      name,
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
    } else if (typeof userNicknames === "string") {
      isValidNickname = userNicknames.toLowerCase() === trimmedNickname;
    }
  }

  /* ------------ SUCCESS LOGIN ------------ */
  if (isValidNickname) {
    const cookieStore = await cookies(); // FIXED
    cookieStore.set("user", lowercaseFirstName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    redirect(`/${lowercaseFirstName}/letter`);
  }

  /* ------------ WRONG NICKNAME (HINT) ------------ */
  let hint = "";

  if (userNicknames) {
    const first =
      Array.isArray(userNicknames) ? userNicknames[0] : userNicknames;

    if (first) {
      if (first.length > 2) {
        const firstChar = first.charAt(0).toLowerCase();
        const lastChar = first.charAt(first.length - 1).toLowerCase();
        const dots = ".".repeat(first.length - 2);
        hint = `Hint: Your nickname is like '${firstChar}${dots}${lastChar}'.`;
      } else {
        hint = `Hint: Your nickname starts with '${first.charAt(0).toLowerCase()}'.`;
      }
    }
  }

  return {
    errors: { credentials: `Incorrect nickname. ${hint}` },
    message: "Invalid nickname.",
    name,
  };
}

/* ---------------------- REDIS TRACKING ---------------------- */

export async function trackLetterOpen(name: string) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = { name, timestamp };
    const key = `log:${timestamp}:${name}`;

    await redis.set(key, JSON.stringify(logEntry));

    console.log(`💌 Letter for ${name} was opened at ${timestamp}`);
  } catch (error) {
    console.error("Failed to log letter opening to Upstash Redis:", error);
  }
}
