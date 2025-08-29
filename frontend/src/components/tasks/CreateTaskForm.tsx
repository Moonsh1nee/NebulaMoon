import { useCreateTaskMutation } from "@/store/api/tasksApi";
import React from "react";
import styles from "@/styles/components/tasks/CreateTaskForm.module.scss";

export default function CreateTaskForm() {
  const [title, setTitle] = React.useState("");
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ title: title.trim(), status: "pending" });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Новая задача..."
        className={styles.input}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading} className={styles.btn}>
        {isLoading ? "Создание..." : "Создать задачу"}
      </button>
    </form>
  );
}
