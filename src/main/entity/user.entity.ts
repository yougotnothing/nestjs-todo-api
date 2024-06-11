import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { TodoEntity } from "entity/todo";
import { HttpException, HttpStatus } from "@nestjs/common";

@Entity("user_entity")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar")
  email: string;

  @Column("varchar")
  password: string;

  @Column("bytea")
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