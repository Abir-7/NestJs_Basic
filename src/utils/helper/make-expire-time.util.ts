// src/common/utils/make-expire-time.util.ts
export function makeExpireTime(minutes = 5): Date {
  return new Date(Date.now() + minutes * 60_000);
}
