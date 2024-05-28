import mitter from '../mitt'
import { xmindMap } from '@/store'
import { storeToRefs } from 'pinia'
import { drag as d3Drag } from 'd3-drag'
import edgeStyleMap from '../theme/edgeStyle'
import { select, selectAll } from 'd3-selection'
import { getXmindSummaryPos, getNodeRelationPathPoints, hasChild } from '../utils/node'
import { getLinearExpression, getMinDistancePoint, getRectLineIntersectionPoint } from '../utils/math'

const store = xmindMap()
const { readOnly } = storeToRefs(store)
let xmindTheme = null
let xmindStructure = null
let nodeContainer = null
let edgeContainer = null
let summaryContainer = null
let relationContainer = null

/**
 * 创建画布节点容器
 */
export function createCanvasContainer (mindContainer) {
  nodeContainer = mindContainer
    .append('g')
    .attr('class', 'mind-map-nodebox')

  edgeContainer = mindContainer
    .insert('g', '.mind-map-nodebox')
    .attr('class', 'mind-map-edgebox')

  summaryContainer = mindContainer
    .append('g')
    .attr('class', 'mind-map-summarybox')

  relationContainer = mindContainer
    .append('g')
    .attr('class', 'mind-map-relationbox')
}

/**
 * 新增的节点批量渲染
 * @param {*} nodes
 */
export function renderNewNodes (nodes, theme, structure) {
  xmindTheme = theme
  xmindStructure = structure
  const themeName = xmindTheme.name
  const enter = nodeContainer
    .selectAll('.x-mind-nodetheme')
    .data(nodes)
    .enter()
    .append('g')
    .attr('id', d => d.data._id)
    .attr('class', d => `x-mind-nodetheme ${!d.parent ? 'x-mind-root-theme' : 'x-mind-ref-theme'}`)
    .on('click', function (event) {
      mitter.emit('node-handler-click', { event, _this: this })
    })
    .on('contextmenu', function (event) {
      mitter.emit('node-context-click', { event, _this: this })
    })
    .on('dblclick', function (event) {
      mitter.emit('node-handler-dblclick', { event, _this: this })
    })
    .on('mouseenter', function (event) {
      mitter.emit('node-handler-mouseenter', { event, _this: this })
    })
    .on('mousemove', function (event) {
      mitter.emit('node-handler-mousemove', { event, _this: this })
    })
    .on('mouseleave', function (event) {
      mitter.emit('node-handler-mouseleave', { event, _this: this })
    })
    .call(
      d3Drag()
        .on('drag', function (event) {
          mitter.emit('node-handler-draging', { event, _this: this })
        })
        .on('end', function (event) {
          mitter.emit('node-handler-dragend', { event, _this: this })
        }))

  enter
    .append('rect')
    .attr('class', 'x-mind-node-block')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('rx', d => d.style.rx)
    .attr('ry', d => d.style.ry)
    .attr('fill', d => d.style.fill)
    .attr('stroke', d => d.style.stroke)
    .attr('stroke-width', d => d.style.strokeWidth)
    .attr('stroke-linecap', d => d.style.rx ? 'round' : 'square')
    .attr('stroke-dasharray', d => d.style.strokeStyle === 'dashed' ? `8, ${8 + d.style.strokeWidth - 2}` : '1, 0')

  enter
    .append('foreignObject')
    .attr('class', 'x-mind-node-text')
    .attr('width', d => d.data.foreignObjectWidth)
    .attr('height', d => d.data.foreignObjectHeight)
    .attr('x', d => {
      const marks = d.data.marks
      if (marks && marks.length) {
        return d.x + d.style.margin._l + marks.length * d.style.markSize - (marks.length - 1) * d.style.markSize * 0.15 + 6
      } else {
        return d.x + d.style.margin._l
      }
    })
    .attr('y', d => d.y + d.height - d.data.foreignObjectHeight - d.style.margin._b)
    .append('xhtml:p')
    .attr('xmlns', 'http://www.w3.org/1999/xhtml')
    .attr('class', 'node-text-description')
    .text(d => d.data.text)
    .style('color', d => d.style.textStyle.color)
    .style('font-size', d => d.style.textStyle.fontSize + 'px')
    .style('font-weight', d => d.style.textStyle.fontWeight)
    .style('font-style', d => d.style.textStyle.fontStyle)
    .style('font-family', d => d.style.textStyle.fontFamily || "黑体, SimHei, 'Heiti SC'")
    .style('text-decoration', d => d.style.textStyle.textDecoration)
    .style('text-align', d => d.style.textStyle.align)

  select('.mind-map-nodebox')
    .selectAll('.x-mind-nodetheme')
    .selectAll('.rect-border-bootom')
    .remove()

  if (themeName === 'simplicity') {
    select('.mind-map-nodebox')
      .selectAll('.x-mind-nodetheme')
      .filter(node => node.depth > 1 && node.direction !== 'bottom')
      .append('path')
      .attr('class', 'rect-border-bootom')
      .attr('d', d => `M${d.x},${d.y + d.height} L${d.x + d.width}, ${d.y + d.height}`)
      .attr('stroke', d => d.style.lineStyle.fill)
      .attr('stroke-width', 4)
  }
}

/**
 * 已经存在的节点更新
 * @param {*} nodes
 */
export function renderUpdateNodes (nodes) {
  select('.mind-map-nodebox')
    .selectAll('.x-mind-nodetheme')
    .data(nodes)
    .attr('id', d => d.data._id)
    .classed('x-mind-root-theme', d => !d.parent)
    .classed('x-mind-ref-theme', d => !!d.parent)
    .attr('transform', null)
    .select('.x-mind-node-block')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('rx', d => d.style.rx)
    .attr('ry', d => d.style.ry)
    .attr('fill', d => d.style.fill)
    .attr('stroke', d => d.style.stroke)
    .attr('stroke-width', d => d.style.strokeWidth)
    .attr('stroke-linecap', d => d.style.rx ? 'round' : 'square')
    .attr('stroke-dasharray', d => d.style.strokeStyle === 'dashed' ? `8, ${8 + d.style.strokeWidth - 2}` : '1, 0')

  select('.mind-map-nodebox')
    .selectAll('.x-mind-nodetheme')
    .data(nodes)
    .select('.x-mind-node-text')
    .attr('width', d => d.data.foreignObjectWidth)
    .attr('height', d => d.data.foreignObjectHeight)
    .attr('x', d => {
      const marks = d.data.marks
      if (marks && marks.length) {
        return d.x + d.style.margin._l + marks.length * d.style.markSize - (marks.length - 1) * d.style.markSize * 0.15 + 6
      } else {
        return d.x + d.style.margin._l
      }
    })
    .attr('y', d => d.y + d.height - d.data.foreignObjectHeight - d.style.margin._b)
    .select('.node-text-description')
    .text(d => d.data.text)
    .style('color', d => d.style.textStyle.color)
    .style('font-size', d => d.style.textStyle.fontSize + 'px')
    .style('font-weight', d => d.style.textStyle.fontWeight)
    .style('font-style', d => d.style.textStyle.fontStyle)
    .style('font-family', d => d.style.textStyle.fontFamily || "黑体, SimHei, 'Heiti SC'")
    .style('text-decoration', d => d.style.textStyle.textDecoration)
    .style('text-align', d => d.style.textStyle.align)
}

