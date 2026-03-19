/** Placeholder shown when no artwork image is uploaded yet */
export const ARTWORK_PLACEHOLDER = "/placeholder.svg";

/**
 * Returns the artwork image URL or a placeholder if none is set.
 * Admin-uploaded URLs (full https:// paths) are used directly.
 */
export const getArtworkImage = (imageUrl: string | null): string => {
  if (imageUrl && !imageUrl.startsWith("/")) {
    return imageUrl;
  }
  return ARTWORK_PLACEHOLDER;
};
