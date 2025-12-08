'use client';

import { LetterDisplay } from "@/components/letter-display";

export function GeneratedLetter({ letterContent, userName }: { letterContent: string, userName: string }) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <LetterDisplay letterContent={letterContent} userName={userName} />
        </div>
    );
}