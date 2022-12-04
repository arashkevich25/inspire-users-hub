import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UsersEntity } from './users.entity';

@Entity(`nsp_global_deviceId`)
export class UserDeviceIdEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  deviceId: string;

  @Column()
  isAndroid: boolean;

  @Column()
  isIos: boolean;

  @Column()
  appVersion: string;

  @Column()
  osVersion: string;

  @Column()
  deviceBrand: string;

  @Column()
  deviceModel: string;

  @Column()
  deviceLanguage: string;

  @OneToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: number;
}
