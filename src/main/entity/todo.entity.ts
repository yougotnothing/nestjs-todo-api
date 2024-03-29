import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class TodoEntity {
  @Column({ type: 'boolean', default: false })
  isChecked: boolean;
  @Column({ default: '' })
  content: string;
  @Column({ default: '' })
  header: string;
  @Column()
  creator: string;
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UserEntity, user => user.tasks)
  user: UserEntity;
}