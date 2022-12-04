import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UsersEntity } from './users.entity';

import { SocietiesEntity } from '../../society/entities/society.entity';

@Entity(`nsp_global_app_id`)
export class UserAppIdEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  appId: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;

  @ManyToOne(() => SocietiesEntity)
  @JoinColumn()
  society: SocietiesEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: number;
}
