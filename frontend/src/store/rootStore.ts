import { makeAutoObservable, runInAction } from 'mobx';
import { getFields, getTasks, Field, Task } from '../lib/api';

export class RootStore {
    fields: Field[] = [];
    tasks: Task[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        // Загружаем данные при создании стора
        this.loadInitialData();
    }

    async loadInitialData() {
        this.loading = true;
        try {
            // Загружаем поля и задачи параллельно
            const [fields, tasks] = await Promise.all([getFields(), getTasks()]);
            runInAction(() => {
                this.fields = fields;
                this.tasks = tasks;
                this.loading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = 'Failed to load data';
                this.loading = false;
            });
        }
    }

    async fetchFields() {
        this.loading = true;
        try {
            const data = await getFields();
            runInAction(() => {
                this.fields = data;
                this.loading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = 'Failed to load fields';
                this.loading = false;
            });
        }
    }

    async fetchTasks() {
        this.loading = true;
        try {
            const data = await getTasks();
            runInAction(() => {
                this.tasks = data;
                this.loading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = 'Failed to load tasks';
                this.loading = false;
            });
        }
    }
}