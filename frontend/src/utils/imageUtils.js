/**
 * Convert relative image path to absolute URL
 * If image is already a full URL, return as-is
 * Otherwise prepend the backend base URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend base URL
  const baseUrl = 'http://localhost:8000';
  return `${baseUrl}${imagePath}`;
};
