'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { redirect } from 'next/navigation';
import TaskList from '../components/TaskList';
import CreateTask from '../components/CreateTask';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import { useGetProfileQuery, useLoginMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import Login from '@/components/Login';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
      </main>
      <ToastContainer />
    </div>
  )
}
