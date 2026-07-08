'use client';

import {useEffect, useRef, useState} from 'react';
import type {Slide} from '@/lib/types';
import {localize} from '@/lib/localize';
import {SCENES} from '@/components/illustrations/scenes';

/**
 * Illustration slider (prototype `.slider`). Autoplays every 6s, pauses on
 * hover, supports touch swipe and dot navigation, and honours
 * prefers-reduced-motion (no autoplay).
 */
export default function Slider({
  slides,
  locale,
  note
}: {
  slides: Slide[];
  locale: string;
  note: string;
}) {
  const [current, setCurrent] = useState(0);
  const touchX = useRef<number | null>(null);
  const paused = useRef(false);

  const go = (n: number) => setCurrent((n + slides.length) % slides.length);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || slides.length < 2) return;

    const id = setInterval(() => {
      if (!paused.current) setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-md border border-ligne bg-indigo"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <div
          className="flex transition-transform duration-[600ms] ease-in-out"
          style={{transform: `translateX(-${current * 100}%)`}}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          {slides.map((slide, i) => (
            <figure key={i} className="relative m-0 min-w-full">
              <div
                className="[&>svg]:block [&>svg]:h-[clamp(190px,32vw,370px)] [&>svg]:w-full"
                dangerouslySetInnerHTML={{__html: SCENES[slide.scene]}}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(20,28,66,0.78)] to-transparent px-6 pb-[15px] pt-[38px] font-serif text-[16.5px] text-white">
                {localize(slide.caption, locale)}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="absolute bottom-[13px] right-[17px] flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2.5 w-2.5 rounded-full ${
                i === current ? 'bg-white' : 'bg-white/45'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-[12px] italic text-gris">{note}</p>
    </div>
  );
}
