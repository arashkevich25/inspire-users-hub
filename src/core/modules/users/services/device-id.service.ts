import { AddDeviceIdDto } from '@inspire/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppIdService } from './app-id.service';
import { DeviceIdRepositoryService } from './device-id.repository.service';

import { UserDeviceIdEntity } from '../entities/user-device-id.entity';

@Injectable()
export class DeviceIdService extends DeviceIdRepositoryService {
  constructor(
    @InjectRepository(UserDeviceIdEntity)
    deviceIdRepository: Repository<UserDeviceIdEntity>,
    private readonly appIdService: AppIdService,
  ) {
    super(deviceIdRepository);
  }

	async deleteDeviceByUserId(userId: number, societyId: string) {
		const user = await this.appIdService.getByAppIdAndSocietyId(userId, societyId);
		await this.delete(user.user.id);
	}

  async createOrUpdate(deviceId: AddDeviceIdDto): Promise<UserDeviceIdEntity> {
    const user = await this.appIdService.getByAppId(deviceId.user);
		const device = await this.getByUserId(user.user.id);
		const newDeviceId = new UserDeviceIdEntity();
		newDeviceId.user = user.user;
		newDeviceId.deviceId = deviceId.deviceId;
		newDeviceId.appVersion = deviceId.appVersion;
		newDeviceId.deviceLanguage = deviceId.deviceLanguage;
		newDeviceId.isAndroid = deviceId.isAndroid;
		newDeviceId.isIos = deviceId.isIos;
		newDeviceId.osVersion = deviceId.osVersion;
		newDeviceId.deviceBrand = deviceId.deviceBrand;
		newDeviceId.deviceModel = deviceId.deviceModel;
		if(device) {
      await this.update(newDeviceId);
			return this.getByUserId(user.user.id);
		}
		return this.add(newDeviceId);
	}

	async getDevice(userId: number) {
		const device = await this.getByUserId(userId);
		if (!device) {
			return new UserDeviceIdEntity();
		}
		return device;
	}

}
