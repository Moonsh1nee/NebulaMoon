"use client";

import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/store/api/tasksApi";
import { Task } from "@/types/task";
import styles from "@/styles/components/tasks/TasksList.module.scss";
import React from "react";
import EditTaskModal from "./EditTaskModal";

export default function TasksList() {
  const { data, isLoading, isError } = useGetTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [editId, setEditId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [modalTask, setModalTask] = React.useState<Task | null>(null);

  const clickTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const lastClickTime = React.useRef<number>(0);

  const handleClick = (task: Task) => {
    const now = Date.now();
    if (now - lastClickTime.current < 250) {
      // double click
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
      }
      setEditId(task._id);
      setEditTitle(task.title);
      console.log("Двойной клик по задаче:", task);
    } else {
      // single click — ждём, вдруг будет второй
      clickTimeout.current = setTimeout(() => {
        setModalTask(task);
        console.log("Одинарный клик по задаче:", task);
      }, 250);
    }
    lastClickTime.current = now;
  };

  if (isLoading) return <div className={styles.state}>Загрузка…</div>;
  if (isError) return <div className={styles.state}>Ошибка</div>;
  if (!data?.length) return <div className={styles.state}>Задач пока нет</div>;

  return (
    <>
      <ul className={styles.list}>
        {data.map((task) => (
          <li
            key={task._id}
            onClick={() => handleClick(task)}
            className={styles.item}
          >
            {editId === task._id ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => {
                  updateTask({ id: task._id, task: { title: editTitle } });
                  setEditId(null);
                }}
                autoFocus
              />
            ) : (
              <span>{task.title}</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Удалить задачу?")) deleteTask(task._id);
              }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>

      <EditTaskModal
        isOpen={!!modalTask}
        onClose={() => setModalTask(null)}
        task={modalTask}
      />
    </>
  );
}
