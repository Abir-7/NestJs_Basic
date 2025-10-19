export interface IAuthData {
  user_id: string;
  user_email: string;
  user_role: string;
}
export interface IDecodedData {
  user_id: string;
  user_email: string;
  user_role: string;
  iat: number;
  exp: number;
}
