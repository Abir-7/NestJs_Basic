// src/common/utils/make-otp.util.ts
export function makeOtp(length = 6): string {
  return Array.from({ length })
    .map(() => Math.floor(Math.random() * 10))
    .join('');
}
