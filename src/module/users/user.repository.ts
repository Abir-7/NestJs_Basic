import { Inject, Injectable } from '@nestjs/common';
import { DB_STRING } from '../../database/database_identifier';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../database/all_schema';
import { UserProfilesRepository } from '../user_profile/user_profiles.repository';
import { UserAuthenticationRepository } from '../user_authentication/user_authentication.repository';
import type { IAuthType } from '../user_authentication/user_authentication.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DB_STRING) private readonly database: NodePgDatabase<typeof schema>,
    private readonly profileRepository: UserProfilesRepository,
    private readonly userAuthenticationRepository: UserAuthenticationRepository,
  ) {}

  async findUserByEmail(email: string) {
    return await this.database.query.Users.findFirst({
      where: eq(schema.Users.email, email),
    });
  }

  async deleteUserById(userId: string) {
    const result = await this.database
      .delete(schema.Users)
      .where(eq(schema.Users.id, userId));

    return { deleted: result.rowCount };
  }

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
      const [user] = await tx.insert(schema.Users).values(data).returning();

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
