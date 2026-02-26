import { ref } from "vue";
import { defineStore } from "pinia";
import type { Settings } from "@/types/settings";

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  soundVolume: 0.5,
};

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<Settings>({ ...DEFAULT_SETTINGS });
  const showSettingsModal = ref(false);

  // Actions
  const loadSettings = () => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  };

  const saveSettings = () => {
    localStorage.setItem("settings", JSON.stringify(settings.value));
  };

  const updateSettings = (partial: Partial<Settings>) => {
    settings.value = { ...settings.value, ...partial };
    saveSettings();
  };

  const resetSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS };
    saveSettings();
  };

  const openModal = () => {
    showSettingsModal.value = true;
  };

  const closeModal = () => {
    showSettingsModal.value = false;
  };

  loadSettings();

  return {
    settings,
    showSettingsModal,
    loadSettings,
    saveSettings,
    updateSettings,
    resetSettings,
    openModal,
    closeModal,
  };
});
