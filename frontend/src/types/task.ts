export interface Task {
  _id: string;
  title: string;
  categoryId?: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly" | "none";
    until?: string;
  };
  status: "pending" | "in-progress" | "completed";
  reminders?: string[];
  createdAt: string;
  updatedAt: string;
}