/**
 * 删除节点后重新渲染
 * @param {*} nodes
 */
export function renderDeleteNodes (nodes) {
  nodeContainer
    .selectAll('.x-mind-nodetheme')
    .data(nodes)
    .exit()
    .remove()
}

export function renderExpandNodeIcon () {
  const themeName = xmindTheme.name
  select('.mind-map-nodebox')
    .selectAll('.child-ref-expand').remove()
  const expandNodesEnter = select('.mind-map-nodebox')
    .selectAll('.x-mind-nodetheme')
    .filter(node => node.children?.length)
    .append('g')
    .attr('class', 'child-ref-expand')
    .on('mouseenter', function (event) {
      mitter.emit('expand-handler-mouseenter', { event, _this: this })
    })
    .on('mouseleave', function (event) {
      mitter.emit('expand-handler-mouseleave', { event, _this: this })
    })
    .on('click', function (event) {
      mitter.emit('expand-handler-click', { event, _this: this })
    })

  expandNodesEnter
    .append('circle')
    .attr('class', 'expand-circle')
    .attr('cx', d => {
      return d.direction === 'bottom'
        ? d.x + d.width / 2
        : d.direction === 'left'
          ? d.x - 12 : d.x + d.width + 12
    })
    .attr('cy', d => d.direction !== 'bottom'
      ? d.y + d.height / 2 + (themeName === 'simplicity' && d.depth > 1 ? d.height / 2 : 0)
      : d.y + d.height + 8)
    .attr('r', 4)
    .attr('fill', '#fff')
    .attr('stroke', d => d.style.lineStyle.fill)
    .attr('opacity', 0)

  expandNodesEnter
    .append('circle')
    .attr('class', 'expand-circle')
    .attr('cx', d => d.direction === 'left' ? d.x - 12 : d.direction === 'right' ? d.x + d.width + 12 : d.x + d.width / 2)
    .attr('cy',
      d => d.direction !== 'bottom'
        ? d.y + d.height / 2 + (themeName === 'simplicity' && d.depth > 1 ? d.height / 2 : 0)
        : d.y + d.height + 8)
    .attr('r', 12)
    .attr('fill', 'transparent')

  expandNodesEnter
    .append('path')
    .attr('class', 'expand-path')
    .attr('d', d => {
      if (d.direction === 'left') {
        return `M${d.x - 14} ${d.y + d.height / (themeName === 'simplicity' && d.depth > 1 ? 1 : 2)} L${d.x - 10} ${d.y + d.height / (themeName === 'simplicity' && d.depth > 1 ? 1 : 2)}`
      }
      if (d.direction === 'right') {
        return `M${d.x + d.width + 10} ${d.y + d.height / (themeName === 'simplicity' && d.depth > 1 ? 1 : 2)} L${d.x + d.width + 14} ${d.y + d.height / (themeName === 'simplicity' && d.depth > 1 ? 1 : 2)}`
      }
      if (d.direction === 'bottom') {
        return `M${d.x + d.width / 2 - 2} ${d.y + d.height + 8} L${d.x + d.width / 2 + 2} ${d.y + d.height + 8}`
      }
    })
    .attr('stroke', d => d.style.collapseColor || d.style.lineStyle.fill)
    .attr('stroke-width', 2)
    .attr('opacity', 0)
}

export function renderXmindNodeTags () {
  select('.mind-map-nodebox')
    .selectAll('.xmind-node-tags')
    .remove()
  const tagNodesEnter = select('.mind-map-nodebox')
    .selectAll('.x-mind-nodetheme')
    .filter(node => node.data.tag)
    .append('g')
    .attr('class', 'xmind-node-tags')
    .attr('transform', d => {
      return `translate(0, ${Math.min(((d.style.tagSize + 6) - d.style.textStyle.fontSize) / 2, 0)})`
    })
    .selectAll('g')
    .data(d => d.data.tagsInfo.map(o => {
      return {
        ...o,
        _id: d.data._id,
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height,
        style: d.style,
        comment: d.data.comment,
        link: d.data.link
      }
    }))
    .enter()
    .append('g')
  tagNodesEnter
    .append('text')
    .text(d => d.tagName)
    .attr('font-size', d => d.style.tagSize)
    .attr('fill', (d, i) => d.style.tagColors[i % 4])
    .attr('x', (d, i) => {
      const rightSpacing = [d.comment, d.link].filter(Boolean).length * (d.style.linkSize + 8)
      return d.x + d.width - rightSpacing - d.tagWidth - d.style.margin._r - d.prevWidth - i * 8
    })
    .attr('y', d => d.y + d.height - d.style.margin._b - 3)
    .attr('dominant-baseline', 'ideographic')

  tagNodesEnter
    .insert('rect', 'text')
    .attr('x', (d, i) => {
      const rightSpacing = [d.comment, d.link].filter(Boolean).length * (d.style.linkSize + 8)
      return d.x + d.width - rightSpacing - d.tagWidth - d.style.margin._r - d.prevWidth - i * 8 - 6
    })
    .attr('y', d => d.y + d.height - d.style.margin._b - d.tagHeight + 1)
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('width', d => d.tagWidth)
    .attr('height', d => d.tagHeight)
    .attr('fill', (d, i) => `${d.style.tagColors[i % 4]}30`)
}

