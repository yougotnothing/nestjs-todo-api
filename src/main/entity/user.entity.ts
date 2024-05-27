import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { TodoEntity } from "entity/todo.entity";

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

  @Column({ type: 'bytea', nullable: false })
  avatar: Buffer;

  @Column({ default: false })
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