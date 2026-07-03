import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDevices } from './entities/user-device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectRepository(UserDevices)
    private readonly userDeviceRepository: Repository<UserDevices>,
  ) {}

  async save_device_info(
    user: User,
    deviceInfo: {
      ipAddress?: string;
      deviceFingerprint?: string;
      osType?: string;
      deviceModel?: string;
      isEmulator?: boolean;
      isLoggedIn?: boolean;
    },
  ): Promise<UserDevices> {
    let device: UserDevices | null = null;

    // Try to find an existing device by fingerprint
    if (deviceInfo.deviceFingerprint) {
      device = await this.userDeviceRepository.findOne({
        where: {
          deviceFingerprint: deviceInfo.deviceFingerprint,
          user: { id: user.id },
        },
      });
    }

    if (device) {
      // Update existing device
      Object.assign(device, deviceInfo);
    } else {
      // Create a new device record
      device = this.userDeviceRepository.create({
        ...deviceInfo,
        user,
      });
    }

    return this.userDeviceRepository.save(device);
  }

  async get_user_device_info(
    user: User,
    deviceFingerprint?: string,
  ): Promise<{
    totalLoginDevices: number;
    isSameDevice: boolean;
  }> {
    const [totalLoginDevices, existingDevice] = await Promise.all([
      this.userDeviceRepository.count({
        where: {
          user: { id: user.id },
          isLoggedIn: true,
        },
      }),
      deviceFingerprint
        ? this.userDeviceRepository.findOne({
            where: {
              deviceFingerprint,
              user: { id: user.id },
            },
          })
        : Promise.resolve(null),
    ]);

    return { totalLoginDevices, isSameDevice: !!existingDevice };
  }
}