export function renderXmindPImageNodes () {
  nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => !n.data.imageInfo)
    .select('.xmind-node-image')
    .remove()

  const needRenderNodes = nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => n.data.imageInfo)
  needRenderNodes.filter(function () {
    return !select(this)
      .select('.xmind-node-image')
      .empty()
  })
    .select('.xmind-node-image')
    .select('image')
    .attr('x', d => d.x + (d.width - d.data.imageInfo.width) / 2)
    .attr('y', d => d.y + d.style.margin._t)
    .attr('width', d => d.data.imageInfo.width)
    .attr('height', d => d.data.imageInfo.height)
    .attr('xlink:href', d => d.data.imageInfo.url)

  needRenderNodes.filter(function () {
    return select(this)
      .select('.xmind-node-image')
      .empty()
  })
    .append('g')
    .attr('class', 'xmind-node-image')
    .append('image')
    .attr('x', d => d.x + (d.width - d.data.imageInfo.width) / 2)
    .attr('y', d => d.y + d.style.margin._t)
    .attr('width', d => d.data.imageInfo.width)
    .attr('height', d => d.data.imageInfo.height)
    .attr('xlink:href', d => d.data.imageInfo.url)
    .on('click', function (event) {
      mitter.emit('image-handler-click', { event, _this: this })
    })
}

export function renderXmindMarksNodes () {
  select('.mind-map-nodebox')
    .selectAll('.xmind-node-mark')
    .remove()
  const enter = select('.mind-map-nodebox')
    .selectAll('.x-mind-nodetheme')
    .filter(node => node.data.marks?.length)
    .append('g')
    .attr('class', 'xmind-node-mark')

  const childEnter = enter
    .selectAll('g')
    .data(d => (d.data.marks || []).map((o, i) => {
      return {
        ...o,
        _id: d.data._id,
        x: d.x,
        y: d.y,
        height: d.height,
        style: d.style,
        sortIdx: i,
        marks: d.data.marks,
        foreignObjectHeight: d.data.foreignObjectHeight
      }
    }))
    .enter()
    .append('g')
    .on('mouseenter', function () {
      select(this).raise()
    })
    .on('mouseleave', function () {
      select(this.parentNode).selectAll('g').sort((a, b) => a.sortIdx - b.sortIdx)
    })
    .on('click', function (event) {
      mitter.emit('mark-handler-click', { event, _this: this })
    })

  childEnter.append('circle')
    .attr('cx', (d, i) => d.x + d.style.margin._l + i * d.style.markSize * 0.85 + d.style.markSize / 2)
    .attr('cy', d => d.y + d.height - d.foreignObjectHeight / 2 - d.style.margin._b)
    .attr('r', d => d.style.markSize / 2 + 2)
    .attr('fill', '#fff')

  childEnter.append('rect')
    .attr('x', (d, i) => d.x + d.style.margin._l + i * d.style.markSize * 0.85 - 2)
    .attr('y', d => d.y + d.height - (d.foreignObjectHeight + d.style.markSize) / 2 - d.style.margin._b - 2)
    .attr('width', d => d.style.markSize + 4)
    .attr('height', d => d.style.markSize + 4)
    .attr('fill', 'transparent')
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('stroke-width', 2)
    .attr('stroke', 'transparent')

  childEnter
    .append('svg')
    .attr('viewBox', '0, 0, 1024, 1024')
    .attr('width', d => d.style.markSize)
    .attr('height', d => d.style.markSize)
    .attr('x', (d, i) => d.x + d.style.margin._l + i * d.style.markSize * 0.85)
    .attr('y', d => d.y + d.height - (d.foreignObjectHeight + d.style.markSize) / 2 - d.style.margin._b)
    .html(d => {
      return select(`#${d.icon}`).node().innerHTML
    })
}

export function renderXmindLinkNodes () {
  nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => !n.data.link)
    .select('.xmind-node-link')
    .remove()

  const needRenderNodes = nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => n.data.link)
  needRenderNodes.filter(function () {
    return !select(this)
      .select('.xmind-node-link')
      .empty()
  })
    .select('.xmind-node-link')
    .attr('transform', d => {
      return `translate(0, ${Math.min((d.style.linkSize - d.style.textStyle.fontSize) / 2, 0)})`
    })
    .select('svg')
    .attr('x', d => d.x + d.width - d.style.margin._r - d.style.linkSize - (d.data.comment ? 8 + d.style.linkSize : 0))
    .attr('y', d => d.y + d.height - d.style.margin._t - d.style.linkSize)
    .select('a')
    .attr('xlink:title', d => d.data.link)
    .attr('href', d => `${d.data.link}`)
    .select('svg')
    .attr('width', d => d.style.linkSize)
    .attr('height', d => d.style.linkSize)
    .attr('fill', d => d.style.textStyle.color)
    .html(select('#icon-link').node().innerHTML)
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1024)
    .attr('height', 1024)
    .attr('fill', 'transparent')

  needRenderNodes.filter(function () {
    return select(this)
      .select('.xmind-node-link')
      .empty()
  })
    .append('g')
    .attr('class', 'xmind-node-link')
    .append('svg')
    .attr('x', d => d.x + d.width - d.style.margin._r - d.style.linkSize - (d.data.comment ? 8 + d.style.linkSize : 0))
    .attr('y', d => d.y + d.height - d.style.margin._t - d.style.linkSize)
    .append('a')
    .attr('target', '_blank')
    .attr('xlink:title', d => d.data.link)
    .attr('href', d => `${d.data.link}`)
    .append('svg')
    .attr('width', d => d.style.linkSize)
    .attr('height', d => d.style.linkSize)
    .attr('fill', d => d.style.textStyle.color)
    .attr('viewBox', '0 0 1024 1024')
    .html(select('#icon-link').node().innerHTML)
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1024)
    .attr('height', 1024)
    .attr('fill', 'transparent')
}

