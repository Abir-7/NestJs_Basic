import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailProducer } from '../jobs/producers/email.producer';
import { generateCode } from '../../common/utils/generate-code.util';
import {
  AuthenticationStatus,
  AuthenticationType,
  UserAuthentication,
} from '../user-authentication/entities/user-authentication.entity';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserProfilePhoto } from '../user-profile/entities/user-profile-photo';
import { UserDevices } from '../user-device/entities/user-device.entity';
import { SmsProducer } from '../jobs/producers/sms.producer';
@Injectable()
export class AuthService {
  constructor(
    private readonly smsProducer: SmsProducer,
    private readonly emailProducer: EmailProducer,
    @InjectRepository(UserDevices)
    private readonly userDeviceRepository: Repository<UserDevices>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserAuthentication)
    private readonly authenticationRepository: Repository<UserAuthentication>,
    @InjectRepository(UserProfilePhoto)
    private readonly userProfilePhotoRepository: Repository<UserProfilePhoto>,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });

    if (existingUser && existingUser.isVerified) {
      throw new ConflictException(
        dto.email ? 'Email already exists' : 'Phone already exist',
      );
    }

    if (existingUser && existingUser.id) {
      await this.deleteUser({ user_id: existingUser.id });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const otp = generateCode(6, 'digit');
    const photo = this.userProfilePhotoRepository.create({});
    const profile = this.profileRepository.create({
      fullName: dto.full_name,
      photo,
    });
    const userAuthentication = this.authenticationRepository.create({
      code: otp,
      type: dto.email
        ? AuthenticationType.EMAIL_VERIFICATION
        : AuthenticationType.PHONE_VERIFICATION,
    });

    const userDevice = this.userDeviceRepository.create({
      deviceModel: dto.device_model,
      deviceFingerprint: dto.device_fingerprint,
      ipAddress: dto.ip_Address,
      isEmulator: dto.is_emulator,
      isLoggedIn: false,
      osType: dto.os_type,
    });

    const user = this.userRepository.create({
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      profile,
      userAuthentication,
      userDevices: [userDevice],
    });

    const savedUser = await this.userRepository.save(user);

    if (savedUser.email) {
      await this.emailProducer.sendVerificationEmail(savedUser.email, otp);
    }
    if (savedUser.phone) {
      await this.smsProducer.sendOtp(savedUser.phone, otp);
    }
    return {
      message: 'Registration successful',
      userId: savedUser.id,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email, phone } = dto;

    // Don't reveal whether the user exists for security
    const user = await this.userRepository.findOne({
      where: email ? { email } : { phone },
    });

    if (!user) {
      return {
        message:
          'If an account with that contact exists, a password reset OTP has been sent.',
      };
    }

    // Expire any existing UNUSED PASSWORD_RESET OTPs for this user
    await this.authenticationRepository.update(
      {
        user: { id: user.id },
        type: AuthenticationType.PASSWORD_RESET,
        status: AuthenticationStatus.UNUSED,
      },
      { status: AuthenticationStatus.EXPIRED },
    );

    // Generate and save a new PASSWORD_RESET OTP
    const otp = generateCode(6, 'digit');
    const authRecord = this.authenticationRepository.create({
      code: otp,
      type: AuthenticationType.PASSWORD_RESET,
      status: AuthenticationStatus.UNUSED,
      user,
    });
    await this.authenticationRepository.save(authRecord);

    // Send via the appropriate channel
    if (user.email) {
      await this.emailProducer.sendPasswordResetEmail(user.email, otp);
    } else if (user.phone) {
      await this.smsProducer.sendOtp(user.phone, otp);
    }

    return {
      message:
        'If an account with that contact exists, a password reset OTP has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { user_id, token, new_password } = dto;

    // Find the USED PASSWORD_RESET auth record with the matching token
    const authRecord = await this.authenticationRepository.findOne({
      where: {
        user: { id: user_id },
        token,
        type: AuthenticationType.PASSWORD_RESET,
        status: AuthenticationStatus.USED,
      },
      relations: ['user'],
    });

    if (!authRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if the token has expired (15 minute TTL)
    const now = new Date();
    const tokenAge =
      (now.getTime() - authRecord.createdAt.getTime()) / 1000 / 60;
    if (tokenAge > 15) {
      authRecord.status = AuthenticationStatus.EXPIRED;
      await this.authenticationRepository.save(authRecord);
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(new_password, 10);
    authRecord.user.password = hashedPassword;
    await this.userRepository.save(authRecord.user);

    // Expire any other PASSWORD_RESET records for this user as a safety measure
    await this.authenticationRepository.update(
      {
        user: { id: user_id },
        type: AuthenticationType.PASSWORD_RESET,
        status: AuthenticationStatus.UNUSED,
      },
      { status: AuthenticationStatus.EXPIRED },
    );

    return { message: 'Password reset successful' };
  }

  async deleteUser(dto: DeleteUserDto) {
    const result = await this.userRepository.delete(dto.user_id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
