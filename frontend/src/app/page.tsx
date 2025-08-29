"use client";

import TasksList from "@/components/tasks/TasksList";
import Header from "../components/header/Header";
import React from "react";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import AddTaskModal from "@/components/tasks/AddTaskModal";

export default function Home() {
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <div>
      <Header />
      <main>
        <div>
          <h1>Мои задачи</h1>
          <button onClick={() => setIsAddOpen(true)} style={{ fontSize: 24 }}>
            ➕
          </button>
        </div>
        <TasksList />
        <AddTaskModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      </main>
    </div>
  );
}

// TODO: Доработать авторизацию и регистрацию (стили)
// TODO: Стили для задач (список задач + форма + модалка)
// TODO: Стили для модального окна
// TODO: Инлайновое редактирование задач (стили)
// TODO: Отображение задач и информации о задачах