export function renderXmindCommentNodes () {
  nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => !n.data.comment)
    .select('.xmind-node-comment')
    .remove()

  const needRenderNodes = nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => n.data.comment)
  needRenderNodes.filter(function () {
    return !select(this)
      .select('.xmind-node-comment')
      .empty()
  })
    .select('.xmind-node-comment')
    .attr('transform', d => {
      return `translate(0, ${Math.min((d.style.linkSize - d.style.textStyle.fontSize) / 2, 0)})`
    })
    .select('svg')
    .attr('x', d => d.x + d.width - d.style.margin._r - d.style.linkSize)
    .attr('y', d => d.y + d.height - d.style.margin._t - d.style.linkSize - 1)
    .select('svg')
    .attr('width', d => d.style.linkSize)
    .attr('height', d => d.style.linkSize)
    .attr('fill', d => d.style.textStyle.color)
    .html(select('#icon-article').node().innerHTML)
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1024)
    .attr('height', 1024)
    .attr('fill', 'transparent')

  needRenderNodes.filter(function () {
    return select(this)
      .select('.xmind-node-comment')
      .empty()
  })
    .append('g')
    .attr('class', 'xmind-node-comment')
    .attr('transform', d => {
      return `translate(0, ${Math.min((d.style.linkSize - d.style.textStyle.fontSize) / 2, 0)})`
    })
    .on('click', function (event) {
      event.stopPropagation()
      mitter.emit('comment-handler-click', { event, _this: this })
    })
    .append('svg')
    .attr('x', d => d.x + d.width - d.style.margin._r - d.style.linkSize)
    .attr('y', d => d.y + d.height - d.style.margin._t - d.style.linkSize - 1)
    .append('svg')
    .attr('width', d => d.style.linkSize)
    .attr('height', d => d.style.linkSize)
    .attr('fill', d => d.style.textStyle.color)
    .attr('viewBox', '0 0 1024 1024')
    .html(select('#icon-article').node().innerHTML)
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1024)
    .attr('height', 1024)
    .attr('fill', 'transparent')
}

export function renderChildCountNode () {
  const radius = 9
  nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => n.data.expand || !n.data.childCount)
    .select('.xmind-node-childcount')
    .remove()

  const needRenderNodes = nodeContainer
    .selectAll('.x-mind-nodetheme')
    .filter(n => !n.data.expand && n.data.childCount)
  needRenderNodes.filter(function () {
    return !select(this)
      .select('.xmind-node-childcount')
      .empty()
  })
    .select('.xmind-node-childcount')
    .select('path')
    .attr('d', d => {
      if (d.direction === 'left') {
        return `M${d.x}, ${d.y + d.height / 2} L${d.x - radius}, ${d.y + d.height / 2}`
      } else if (d.direction === 'right') {
        return `M${d.x + d.width}, ${d.y + d.height / 2} L${d.x + d.width + radius}, ${d.y + d.height / 2}`
      } else if (d.direction === 'bottom') {
        return `M${d.x + d.width / 2}, ${d.y + d.height} L${d.x + d.width / 2}, ${d.y + d.height + radius}`
      }
    })
    .attr('stroke', d => d.style.lineStyle.fill)
    .each(function () {
      select(this.parentNode)
        .select('circle')
        .attr('cx', d => {
          return d.direction === 'left' ? d.x - radius * 2
            : d.direction === 'right' ? d.x + d.width + radius * 2 : d.x + d.width / 2
        })
        .attr('cy', d => d.direction === 'bottom' ? d.y + d.height + radius * 2 : d.y + d.height / 2)
        .attr('fill', d => d.style.lineStyle.fill)
      select(this.parentNode)
        .select('text')
        .attr('x', d => {
          return d.direction === 'left' ? d.x - radius * 2
            : d.direction === 'right' ? d.x + d.width + radius * 2 : d.x + d.width / 2
        })
        .attr('y', d => (d.direction === 'bottom' ? d.y + d.height + radius * 2 : d.y + d.height / 2) + 1)
        .text(d => d.data.childCount)
        .attr('fill', d => d.style.expandColor)
    })

  needRenderNodes.filter(function () {
    return select(this)
      .select('.xmind-node-childcount')
      .empty()
  })
    .append('g')
    .attr('class', 'xmind-node-childcount')
    .on('click', function (event) {
      mitter.emit('expand-node-click', { event, _this: this })
    })
    .append('path')
    .attr('d', d => {
      if (d.direction === 'left') {
        return `M${d.x}, ${d.y + d.height / 2} L${d.x - radius}, ${d.y + d.height / 2}`
      } else if (d.direction === 'right') {
        return `M${d.x + d.width}, ${d.y + d.height / 2} L${d.x + d.width + radius}, ${d.y + d.height / 2}`
      } else if (d.direction === 'bottom') {
        return `M${d.x + d.width / 2}, ${d.y + d.height} L${d.x + d.width / 2}, ${d.y + d.height + radius}`
      }
    })
    .attr('stroke-width', 2)
    .attr('stroke', d => d.style.lineStyle.fill)
    .each(function () {
      select(this.parentNode)
        .append('circle')
        .attr('cx', d => {
          return d.direction === 'left' ? d.x - radius * 2
            : d.direction === 'right' ? d.x + d.width + radius * 2 : d.x + d.width / 2
        })
        .attr('cy', d => d.direction === 'bottom' ? d.y + d.height + radius * 2 : d.y + d.height / 2)
        .attr('r', radius)
        .attr('fill', d => d.style.lineStyle.fill)
      select(this.parentNode)
        .append('text')
        .attr('x', d => {
          return d.direction === 'left' ? d.x - radius * 2
            : d.direction === 'right' ? d.x + d.width + radius * 2 : d.x + d.width / 2
        })
        .attr('y', d => (d.direction === 'bottom' ? d.y + d.height + radius * 2 : d.y + d.height / 2) + 1)
        .text(d => d.data.childCount)
        .attr('font-size', 10)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', d => d.style.expandColor)
    })
}

/**
 * 新增的边节点批量渲染
 * @param {*} links
 */
