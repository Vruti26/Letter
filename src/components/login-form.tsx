'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, type State } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AlertCircle, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Unsealing...' : 'Open Letter'}
      <LogIn />
    </Button>
  );
}

export function LoginForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(login, initialState);
  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.errors?.credentials) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.errors.credentials,
      });

      gsap.fromTo(
        formRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power1.inOut',
          onComplete: () => gsap.to(formRef.current, { x: 0 }),
        }
      );
    }
  }, [state, toast]);

  useEffect(() => {
    const card = formRef.current;
    const bg = document.getElementById('parallax-bg');

    if (card) {
      gsap.from(card, {
        duration: 1,
        opacity: 0,
        y: 50,
        scale: 0.95,
        ease: 'power3.out',
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!bg) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      gsap.to(bg, {
        x: -x * 30,
        y: -y * 30,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <form
      ref={formRef}
      action={dispatch}
      className="glass-card z-10 w-full max-w-md p-8 space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-headline font-bold text-white">Secret Letter</h2>
        <p className="text-white/80 mt-2">
          Enter your name and nickname to reveal your message.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/90">
            Your Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            aria-describedby="name-error"
            className="bg-transparent focus:bg-background/50"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-destructive" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-white/90">
            Your Nickname
          </Label>
          <Input
            id="nickname"
            name="nickname"
            type="password"
            required
            aria-describedby="nickname-error"
            className="bg-transparent focus:bg-background/50"
          />
          <div id="nickname-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nickname &&
              state.errors.nickname.map((error: string) => (
                <p className="mt-2 text-sm text-destructive" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      
      <SubmitButton />

      {state.errors?.credentials && (
        <div className="flex items-center space-x-2 text-sm text-destructive" aria-live="polite">
          <AlertCircle className="h-4 w-4" />
          <p>{state.errors.credentials}</p>
        </div>
      )}
    </form>
  );
}
