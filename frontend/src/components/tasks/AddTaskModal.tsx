"use client";
import Modal from "@/components/ui/Modal";
import CreateTaskForm from "./CreateTaskForm";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Новая задача</h2>
      <CreateTaskForm />
    </Modal>
  );
}
