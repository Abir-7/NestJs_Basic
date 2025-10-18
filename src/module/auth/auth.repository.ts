import { Inject, Injectable } from '@nestjs/common';
import { DB_STRING } from '../../database/database_identifier';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../database/all_schema';
import { UserAuthenticationRepository } from '../user/user_authentication/user_authentication.repository';
import { IAuthType } from '../user/user_authentication/user_authentication.schema';
import { UserProfilesRepository } from '../user/user_profile/user_profiles.repository';
import { UserRepository } from '../user/users/user.repository';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DB_STRING) private readonly database: NodePgDatabase<typeof schema>,
    private readonly userAuthenticationRepository: UserAuthenticationRepository,
    private readonly profileRepository: UserProfilesRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(
    data: typeof schema.Users.$inferInsert,
    profile_data: { full_name: string },
    authentication_data: {
      code: string;
      expire_time: Date;
      type: IAuthType;
    },
  ) {
    return await this.database.transaction(async (tx) => {
      const [user] = await this.userRepository.createUser(data);

      const profile_data_with_user_id = {
        ...profile_data,
        user_id: user.id,
      };

      const [profile] = await this.profileRepository.createUserProfile(
        profile_data_with_user_id,
        tx,
      );

      const [auth] =
        await this.userAuthenticationRepository.createAuthenticationForUser(
          {
            user_id: user.id,
            ...authentication_data,
            type: 'email',
          },
          tx,
        );

      return { user, profile, auth };
    });
  }
}
