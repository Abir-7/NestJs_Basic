import { unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Remove file from disk by fileId
 * @param fileId - relative path like /image/filename.png or /video/file.mp4
 * @returns true if deleted successfully, false if file not found or error
 */
export const removeFileByFileId = async (fileId: string): Promise<boolean> => {
  if (!fileId) return false;

  try {
    const filePath = join(process.cwd(), 'uploads', fileId.replace(/^\/+/, ''));
    await unlink(filePath);
    return true;
  } catch (err) {
    console.error('Error deleting file:', err);
    return false;
  }
};
