import { format, isValid, parseISO } from "date-fns";
import { Todo } from "@/types/todo";

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
  } catch {
    return "Invalid date";
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy h:mm a") : "Invalid date";
  } catch {
    return "Invalid date";
  }
};

export const isOverdue = (dueDateString?: string): boolean => {
  if (!dueDateString) return false;
  try {
    const dueDate = parseISO(dueDateString);
    return isValid(dueDate) && dueDate < new Date();
  } catch {
    return false;
  }
};

export const getPriorityColor = (priority: Todo["priority"]): string => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const getStatusColor = (status: Todo["status"]): string => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50 border-green-200";
    case "in-progress":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "pending":
      return "text-gray-600 bg-gray-50 border-gray-200";
    case "archived":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const validateTodoForm = (data: {
  title: string;
  priority: string;
  due_date?: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters long";
  } else if (data.title.trim().length > 200) {
    errors.title = "Title must be less than 200 characters";
  }

  if (!["low", "medium", "high"].includes(data.priority)) {
    errors.priority = "Priority must be low, medium, or high";
  }

  if (data.due_date) {
    try {
      const date = parseISO(data.due_date);
      if (!isValid(date)) {
        errors.due_date = "Invalid due date format";
      }
    } catch {
      errors.due_date = "Invalid due date format";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
