import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "entity/user";
import { TodoType, TodoTypeEnum } from "types/todo";
import { UUID } from "crypto";

@Entity("todo_entity")
export class TodoEntity {
  @Column("varchar")
  header: string;

  @Column("varchar")
  till: string;

  @Column("varchar")
  from: string;

  @Column("varchar")
  createdAt: string;

  @PrimaryGeneratedColumn("uuid")
  id: UUID;

  @Column("enum", { enum: TodoTypeEnum })
  type: TodoType;

  @Column("boolean", { default: false })
  isChecked: boolean;

  @Column("boolean", { default: false })
  important: boolean;

  @Column("jsonb", { default: [] })
  tasks: Array<{ isChecked: boolean, content: string }>;

  @Column("timestamp", { default: new Date() })
  createdAtDate: Date;

  @ManyToOne(() => UserEntity, user => user.tasks)
  creator: UUID;
}