/**
 * Shrinks an image in the browser before it is uploaded to Supabase Storage.
 * Phone photos are often 2-5 MB; a product photo only needs ~800px, which
 * comes out around 40-120 KB as WebP. Smaller files = far less egress.
 */
export async function compressImage(
  file: File,
  maxSize = 800,
  quality = 0.8
): Promise<File> {
  try {
    if (!file.type.startsWith('image/')) return file;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    // If compression failed or somehow made it bigger, keep the original.
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
  } catch {
    return file;
  }
}

// Browsers cache files for a year when the name never changes (ours are unique per upload).
export const IMAGE_CACHE_CONTROL = '31536000';
