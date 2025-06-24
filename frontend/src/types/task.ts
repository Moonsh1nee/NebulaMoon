export interface Task {
  id: string;
  title: string;
  fields: TaskField[];
}

export interface TaskField {
  fieldId: string;
  name: string;
  value: string | number | boolean | Date | string[];
}