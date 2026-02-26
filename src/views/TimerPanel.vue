<template>
  <div class="timer-panel">
    <!-- 当前任务 -->
    <div class="current-task">
      <span class="label">当前专注</span>
      <h3 class="task-name">{{ currentTaskName }}</h3>
      <button v-if="currentTask" class="clear-btn" @click="clearTask">清除</button>
    </div>
    <!-- 番茄钟圆环 -->
    <div class="timer-circle">
      <Circleprogress
        :progress="progress"
        :size="320"
        :stroke-width="44"
        :track-color="trackColor"
        :progress-color="progressColor"
      >
        <div class="timer-content">
          <div class="time">{{ displayTime }}</div>
          <div class="mode-badge" :style="{ color: progressColor }">
            {{ modeText }}
          </div>
        </div>
      </Circleprogress>
    </div>
    <!-- 控制按钮 -->
    <div class="controls">
      <button v-if="!isRunning" class="btn-primary" @click="start">
        <IconPlay class="play" />
        {{ currentTask ? "继续" : "开始专注" }}
      </button>

      <button v-else class="btn-primary paused" @click="pause">
        <IconPause class="play" />
        暂停
      </button>

      <div class="secondary-controls">
        <button class="btn-text" @click="reset">
  
          重置
        </button>
        <button class="btn-text" @click="skip">跳过</button>
      </div>
    </div>

    <!-- 今日统计 -->
    <div class="stats">
      <p v-if="currentTask" class="task-progress">
        本任务: {{ currentTask.completedPomodoros }} 个番茄
      </p>
      <span class="tomato-count">🍅 今日完成 {{ todayCount }} 个番茄</span>
    </div>
    <!-- 模式切换 -->
    <div class="mode-switch">
      <button
        v-for="m in modes"
        :key="m.value"
        class="mode-btn"
        :class="{ active: mode === m.value }"
        @click="setMode(m.value)"
      >
        {{ m.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTimerStore } from "@/stores/timer";
import { useTodoStore } from "@/stores/todo";
import Circleprogress from "@/components/Circleprogress.vue";
import IconPlay from "../assets/icons/IconPlay.vue";
import IconPause from "../assets/icons/IconPause.vue";


const store = useTimerStore();
const todoStore = useTodoStore();
const {
  mode,
  isRunning,
  todayCount,
  currentTask,
  displayTime,
  progress,
  modeText,
  currentTaskName,
} = storeToRefs(store);
const { start, pause, reset, skip, setMode, clearTask } = store;

const modes = [
  { value: "work", label: "工作" },
  { value: "shortBreak", label: "短休" },
  { value: "longBreak", label: "长休" },
] as const;

const colors = {
  work: { track: '#FFE5D0', progress: '#FF8C42' },
  shortBreak: { track: '#D4F8E8', progress: '#6BCB77' },
  longBreak: { track: '#FFF4D6', progress: '#FFD93D' }
}
const trackColor = computed(() => colors[mode.value].track);
const progressColor = computed(() => colors[mode.value].progress);

watch(
  () => todayCount.value,
  (newVal, oldVal) => {
    if (newVal > oldVal && currentTask.value) {
      todoStore.incrementPomodoro(currentTask.value.id);
    }
  },
);
</script>

<style scoped>
.timer-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.current-task {
  text-align: center;
  position: relative;
}

.current-task .label {
  font-size: 14px;
  color: #636E72;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.current-task .task-name {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 600;
  color: #2D3436;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear-btn {
  margin-top: 8px;
  padding: 4px 12px;
  background: none;
  border: 1px solid #FFE5D0;
  border-radius: 12px;
  font-size: 12px;
  color: #636E72;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #FF8C42;
  color: #FF8C42;
}

.timer-circle {
  position: relative;
}

.timer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 56px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #2D3436;
  line-height: 1;
}

.mode-badge {
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 48px;
  background: #FF8C42;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(255, 140, 66, 0.3);
}

.btn-primary:hover {
  background: #FF9F5A;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 140, 66, 0.4);
}

.btn-primary.paused {
  background: #FFD93D;
  color: #2D3436;
  box-shadow: 0 4px 16px rgba(255, 217, 61, 0.3);
}

.secondary-controls {
  display: flex;
  gap: 24px;
}

.play {
  width: 20px;
  height: 20px;
}

.btn-text {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #636E72;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-text:hover {
  color: #FF8C42;
}

.stats {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tomato-count {
  font-size: 14px;
  color: #FF8C42;
  font-weight: 500;
}

.task-progress {
  font-size: 12px;
  color: #636E72;
}

.mode-switch {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #FFF8F0;
  border-radius: 12px;
}

.mode-btn {
  padding: 8px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  color: #636E72;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.active {
  background: white;
  color: #FF8C42;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>
