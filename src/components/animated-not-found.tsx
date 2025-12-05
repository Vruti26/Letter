'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function AnimatedNotFound() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const tear = svg.querySelector('#tear');
    const letter = svg.querySelector('#letter');
    const envelope = svg.querySelector('#envelope');

    gsap.set([tear, letter, envelope], { autoAlpha: 0 });
    gsap.set(tear, { y: -20 });
    gsap.set(letter, { y: 10 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    tl.to(envelope, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' })
      .to(letter, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
      .to(tear, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.in' })
      .to(tear, {
        rotation: -20,
        x: -10,
        y: 40,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out'
      })
      .to([letter, envelope], {
        delay: 1,
        autoAlpha: 0,
        duration: 0.5,
      });

  }, []);

  return (
    <div className="w-48 h-48">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="envelope" fill="none" stroke="hsl(var(--primary))" strokeWidth="2">
          <path d="M10 30 L50 60 L90 30 L10 30 Z" />
          <path d="M10 30 L10 70 L90 70 L90 30" />
        </g>
        <g id="letter" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="1.5">
          <rect x="20" y="20" width="60" height="40" rx="2" />
          <path d="M30 35 h40 M30 45 h20" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        </g>
        <g id="tear" fill="hsl(var(--accent))">
          <path d="M45 50 Q 50 40 55 50 Q 60 60 50 70 Q 40 60 45 50 Z" />
        </g>
      </svg>
    </div>
  );
}
