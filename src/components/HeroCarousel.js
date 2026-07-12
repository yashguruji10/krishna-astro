'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import LazyImage from './LazyImage';

export default function HeroCarousel({ slides, locale }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] max-h-[560px] overflow-hidden bg-maroon">
      {slides.map((slide, i) => {
        const caption = slide.caption?.[locale] || slide.caption?.en;
        const isActive = i === index;
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {slide.image && (
              <>
                {/* Blurred full-bleed backdrop — fills the frame on any
                    screen size regardless of the uploaded image's aspect
                    ratio, so there's never an empty gap. */}
                <div className={`absolute inset-0 overflow-hidden ${isActive ? 'animate-kenburns-bg' : ''}`}>
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    aria-hidden="true"
                    sizes="100vw"
                    className="object-cover scale-125 blur-2xl brightness-[0.5] saturate-150"
                  />
                </div>
                {/* Sharp foreground image, always shown in full —
                    never cropped, so text/logos baked into banner
                    images (like ad graphics) stay fully readable. */}
                <div className="absolute inset-0">
                  <LazyImage
                    src={slide.image}
                    alt={caption || `Slide ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={i === 0}
                  />
                </div>
              </>
            )}
            {/* Gradient overlay for caption legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />
            {/* Caption */}
            {caption && (
              <div className="absolute bottom-10 sm:bottom-12 left-0 w-full text-center px-4">
                <span className="inline-block bg-maroon/75 backdrop-blur-sm text-white text-base sm:text-lg md:text-2xl font-bold px-5 sm:px-6 py-2 rounded-full shadow-lg border border-gold/30 max-w-[92%]">
                  🕉 {caption}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/55 text-white w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/55 text-white w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-colors"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-0 w-full flex justify-center gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all rounded-full ${
                  i === index ? 'w-6 h-2.5 bg-gold' : 'w-2.5 h-2.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
