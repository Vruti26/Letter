'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const p = pRef.current;
    const button = buttonRef.current;
    const container = containerRef.current;

    if (!title || !p || !button || !container) return;

    // Split title into characters
    const chars = title.innerText.split('').map((char) => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      return span;
    });
    title.innerHTML = '';
    title.append(...chars);
    
    gsap.set(container, { autoAlpha: 1 });
    const tl = gsap.timeline();

    tl.from(chars, {
      y: 100,
      opacity: 0,
      stagger: 0.03,
      duration: 1,
      ease: 'power3.out',
    })
    .from(p, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, "-=0.5")
    .from(button, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, "-=0.6");
  }, []);

  return (
    <div ref={containerRef} className="text-center invisible">
      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-accent to-white mb-6"
      >
        A Letter For You
      </h1>
      <p ref={pRef} className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10">
      Something I never mentioned before, something small but meaningful to me… sharing it feels easier.
      </p>
      <Button asChild size="lg" ref={buttonRef} className="group">
        <Link href="/login">
          Open Your Letter
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
