import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('nsp_global_user-reset-password-storage')
export class UserResetPasswordStorageEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  email: string;

  @Column()
  uniqId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: number;
}
