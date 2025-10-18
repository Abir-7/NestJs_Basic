import { Controller } from '@nestjs/common';
import { UserProfilesService } from './user_profile.service';
@Controller('user-profiles')
export class UserProfileController {
  constructor(private service: UserProfilesService) {}
}
