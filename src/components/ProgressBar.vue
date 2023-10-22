<template>
  <div
    class="progress-container"
    max="100"
    :style="[{ 'max-width': maxWidth }]"
  >
    <div class="progress" :style="[{ background: `var(--${color}-hover)` }]">
      <span
        class="progress-bar"
        :style="[
          { width: `${aploadValue}%` },
          { background: `var(--${color})` },
        ]"
      >
        Loading...{{ aploadValue.toFixed() + '%' }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    aploadValue: Number,
    maxWidth: {
      type: String,
      default: '300px',
    },
    color: {
      type: String,
      default: 'primary-progress',
    },
    progress: Number,
  },
  current: 'uploadValue',
}
</script>

<style  scoped>
.progress {
  border-radius: 4px;
}
.progress-container {
  margin-top: 20px;
  margin-bottom: 20px;
}
.progress-bar {
  background: #000;

  border-radius: 4px;
  transition: 0.5s;

  display: block;
  text-align: center;
  padding: 10px;
  font-weight: bold;
  font-size: 17px;
}
</style>