export function renderNewEdges (links) {
  const themeName = xmindTheme.name
  const edgeStyleValue = localStorage.getItem('edgeStyleValue') || '2'
  const enter = edgeContainer
    .selectAll('g')
    .data(links)
    .enter()
    .append('g')
  enter
    .append('path')
    .attr('d', d => {
      const sourcePoint = {
        sx: d.target.direction === 'left'
          ? d.source.x + d.source.gap
          : d.target.direction === 'right'
            ? d.source.width + d.source.x - d.source.gap
            : d.source.x + d.source.width / 2,
        sy: d.target.direction === 'bottom'
          ? d.source.y + d.source.height
          : d.source.height / (d.source.depth > 1 && themeName === 'simplicity' ? 1 : 2) + d.source.y
      }
      const targetPoint = {
        tx: d.target.direction === 'left'
          ? d.target.x + d.target.width
          : d.target.direction === 'right'
            ? d.target.x
            : d.target.x + d.target.width / 2,
        ty: d.target.direction === 'bottom'
          ? d.target.y
          : d.target.height / (d.target.depth > 1 && themeName === 'simplicity' ? 1 : 2) + d.target.y
      }
      if (d.target.direction === 'bottom') {
        const { sx, sy } = sourcePoint
        const { tx, ty } = targetPoint
        const unit = tx > sx ? -1 : 1
        if (tx !== sx) {
          return `M${sx} ${sy} L${sx} ${sy + 18} L${tx + 5 * unit} ${sy + 18} Q${tx} ${sy + 18} ${tx} ${sy + 23} L${tx} ${ty}`
        }
        return `M${sx} ${sy} L${tx} ${ty}`
      }
      const lineWidth = d.source.style.lineStyle.lineWidth
      return edgeStyleMap[edgeStyleValue]({
        sourcePoint,
        targetPoint,
        isRoot: !d.source.parent,
        gradient: typeof d.source.style.lineStyle.lineWidth === 'string',
        lineWidth,
        structure: xmindStructure
      })
    })
    .attr('stroke-linecap', 'square')
    .attr('stroke', d => d.target.style.lineStyle.fill)
    .attr('stroke-width', d => {
      let lineWidth = d.source.style.lineStyle.lineWidth
      lineWidth = typeof lineWidth === 'number' ? lineWidth : Number(lineWidth.split('-')[1])
      const gradient = typeof d.source.style.lineStyle.lineWidth === 'string' &&
        d.target.direction !== 'bottom' && xmindStructure === 'swdt'
      if (gradient) return Math.ceil(lineWidth / 8)
      return lineWidth
    })
    .attr('stroke-dasharray', d => d.source.style.lineStyle.dot === 'dashed' ? '5, 5' : '1, 0')
    .attr('fill', d => {
      const gradient = typeof d.source.style.lineStyle.lineWidth === 'string' &&
        d.target.direction !== 'bottom' && xmindStructure === 'swdt'
      if (gradient) {
        return d.target.style.lineStyle.fill
      }
      return 'none'
    })
}

/**
 * 已经存在边节点渲染更新
 * @param {*} links
 */
export function renderUpdateEdges (links) {
  const themeName = xmindTheme.name
  const edgeStyleValue = localStorage.getItem('edgeStyleValue') || 2
  select('.mind-map-edgebox')
    .selectAll('g')
    .data(links)
    .select('path')
    .attr('d', d => {
      const sourcePoint = {
        sx: d.target.direction === 'left'
          ? d.source.x + d.source.gap
          : d.target.direction === 'right'
            ? d.source.width + d.source.x - d.source.gap
            : d.source.x + d.source.width / 2,
        sy: d.target.direction === 'bottom'
          ? d.source.y + d.source.height
          : d.source.height / (d.source.depth > 1 && themeName === 'simplicity' ? 1 : 2) + d.source.y
      }
      const targetPoint = {
        tx: d.target.direction === 'left'
          ? d.target.x + d.target.width
          : d.target.direction === 'right'
            ? d.target.x
            : d.target.x + d.target.width / 2,
        ty: d.target.direction === 'bottom'
          ? d.target.y
          : d.target.height / (d.target.depth > 1 && themeName === 'simplicity' ? 1 : 2) + d.target.y
      }
      if (d.target.direction === 'bottom') {
        const { sx, sy } = sourcePoint
        const { tx, ty } = targetPoint
        const unit = tx > sx ? -1 : 1
        if (tx !== sx) {
          return `M${sx} ${sy} L${sx} ${sy + 18} L${tx + 5 * unit} ${sy + 18} Q${tx} ${sy + 18} ${tx} ${sy + 23} L${tx} ${ty}`
        }
        return `M${sx} ${sy} L${tx} ${ty}`
      }
      const lineWidth = d.source.style.lineStyle.lineWidth
      return edgeStyleMap[edgeStyleValue]({
        sourcePoint,
        targetPoint,
        isRoot: !d.source.parent,
        gradient: typeof d.source.style.lineStyle.lineWidth === 'string',
        lineWidth,
        structure: xmindStructure
      })
    })
    .attr('stroke', d => d.target.style.lineStyle.fill)
    .attr('stroke-width', d => {
      let lineWidth = d.source.style.lineStyle.lineWidth
      lineWidth = typeof lineWidth === 'number' ? lineWidth : Number(lineWidth.split('-')[1])
      const gradient = typeof d.source.style.lineStyle.lineWidth === 'string' &&
        d.target.direction !== 'bottom' && xmindStructure === 'swdt'
      if (gradient) return Math.ceil(lineWidth / 8)
      return lineWidth
    })
    .attr('stroke-dasharray', d => d.source.style.lineStyle.dot === 'dashed' ? '5, 5' : '1, 0')
    .attr('fill', d => {
      const gradient = typeof d.source.style.lineStyle.lineWidth === 'string' &&
        d.target.direction !== 'bottom' && xmindStructure === 'swdt'
      if (gradient) {
        return d.target.style.lineStyle.fill
      }
      return 'none'
    })
}

/**
 * 删除边节点后重新渲染
 * @param {*} links
 */
export function renderDeleteEdges (links) {
  edgeContainer
    .selectAll('g')
    .data(links)
    .exit()
    .remove()
}

/**
 * 渲染绘制节点概要视图
 * @param {*} id
 */
