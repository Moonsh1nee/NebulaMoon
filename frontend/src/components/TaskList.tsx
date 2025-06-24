'use client';

import React from 'react';
import { useGetTasksQuery } from '../store/api/tasksApi';

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, error } = useGetTasksQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки задач</div>;
  if (!tasks?.length) return <div>Задач нет</div>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <h3>{task.title}</h3>
          {task.fields.map((field, index) => (
            <p key={index}>
              {field.name}: {field.value.toString()}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
