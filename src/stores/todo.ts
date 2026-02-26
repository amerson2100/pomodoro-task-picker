import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Todo, Priority, FilterTag } from "@/types/todo";

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<Todo[]>([]);
  const filter = ref<FilterTag>("all");

  //   计算属性
  const filteredTodos = computed(() => {
    if (filter.value === "all") return todos.value;
    return todos.value.filter((t) => !t.completed);
  });
  const uncompletedCount = computed(() => todos.value.filter((t) => !t.completed).length);
  const completedCount = computed(() => todos.value.filter((t) => t.completed).length);

  //   方法
  const addTodo = (title: string, priority: Priority = "medium", minutes: number = 25) => {
    const todo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      estimatedMinutes: minutes,
      completedPomodoros: 0,
      createdAt: Date.now(),
    };
    todos.value.unshift(todo);
    saveToStorage();
  };
  const toggleTodo = (id: string) => {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveToStorage();
    }
  };
  const deleteTodo = (id: string) => {
    todos.value = todos.value.filter((t) => t.id !== id);
    saveToStorage();
  };

  const incrementPomodoro = (id: string) => {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.completedPomodoros++;
      saveToStorage();
    }
  };

  const saveToStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos.value));
  };
  const loadFromStorage = () => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      todos.value = JSON.parse(saved);
    }
  };
  loadFromStorage();

  return {
    todos,
    filter,
    filteredTodos,
    uncompletedCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    incrementPomodoro,
  };
});
