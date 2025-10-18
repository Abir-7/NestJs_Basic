import * as UserSchema from '../module/users/user.schema';
import * as UserProfileSchema from '../module/user_profile/user_profile.schema';
import * as UserAuthenticationSchema from '../module/user_authentication/user_authentication.schema';
export const schema = {
  ...UserSchema,
  ...UserProfileSchema,
  ...UserAuthenticationSchema,
};
