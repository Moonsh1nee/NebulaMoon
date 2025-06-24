'use client';

import React, { useState } from 'react';
import { useCreateTaskMutation } from '../store/api/tasksApi';
import { useGetFieldsQuery } from '../store/api/fieldsApi';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [fieldId, setFieldId] = useState('');
  const [value, setValue] = useState('');
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: fields } = useGetFieldsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && fieldId && value) {
      try {
        await createTask({ title, fields: [{ fieldId, name, value }] }).unwrap();
        setTitle('');
        setFieldId('');
        setName('');
        setValue('');
      } catch (err) {
        console.error('Failed to create task:', err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название задачи"
        disabled={isLoading}
      />
      <select value={fieldId} onChange={(e) => setFieldId(e.target.value)} disabled={isLoading}>
        <option value="">Выберите поле</option>
        {fields?.map((field) => (
          <option key={field.id} value={field.id}>
            {field.name} ({field.type})
          </option>
        ))}
      </select>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя поля (опционально)"
        disabled={isLoading}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Значение поля"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        Создать
      </button>
    </form>
  );
};

export default CreateTask;
