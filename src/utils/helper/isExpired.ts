export const isExpired = (expireTime: Date | string): boolean => {
  const now = new Date(); // current UTC time
  const expireDate =
    typeof expireTime === 'string' ? new Date(expireTime) : expireTime;
  return now.getTime() > expireDate.getTime();
};
