<template>
  <div class="circle-progress">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <!-- 背景圆环 -->
      <circle
        class="track"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />

      <!-- 进度圆环 -->
      <circle
        class="progress"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        :style="progressStyle"
      />
    </svg>

    <!-- 中间内容插槽 -->
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 280,
  strokeWidth: 12,
  trackColor: '#FFE5D0',
  progressColor: '#FF8C42'
});

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

// 限制 progress 在 0-100 范围内
const clampedProgress = computed(() => Math.max(0, Math.min(100, props.progress)));

const dashOffset = computed(
  () => circumference.value - (clampedProgress.value / 100) * circumference.value,
);

const progressStyle = computed(() => ({
  transition: "stroke-dashoffset 0.3s ease",
}));
</script>

<style scoped>
.circle-progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.track {
  opacity: 0.5;
}

.progress {
  transform: rotate(-90deg);
  transform-origin: center;
}

.content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
