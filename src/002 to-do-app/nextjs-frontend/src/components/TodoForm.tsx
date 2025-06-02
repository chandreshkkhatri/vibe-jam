"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Hash } from "lucide-react";
import { Todo, CreateTodoRequest, UpdateTodoRequest } from "@/types/todo";
import { validateTodoForm } from "@/lib/utils";

interface TodoFormProps {
  todo?: Todo;
  onSave: (todoData: CreateTodoRequest | UpdateTodoRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TodoForm({
  todo,
  onSave,
  onCancel,
  isLoading = false,
}: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "pending" as "pending" | "completed" | "archived",
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        due_date: todo.due_date ? todo.due_date.split("T")[0] : "",
        priority: todo.priority,
        status: todo.status,
        tags: todo.tags ? todo.tags.join(", ") : "",
      });
    }
  }, [todo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTodoForm({
      title: formData.title,
      priority: formData.priority,
      due_date: formData.due_date,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        due_date: formData.due_date
          ? new Date(formData.due_date).toISOString()
          : undefined,
        priority: formData.priority,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : undefined,
      };

      if (todo) {
        // Include status for updates
        await onSave({ ...todoData, status: formData.status });
      } else {
        await onSave(todoData);
      }
    } catch (error) {
      console.error("Error saving todo:", error);
      setErrors({ submit: "Failed to save todo. Please try again." });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {todo ? "Edit Todo" : "Create New Todo"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  errors.title
                    ? "border-red-300 focus:border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }
              `}
              placeholder="Enter todo title..."
              maxLength={200}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description (optional)..."
              maxLength={1000}
            />
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  errors.priority
                    ? "border-red-300 focus:border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }
              `}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
            )}
          </div>

          {/* Status (only for editing) */}
          {todo && (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {" "}
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label
              htmlFor="due_date"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  errors.due_date
                    ? "border-red-300 focus:border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }
              `}
            />
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Hash className="w-4 h-4 mr-1" />
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tags separated by commas..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas (e.g., work, urgent, meeting)
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
