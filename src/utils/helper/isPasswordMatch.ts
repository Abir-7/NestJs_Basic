/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcryptjs';

const isPasswordMatch = async (
  plain_password: string,
  hashed_password: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plain_password, hashed_password);
  } catch (error: any) {
    return false;
  }
};

export default isPasswordMatch;
