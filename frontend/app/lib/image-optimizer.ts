/**
 * Image Optimizer Utility
 * Optimizes Shopify CDN images with size parameters
 */

export function optimizeShopifyImage(url: string, width: number, quality = 85): string {
    if (!url) return url;

    // Only optimize Shopify CDN images
    if (!url.includes('shopify') && !url.includes('cdn.shopify.com')) {
        return url;
    }

    try {
        const urlObj = new URL(url);

        // Add width parameter for Shopify CDN
        urlObj.searchParams.set('width', width.toString());

        // Add format parameter (progressive JPEG for better loading)
        if (!urlObj.searchParams.has('format')) {
            urlObj.searchParams.set('format', 'pjpg');
        }

        // Add quality parameter
        urlObj.searchParams.set('quality', quality.toString());

        return urlObj.toString();
    } catch (error) {
        // If URL parsing fails, return original
        console.warn('Failed to optimize image URL:', error);
        return url;
    }
}

/**
 * Get optimized Shopify image with srcset for responsive images
 */
export function getShopifyImageSrcSet(url: string, sizes: number[]): string {
    return sizes
        .map(size => `${optimizeShopifyImage(url, size)} ${size}w`)
        .join(', ');
}

/**
 * Generate blur placeholder data URL
 */
export function getShimmerDataUrl(width: number, height: number): string {
    const shimmer = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#0d0d1e" offset="20%" />
          <stop stop-color="#1a1a3e" offset="50%" />
          <stop stop-color="#0d0d1e" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#0d0d1e" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

    const toBase64 = (str: string) =>
        typeof window === 'undefined'
            ? Buffer.from(str).toString('base64')
            : window.btoa(str);

    return `data:image/svg+xml;base64,${toBase64(shimmer)}`;
}
