<template>
  <div class="forces-demo-container">
    <div id="forces-demo"></div>
  </div>
</template>

<script>
import { select } from 'd3-selection'
import { drag as d3Drag } from 'd3-drag'
import { zoom as d3Zoom } from 'd3-zoom'
import { defineComponent, onMounted } from 'vue'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'

export default defineComponent({
  setup () {
    const forceAttributeInfo = {
      g: null,
      width: 0,
      height: 0,
      links: [],
      nodes: [],
      forceSimulation: null
    }
    const nodes = [
      { name: '中国', id: 'china', color: 'rgb(0,188,123)' },
      { name: '浙江', id: 'zhejiang', color: 'rgb(249,66,58)' },
      { name: '上海', id: 'shanghai', color: 'rgb(250,12,56)' },
      { name: '北京', id: 'beijing', color: 'rgb(32,32,32)' },
      { name: '江苏', id: 'jiangsu', color: 'rgb(66,66,66)' },
      { name: '广东', id: 'guangdong', color: 'rgb(20,30,80)' },
      { name: '杭州', id: 'hangzhou', color: 'rgb(126,150,20)' },
      { name: '宁波', id: 'ningbo', color: 'rgb(30,90,150)' },
      { name: '温州', id: 'wenzhou', color: 'rgb(80,122,135)' },
      { name: '绍兴', id: 'shaoxing', color: 'rgb(60,80,90)' },
      { name: '黄浦', id: 'huangpu', color: 'rgb(222,222,20)' },
      { name: '静安', id: 'jingan', color: 'rgb(50,86,88)' },
      { name: '徐汇', id: 'xuhui', color: 'rgb(66,88,99)' },
      { name: '东城', id: 'dongcheng', color: 'rgb(30,80,20)' },
      { name: '朝阳', id: 'chaoyang', color: 'rgb(20,80,150)' },
      { name: '南京', id: 'nanjing', color: 'rgb(70,52,26)' },
      { name: '苏州', id: 'suzhou', color: 'rgb(225,38,12)' },
      { name: '扬州', id: 'yangzhou', color: 'rgb(55,55,55)' },
      { name: '深圳', id: 'shenzhen', color: 'rgb(88,8,188)' },
      { name: '广州', id: 'guangzhou', color: 'rgb(20,180,255)' }
    ]
    const edges = [
      { source: 'china', target: 'zhejiang' },
      { source: 'china', target: 'shanghai' },
      { source: 'china', target: 'beijing' },
      { source: 'china', target: 'jiangsu' },
      { source: 'china', target: 'guangdong' },
      { source: 'zhejiang', target: 'hangzhou' },
      { source: 'zhejiang', target: 'ningbo' },
      { source: 'zhejiang', target: 'wenzhou' },
      { source: 'zhejiang', target: 'shaoxing' },
      { source: 'shanghai', target: 'huangpu' },
      { source: 'shanghai', target: 'jingan' },
      { source: 'shanghai', target: 'xuhui' },
      { source: 'beijing', target: 'dongcheng' },
      { source: 'beijing', target: 'chaoyang' },
      { source: 'jiangsu', target: 'nanjing' },
      { source: 'jiangsu', target: 'suzhou' },
      { source: 'jiangsu', target: 'yangzhou' },
      { source: 'guangdong', target: 'shenzhen' },
      { source: 'guangdong', target: 'guangzhou' }
    ]

    onMounted(() => {
      initCreateCanvas()
      createForceSimulation()
      drawsAllLinks()
      drawAllNodes()
    })

    /**
     * 初始化生成渲染画布
     */
    function initCreateCanvas () {
      const container = document.querySelector('#forces-demo')
      const { clientWidth: width, clientHeight: height } = container
      forceAttributeInfo.width = width
      forceAttributeInfo.height = height
      const SVG = select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
      forceAttributeInfo.g = SVG
        .append('g')
        .attr('class', 'container-out-g')
      const zoom = d3Zoom()
        .scaleExtent([0.1, 2])
        .on('zoom', function (event) {
          forceAttributeInfo.g.attr('transform', () => {
            return event.transform
          })
        })
      SVG.call(zoom).on('dblclick.zoom', null)
    }

    /**
     * 新建一个力导向图并且创建边数据和节点数据
     */
    function createForceSimulation () {
      const d3ForceSimulation = forceSimulation()
        .force('link', forceLink())
        .force('charge', forceManyBody())
        .force('center', forceCenter())

      // 生成节点数据
      d3ForceSimulation.nodes(nodes)
        .on('tick', tick)

      // 生成边数据
      d3ForceSimulation.force('link')
        .id(d => d.id)
        .links(edges)
        .distance(80)

      // forceManyBody() 初始化加载的时候创建一个使用默认参数的电荷力模型
      d3ForceSimulation.force('charge')
        .strength(-200)
        .distanceMin(80)

      // 设置图形中心点
      d3ForceSimulation.force('center')
        .x(forceAttributeInfo.width / 2)
        .y(forceAttributeInfo.height / 2)

      forceAttributeInfo.forceSimulation = d3ForceSimulation
    }

    /**
     * 绘制力导向图所有的节点元素
     */
    function drawAllNodes () {
      forceAttributeInfo.nodes = forceAttributeInfo.g
        .append('g')
        .attr('class', 'node-container')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .call(d3Drag()
          .on('start', start)
          .on('drag', drag)
          .on('end', end))

      forceAttributeInfo.nodes.append('circle')
        .attr('fill', d => d.color)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 20)

      forceAttributeInfo.nodes
        .append('text')
        .text(d => d.name)
        .attr('x', 0)
        .attr('y', 1)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#fff')
        .attr('font-weight', 'bold')
    }

    /**
     * 绘制力导向图的所有边
     */
    function drawsAllLinks () {
      forceAttributeInfo.links = forceAttributeInfo.g
        .append('g')
        .attr('class', 'link-container')
        .selectAll('line')
        .data(edges)
        .enter()
        .append('line')
        .attr('stroke', d => d.target.color)
        .attr('stroke-width', '2')
    }

    /**
     * 按指定的迭代次数手动执行仿真，并返回仿真
     */
    function tick () {
      forceAttributeInfo.links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      forceAttributeInfo.nodes
        .attr('transform', d => {
          return `translate(${d.x}, ${d.y})`
        })
    }

    function start (event) {
      event.sourceEvent.stopPropagation()
      if (!event.active) {
        forceAttributeInfo.forceSimulation.alphaTarget(0.1).restart()
      }
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function drag (event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function end (event) {
      if (!event.active) {
        forceAttributeInfo.forceSimulation.alphaTarget(0)
      }
      event.subject.fx = null
      event.subject.fy = null
    }
  }
})
</script>

<style lang="less" scoped>
.forces-demo-container {
  height: 100vh;
  overflow: hidden;
  #forces-demo {
    width: 100%;
    height: 100%;
  }
}
</style>
