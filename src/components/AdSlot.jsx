import { useEffect, useRef } from 'react';
import { adsConfig } from '../config/ads';

/**
 * AdSlot — Reusable ad placement component
 * 
 * Supports:
 * - Google AdSense (auto-renders when enabled)
 * - Custom banner (image + link)
 * - Graceful fallback (hidden when no ad configured)
 * 
 * Usage: <AdSlot position="header-banner" />
 */
export default function AdSlot({ position, className = '' }) {
  const adRef = useRef(null);
  const placement = adsConfig.placements[position];

  useEffect(() => {
    // Initialize AdSense if enabled
    if (adsConfig.adsense.enabled && placement?.adsenseSlot && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense initialization error:', e);
      }
    }
  }, [placement]);

  if (!placement) return null;

  // Check if any ad is configured
  const hasAdsense = adsConfig.adsense.enabled && placement.adsenseSlot;
  const hasCustom = placement.customAd;

  // If no ad configured, render nothing
  if (!hasAdsense && !hasCustom) return null;

  return (
    <div
      className={`ad-slot ad-slot--${position} ${className}`}
      data-ad-position={position}
      aria-label="Advertisement"
    >
      <div className="ad-slot__inner">
        {/* Custom Banner Ad */}
        {hasCustom && (
          <a
            href={placement.customAd.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="ad-slot__custom-link"
          >
            <picture>
              {/* Mobile image if different */}
              <img
                src={placement.customAd.imageUrl}
                alt={placement.customAd.altText || 'Advertisement'}
                className="ad-slot__custom-img"
                loading="lazy"
              />
            </picture>
          </a>
        )}

        {/* Google AdSense Ad */}
        {hasAdsense && !hasCustom && (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adsConfig.adsense.publisherId}
            data-ad-slot={placement.adsenseSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}

        <span className="ad-slot__label">Iklan</span>
      </div>
    </div>
  );
}
