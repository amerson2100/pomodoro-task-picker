<template>
  <div class="random-panel">
    <!-- 顶部装饰条 -->
    <div class="top-bar" />

    <!-- 标题 -->
    <div class="header">
      <h2 class="title">不知道做什么？</h2>
      <p class="subtitle">让运气来决定</p>
    </div>

    <!-- 筛选标签 -->
    <div class="filters">
      <button
        v-for="tag in tags"
        :key="tag.value"
        class="filter-btn"
        :class="{ active: filterTag === tag.value }"
        @click="setFilter(tag.value)"
      >
        {{ tag.label }}
      </button>
    </div>

    <!-- 随机按钮 -->
    <button class="roll-btn" :disabled="isRolling || !hasCandidates" @click="handleRoll">
      <IconDice :class="{ spinning: isRolling }" />
      <span>{{ isRolling ? "选取中..." : "随机选一个" }}</span>
    </button>

    <!-- 结果显示 -->
    <div v-if="displayTodo || selectedTodo" class="result" :class="{ confirmed: !!selectedId }">
      <div class="result-label">
        {{ isRolling ? "✨ 看看这个" : selectedId ? "🎯 就它了" : "" }}
      </div>
      <div class="result-title">{{ displayTodo?.title || selectedTodo?.title }}</div>
      <div class="result-meta">
        {{ displayTodo?.estimatedMinutes || selectedTodo?.estimatedMinutes }}分钟 ·
        {{
          displayTodo?.priority === "high"
            ? "高优先级"
            : displayTodo?.priority === "medium"
              ? "中优先级"
              : "低优先级"
        }}
      </div>

      <!-- 操作按钮 -->
      <div v-if="selectedId && !isRolling" class="result-actions">
        <button class="btn-start" @click="startThisTask">开始这个</button>
        <button class="btn-again" @click="clearResult">取消</button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!hasCandidates" class="empty">
      <div class="empty-icon">🎲</div>
      <div class="empty-text">没有待办任务</div>
      <div class="empty-hint">先去左边添加几个吧</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRandomStore } from "../stores/random";
import { useTimerStore } from "../stores/timer";
import IconDice from "../assets/icons/IconDice.vue";

const randomStore = useRandomStore();
const timerStore = useTimerStore();

const { isRolling, filterTag, displayTodo, selectedId, hasCandidates, selectedTodo } =
  storeToRefs(randomStore);
const { setFilter, roll, clearResult } = randomStore;

const tags = [
  { value: "all", label: "全部" },
  { value: "work", label: "工作" },
  { value: "life", label: "生活" },
  { value: "study", label: "学习" },
  { value: "other", label: "琐事" },
];

const handleRoll = () => {
  roll();
};

const startThisTask = () => {
  if (selectedTodo.value) {
    timerStore.startTask(selectedTodo.value);
  }
};
</script>

<style scoped>
.random-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  border: 1px solid #FFD93D;
  overflow: hidden;
  position: relative;
}

.top-bar {
  height: 6px;
  background: #FFD93D;
}

.header {
  padding: 24px 24px 16px;
  text-align: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #636E72;
  font-family: 'ZCOOL XiaoWei', cursive;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 20px 16px;
  justify-content: center;
}

.filter-btn {
  padding: 6px 14px;
  background: #FFF8F0;
  border: 1px solid #FFE5D0;
  border-radius: 20px;
  font-size: 13px;
  color: #636E72;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #FFD93D;
}

.filter-btn.active {
  background: #FFD93D;
  border-color: #FFD93D;
  color: #2D3436;
  font-weight: 500;
}

.roll-btn {
  margin: 0 24px 24px;
  padding: 20px;
  background: #FFD93D;
  border: none;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(255, 217, 61, 0.3);
}

.roll-btn:hover:not(:disabled) {
  background: #FFE066;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 217, 61, 0.4);
}

.roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.roll-btn svg {
  width: 32px;
  height: 32px;
  color: #2D3436;
  transition: transform 0.3s;
}

.roll-btn svg.spinning {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.roll-btn span {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
}

.result {
  margin: 0 24px 24px;
  padding: 20px;
  background: #FFF8F0;
  border-radius: 16px;
  border: 2px dashed #FFE5D0;
  text-align: center;
  transition: all 0.3s;
}

.result.confirmed {
  border-style: solid;
  border-color: #FF8C42;
  background: white;
  box-shadow: 0 4px 16px rgba(255, 140, 66, 0.1);
}

.result-label {
  font-size: 13px;
  color: #FF8C42;
  font-weight: 500;
  margin-bottom: 8px;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
  line-height: 1.4;
}

.result-meta {
  font-size: 13px;
  color: #636E72;
}

.result-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
}

.btn-start {
  padding: 10px 20px;
  background: #FF8C42;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-start:hover {
  background: #FF9F5A;
}

.btn-again {
  padding: 10px 20px;
  background: white;
  color: #636E72;
  border: 1px solid #FFE5D0;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-again:hover {
  border-color: #FF8C42;
  color: #FF8C42;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  color: #636E72;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 13px;
  opacity: 0.7;
}
</style>