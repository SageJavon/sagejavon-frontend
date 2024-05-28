<template>
  <div
    class="thumb-zx-xmind-map"
    :style="{ 'background-color': backgroundColor }">
    <div id="thumb-zx-xmind-map"></div>
    <div
      class="thumb-xmind-viewport"
      :style="{
        width: `${viewportScreen.width}px`,
        height: `${viewportScreen.height}px`,
        left: `${viewportBounding.left}px`,
        top: `${viewportBounding.top}px`,
        ...thumbStyle
      }">
      <div class="thumb-radio" :style="thumbStyle"></div>
    </div>
  </div>
</template>

<script>
import { select } from 'd3-selection'
import {
  createThumbContainer,
  renderNewNodes,
  renderUpdateNodes,
  renderDeleteNodes,
  renderNewEdges,
  renderUpdateEdges,
  renderDeleteEdges,
  renderXmindOtherElement
} from '../graph/thumbDraw'
import { ref, defineComponent, computed, nextTick, watch, onMounted } from 'vue'
let svg = null
let nodes = []
let edges = []
let mindContainer = null
let canvasWidth = 0
let canvasHeight = 0
export default defineComponent({
  props: {
    scaleNumber: {
      type: Number,
      default: 1
    },
    boundingClient: {
      type: Object,
      default: () => null
    }
  },
  setup (props, context) {
    const couldDragState = ref(false)
    const themeValue = ref(null)
    const structureValue = ref(null)
    const viewportScreen = ref({ width: 0, height: 0 })
    const scalceRadio = computed(() => {
      return 0.1 / props.scaleNumber
    })

    onMounted(() => {
      moveViewportBox()
    })

    /**
     * 初始化缩略图画布渲染所有元素
     * @param { String } id 生成画布容器id
     */
    function initThumbMindContainer () {
      const ele = document.getElementById('thumb-zx-xmind-map')
      canvasWidth = ele.clientWidth
      canvasHeight = ele.clientHeight
      svg = select(ele)
        .append('svg')
        .attr('id', 'thumb-zx-xmind-map-svg')
        .attr('width', canvasWidth)
        .attr('height', canvasHeight)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      mindContainer = svg
        .append('g')
        .attr('class', 'thumb-map-outter-container')
        .attr('transform', `scale(${scalceRadio.value})`)
      initThumbRnderCanvas()
      nextTick(() => {
        if (select('.thumb-x-mind-root-theme').empty()) return
        const { width, height } = select('.thumb-x-mind-root-theme').node().getBoundingClientRect()
        mindContainer
          .attr('transform', `translate(${(canvasWidth - width) / 2}, ${(canvasHeight - height) / 2}) scale(${scalceRadio.value})`)
      })
    }

    function initThumbRnderCanvas () {
      createThumbContainer(mindContainer)
      const relationNodes = nodes.filter(node => node.data.relations?.length)
      renderNewNodes(nodes, themeValue.value, structureValue.value)
      renderNewEdges(edges)
      renderXmindOtherElement(relationNodes)
    }

    function updateThumbXmindCanvas () {
      const relationNodes = nodes.filter(node => node.data.relations?.length)
      renderNewNodes(nodes, themeValue.value, structureValue.value)
      renderUpdateNodes(nodes)
      renderDeleteNodes(nodes)
      renderNewEdges(edges)
      renderUpdateEdges(edges)
      renderDeleteEdges(edges)
      renderXmindOtherElement(relationNodes)
    }

    function setThumbAttrs (nodeList, edgeList, theme, structure) {
      nodes = nodeList
      edges = edgeList
      themeValue.value = theme
      structureValue.value = structure
    }

    function moveViewportBox () {
      select('.thumb-xmind-viewport')
        .on('mouseenter', () => {
          couldDragState.value = false
        })
        .on('mouseleave', () => {
          couldDragState.value = false
        })
        .on('mousedown', (event) => {
          event.stopPropagation()
          couldDragState.value = true
        })
        .on('mousemove', event => {
          if (couldDragState.value) {
            context.emit('move-map', {
              x: event.movementX,
              y: event.movementY
            })
          }
        })
        .on('mouseup', () => {
          couldDragState.value = false
        })
    }

    const viewportBounding = computed(() => {
      const thumbmap = document.querySelector('.thumb-zx-xmind-map')
      const mindmap = document.querySelector('.thumb-map-outter-container')
      const thumbmapInfo = thumbmap?.getBoundingClientRect()
      const mindmapInfo = mindmap?.getBoundingClientRect()
      if (!props.boundingClient) {
        return {
          left: 0,
          top: 0
        }
      } else {
        return {
          left: (mindmapInfo?.left - thumbmapInfo?.left) - props.boundingClient.left * scalceRadio.value - 2,
          top: (mindmapInfo?.top - thumbmapInfo?.top) - props.boundingClient.top * scalceRadio.value - 2
        }
      }
    })

    watch(() => scalceRadio.value, () => {
      nextTick(() => {
        const sourceEle = document.getElementById('zx-xmind-map')
        if (sourceEle) {
          viewportScreen.value = {
            width: Math.ceil(sourceEle.clientWidth * scalceRadio.value),
            height: Math.ceil(sourceEle.clientHeight * scalceRadio.value)
          }
        }
      })
    }, { immediate: true })

    const backgroundColor = computed(() => {
      return themeValue.value?.backgroundColor
    })

    const thumbStyle = computed(() => {
      return {
        'border-color': themeValue.value?.thumbColor
      }
    })

    return {
      viewportScreen,
      scalceRadio,
      backgroundColor,
      viewportBounding,
      thumbStyle,
      setThumbAttrs,
      initThumbMindContainer,
      updateThumbXmindCanvas
    }
  }
})
</script>

<style lang="less">
.thumb-zx-xmind-map {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 260px;
  height: 146px;
  user-select: none;
  box-shadow: 0px 0px 18px 5px rgba(0,0,0,0.1);
  border-radius: 2px;
  overflow: hidden;
  &.thumb-hidden {
    visibility: hidden;
  }
  #thumb-zx-xmind-map {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .thumb-xmind-viewport {
    position: absolute;
    border: 2px solid #d53e78;
    left: 0;
    top: 0;
    box-sizing: content-box;
    border-radius: 4px;
    cursor: move;
    .thumb-radio {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid #d53e78;
      right: -5px;
      bottom: -5px;
      position: absolute;
      background: #fff;
    }
  }
}
</style>
