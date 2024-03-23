import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { TodoEntity } from "./todo.entity";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ default: false })
  isHaveAvatar: boolean;
  @OneToMany(() => TodoEntity, todo => todo.user)
  tasks: TodoEntity[];

  async comparePassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
};