export function renderNewSummaryNode (id) {
  summaryContainer.selectAll('g').remove()
  if (xmindStructure === 'zzjgt') return
  select('.mind-map-nodebox')
    .selectAll('.x-mind-nodetheme')
    .filter(node => node.data.targetSummarys?.length)
    .each(node => {
      const targetSummarys = node.data.targetSummarys
      const dir = node.direction === 'right'
      const minY = getXmindSummaryPos(node).minY
      const unit = dir ? 1 : '-1'
      for (let i = 0; i < targetSummarys.length; i++) {
        const targetId = targetSummarys[i].id
        const targetNode = select(`#${targetId}`)
        if (targetNode.empty()) continue
        if (targetNode.datum().parent.data._id !== node.parent.data._id) continue
        const brothers = targetNode.datum().parent?.children
        const startIdx = brothers.findIndex(o => o.data._id === node.data._id)
        const endIdx = brothers.findIndex(o => o.data._id === targetId)
        let [minX, maxX] = [Infinity, -Infinity]
        const [upArea, downArea] = [[], []]
        downArea[1] = getXmindSummaryPos(brothers[brothers.length - 1]).maxY + 8
        upArea[0] = getXmindSummaryPos(brothers[0]).minY - 8
        for (let i = startIdx; i <= endIdx; i++) {
          const limitRect = getXmindSummaryPos(brothers[i])
          i === startIdx && (downArea[0] = limitRect.maxY + 8)
          i === endIdx && (upArea[1] = limitRect.minY - 8)
          maxX = Math.max(maxX, limitRect.maxX)
          minX = Math.min(minX, limitRect.minX)
        }
        const maxY = getXmindSummaryPos(targetNode.datum()).maxY
        const startX = dir ? maxX : minX
        const controlPos = { x: startX + 12 * unit, y: (maxY + minY) / 2 }
        summaryContainer
          .append('g')
          .attr('id', `summary-path-${node.data._id}-${targetId}`)
          .attr('data-id', `${node.data._id}-${targetId}`)
          .append('path')
          .attr('stroke-width', 2)
          .attr('stroke', xmindTheme.summaryLineColor)
          .attr('d', `M${startX}, ${minY} Q${startX + 10 * unit}, ${minY} ${controlPos.x}, ${controlPos.y} Q${startX + 10 * unit}, ${maxY} ${startX}, ${maxY}`)
          .attr('fill', 'none')
          .attr('stroke-linecap', 'buut')
          .each(function () {
            select(this.parentNode)
              .append('path')
              .attr('d', `M${controlPos.x}, ${controlPos.y} L${controlPos.x + 10 * unit}, ${controlPos.y}`)
              .attr('stroke-width', 2)
              .attr('stroke', xmindTheme.summaryLineColor)
              .each(function () {
                select(this.parentNode)
                  .append('g')
                  .datum({ parentId: `${node.data._id}-${targetId}`, upArea, downArea, x: minX + (dir ? -8 : 4), y: minY - 8, width: maxX - minX + 2, height: maxY - minY + 16 })
                  .on('mousedown', function (event) {
                    event.stopPropagation()
                  })
                  .on('mouseenter', function (event) {
                    mitter.emit('summary-handler-mouseenter', { event, _this: this })
                  })
                  .on('mouseleave', function (event) {
                    mitter.emit('summary-handler-mouseleave', { event, _this: this })
                  })
                  .on('click', function (event) {
                    mitter.emit('summary-handler-click', { event, _this: this })
                  })
                  .on('dblclick', function (event) {
                    mitter.emit('summary-handler-dblclick', { event, _this: this })
                  })
                  .attr('fill', 'transparent')
                  .append('rect')
                  .attr('class', 'rect-border')
                  .attr('x', controlPos.x + 16 * unit - (dir ? 0 : targetSummarys[i].summaryWidth))
                  .attr('y', controlPos.y - targetSummarys[i].summaryHeight / 2)
                  .attr('width', targetSummarys[i].summaryWidth)
                  .attr('height', targetSummarys[i].summaryHeight)
                  .attr('rx', 4)
                  .attr('ry', 4)
                  .attr('stroke', xmindTheme.summaryLineColor)
                  .attr('stroke-width', '2')
                  .attr('fill', 'none')
                  .each(function () {
                    select(this.parentNode)
                      .append('foreignObject')
                      .attr('x', controlPos.x + (16 + 10) * unit - (dir ? 0 : targetSummarys[i].summaryWidth - 10 - 10))
                      .attr('y', controlPos.y - targetSummarys[i].summaryHeight / 2 + 6)
                      .attr('width', targetSummarys[i].summaryWidth - 20)
                      .attr('height', targetSummarys[i].summaryHeight - 12)
                      .append('xhtml:p')
                      .attr('xmlns', 'http://www.w3.org/1999/xhtml')
                      .attr('class', 'node-summary-description')
                      .style('color', xmindTheme.summaryTextColor)
                      .text(targetSummarys[i].text)
                      .each(function () {
                        select(this.parentNode.parentNode)
                          .append('rect')
                          .attr('class', 'high-border')
                          .attr('x', controlPos.x + 13 * unit - (dir ? 0 : targetSummarys[i].summaryWidth + 6))
                          .attr('y', controlPos.y - targetSummarys[i].summaryHeight / 2 - 3)
                          .attr('width', targetSummarys[i].summaryWidth + 6)
                          .attr('height', targetSummarys[i].summaryHeight + 6)
                          .attr('rx', 4)
                          .attr('ry', 4)
                          .attr('stroke', 'none')
                          .attr('stroke-width', '2')
                          .attr('fill', 'transparent')
                      })
                  })
              })
          })
      }
    })
  id && requestAnimationSummary(id)
}

/**
 * 动画渲染指定id的概要节点
 * @param {*} id
 */
export function requestAnimationSummary (id) {
  select(`#summary-path-${id}`)
    .selectAll('path, .rect-border')
    .attr('stroke-dasharray', function () {
      const len = select(this).node().getTotalLength()
      return `0 ${len}`
    })
    .transition()
    .duration(600)
    .attr('stroke-dasharray', function () {
      const len = select(this).node().getTotalLength()
      return `${len}, 0`
    })
  select(`#summary-path-${id}`)
    .select('text')
    .attr('opacity', 0)
    .transition()
    .delay(500)
    .duration(500)
    .attr('opacity', 1)
}

/**
 * 左键拖动绘制全选主题区域
 * @param {*} event
 * @param {*} domainStart
 * @param {*} updateCb
 */
export function drawAllSelectDomain (event, domainStart, updateCb) {
  if (select('.all-select-domain').empty()) {
    select('#zx-xmind-map-svg')
      .append('g')
      .attr('class', 'all-select-domain')
      .append('rect')
      .attr('x', Math.min(domainStart.x, event.x))
      .attr('y', Math.min(domainStart.y, event.y))
      .attr('width', Math.abs(event.x - domainStart.x))
      .attr('height', Math.abs(event.y - domainStart.y))
      .attr('stroke', 'rgb(187,233,255)')
      .attr('stroke-width', 2)
      .attr('fill', 'rgba(234,248,255,.22)')
  } else {
    select('.all-select-domain')
      .select('rect')
      .attr('x', Math.min(domainStart.x, event.x))
      .attr('y', Math.min(domainStart.y, event.y))
      .attr('width', Math.abs(event.x - domainStart.x))
      .attr('height', Math.abs(event.y - domainStart.y))
  }
  updateCb(event)
}

