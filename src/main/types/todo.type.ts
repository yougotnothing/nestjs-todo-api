type Field = {
  isCheched?: boolean;
  content: string;
}

export type Todo = {
  header: string;
  field: Array<Field>;
  id: number;
}

export type TodoType = 'school' | 'work' | 'shop' | 'read' | 'work out';