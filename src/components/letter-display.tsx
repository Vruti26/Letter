'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/button';

export function LetterDisplay({ letterContent, userName }: { letterContent: string; userName: string }) {
  const [isOpened, setIsOpened] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openEnvelope = () => {
    if (isOpened || !envelopeRef.current || !flapRef.current || !letterRef.current || !contentRef.current) return;

    setIsOpened(true);
    const tl = gsap.timeline();

    tl.to(flapRef.current, {
      duration: 1,
      rotationX: 180,
      ease: 'power2.inOut',
    })
    .to(letterRef.current, {
      duration: 1,
      y: '-80%',
      ease: 'power3.out',
    }, '-=0.5')
    .to(envelopeRef.current, {
        duration: 0.7,
        opacity: 0,
        scale: 0.8,
        ease: 'power2.in',
    }, '+=0.2')
    .set(envelopeRef.current, { display: 'none' })
    .fromTo(contentRef.current, 
      { display: 'none', opacity: 0, y: 50 },
      {
        display: 'block',
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }
    );
  };

  useEffect(() => {
    gsap.fromTo(
      envelopeRef.current,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div
        ref={envelopeRef}
        className="relative w-full aspect-[1.5/1] cursor-pointer"
        onClick={openEnvelope}
        role="button"
        
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openEnvelope()}
        aria-label="Open the letter"
      >
        <div className="absolute inset-0 bg-secondary rounded-lg shadow-2xl shadow-primary/20 border border-white/30"></div>
        {/* Flap */}
        <div
          ref={flapRef}
          className="absolute top-0 left-0 w-full h-1/2"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center',
          }}
        >
          <div className="absolute inset-0 bg-accent border-b border-white/50" style={{
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}></div>
        </div>
        {/* Letter inside */}
        <div ref={letterRef} className="absolute top-[5%] left-[5%] w-[90%] h-[90%] bg-card p-4 rounded-sm shadow-inner transition-transform duration-1000">
             <div className="w-full h-full border border-dashed border-muted-foreground/30 flex items-center justify-center">
                 <p className="font-headline text-2xl text-muted-foreground/50">For {userName.charAt(0).toUpperCase() + userName.slice(1)}</p>
            </div>
        </div>
        {/* Envelope body */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-secondary border-t border-white/30" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}></div>
          <div className="absolute top-0 left-0 w-1/2 h-full bg-secondary/80 border-r border-white/30" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/80 border-l border-white/30" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
             <p className="text-xl text-white font-semibold opacity-90">Click to open</p>
        </div>
      </div>

      <div
        ref={contentRef}
        className="hidden p-8 sm:p-12 bg-card/80 backdrop-blur-md rounded-lg shadow-2xl shadow-accent/10 border border-border"
      >
        <h2 className="font-headline text-3xl text-primary mb-6">
          Dear {userName.charAt(0).toUpperCase() + userName.slice(1)},
        </h2>
        <p className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
          {letterContent}
        </p>
        <Button asChild className="mt-8">
            <a href="/">Close Letter</a>
        </Button>
      </div>
    </div>
  );
}
