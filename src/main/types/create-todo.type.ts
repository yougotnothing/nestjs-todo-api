interface Subtask {
  isChecked: boolean;
  content: string;
}

export interface CreateTodoDto {
  isChecked: boolean;
  createdAt: string;
  from: string;
  header: string;
  important: boolean;
  tasks: Subtask[];
  till: string;
  type: "school" | "work" | "shop" | "read" | "work out";
}