import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  alt: string;
  className?: string; // sizing classes for the outer wrapper
  imgClassName?: string;
  onClick?: () => void;
  showArrows?: boolean;
}

/**
 * Swipeable image gallery. Uses native CSS scroll-snap, so it works with
 * touch swipe on phones, trackpad/mouse-drag scroll on desktop, plus
 * arrow buttons and dots. With a single image it renders a plain image.
 */
export default function ImageSlider({
  images,
  alt,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  onClick,
  showArrows = true,
}: ImageSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    setIndex(0);
    if (ref.current) ref.current.scrollTo({ left: 0 });
  }, [images.join('|')]);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    setIndex(next);
  };

  const handleScroll = () => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  if (count <= 1) {
    return (
      <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
        <img src={images[0]} alt={alt} className={imgClassName} referrerPolicy="no-referrer" draggable={false} />
      </div>
    );
  }

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={`relative overflow-hidden group/slider ${className}`}>
      <div
        ref={ref}
        onScroll={handleScroll}
        onClick={onClick}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`${alt} - photo ${i + 1}`}
            className={`${imgClassName} shrink-0 w-full snap-center`}
            referrerPolicy="no-referrer"
            draggable={false}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {showArrows && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={(e) => { stop(e); goTo(index - 1); }}
              className="hidden sm:flex absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-800/90 shadow text-neutral-700 dark:text-neutral-200 opacity-0 group-hover/slider:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {index < count - 1 && (
            <button
              type="button"
              onClick={(e) => { stop(e); goTo(index + 1); }}
              className="hidden sm:flex absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-800/90 shadow text-neutral-700 dark:text-neutral-200 opacity-0 group-hover/slider:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </>
      )}

      <div className="absolute bottom-1.5 left-0 right-0 z-20 flex justify-center gap-1 pointer-events-none">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-emerald-600' : 'w-1.5 bg-white/80 shadow'}`}
          />
        ))}
      </div>
    </div>
  );
}
