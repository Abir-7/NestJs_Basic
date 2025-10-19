import { sep } from 'path';

/**
 * Convert a disk path to fileId for backend use.
 * Works for images, videos, files, etc.
 */
export const getFileId = (
  filePath: string,
  folderNames: string[] = ['image', 'video', 'files'],
): string => {
  const normalizedPath = filePath.split(sep).join('/'); // normalize slashes

  for (const folder of folderNames) {
    const index = normalizedPath.indexOf(`/${folder}/`);
    if (index !== -1) {
      return normalizedPath.substring(index); // /folder/filename
    }
  }

  return ''; // folder not found
};
