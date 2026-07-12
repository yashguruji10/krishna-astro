'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Drop-in replacement for next/image that shows a shimmering skeleton
 * placeholder until the image has actually finished loading, then
 * cross-fades into view. Works with both `fill` and fixed width/height.
 *
 * Usage is identical to next/image, e.g.:
 *   <LazyImage src={url} alt="..." fill className="object-cover" />
 */
export default function LazyImage({
  className = '',
  wrapperClassName = '',
  skeletonClassName = '',
  onLoad,
  fill,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} ${wrapperClassName}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 skeleton-shimmer ${skeletonClassName}`}
        />
      )}
      <Image
        {...props}
        fill={fill}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </div>
  );
}
