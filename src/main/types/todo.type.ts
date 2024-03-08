type Field = {
  isCheched?: boolean;
  content: string;
}

export type Todo = {
  header: string;
  field: Array<Field>;
  id: number;
}