'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { redirect } from 'next/navigation';
import TaskList from '../components/TaskList';
import CreateTask from '../components/CreateTask';
import Header from '../components/Header';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div>
      <Header />
      <h1>Мои задачи</h1>
      <CreateTask />
      <TaskList />
    </div>
  );
}
