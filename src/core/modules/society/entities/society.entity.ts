import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(`nsp_global_societies`)
export class SocietiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  societyId: string;

  @Column()
  api: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: number;
}
