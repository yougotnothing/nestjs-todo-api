import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "entity/user.entity";

@Entity()
export class TodoEntity {
  @Column({ type: "enum", enum: ["school", "work", "shop", "read", "work out"] })
  type: "school" | "work" | "shop" | "read" | "work out";
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
  @Column()
  till: string;
  @Column()
  from: string;
  @Column({ type: 'boolean', default: false })
  important: boolean;
  @Column()
  createdAt: string;
  @ManyToOne(() => UserEntity, user => user.tasks)
  user: UserEntity;
}