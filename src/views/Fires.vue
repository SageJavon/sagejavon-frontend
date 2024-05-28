<template>
  <div class="fires-canvas">
    <canvas id="fires-work"></canvas>
    <svg id="svg" class="svg" style="width: 100%; height: 100%">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="10%" y2="0%">
          <stop offset="0%" style="stop-color:#02fbe4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:transparent;stop-opacity:1" />
        </linearGradient>
      </defs>
      <g stroke-width="0.1">
        <path class="cruve-path" d="M0,963 L690,574 1230,880 1630,630 1380,490 1530,380 1320,250 1720,0" fill="none" stroke="#fff" ></path>
        <path class="cruve-path1" d="M0,963 L690,574 578,510 710,428 595,358 400,470 0,220" fill="none" stroke="#fff" ></path>
        <path class="cruve-path2" d="M0,963 L690,574 578,510 710,428 595,358 970,140 740,0" fill="none" stroke="#fff" ></path>
        <path class="cruve-path3" d="M0,963 L690,574 1230,880 1630,630 1380,490 1125,677 595,358" fill="none" stroke="#fff" ></path>
      </g>

      <path
        class="line-cruve-path"
        d="M0,963 L690,574 1230,880 1630,630 1380,490 1530,380 1320,250 1720,0"
        stroke="#34ef90"
        stroke-width="3"
        fill="none"
        stroke-dasharray='150 3076'
        stroke-linecap="round"></path>
      <path
        class="line-cruve-path1"
        d="M0,963 L690,574 578,510 710,428 595,358 400,470 0,220"
        stroke="#02fbe4"
        stroke-width="3"
        fill="none"
        stroke-dasharray='150 1908'
        stroke-linecap="round"></path>
      <path
        class="line-cruve-path2"
        d="M0,963 L690,574 578,510 710,428 595,358 970,140 740,0"
        stroke="#e82fe7"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray='150 1915'></path>
      <path
        class="line-cruve-path3"
        d="M0,963 L690,574 1230,880 1630,630 1380,490 1125,677 595,358"
        stroke="#34ef90"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray='150 3106'></path>
    </svg>
  </div>
</template>

<script>
import fireworkCanvas from '@/utils/firework'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  setup () {
    onMounted(() => {
      console.log(document.querySelector('.cruve-path').getTotalLength())
      console.log(document.querySelector('.cruve-path1').getTotalLength())
      console.log(document.querySelector('.cruve-path2').getTotalLength())
      console.log(document.querySelector('.cruve-path3').getTotalLength())
      fireworkCanvas('fires-work')
    })
  }
})
</script>

<style lang="less">
.fires-canvas {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

#svg {
  z-index: 999;
  pointer-events: none;
  position: fixed;
  inset: 0;
}

.line-cruve-path {
  animation: move 4s linear infinite;
}
.line-cruve-path1 {
  animation: move1 4s linear infinite;
}
.line-cruve-path2 {
  animation: move2 4s linear infinite;
}
.line-cruve-path3 {
  animation: move3 4s linear infinite;
}

@keyframes move {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -3076;
  }
}
@keyframes move1 {
  0% {
    stroke-dashoffset: 150;
  }
  25% {
    stroke-dashoffset: 150;
  }
  100% {
    stroke-dashoffset: -1908;
  }
}
@keyframes move2 {
  0% {
    stroke-dashoffset: 150;
  }
  50% {
    stroke-dashoffset: 150;
  }
  100% {
    stroke-dashoffset: -1915;
  }
}
@keyframes move3 {
  0% {
    stroke-dashoffset: 150;
  }
  100% {
    stroke-dashoffset: -3106;
  }
}
</style>
