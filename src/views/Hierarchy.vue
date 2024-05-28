<script>
import { linkHorizontal } from 'd3'
import { drag as d3Drag } from 'd3-drag'
import { hierarchy, tree } from 'd3-hierarchy'
import { select, selectAll } from 'd3-selection'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom'
import { defineComponent, nextTick, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const imageIconMap = {
      Table: require('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/snowflakelogo.png'),
      Chart: require('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/supersetlogo.png'),
      PostgreSQL: require('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/postgreslogo.png'),
      Task: require('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/airflowlogo.png'),
      Dataset: require('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/s3.png'),
    }
    const canvasObject = {
      g: null,
      width: 0,
      height: 0,
      nodeWidth: 166,
      nodeHeight: 56,
      nodes: [],
    }
    const linkGenerator = linkHorizontal()
      .x(d => d.x)
      .y(d => d.y)
    const edges = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 1, target: 4 },
      { source: 1, target: 5 },
      { source: 1, target: 6 },
      { source: 1, target: 9 },
      { source: 2, target: 7 },
      { source: 4, target: 7 },
      { source: 5, target: 6 },
      { source: 5, target: 9 },
      { source: 6, target: 11 },
      { source: 8, target: 7 },
      { source: 9, target: 8 },
      { source: 9, target: 10 },
      { source: 10, target: 7 },
    ]
    const root = {
      name: 'all_entities',
      typeName: 'Snowflake',
      type: 'Table',
      id: 1,
      children: [
        {
          name: 'Number of Datasets',
          typeName: 'Superset',
          type: 'Task',
          id: 2,
          parentNumber: 2,
          children: [
            { name: 'Datahub Metadata Analytics', typeName: 'Superset', type: 'Chart', id: 7, parentNumber: 3 },
          ],
        },
        { name: 'Entities by type', typeName: 'Superset', type: 'Chart', id: 3, parentNumber: 3 },
        { name: 'Types of Entities', typeName: 'Superset', type: 'Dataset', id: 4, parentNumber: 2 },
        { name: 'generated_dataset_platforms', typeName: 'Snowflake', type: 'Task', id: 5 },
        {
          name: 'generated_latest_dataset_owners',
          typeName: 'Snowflake',
          type: 'Dataset',
          id: 6,
          children: [
            { name: 'Number of Dataset Owners by Data Platform', typeName: 'Superset', type: 'PostgreSQL', id: 11, parentNumber: 1 },
          ],
          parentNumber: 1,
        },
        {
          name: 'generated_latest_dataset_info',
          typeName: 'Snowflake',
          type: 'Task',
          id: 9,
          parentNumber: 2,
          children: [
            { name: 'Dataset Documentation Completeness by Data Platform', typeName: 'Superset', type: 'Chart', id: 8, parentNumber: 2 },
            { name: 'Upstream Lineage Completeness', typeName: 'Superset', type: 'Task', id: 10, parentNumber: 1 },
          ],
        },
      ],
    }

    onMounted(() => {
      initCreateCanvas()
      dataTreeLayoutPackage()
      batchRenderNodes()
      batchRenderLinks()
    })

    /**
     * 根据根节点root平铺所有节点数据并且赋予节点x/y坐标
     */
    function dataTreeLayoutPackage() {
      const { nodeWidth, nodeHeight } = canvasObject
      // 生成一个树形布局，并且设置每个节点的固定宽高
      const d3Tree = tree()
        .nodeSize([nodeHeight + 24, nodeWidth + 90])
        .separation(() => 1)
      const hierarchydata = d3Tree(hierarchy(root, d => d.children))
      canvasObject.nodes = hierarchydata.descendants({ tx: 0 })
      canvasObject.nodes.forEach((node) => {
        node.tx = 0
        node.ty = 0
      })
    }

    function initCreateCanvas() {
      const container = document.querySelector('#hierarchy-demo')
      const { clientWidth: width, clientHeight: height } = container
      canvasObject.width = width
      canvasObject.height = height
      const SVG = select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('style', 'cursor: grab')
      canvasObject.g = SVG
        .append('g')
        .attr('class', 'container-out-g')
      const zoom = d3Zoom()
        .scaleExtent([0.1, 2])
        .extent([[200, 200], [width - 200, height - 200]])
        .on('start', function (event) {
          if (event.sourceEvent && event.sourceEvent.type !== 'wheel')
            select(this).attr('style', 'cursor: grabbing')
        }).on('zoom', (event) => {
          canvasObject.g.attr('transform', () => event.transform)
        }).on('end', function () {
          select(this).attr('style', 'cursor: grab')
        })
      SVG.on('contextmenu', event => event.preventDefault())
        .call(zoom)
        .on('dblclick.zoom', null)
      customerDefsCreate(SVG)
      nextTick(() => {
        // 初始化平移和缩放
        SVG
          .call(zoom.transform,
            zoomIdentity
              .translate(200, canvasObject.height / 2))
      })
    }

    function batchRenderLinks() {
      canvasObject.g
        .insert('g', '.nodes-container')
        .attr('class', 'links-container')
        .selectAll('.link-block')
        .data(edges)
        .enter()
        .append('g')
        .attr('class', 'link-block')
        .append('path')
        .attr('d', ({ source, target }) => {
          const [sourceData, targetData] = [source, target].map((n) => {
            return selectAll('.node-block')
              .filter(({ data }) => data.id === n)
              .datum()
          })
          const sp = {
            x: sourceData.y + canvasObject.nodeWidth,
            y: sourceData.x + (canvasObject.nodeHeight) / 2,
          }
          const tp = {
            x: targetData.y,
            y: targetData.x + (canvasObject.nodeHeight) / 2,
          }
          return sp.x + 50 < tp.x
            ? `${linkGenerator(
          { source: sp, target: { ...tp, x: tp.x - 10 } })} L${tp.x}, ${tp.y}`
            : createBezierCurveTo(sp, tp)
        })
        .attr('fill', 'none')
        .attr('stroke', '#BFBFBF')
        .attr('stroke-width', 0.7)
        .attr('marker-end', 'url(#triangle-downstream)')
    }

    function batchRenderNodes() {
      canvasObject.g.append('g')
        .attr('class', 'nodes-container')
        .selectAll('.node-block')
        .data(canvasObject.nodes)
        .enter()
        .append('g')
        .attr('class', 'node-block')
        .attr('transform', d => `translate(${d.tx}, ${d.ty})`)
        .attr('style', 'cursor: pointer')
        .on('mouseover', mouseOverRect)
        .on('mouseleave', mouseLeaveRect)
        .on('click', mouseClickRect)
        .call(dragNodesRepeatDrawLinks())
        .append('rect')
        .attr('x', d => d.y)
        .attr('y', d => d.x)
        .attr('width', canvasObject.nodeWidth)
        .attr('height', canvasObject.nodeHeight)
        .attr('rx', 4)
        .attr('fill', 'white')
        .attr('stroke', 'rgba(192, 190, 190, 0.25)')
        .attr('stroke-width', 1)
        .attr('style', 'filter: url(#shadow1)')
      select('.nodes-container')
        .selectAll('.node-block')
        .append('g')
        .attr('class', 'text-group')
        .append('text')
        .text(({ data }) => `${data.typeName} | ${data.type}`)
        .attr('font-size', 8)
        .attr('fill', '#8C8C8C')
        .attr('x', d => d.y + 50)
        .attr('y', d => d.x + 22)
      selectAll('.text-group')
        .append('text')
        .attr('class', 'vx-text-name')
        .text(({ data }) => data.name)
        .attr('font-size', 12)
        .attr('fill', '#4c4c4c')
        .attr('dx', d => d.y + 50)
        .attr('dy', d => d.x + 42)
        .text(function ({ data }) {
          const textLength = select(this).node().getComputedTextLength()
          return textLength > canvasObject.nodeWidth - 50
            ? `${data.name.substr(0, 15)}...`
            : data.name
        })
        .append('title')
        .text(({ data }) => data.name)
      select('.nodes-container')
        .selectAll('.node-block')
        .append('image')
        .attr('xlink:href', ({ data }) => imageIconMap[data.type])
        .attr('x', d => d.y + 16)
        .attr('y', d => d.x + (canvasObject.nodeHeight - 24) / 2)
        .attr('height', 24)
        .attr('width', 24)
      selectAll('.node-block')
        .insert('g', 'rect')
        .attr('class', 'path-link-group')
        .attr('style', 'display: none')
        .selectAll('path')
        .data((d) => {
          const start = {
            x: d.y + 30,
            y: d.x + canvasObject.nodeHeight / 2,
          }
          return calculateParentLinks(start).slice(0, d.data.parentNumber || 0)
        })
        .enter()
        .append('path')
        .attr('class', 'path-link-horizontal-diagonal')
        .attr('d', d => d)
        .attr('stroke', 'url(#gradient-Downstream)')
        .attr('fill', 'none')
      selectAll('.path-link-group')
        .filter(({ data }) => data.parentNumber)
        .append('text')
        .text(({ data }) => `${data.parentNumber} hidden upstream dependencies`)
        .attr('fill', '#000')
        .attr('font-size', 10)
        .attr('x', d => d.y)
        .attr('y', d => d.x - 10)
    }

    function calculateParentLinks(start) {
      return [
    `M${start.x},${start.y}C${start.x - 28},${start.y},${start.x - 28},${start.y + 28},${start.x - 56},${start.y + 28}`,
    `M${start.x},${start.y}C${start.x - 28},${start.y},${start.x - 28},${start.y - 28},${start.x - 56},${start.y - 28}`,
    `M${start.x},${start.y}C${start.x - 28},${start.y},${start.x - 28},${start.y + 5},${start.x - 56},${start.y + 5}`,
      ]
    }

    /**
     * 拖动画布节点并且重新绘制与该节点有关联的links
     */
    function dragNodesRepeatDrawLinks() {
      return d3Drag()
        .on('drag', function (e) {
          const { x: y, y: x, tx, ty } = select(this).raise().datum()
          select(this).datum().tx = tx + e.dx
          select(this).datum().ty = ty + e.dy
          select(this).attr('transform', `translate(${tx + e.dx}, ${ty + e.dy})`)
          const id = select(this).datum().data.id
          // 分别修改以该节点为source或者target的path的的路径属性
          selectAll('.link-block')
            .filter(({ source }) => source === id)
            .select('path')
            .attr('d', ({ target }) => {
              const targetDatum = selectAll('.node-block')
                .filter(d => d.data.id === target)
                .datum()
              const sp = {
                x: x + tx + e.dx + canvasObject.nodeWidth,
                y: y + ty + e.dy + (canvasObject.nodeHeight / 2),
              }
              const tp = {
                x: targetDatum.y + targetDatum.tx,
                y: targetDatum.x + targetDatum.ty + (canvasObject.nodeHeight / 2),
              }
              return sp.x + 50 < tp.x
                ? `${linkGenerator(
          { source: sp, target: { ...tp, x: tp.x - 10 } })} L${tp.x}, ${tp.y}`
                : createBezierCurveTo(sp, tp)
            })
          selectAll('.link-block')
            .filter(({ target }) => target === id)
            .select('path')
            .attr('d', ({ source }) => {
              const sourceDatum = selectAll('.node-block')
                .filter(d => d.data.id === source)
                .datum()
              const sp = {
                x: sourceDatum.y + sourceDatum.tx + canvasObject.nodeWidth,
                y: sourceDatum.x + sourceDatum.ty + (canvasObject.nodeHeight / 2),
              }
              const tp = {
                x: x + tx + e.dx,
                y: y + ty + e.dy + (canvasObject.nodeHeight / 2),
              }
              return sp.x + 50 < tp.x
                ? `${linkGenerator(
          { source: sp, target: { ...tp, x: tp.x - 10 } })} L${tp.x}, ${tp.y}`
                : createBezierCurveTo(sp, tp)
            })
        })
    }

    /**
     * 三次贝塞尔曲线路径生成
     * @param { Objetc } source 起始点x,y坐标
     * @param { Objetc } target 终点x,y坐标
     */
    function createBezierCurveTo(source, target) {
      const { x: sx, y: sy } = source
      const { x: tx, y: ty } = target
      if (target.y > source.y)
        return `M${sx},${sy}Q${sx + 40},${sy + 2},${sx + 40},${sy + 20}C${sx + 40},${sy + 60},${tx - 40},${ty - 60},${tx - 40},${ty - 20}Q${tx - 40},${ty - 2},${tx},${ty}`
      else
        return `M${sx},${sy}Q${sx + 40},${sy - 2},${sx + 40},${sy - 20}C${sx + 40},${sy - 60},${tx - 40},${ty + 60},${tx - 40},${ty + 20}Q${tx - 40},${ty + 2},${tx},${ty}`
    }

    /**
     * 鼠标移入节点修改节点和与这个节点所有连线的样式
     */
    function mouseOverRect() {
      setHighlightStyle(select(this))
      const id = select(this).datum().data.id
      selectAll('.link-block')
        .filter(n => n.target === id || n.source === id)
        .raise()
        .select('path')
        .attr('stroke', '#1890ff')
        .attr('marker-end', 'url(#triangle-downstream-highlighted)')
    }

    /**
     * 鼠标移出节点恢复默认样式
     */
    function mouseLeaveRect() {
      if (!select(this).classed('node-active')) {
        removeHighlightStyle(select(this))
        select(this).select('.path-link-group')
          .attr('style', 'display: none')
      }
      selectAll('.link-block')
        .select('path')
        .attr('stroke', '#BFBFBF')
        .attr('marker-end', 'url(#triangle-downstream)')
    }

    /**
     * 点击节点激活选中样式获取节点详细信息
     */
    function mouseClickRect() {
      removeHighlightStyle(select('.node-active'))
      select('.node-active').classed('node-active', false)
      select(this).classed('node-active', true)
      setHighlightStyle(select(this))
    }

    /**
     * 节点设置高亮样式
     * @param { Object } selection
     */
    function setHighlightStyle(selection) {
      selection
        .select('rect')
        .attr('stroke', '#1890ff')
        .attr('style', 'filter: url(#shadow1-selected)')
      selection
        .select('.path-link-group')
        .attr('style', 'display: block')
    }

    /**
     * 节点移除高亮样式
     * @param { Object } selection
     */
    function removeHighlightStyle(selection) {
      selection
        .select('rect')
        .attr('stroke', 'rgba(192, 190, 190, 0.25)')
        .attr('style', 'filter: url(#shadow1)')
      selection
        .select('.path-link-group')
        .attr('style', 'display: none')
    }

    /**
     * defs 自定义标签属性定义
     */
    function customerDefsCreate(svg) {
      const DEFS = svg.append('defs')
      // 未选中状态rect阴影
      DEFS.append('filter')
        .attr('id', 'shadow1')
        .append('feDropShadow')
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('stdDeviation', 4)
        .attr('flood-color', 'rgba(72, 106, 108, 0.15)')
        .attr('flood-opacity', 1)

      // 选中状态rect下阴影
      DEFS.append('filter')
        .attr('id', 'shadow1-selected')
        .append('feDropShadow')
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('stdDeviation', 6)
        .attr('flood-color', 'rgba(24, 144, 255, .15)')
        .attr('flood-opacity', 1)

      // 连线终点处未选择状态箭头绘制
      DEFS.append('marker')
        .attr('id', 'triangle-downstream')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', '#BFBFBF')

      // 连线终点处选中状态箭头绘制
      DEFS.append('marker')
        .attr('id', 'triangle-downstream-highlighted')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', '#1890FF')

      DEFS.append('linearGradient')
        .attr('id', 'gradient-Downstream')
        .attr('x1', 1)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 0)
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#1890FF')
      select('#gradient-Downstream')
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#1890FF')
        .attr('stop-opacity', 0)
    }
  },
})
</script>

<template>
  <div class="hierarchy-demo-container">
    <div id="hierarchy-demo" />
  </div>
</template>

<style lang="less">
.hierarchy-demo-container {
  height: 100vh;
  overflow: hidden;
  #hierarchy-demo {
    width: 100%;
    height: 100%;
    background: rgb(250,250,250);
  }
}
</style>