/**
 * 主题之间虚拟关系连接绘制
 * @param {*} movePos
 */
export function renderVirtualRelationPath (movePos) {
  updateCustomMarkerColor()
  const id = movePos.id
  console.log(movePos)
  relationContainer
    .select('.virtual-relation-path')
    .remove()
  relationContainer
    .append('path')
    .attr('id', `virtual-relation-${id}`)
    .attr('class', 'virtual-relation-path')
    .attr('stroke-dasharray', '10, 3')
    .attr('stroke', xmindTheme.relationStyle.lineColor)
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .style('pointer-events', 'none')
    .attr('marker-end', 'url(#triangle-downstream)')
    .attr('marker-start', 'url(#triangle-downstream-start)')
    .datum(movePos)
}

/**
 * 绘制关系连接虚拟连线的状态下在鼠标移动的时候更新渲染连线
 * @param {*} param0
 */
export function updateRenderVirtualRelationPath ({ x1, y1 }) {
  const movePos = relationContainer
    .select('.virtual-relation-path').datum()
  const { x, y, width, height } = movePos
  const centerPoint = { x: x + width / 2, y: y + height / 2 }
  const expression = getLinearExpression(centerPoint, { x: x1, y: y1 })
  const intersectPoints = getRectLineIntersectionPoint({
    y1: y,
    x1: x + width,
    y2: y + height,
    x2: x
  }, expression)
  const minPoint = getMinDistancePoint({ x: x1, y: y1 }, intersectPoints)
  const unit = minPoint.x < x1 ? 1 : -1
  relationContainer
    .select('.virtual-relation-path')
    .datum({
      ...movePos,
      minPoint
    })
  relationContainer
    .select('.virtual-relation-path')
    .attr('d', () => {
      return `M${minPoint.x} ${minPoint.y}, C ${minPoint.x + 100 * unit} ${minPoint.y} ${x1 - 100 * unit} ${y1} ${x1} ${y1}`
    })
}

/**
 * 根据起始点和结束点以及两个控制点绘制三次贝塞尔曲线
 * @param {*} relationId
 * @param {*} relationText
 * @param {*} source
 * @param {*} target
 * @param {*} animate
 */
export function drawRealRealtionPath (relationId, relationText, source, target) {
  try {
    const { start, end, c1, c2 } = getNodeRelationPathPoints(source, target)
    relationContainer
      .append('g')
      .attr('id', `relation-${relationId}`)
      .attr('data-id', `${source.id}-${target.id}`)
      .append('path')
      .attr('class', 'rela-relation-path')
      .attr('d', `M${start.x} ${start.y}, C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`)
      .attr('stroke', xmindTheme.relationStyle.lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#triangle-downstream)')
      .attr('marker-start', 'url(#triangle-downstream-start)')
      .attr('stroke-dasharray', '10, 3')
      .each(function () {
        const lines = [{ move: start, to: c1 }, { move: end, to: c2 }]
        const circles = [start, end]
        const rects = [c1, c2]
        select(this.parentNode)
          .append('g')
          .attr('class', 'controller-model')
          .on('mouseenter', function () {
            if (readOnly.value) return
            select(this.parentNode).raise()
            select(this).select('.active-rela-relation-path').attr('opacity', 0.4)
            select(this).selectAll('line, rect, circle').style('display', 'block')
          })
          .on('mouseleave', function () {
            if (readOnly.value) return
            if (!select(this).classed('active-relation')) {
              select(this).select('.active-rela-relation-path').attr('opacity', 0)
              select(this).selectAll('line, rect, circle').style('display', 'none')
            }
          })
          .on('click', function (event) {
            if (readOnly.value) return
            mitter.emit('relation-node-handler-click', { event, _this: this })
          })
          .on('contextmenu', function (event) {
            if (readOnly.value) return
            mitter.emit('relation-node-contextmenu', { event, _this: this })
          })
          .on('dblclick', function (event) {
            if (readOnly.value) return
            mitter.emit('relation-node-dblclick', { event, _this: this })
          })
          .datum({ relationId, relationText, source, target })
          .selectAll('line')
          .data(lines)
          .enter()
          .append('line')
          .attr('class', (_, i) => i === 0 ? 'start-line' : 'end-line')
          .attr('x1', d => d.move.x)
          .attr('y1', d => d.move.y)
          .attr('x2', d => d.to.x)
          .attr('y2', d => d.to.y)
          .attr('stroke', '#2ebaff')
          .attr('stroke-width', 2)
          .attr('style', 'display: none')
        select(this.parentNode).select('.controller-model')
          .append('path')
          .attr('class', 'active-rela-relation-path')
          .attr('d', `M${start.x} ${start.y}, C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`)
          .attr('stroke', '#62ceff')
          .attr('stroke-width', 14)
          .attr('opacity', 0)
          .attr('fill', 'none')
        const pathLength = select(this).node().getTotalLength()
        const textPos = select(this).node().getPointAtLength(pathLength / 2)
        select(this.parentNode).select('.controller-model')
          .append('text')
          .text(relationText)
          .attr('fill', xmindTheme.relationStyle.textColor)
          .attr('x', textPos.x)
          .attr('y', textPos.y)
          .attr('font-size', 12)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'ideographic')
          .attr('style', 'pointer-events: none; text-shadow: 0 0 20px #00000050;')
        select(this.parentNode).select('.controller-model')
          .selectAll('circle')
          .data(circles)
          .enter()
          .append('circle')
          .attr('class', (_, i) => i === 0 ? 'start-circle' : 'end-circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', 4)
          .attr('stroke-width', 2)
          .attr('stroke', '#2ebaff')
          .attr('fill', '#fff')
          .attr('style', 'display: none; cursor: grab;')
          .on('mouseenter', function () {
            select(this).attr('r', 7)
          })
          .on('mouseleave', function () {
            select(this).attr('r', 4)
          })
          .on('mousedown', function (event) {
            mitter.emit('relation-controller-mousedown', { event, _this: this })
          })
        select(this.parentNode).select('.controller-model')
          .selectAll('rect')
          .data(rects)
          .enter()
          .append('rect')
          .attr('class', (_, i) => i === 0 ? 'start-rect' : 'end-rect')
          .attr('x', d => d.x - 5)
          .attr('y', d => d.y - 5)
          .attr('width', 10)
          .attr('height', 10)
          .attr('stroke-width', 2)
          .attr('stroke', '#2ebaff')
          .attr('fill', '#fff')
          .attr('style', 'display: none; cursor: grab;')
          .on('mouseenter', function () {
            select(this).attr('x', d => d.x - 7).attr('y', d => d.y - 7).attr('width', 14).attr('height', 14)
          })
          .on('mouseleave', function () {
            select(this).attr('x', d => d.x - 5).attr('y', d => d.y - 5).attr('width', 10).attr('height', 10)
          })
          .on('mousedown', function (event) {
            mitter.emit('relation-controller-mousedown', { event, _this: this })
          })
      })
  } catch (error) {
    console.warn('The node of the relational connection could not be found')
  }
}

