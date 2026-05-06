import * as SubframeCore from "@subframe/core";

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return "";
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export const twClassNames = SubframeCore.createTwClassNames([
  "text-caption",
  "text-caption-bold",
  "text-body",
  "text-body-bold",
  "text-heading-3",
  "text-heading-2",
  "text-heading-1",
  "text-monospace-body",
]);
