import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3001',
});

export interface Field {
    _id: string;
    name: string;
    type: 'text' | 'date' | 'double-date' | 'select' | 'checkbox';
    options: string[];
}

export interface Task {
    _id: string;
    title: string;
    fields: { fieldId: Field; value: any }[];
}

export const getFields = async (): Promise<Field[]> => {
    const response = await api.get('/fields');
    return response.data;
};

export const getTasks = async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
};