# Product Requirements Document (PRD): Todo App

## Purpose

A simple todo application for a single user to manage tasks efficiently, with support for priorities and tags.

## Features

1. Task Management

   - Create, read, update, and delete todo items.
   - Each todo has:
     - Title (required)
     - Description (optional)
     - Status: Pending or Completed
     - Due date (optional)
     - Priority: Low, Medium, High
     - Tags: Multiple, user-defined

2. Filtering & Sorting

   - Filter todos by status, priority, or tags.
   - Sort todos by due date or priority.

3. No user accounts or sharing.

## Non-Functional Requirements

- Responsive and intuitive UI.
- Fast backend API.
- Data persistence (local database or file).

## Out of Scope

- User authentication
- Multi-user support
- Task sharing
