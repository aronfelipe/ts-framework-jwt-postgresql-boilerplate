import { Column, Entity } from 'typeorm';
import { ExtendedEntity } from './base';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  CONSUMER = "consumer",
  ADMIN = "admin",
  AUDITOR = "auditor"
}

@Entity(UserModel.tableName)
export default class UserModel extends ExtendedEntity {
  private static readonly tableName = 'users';

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false, unique: true })
  public email: string;

  @Column({ nullable: true })
  public password_hash: string;

  @Column({ nullable: true, default: UserRole.CONSUMER })
  public role: UserRole;

  constructor(data: Partial<UserModel>) {
    super(data);
  }

  public static async findByEmail(email: string) {
    return this.findOne({where:{email}})
  }

  public async setPassword(password: string) {
    try {
      this.password_hash = await bcrypt.hash(password, 10)
    } catch (error) {
      console.error(error)
    }
  }

  public async validadePassword(password: string) {
    const matchPassword = await bcrypt.compare(password, this.password_hash);
    return matchPassword
  }
}