export function bacthDrawRealRelationPath (nodes) {
  updateCustomMarkerColor()
  relationContainer.selectAll('g').remove()
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].data
    for (let k = 0; k < node.relations.length; k++) {
      const { relationId, relationText, sourceInfo, targetInfo } = node.relations[k]
      drawRealRealtionPath(relationId, relationText, sourceInfo, targetInfo)
    }
  }
}

export function renderXmindOtherElement (summaryId, relationNodes) {
  renderExpandNodeIcon()
  renderXmindNodeTags()
  renderXmindPImageNodes()
  renderXmindLinkNodes()
  renderXmindCommentNodes()
  renderXmindMarksNodes()
  renderChildCountNode()
  renderNewSummaryNode(summaryId)
  bacthDrawRealRelationPath(relationNodes)
}

/**
 * 重绘节点样式（该样式不会影响画布布局）
 * @param {*} param0
 */
export function updateRedrawNodeStyle ({ filedName, filedValue, id }) {
  switch (filedName) {
    case 'textColor':
      select(`#${id}`)
        .select('.x-mind-node-text')
        .select('.node-text-description')
        .style('color', filedValue)
      break
    case 'strokeColor':
      select(`#${id}`)
        .select('.x-mind-node-block')
        .attr('stroke', filedValue)
      break
    case 'lineColor':
      select('.mind-map-edgebox')
        .selectAll('g')
        .filter(d => d.target.data._id === id)
        .select('path')
        .attr('stroke', filedValue)
        .attr('fill', d => {
          const gradient = typeof d.source.style.lineStyle.lineWidth === 'string' &&
            d.target.direction !== 'bottom'
          if (gradient) {
            return filedValue
          }
          return 'none'
        })
      break
    case 'backgroundColor':
      select(`#${id}`)
        .select('.x-mind-node-block')
        .attr('fill', filedValue)
      break
    default:
      break
  }
}

/**
 * 全局节点统一修改背景色或者文字颜色
 * @param {*} root
 * @param {*} filedName
 * @param {*} filedValue
 */
export function gloabupdateColorStyle (root, filedName, filedValue) {
  const id = root._id
  const node = select(`#${id}`)
  if (node.empty()) return
  if (filedName === 'backgroundColor') {
    node.select('.x-mind-node-block')
      .attr('fill', filedValue)
  } else if (filedName === 'textColor') {
    node.select('.x-mind-node-text')
      .select('.node-text-description')
      .style('color', filedValue)
  }
  if (hasChild(node)) {
    node.children.forEach(n => {
      gloabupdateColorStyle(n, filedName, filedValue)
    })
  }
}

/**
 * defs 自定义标签属性定义
 */
export function createCustomXMindDEFS () {
  select('#icon-article').selectAll('path').attr('fill', null)
  select('#icon-link').selectAll('path').attr('fill', null)
  const DEFS = select('#zx-xmind-map-svg').append('defs')
  // 连线终点处未选择状态箭头绘制
  DEFS.append('marker')
    .attr('id', 'triangle-downstream')
    .attr('viewBox', '0 0 5 5')
    .attr('refX', 3.7)
    .attr('refY', 2.5)
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', 4)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 5 2.5 L 0 5 z')
  // 连线起点处未选择状态箭头绘制
  DEFS.append('marker')
    .attr('id', 'triangle-downstream-start')
    .attr('viewBox', '0 0 3 3')
    .attr('refX', 1.5)
    .attr('refY', 1.5)
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 3 1.5 A 1.5 1.5 0 1 0 3 1.51 z')
  DEFS.append('linearGradient')
    .attr('id', 'gradient-Downstream')
    .attr('x1', 1)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', 0)
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#1890FF')
    .each(function () {
      select(this.parentNode)
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#1890FF')
        .attr('stop-opacity', 0)
    })
}

/**
 * 图片拖动放大缩小控制点绘制
 * @param {*} mindOutterG
 */
export function drawImageControlNode (mindOutterG) {
  const controllers = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
  mindOutterG
    .insert('g', '.mind-map-edgebox')
    .style('display', 'none')
    .attr('class', 'element-drag-controller')
    .on('click', event => event.stopPropagation())
    .on('mousedown', event => event.stopPropagation())
    .selectAll('point')
    .data(controllers)
    .enter()
    .append('rect')
    .attr('class', d => `${d}-point control-point`)
    .attr('width', 8)
    .attr('height', 8)
    .attr('stroke', 'rgb(41,183,250)')
    .attr('stroke-width', 2)
    .attr('fill', '#fff')
  select('.element-drag-controller')
    .insert('path', 'rect')
    .attr('stroke', 'rgb(41,183,250)')
    .attr('stroke-width', 2)
    .attr('fill', 'transparent')
    // 节点拖动占位符绘制
  mindOutterG.append('g')
    .attr('class', 'drag-shadow-node')
    .style('display', 'none')
    .append('rect')
    .attr('fill', 'rgb(4,183,250)')
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('width', 46)
    .attr('height', 18)
  mindOutterG.insert('g', '.mind-map-nodebox')
    .attr('class', 'drag-shadow-edge')
    .style('display', 'none')
    .append('path')
    .attr('stroke-width', 2)
    .attr('stroke', 'rgb(4, 183, 250)')
    .attr('fill', 'transparent')
}

export function updateCustomMarkerColor () {
  selectAll('#triangle-downstream, #triangle-downstream-start')
    .attr('fill', xmindTheme.relationStyle.lineColor)
}
