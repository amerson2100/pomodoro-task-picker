<template>
  <div class="todo-panel">
    <!-- 头部 -->
    <div class="panel-header">
      <h2 class="title">
        待办清单
        <span class="count">{{ uncompletedCount }}</span>
      </h2>
      <button class="add-btn" @click="openAddForm">
        <IconPlus />
      </button>
    </div>

    <!-- 添加表单 -->
    <div v-if="showAddForm" class="add-form">
      <input
        v-model="newTitle"
        type="text"
        placeholder="输入..."
        @keyup.enter="handleAdd"
        ref="inputRef"
      />
      <div class="form-row">
        <select v-model="newPriority">
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
        <input v-model.number="newMinutes" type="number" min="5" max="300" step="5" />
        <span class="unit">分钟</span>
      </div>
      <div class="form-actions">
        <button class="btn-cancel" @click="showAddForm = false">取消</button>
        <button class="btn-confirm" @click="handleAdd">添加</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="todo-list">
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ completed: todo.completed, active: timerStore.currentTask?.id === todo.id }"
        @click="handleTaskClick(todo)"
      >
        <!-- 优先级条 -->

        <div class="priority-bar" :class="todo.priority" />

        <!-- 复选框 -->
        <button class="checkbox" @click="toggleTodo(todo.id)">
          <IconCheck v-if="todo.completed" />
        </button>

        <!-- 内容 -->
        <div class="content">
          <div class="title">{{ todo.title }}</div>
          <div class="meta">
            {{ todo.estimatedMinutes }}分钟
            <span v-if="todo.completedPomodoros > 0">
              · 已完成 {{ todo.completedPomodoros }} 个番茄
            </span>
          </div>
        </div>

        <!-- 删除 -->
        <button class="delete-btn" @click="deleteTodo(todo.id)">×</button>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTodos.length === 0" class="empty">
        <div class="empty-icon">📝</div>
        <div class="empty-text">还没有任务</div>
        <div class="empty-hint">点击右上角 + 添加</div>
      </div>
    </div>

    <!-- 统计 -->
    <div class="panel-footer">
      <span>已完成{{ completedCount }}个</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useTimerStore } from "@/stores/timer";
import { useTodoStore } from "@/stores/todo";
import type { Todo, Priority } from "../types/todo";
import IconPlus from "../assets/icons/IconPlus.vue";
import IconCheck from "../assets/icons/IconCheck.vue";

const store = useTodoStore();
const timerStore = useTimerStore();

const { filteredTodos, uncompletedCount, completedCount } = storeToRefs(store);
const { addTodo, toggleTodo, deleteTodo } = store;

const showAddForm = ref(false);
const newTitle = ref("");
const newPriority = ref<Priority>("medium");
const newMinutes = ref(25);
const inputRef = ref<HTMLInputElement>();

//聚焦
const openAddForm = () => {
  showAddForm.value = true;
  nextTick(() => inputRef.value?.focus());
};

//添加任务
const handleAdd = () => {
  if (!newTitle.value.trim()) return;
  addTodo(newTitle.value.trim(), newPriority.value, newMinutes.value);
  newTitle.value = "";
  newPriority.value = "medium";
  newMinutes.value = 25;
  showAddForm.value = false;
};

const handleTaskClick = (todo: Todo) => {
  if (todo.completed) {
    toggleTodo(todo.id);
  } else {
    timerStore.startTask(todo);
  }
};
</script>

<style scoped>

.todo-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  border: 1px solid #FFE5D0;
  overflow: hidden;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-bottom: 8px;
  background: white;
  border-radius: 12px;
  position: relative;
  transition: all 0.2s;
  cursor: pointer;
}

.todo-item:hover {
  background: #FFF8F0;
}

.todo-item.active {
  background: #FFF8F0;
  border: 2px solid #FF8C42;
  padding: 14px; 
}

.todo-item.completed {
  opacity: 0.6;
}

.doing {
  color: #FF8C42;
  font-weight: 500;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #FFF8F0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: #FF8C42;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
}

.add-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FF8C42;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #FF9F5A;
  transform: scale(1.05);
}

.add-form {
  padding: 16px 24px;
  background: #FFF8F0;
  border-bottom: 1px solid #FFE5D0;
}

.add-form input[type="text"] {
  width: 80%;
  padding: 12px 16px;
  border: 1px solid #FFE5D0;
  border-radius: 12px;
  font-size: 15px;
  margin-bottom: 12px;
  outline: none;
}

.add-form input[type="text"]:focus {
  border-color: #FF8C42;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row select,
.form-row input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #FFE5D0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
}

.form-row input[type="number"] {
  width: 70px;
}

.unit {
  font-size: 14px;
  color: #636E72;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  padding: 8px 16px;
  background: none;
  border: none;
  color: #636E72;
  font-size: 14px;
  cursor: pointer;
}

.btn-confirm {
  padding: 8px 20px;
  background: #FF8C42;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.todo-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.priority-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  border-radius: 2px;
}

.priority-bar.high { background: #FF8C42; }
.priority-bar.medium { background: #FFD93D; }
.priority-bar.low { background: #6BCB77; }

.checkbox {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 2px solid #FFD93D;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox:hover {
  border-color: #FF8C42;
}

.todo-item.completed .checkbox {
  background: #6BCB77;
  border-color: #6BCB77;
  color: white;
}

.content {
  flex: 1;
  min-width: 0;
}

.content .title {
  font-size: 15px;
  color: #2D3436;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-item.completed .title {
  text-decoration: line-through;
  color: #636E72;
}

.meta {
  font-size: 12px;
  color: #636E72;
}

.delete-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #B2BEC3;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: #FF8C42;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #636E72;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 13px;
  opacity: 0.7;
}

.panel-footer {
  padding: 16px 24px;
  border-top: 1px solid #FFF8F0;
  font-size: 13px;
  color: #636E72;
  text-align: center;
}
</style>