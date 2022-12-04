import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserAppIdEntity } from './user-app-id.entity';

import { SocietiesEntity } from '../../society/entities/society.entity';

@Entity(`nsp_global_users`)
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserAppIdEntity, (appId) => appId.user)
  @JoinColumn()
  appId: UserAppIdEntity[];

  @Column({ select: false, nullable: true })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
    transformer: new EncryptionTransformer({
      key: 'somekey',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'someiv',
    }),
  })
  email: string;

  @ManyToMany(() => SocietiesEntity)
  @JoinTable()
  societies: SocietiesEntity[];

  @Column()
  defaultSociety: string;

  @Column()
  facebookUser: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column()
  googleUser: boolean;

  @Column()
  appleUser: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: number;
}
