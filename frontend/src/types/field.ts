export interface Field {
  id: string;
  name: string;
  type: 'text' | 'date' | 'double-date' | 'select' | 'multi-select' | 'checkbox';
  options?: string[];
}