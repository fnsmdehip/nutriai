import sharp from 'sharp';

/**
 * Processes and optimizes an image for food recognition
 * Resizes to a reasonable dimension and optimizes quality
 * @param base64Image Base64 encoded image data
 * @returns Processed base64 image
 */
export const processImage = async (base64Image: string): Promise<string> => {
  try {
    // Check if the image already has a data URI prefix, and remove it if it does
    const base64Data = base64Image.includes('base64,')
      ? base64Image.split('base64,')[1]
      : base64Image;

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Process image with sharp
    const processedImageBuffer = await sharp(imageBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true }) // Resize to max 800x800
      .jpeg({ quality: 85 }) // Compress with good quality
      .toBuffer();

    // Convert back to base64
    return processedImageBuffer.toString('base64');
  } catch (error) {
    console.error('Image processing error:', error);
    // If processing fails, return original image
    return base64Image;
  }
};

export default {
  processImage,
};
