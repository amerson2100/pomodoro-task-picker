import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { useSettingsStore } from "./settings";
import { useSound } from "../composables/useSound";
import type { Todo } from "@/types/todo";

export type TimeMode = "work" | "shortBreak" | "longBreak";

const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const loadTodayData = () => {
  const saved = localStorage.getItem("timerData");
  if (!saved) return { date: getTodayString(), count: 0 };

  const data = JSON.parse(saved);
  const today = getTodayString();

  if (data.date !== today) {
    return { date: today, count: 0 };
  }

  return data;
};

export const useTimerStore = defineStore("timer", () => {
  const settingsStore = useSettingsStore();
  const getDuration = (mode: TimeMode) => {
    switch (mode) {
      case "work":
        return settingsStore.settings.workDuration;
      case "shortBreak":
        return settingsStore.settings.shortBreakDuration;
      case "longBreak":
        return settingsStore.settings.longBreakDuration;
    }
  };

  const mode = ref<TimeMode>("work"); //当前模式
  const timeLeft = ref(getDuration("work") * 60); //剩余时间(秒)
  const isRunning = ref(false); //是否运行
  const currentTask = ref<Todo | null>(null);

  // 加载今日数据
  const todayData = loadTodayData();
  const todayCount = ref(todayData.count);
  const lastDate = ref(todayData.date);

  let timerId: number | null = null; //定时器id

  // 监听日期变化，重置今日计数
const checkNewDay = () => {
  const currentDate = getTodayString();
  if (currentDate !== lastDate.value) {
    todayCount.value = 0;
    lastDate.value = currentDate;
    saveTodayData();
  }
};

const saveTodayData = () => {
  localStorage.setItem("timerData", JSON.stringify({ date: lastDate.value, count: todayCount.value }));
}

watch(todayCount, saveTodayData, { immediate: true })

  watch(
    () => settingsStore.settings,
    () => {
      if (!isRunning.value) {
        timeLeft.value = getDuration(mode.value) * 60;
      }
    },
    { deep: true },
  );

  const displayTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  });

  const totalTime = computed(() => getDuration(mode.value) * 60);

  const progress = computed(() => {
    return ((totalTime.value - timeLeft.value) / totalTime.value) * 100;
  });

  const modeText = computed(() => {
    const map = { work: "工作中", shortBreak: "短休息", longBreak: "长休息" };
    return map[mode.value];
  });

  const currentTaskName = computed(() => currentTask.value?.title || "准备开始");

  const start = () => {
    const { play } = useSound();
    if (isRunning.value) return;
    isRunning.value = true;
    play("click");
    timerId = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        complete();
      }
    }, 1000);
  };

  const pause = () => {
    isRunning.value = false;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const reset = () => {
    pause();
    timeLeft.value = getDuration(mode.value) * 60;
  };

  const skip = () => {
    pause();
    complete();
  };

  const complete = () => {
    pause();
    const { play } = useSound();
    if (mode.value === "work") {
      todayCount.value++;
      const isLongBreak = todayCount.value % 4 === 0;
      switchMode(isLongBreak ? "longBreak" : "shortBreak");
      play("complete");
    } else {
      play("complete");
      switchMode("work");
    }
  };

  const switchMode = (newMode: TimeMode) => {
    mode.value = newMode;
    timeLeft.value = getDuration(newMode) * 60;
  };

  const setMode = (newMode: TimeMode) => {
    pause();
    switchMode(newMode);
  };

  const startTask = (task: Todo) => {
    currentTask.value = task;
    setMode("work");
    start();
  };

  const clearTask = () => {
    currentTask.value = null;
  };
  return {
    mode,
    timeLeft,
    isRunning,
    todayCount,
    currentTask,
    displayTime,
    progress,
    modeText,
    currentTaskName,
    start,
    pause,
    reset,
    skip,
    setMode,
    startTask,
    clearTask,
  };
});
