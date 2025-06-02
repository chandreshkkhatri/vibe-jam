"use client";

import React from "react";
import {
  Calendar,
  Tag,
  Edit2,
  Trash2,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Todo } from "@/types/todo";
import {
  formatDate,
  isOverdue,
  getPriorityColor,
  getStatusColor,
} from "@/lib/utils";

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Todo["status"]) => void;
}

export default function TodoCard({
  todo,
  onEdit,
  onDelete,
  onStatusChange,
}: TodoCardProps) {
  const handleStatusClick = () => {
    let nextStatus: Todo["status"];

    switch (todo.status) {
      case "pending":
        nextStatus = "completed";
        break;
      case "completed":
        nextStatus = "pending";
        break;
      default:
        nextStatus = "pending";
    }

    onStatusChange(todo.id, nextStatus);
  };
  const getStatusIcon = () => {
    switch (todo.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const overdue = isOverdue(todo.due_date);

  return (
    <div
      className={`
      bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow
      ${todo.status === "completed" ? "opacity-75" : ""}
      ${
        overdue && todo.status !== "completed"
          ? "border-red-300"
          : "border-gray-200"
      }
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleStatusClick}
            className="mt-1 hover:scale-110 transition-transform"
            aria-label={`Mark as ${
              todo.status === "completed" ? "pending" : "completed"
            }`}
          >
            {getStatusIcon()}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`
              font-medium text-gray-900 mb-1
              ${todo.status === "completed" ? "line-through text-gray-500" : ""}
            `}
            >
              {todo.title}
            </h3>

            {todo.description && (
              <p
                className={`
                text-sm text-gray-600 mb-2
                ${todo.status === "completed" ? "line-through" : ""}
              `}
              >
                {todo.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Priority Badge */}
              <span
                className={`
                px-2 py-1 rounded-full border text-xs font-medium
                ${getPriorityColor(todo.priority)}
              `}
              >
                {todo.priority}
              </span>

              {/* Status Badge */}
              <span
                className={`
                px-2 py-1 rounded-full border text-xs font-medium
                ${getStatusColor(todo.status)}
              `}
              >
                {todo.status.replace("-", " ")}
              </span>

              {/* Due Date */}
              {todo.due_date && (
                <div
                  className={`
                  flex items-center space-x-1
                  ${
                    overdue && todo.status !== "completed"
                      ? "text-red-600"
                      : "text-gray-500"
                  }
                `}
                >
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDate(todo.due_date)}
                    {overdue && todo.status !== "completed" && (
                      <span className="ml-1 text-red-600 font-medium">
                        (Overdue)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex items-center space-x-1 mt-2">
                <Tag className="w-3 h-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {todo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Edit todo"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete todo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
