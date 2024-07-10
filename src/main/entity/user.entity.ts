import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { TodoEntity } from "entity/todo";
import { UUID } from "crypto";

@Entity("user_entity")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: UUID;

  @Column("varchar")
  name: string;

  @Column("varchar")
  email: string;

  @Column("boolean", { default: false })
  isVerified: boolean;

  @Column("varchar")
  password: string;

  @Column("bytea", { default: Buffer.from("") })
  avatar: Buffer;

  @Column("boolean", { default: false })
  isHaveAvatar: boolean;

  @OneToMany(() => TodoEntity, todo => todo.user)
  tasks: TodoEntity[];

  async comparePassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  changeAvatar(avatar: Buffer): void {
    if(!this.isHaveAvatar) this.isHaveAvatar = true;
    
    this.avatar = avatar;
  }
};