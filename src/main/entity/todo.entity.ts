import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "entity/user.entity";

@Entity()
export class TodoEntity {
  @Column()
  header: string;

  @Column()
  creator: string;

  @Column()
  till: string;

  @Column()
  from: string;

  @Column()
  createdAt: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: ["school", "work", "shop", "read", "work out"] })
  type: "school" | "work" | "shop" | "read" | "work out";

  @Column({ type: 'boolean', default: false })
  isChecked: boolean;

  @Column({ type: 'boolean', default: false })
  important: boolean;

  @Column({ type: 'jsonb', default: [] })
  tasks: Array<{ isChecked: boolean, content: string }>;

  @Column({ type: 'timestamp', default: new Date() })
  createdAtDate: Date;

  @ManyToOne(() => UserEntity, user => user.tasks)
  user: UserEntity;
}