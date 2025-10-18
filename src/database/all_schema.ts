import * as UserSchema from '../module/user/users/user.schema';
import * as UserProfileSchema from '../module/user/user_profile/user_profile.schema';
import * as UserAuthenticationSchema from '../module/user/user_authentication/user_authentication.schema';
export const schema = {
  ...UserSchema,
  ...UserProfileSchema,
  ...UserAuthenticationSchema,
};
