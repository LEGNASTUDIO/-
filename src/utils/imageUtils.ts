/**
 * Helper to process and optimize image files uploaded from the local computer.
 * Automatically scales down excessively large images to ensure fast rendering
 * and stay well within browser localStorage limits while maintaining high clarity.
 */
export async function processImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<string> {
  // If SVG or small gif, read as data URL directly
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Downscale if width or height exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG unless PNG with potential transparency
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Process multiple files in parallel
 */
export async function processMultipleImageFiles(
  files: FileList | File[],
  maxDimension = 1600,
  quality = 0.85
): Promise<string[]> {
  const fileArray = Array.from(files);
  const promises = fileArray.map((file) => processImageFile(file, maxDimension, quality));
  return Promise.all(promises);
}
