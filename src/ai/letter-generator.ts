
import { defineTool } from '@genkit-ai/ai';
import { z } from 'zod';

export const letterGenerator = defineTool(
  {
    name: 'letterGenerator',
    description: 'Generates a personalized letter based on the relationship.',
    inputSchema: z.object({
      name: z.string(),
      relationship: z.string(),
    }),
    outputSchema: z.object({
      letter: z.string(),
    }),
  },
  async ({ name, relationship }) => {
    // This is where you would call your AI model to generate the letter.
    // For now, we'll just return a static string.
    return {
      letter: `Hi ${name}, you are a great ${relationship}!`,
    };
  }
);
