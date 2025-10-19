// common/interceptors/global-file.interceptor.ts
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function GlobalFileInterceptor(fieldName: string = 'file') {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        let folder = 'file'; // default folder

        const mime = file.mimetype;

        if (mime.startsWith('image/')) {
          folder = 'image';
        }
        if (mime === 'image/gif') {
          folder = 'gif';
        }
        if (mime.startsWith('video/')) {
          folder = 'video';
        }
        if (mime === 'application/pdf' || mime.startsWith('application/')) {
          folder = 'file';
        }

        const uploadPath = join('./uploads', folder);

        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  });
}
