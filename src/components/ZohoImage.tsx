import React, { useEffect, useState } from 'react';
import { getCachedImageURL, loadImageURL } from '../service/Zohoapi';

// <img> that loads Zoho Creator file URLs through the SDK (cached); other URLs load normally
export const ZohoImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, className, ...rest }) => {
  const isZohoFile = typeof src === 'string' && src.startsWith('/api/');
  const [imageSrc, setImageSrc] = useState<string | undefined>(() =>
    isZohoFile ? getCachedImageURL(src as string) : src
  );

  useEffect(() => {
    if (!isZohoFile) {
      setImageSrc(src);
      return;
    }
    let isActive = true;
    setImageSrc(getCachedImageURL(src as string));
    loadImageURL(src as string)
      .then((url) => {
        if (isActive) setImageSrc(url);
      })
      .catch((error) => console.error(error));
    return () => {
      isActive = false;
    };
  }, [src, isZohoFile]);

  // Show a light placeholder until the image is ready
  if (!imageSrc) {
    return <div className={`${className || ''} bg-stone-200 animate-pulse`} />;
  }
  return <img src={imageSrc} className={className} {...rest} />;
};
