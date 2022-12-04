import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SocietiesEntity } from '../../society/entities/society.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(`nsp_login_history`)
export class LoginHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;

  @OneToOne(() => SocietiesEntity)
  @JoinColumn()
  society: SocietiesEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: number;
}
