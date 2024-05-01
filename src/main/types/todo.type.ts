export type Todo = {
  header: string;
  field: Array<{ isChecked?: boolean, content: string }>;
  id: number;
}

export type TodoType = 'school' | 'work' | 'shop' | 'read' | 'work out';