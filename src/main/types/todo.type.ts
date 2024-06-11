export type Todo = {
  header: string;
  field: Array<{ isChecked?: boolean, content: string }>;
  id: number;
}

export type TodoType = 'school' | 'work' | 'shop' | 'read' | 'work out';

export enum TodoTypeEnum {
  school = 'school',
  work = 'work',
  shop = 'shop',
  read = 'read',
  workOut = 'work out'
}