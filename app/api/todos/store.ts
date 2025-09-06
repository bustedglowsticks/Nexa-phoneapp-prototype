export type Todo = {
  id: number;
  title: string;
  due?: string;
  canAiHandle: boolean;
  done?: boolean;
};

// Simple in-memory store for demo purposes only
// Note: This resets when the serverless function cold-starts or the server restarts.
let NEXT_ID = 4;
let TODOS: Todo[] = [
  { id: 1, title: 'Approve Crew A timesheets', due: 'Today 5:00 PM', canAiHandle: false, done: false },
  { id: 2, title: 'Confirm weekend outage window with Dispatch', due: 'Tomorrow 9:00 AM', canAiHandle: false, done: false },
  { id: 3, title: 'Email supplier about transformer lead times', due: 'Mon 10:30 AM', canAiHandle: true, done: false },
];

export function getTodos() {
  return TODOS;
}

export function addTodo(input: { title: string; due?: string; canAiHandle?: boolean }) {
  const created: Todo = {
    id: NEXT_ID++,
    title: input.title,
    due: input.due,
    canAiHandle: input.canAiHandle ?? false,
    done: false,
  };
  TODOS = [...TODOS, created];
  return created;
}

export function updateTodo(id: number, patch: Partial<Todo>): Todo | null {
  let found: Todo | null = null;
  TODOS = TODOS.map((t) => {
    if (t.id === id) {
      found = { ...t, ...patch };
      return found;
    }
    return t;
  });
  return found;
}
