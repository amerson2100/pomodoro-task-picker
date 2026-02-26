<template>
  <div class="app" >
    <!-- 导航 -->
    <nav class="navbar">
      <div class="logo">🍅 Focus</div>
      <div class="date">{{ currentDate }}</div>
      <n-button class="settings-btn" @click="openModal">设置</n-button>
    </nav>
    <!-- 主体三栏 -->
    <main class="main-container">
      <TodoPanel class="panel-left" />
      <TimerPanel class="panel-center" />
      <RandomPanel class="panel-right" />
    </main>
    <!-- 弹窗 -->
    <SettingsModal />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "./stores/settings";
import TodoPanel from "./views/TodoPanel.vue";
import TimerPanel from "./views/TimerPanel.vue";
import RandomPanel from "./views/RandomPanel.vue";
import SettingsModal from "./components/SettingsModal.vue";
import { NButton } from "naive-ui";

const settingsStore = useSettingsStore();
const { openModal } = settingsStore;

const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
});
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff8f0;
}

/* 顶部导航 */
.navbar {
  height: 54px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(255, 140, 66, 0.08);
  flex-shrink: 0;
}

.logo {
  font-size: 20px;
  font-weight: 700;
}

.date {
  font-size: 14px;
  color: #636E72;
}

.settings-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: #636E72;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-btn:hover {
  background:  #FFF8F0;
  color: var #FF8C42;
}

/* 主体容器 */
.main-container {
  width: 100%;
  flex: 1;
  display: flex;
  overflow: hidden;
  gap: 16px;
}

/* 三栏宽度 */
.panel-left,
.panel-right {
  width: 25%;
  min-width: 280px;
  overflow-y: auto;
  flex-shrink: 0;
}

.panel-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
}
</style>
