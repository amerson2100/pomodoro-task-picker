// 优先级
export type Priority = "high" | "medium" | "low";

// 待办事项
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  estimatedMinutes: number;
  completedPomodoros: number;
  createdAt: number;
}
// 筛选标签
export type FilterTag = 'all' | 'work' | 'life' | 'study' | 'other'