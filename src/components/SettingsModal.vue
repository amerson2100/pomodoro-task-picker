<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showSettingsModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content" >
          <div class="modal-header">
            <h2>⚙️ 设置</h2>
            <button class="close-btn" @click="closeModal">×</button>
          </div>

          <div class="modal-body">
            <!-- 番茄钟时长 -->
            <section class="setting-section">
              <h3>番茄钟时长（分钟）</h3>
              <div class="duration-grid">
                <div class="duration-item">
                  <label>工作</label>
                  <input
                    type="number"
                    v-model.number="settings.workDuration"
                    min="1"
                    max="60"
                    @change="saveSettings"
                  />
                </div>
                <div class="duration-item">
                  <label>短休息</label>
                  <input
                    type="number"
                    v-model.number="settings.shortBreakDuration"
                    min="1"
                    max="30"
                    @change="saveSettings"
                  />
                </div>
                <div class="duration-item">
                  <label>长休息</label>
                  <input
                    type="number"
                    v-model.number="settings.longBreakDuration"
                    min="1"
                    max="60"
                    @change="saveSettings"
                  />
                </div>
              </div>
            </section>

            <!-- 音效 -->
            <section class="setting-section">
              <h3>音效</h3>
              <div class="setting-row">
                <span>启用音效</span>
                <button
                  class="toggle-btn"
                  :class="{ active: settings.soundEnabled }"
                  @click="toggleSound"
                >
                  <span class="toggle-slider" />
                </button>
              </div>
              <div v-if="settings.soundEnabled" class="volume-row">
                <span>音量</span>
                <input
                  type="range"
                  v-model.number="settings.soundVolume"
                  min="0"
                  max="1"
                  step="0.1"
                  @input="saveSettings"
                />
                <span class="volume-value">{{ Math.round(settings.soundVolume * 100) }}%</span>
              </div>
            </section>
          </div>

          <div class="modal-footer">
            <button class="btn-reset" @click="resetSettings">恢复默认</button>
            <button class="btn-close" @click="closeModal">完成</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();
const { settings, showSettingsModal } = storeToRefs(store);
const { updateSettings, saveSettings, resetSettings, closeModal } = store;

const toggleSound = () => {
  updateSettings({ soundEnabled: !settings.value.soundEnabled });
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}



.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-content.dark .close-btn {
  background: #2d2d44;
  color: #aaa;
}

.close-btn:hover {
  background: --text-primary (dark);
  color: white;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.setting-section {
  margin-bottom: 24px;
}

.setting-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: --text-primary (dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.modal-content.dark .setting-section h3 {
  color: #a0a0b0;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.setting-row span {
  font-size: 15px;
}

/* Toggle 开关 */
.toggle-btn {
  width: 52px;
  height: 28px;
  background: #dfe6e9;
  border: none;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-btn.active {
  background: --text-primary (dark);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-btn.active .toggle-slider {
  transform: translateX(24px);
}

/* 时长网格 */
.duration-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.duration-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.duration-item label {
  font-size: 13px;
  color: --text-primary (dark);
}

.modal-content.dark .duration-item label {
  color: #a0a0b0;
}

.duration-item input {
  padding: 10px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
  outline: none;
}

.modal-content.dark .duration-item input {
  background: #2d2d44;
  border-color: #3d3d5c;
  color: --text-primary (dark);
}

.duration-item input:focus {
  border-color: --text-primary (dark);
}

/* 音量滑块 */
.volume-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding-left: 8px;
}

.volume-row input[type="range"] {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #dfe6e9;
  border-radius: 2px;
  outline: none;
}

.modal-content.dark .volume-row input[type="range"] {
  background: #3d3d5c;
}

.volume-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: --text-primary (dark);
  border-radius: 50%;
  cursor: pointer;
}

.volume-value {
  font-size: 13px;
  color: --text-primary (dark);
  min-width: 36px;
  text-align: right;
}

.modal-content.dark .volume-value {
  color: #a0a0b0;
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 24px;
  border-top: 1px solid #f0f0f0;
}

.modal-content.dark .modal-footer {
  border-color: #2d2d44;
}

.btn-reset {
  padding: 10px 20px;
  background: none;
  border: 1px solid #dfe6e9;
  border-radius: 20px;
  font-size: 14px;
  color: --text-primary (dark);
  cursor: pointer;
  transition: all 0.2s;
}

.modal-content.dark .btn-reset {
  border-color: #3d3d5c;
  color: #a0a0b0;
}

.btn-reset:hover {
  border-color: --text-primary (dark);
  color: --text-primary (dark);
}

.btn-close {
  padding: 10px 32px;
  background: --text-primary (dark);
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #ff9f5a;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
