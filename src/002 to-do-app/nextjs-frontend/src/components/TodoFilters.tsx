"use client";

import React from "react";
import { Filter, ArrowUpDown, Search, X } from "lucide-react";
import type { TodoFilters } from "@/types/todo";

interface TodoFiltersProps {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
  totalCount: number;
}

export default function TodoFilters({
  filters,
  onFiltersChange,
  totalCount,
}: TodoFiltersProps) {
  const handleFilterChange = (
    key: keyof TodoFilters,
    value: string | number
  ) => {
    const newFilters = {
      ...filters,
      [key]: value === "" ? undefined : value,
      page: 1, // Reset to first page when filters change
    };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit || 10,
    });
  };

  const hasActiveFilters =
    filters.status || filters.priority || filters.tags || filters.sortBy;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">
            Filters & Sorting
          </h3>
          {totalCount > 0 && (
            <span className="text-sm text-gray-500">
              ({totalCount} todo{totalCount !== 1 ? "s" : ""})
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label
            htmlFor="status-filter"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {" "}
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label
            htmlFor="priority-filter"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority-filter"
            value={filters.priority || ""}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="sort-filter"
            className="flex items-center text-xs font-medium text-gray-700 mb-1"
          >
            <ArrowUpDown className="w-3 h-3 mr-1" />
            Sort By
          </label>
          <select
            id="sort-filter"
            value={`${filters.sortBy || ""}-${filters.sortOrder || ""}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              if (sortBy && sortOrder) {
                handleFilterChange("sortBy", sortBy);
                handleFilterChange("sortOrder", sortOrder);
              } else {
                handleFilterChange("sortBy", "");
                handleFilterChange("sortOrder", "");
              }
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="-">Default</option>
            <option value="due_date-asc">Due Date (Earliest)</option>
            <option value="due_date-desc">Due Date (Latest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="priority-asc">Priority (Low to High)</option>
            <option value="created_at-desc">Created (Newest)</option>
            <option value="created_at-asc">Created (Oldest)</option>
          </select>
        </div>

        {/* Tags Filter */}
        <div>
          <label
            htmlFor="tags-filter"
            className="flex items-center text-xs font-medium text-gray-700 mb-1"
          >
            <Search className="w-3 h-3 mr-1" />
            Search Tags
          </label>
          <input
            type="text"
            id="tags-filter"
            value={filters.tags || ""}
            onChange={(e) => handleFilterChange("tags", e.target.value)}
            placeholder="Enter tag name..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Active filters:</span>

          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Status: {filters.status}
              <button
                onClick={() => handleFilterChange("status", "")}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.priority && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Priority: {filters.priority}
              <button
                onClick={() => handleFilterChange("priority", "")}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.tags && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
              Tag: {filters.tags}
              <button
                onClick={() => handleFilterChange("tags", "")}
                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.sortBy && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
              Sort: {filters.sortBy} ({filters.sortOrder})
              <button
                onClick={() => {
                  handleFilterChange("sortBy", "");
                  handleFilterChange("sortOrder", "");
                }}
                className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
