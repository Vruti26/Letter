'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login, type State } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AlertCircle, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LetterDisplay } from '@/components/letter-display';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Unsealing...' : 'Open Letter'}
      <LogIn className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function LoginForm() {
  const initialState: State = { message: null, errors: {}, name: '' };
  const [state, dispatch] = useActionState(login, initialState);
  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);
  const nicknameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.errors && 'credentials' in state.errors) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.errors.credentials,
      });

      if (nicknameInputRef.current) {
        nicknameInputRef.current.value = '';
        nicknameInputRef.current.focus();
      }

      gsap.fromTo(
        formRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.to(formRef.current, { x: 0 });
          },
        }
      );
    }
  }, [state, toast]);

  useEffect(() => {
    const card = formRef.current;
    if (card) {
      gsap.from(card, {
        duration: 1,
        opacity: 0,
        y: 50,
        scale: 0.95,
        ease: 'power3.out',
      });
    }
  }, []);

  if (state.generatedLetter) {
    return <LetterDisplay letterContent={state.generatedLetter} userName={state.name || 'Friend'} />;
  }

  return (
    <form
      ref={formRef}
      action={dispatch}
      className="glass-card z-10 w-full max-w-md p-8 space-y-6"
    >
        {state.userNotFound ? (
            <div className="text-center">
                <h2 className="text-3xl font-headline font-bold text-white">A Letter To You</h2>
                <p className="text-white/80 mt-2">
                    Answer one question, who am I to you?
                </p>
            </div>
        ) : (
            <div className="text-center">
                <h2 className="text-3xl font-headline font-bold text-white">A Letter To You</h2>
                <p className="text-white/80 mt-2">
                Enter your name and nickname (the one I used to call you — or just write your name) to open your letter
                </p>
            </div>
        )}

      {state.userNotFound ? (
        <div className="space-y-4">
            <Input type="hidden" name="name" value={state.name} />
            <div className="space-y-2">
                <Label htmlFor="relationship" className="text-white/90">
                    Who are you to me?
                </Label>
                <Select name="relationship" required>
                    <SelectTrigger className="w-full bg-transparent focus:bg-background/50">
                    <SelectValue placeholder="Select a relationship" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="linkdin connection">LinkedIn Connection</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <SubmitButton />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90">
              Your Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ex. Sane"
              required
              aria-describedby="name-error"
              className="bg-transparent focus:bg-background/50"
              defaultValue={state.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-white/90">
              Your Nickname
            </Label>
            <Input
              ref={nicknameInputRef}
              id="nickname"
              name="nickname"
              type="password"
              placeholder="sanny"
              required
              aria-describedby="nickname-error"
              className="bg-transparent focus:bg-background/50"
            />
          </div>
          <SubmitButton />
        </div>
      )}

      {state.errors && 'credentials' in state.errors && (
        <div className="flex items-center space-x-2 text-sm text-destructive" aria-live="polite">
          <AlertCircle className="h-4 w-4" />
          <p>{state.errors.credentials}</p>
        </div>
      )}
    </form>
  );
}
