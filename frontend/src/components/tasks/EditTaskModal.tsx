'use client';
import { useState, useEffect } from 'react';
import { useUpdateTaskMutation } from '@/store/api/tasksApi';
import { Task } from '@/types/task';
import Modal from '@/components/ui/Modal';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  useEffect(() => {
    setTitle(task?.title || '');
  }, [task]);

  const handleSave = async () => {
    if (task && title.trim()) {
      await updateTask({ id: task._id, task: { title } });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Редактирование</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={handleSave} disabled={isLoading}>Сохранить</button>
    </Modal>
  );
}
