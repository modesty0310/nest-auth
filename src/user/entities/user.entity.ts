import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  uid: string;

  @Column()
  id: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenExp: Date;
}
