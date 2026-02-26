import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Todo } from "@/types/todo";
import { useTodoStore } from "./todo";

export const useRandomStore = defineStore("random", () => {
  const isRolling = ref(false);
  const selectedId = ref<string | null>(null);
  const filterTag = ref("all");
  const displayTodo = ref<Todo | null>(null);

  const todoStore = useTodoStore();

  const candidateTodos = computed(() => {
    let list = todoStore.todos.filter((t) => !t.completed);
    if (filterTag.value !== "all") {
      list = list.filter((t) => t.title.toLowerCase().includes(filterTag.value.toLowerCase()));
    }

    return list;
  });

  const hasCandidates = computed(() => candidateTodos.value.length > 0);

  const selectedTodo = computed((): Todo | null => {
    if (!selectedId.value) return null;
    return todoStore.todos.find((t) => t.id === selectedId.value) ?? null;
  });

  const setFilter = (tag: string) => {
    filterTag.value = tag;
  };

  const roll = async (): Promise<Todo | null> => {
    if (isRolling.value || candidateTodos.value.length === 0) return null;
    isRolling.value = true;
    selectedId.value = null;

    //滚动动画
    const totalRolls = 20;
    const interval = 10;

    for (let i = 0; i < totalRolls; i++) {
      const randomIndex = Math.floor(Math.random() * candidateTodos.value.length);
      const todo = candidateTodos.value[randomIndex];
      if (todo) {
        displayTodo.value = todo;
      }
      await sleep(interval + i * 10);
    }

    //最终结果
    const finalIndex = Math.floor(Math.random() * candidateTodos.value.length);
    const finalTodo = candidateTodos.value[finalIndex];
    if (finalTodo) {
      selectedId.value = finalTodo.id;
      displayTodo.value = finalTodo;
    }

    isRolling.value = false;

    return finalTodo??null
  };

  const clearResult = () => {
    selectedId.value = null;
    displayTodo.value = null;
  };

  return {
    isRolling,
    selectedId,
    filterTag,
    displayTodo,
    candidateTodos,
    hasCandidates,
    selectedTodo,
    setFilter,
    roll,
    clearResult,
  };
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
