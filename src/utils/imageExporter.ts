import * as htmlToImage from 'html-to-image';

export interface RenderOptions {
  pixelRatio?: number;
  quality?: number;
  type?: 'jpeg' | 'png';
}

/**
 * Ensures all custom fonts are completely loaded before capturing node
 */
export async function waitForFontsLoaded(): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Font loading check timed out or failed', e);
    }
  }
}

/**
 * Captures an HTML element and returns a JPG or PNG Data URL
 */
export async function nodeToDataUrl(
  node: HTMLElement,
  options: RenderOptions = {}
): Promise<string> {
  const { pixelRatio = 2, quality = 0.95, type = 'jpeg' } = options;
  
  await waitForFontsLoaded();
  
  // Slight delay for images/SVG assets rendering
  await new Promise((resolve) => setTimeout(resolve, 120));

  const config = {
    pixelRatio,
    quality,
    cacheBust: true,
    backgroundColor: '#ffffff',
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  };

  if (type === 'jpeg') {
    return await htmlToImage.toJpeg(node, config);
  } else {
    return await htmlToImage.toPng(node, config);
  }
}

/**
 * Captures an HTML element and returns a Blob
 */
export async function nodeToBlob(
  node: HTMLElement,
  options: RenderOptions = {}
): Promise<Blob> {
  const dataUrl = await nodeToDataUrl(node, options);
  const res = await fetch(dataUrl);
  return await res.blob();
}

/**
 * Triggers browser download of a data URL or Blob
 */
export function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
