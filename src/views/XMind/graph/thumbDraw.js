import { select } from 'd3-selection'
import edgeStyleMap from '../theme/edgeStyle'
import { getXmindSummaryPos, getNodeRelationPathPoints } from '../utils/node'

let xmindTheme = null
let xmindStructure = null
let nodeContainer = null
let edgeContainer = null
let summaryContainer = null
let relationContainer = null

/**
 * 创建画布节点容器
 */
export function createThumbContainer (mindContainer) {
  nodeContainer = mindContainer
    .append('g')
    .attr('class', 'thumb-mind-map-nodebox')

  edgeContainer = mindContainer
    .insert('g', '.thumb-mind-map-nodebox')
    .attr('class', 'thumb-mind-map-edgebox')

  summaryContainer = mindContainer
    .append('g')
    .attr('class', 'thumb-mind-map-summarybox')

  relationContainer = mindContainer
    .append('g')
    .attr('class', 'thumb-mind-map-relationbox')
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
    .selectAll('.thumb-x-mind-nodetheme')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', d => `thumb-x-mind-nodetheme ${!d.parent ? 'thumb-x-mind-root-theme' : 'thumb-x-mind-ref-theme'}`)

  enter
    .append('rect')
    .attr('class', 'thumb-x-mind-node-block')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('rx', d => d.style.rx)
    .attr('ry', d => d.style.ry)
    .attr('stroke', d => d.style.stroke)
    .attr('stroke-width', d => d.style.strokeWidth)
    .attr('fill', d => d.style.fill)
    .attr('stroke-dasharray', d => d.style.strokeStyle === 'dashed' ? '8, 8' : '1, 0')

  enter
    .append('foreignObject')
    .attr('class', 'thumb-x-mind-node-text')
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
    .attr('class', 'node-text-description')
    .text(d => d.data.text)
    .style('color', d => d.style.textStyle.color)
    .style('font-size', d => d.style.textStyle.fontSize + 'px')
    .style('font-weight', d => d.style.textStyle.fontWeight)
    .style('font-style', d => d.style.textStyle.fontStyle)
    .style('font-family', d => d.style.textStyle.fontFamily || "黑体, SimHei, 'Heiti SC'")
    .style('text-decoration', d => d.style.textStyle.textDecoration)
    .style('text-align', d => d.style.textStyle.align)

  select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-x-mind-nodetheme')
    .selectAll('path')
    .remove()

  if (themeName === 'simplicity') {
    select('.thumb-mind-map-nodebox')
      .selectAll('.thumb-x-mind-nodetheme')
      .filter(node => node.depth > 1 && node.direction !== 'bottom')
      .append('path')
      .attr('d', d => `M${d.x},${d.y + d.height} L${d.x + d.width}, ${d.y + d.height}`)
      .attr('stroke', d => d.style.lineStyle.fill)
      .attr('stroke-width', 3)
  }
  renderXmindNodeTags()
}

/**
 * 已经存在的节点更新
 * @param {*} nodes
 */
export function renderUpdateNodes (nodes) {
  select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-x-mind-nodetheme')
    .data(nodes)
    .attr('class', d => `thumb-x-mind-nodetheme ${!d.parent ? 'thumb-x-mind-root-theme' : 'thumb-x-mind-ref-theme'}`)
    .select('.thumb-x-mind-node-block')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('rx', d => d.style.rx)
    .attr('ry', d => d.style.ry)
    .attr('stroke', d => d.style.stroke)
    .attr('stroke-width', d => d.style.strokeWidth)
    .attr('fill', d => d.style.fill)
    .attr('stroke-dasharray', d => d.style.strokeStyle === 'dashed' ? '8, 8' : '1, 0')

  select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-x-mind-nodetheme')
    .select('.thumb-x-mind-node-text')
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
    .selectAll('.thumb-x-mind-nodetheme')
    .data(nodes)
    .exit()
    .remove()
}

export function renderXmindNodeTags () {
  select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-xmind-node-tags')
    .remove()
  const tagNodesEnter = select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-x-mind-nodetheme')
    .filter(node => node.data.tag)
    .append('g')
    .attr('class', 'thumb-xmind-node-tags')
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
    .selectAll('.thumb-x-mind-nodetheme')
    .filter(n => !n.data.imageInfo)
    .select('.thumb-xmind-node-image')
    .remove()

  const needRenderNodes = nodeContainer
    .selectAll('.thumb-x-mind-nodetheme')
    .filter(n => n.data.imageInfo)
  needRenderNodes.filter(function () {
    return !select(this)
      .select('.thumb-xmind-node-image')
      .empty()
  })
    .select('.thumb-xmind-node-image')
    .select('image')
    .attr('x', d => d.x + (d.width - d.data.imageInfo.width) / 2)
    .attr('y', d => d.y + d.style.margin._t)
    .attr('width', d => d.data.imageInfo.width)
    .attr('height', d => d.data.imageInfo.height)
    .attr('xlink:href', d => d.data.imageInfo.url)

  needRenderNodes.filter(function () {
    return select(this)
      .select('.thumb-xmind-node-image')
      .empty()
  })
    .append('g')
    .attr('class', 'thumb-xmind-node-image')
    .append('image')
    .attr('x', d => d.x + (d.width - d.data.imageInfo.width) / 2)
    .attr('y', d => d.y + d.style.margin._t)
    .attr('width', d => d.data.imageInfo.width)
    .attr('height', d => d.data.imageInfo.height)
    .attr('xlink:href', d => d.data.imageInfo.url)
}

export function renderXmindMarksNodes () {
  select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-xmind-node-mark')
    .remove()
  const enter = select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-x-mind-nodetheme')
    .filter(node => node.data.marks?.length)
    .append('g')
    .attr('class', 'thumb-xmind-node-mark')

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

  childEnter.append('circle')
    .attr('cx', (d, i) => d.x + d.style.margin._l + i * d.style.markSize * 0.85 + d.style.markSize / 2)
    .attr('cy', d => d.y + d.height - d.foreignObjectHeight / 2 - d.style.margin._b)
    .attr('r', d => d.style.markSize / 2 + 2)
    .attr('fill', '#fff')

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

export function renderChildCountNode () {
  const radius = 9
  nodeContainer
    .selectAll('.thumb-x-mind-nodetheme')
    .filter(n => n.data.expand || !n.data.childCount)
    .select('.thumb-xmind-node-childcount')
    .remove()

  const needRenderNodes = nodeContainer
    .selectAll('.thumb-x-mind-nodetheme')
    .filter(n => !n.data.expand && n.data.childCount)
  needRenderNodes.filter(function () {
    return !select(this)
      .select('.thumb-xmind-node-childcount')
      .empty()
  })
    .select('.thumb-xmind-node-childcount')
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
      .select('.thumb-xmind-node-childcount')
      .empty()
  })
    .append('g')
    .attr('class', 'thumb-xmind-node-childcount')
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

export function renderXmindOtherElement (relationNodes) {
  renderXmindNodeTags()
  renderXmindPImageNodes()
  renderXmindMarksNodes()
  renderChildCountNode()
  renderNewSummaryNode()
  bacthDrawRealRelationPath(relationNodes)
}

/**
 * 新增的边节点批量渲染
 * @param {*} links
 */
export function renderNewEdges (links) {
  const themeName = xmindTheme.name
  const edgeStyleValue = localStorage.getItem('edgeStyleValue') || 2
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
        return `M${sx} ${sy} L${sx} ${sy + 18} L${tx} ${sy + 18} ${tx} ${ty}`
      }
      const lineWidth = d.source.style.lineStyle.lineWidth
      return edgeStyleMap[edgeStyleValue](
        {
          sourcePoint,
          targetPoint,
          isRoot: !d.source.parent,
          gradient: typeof d.source.style.lineStyle.lineWidth === 'string',
          lineWidth,
          structure: xmindStructure
        }
      )
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
 * 已经存在边节点渲染更新
 * @param {*} links
 */
export function renderUpdateEdges (links) {
  const themeName = xmindTheme.name
  const edgeStyleValue = localStorage.getItem('edgeStyleValue') || 2
  select('.thumb-mind-map-edgebox')
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
        return `M${sx} ${sy} L${sx} ${sy + 18} L${tx} ${sy + 18} ${tx} ${ty}`
      }
      const lineWidth = d.source.style.lineStyle.lineWidth
      return edgeStyleMap[edgeStyleValue](
        {
          sourcePoint,
          targetPoint,
          isRoot: !d.source.parent,
          gradient: typeof d.source.style.lineStyle.lineWidth === 'string',
          lineWidth,
          structure: xmindStructure
        }
      )
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
 * 渲染绘制左侧概览视图
 */
export function renderNewSummaryNode () {
  summaryContainer.selectAll('g').remove()
  if (xmindStructure === 'zzjgt') return
  select('.thumb-mind-map-nodebox')
    .selectAll('.thumb-x-mind-nodetheme')
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
        const brothers = targetNode.datum().parent?.children || []
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
                      .attr('width', targetSummarys[i].summaryWidth)
                      .attr('height', targetSummarys[i].summaryHeight)
                      .append('xhtml:p')
                      .attr('class', 'node-summary-description')
                      .text(targetSummarys[i].text)
                      .style('color', xmindTheme.summaryTextColor)
                  })
              })
          })
      }
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
export function drawRealRealtionPath (relationText, source, target) {
  try {
    const { start, end, c1, c2 } = getNodeRelationPathPoints(source, target)
    relationContainer
      .append('g')
      .append('path')
      .attr('class', 'thumb-rela-relation-path')
      .attr('d', `M${start.x} ${start.y}, C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`)
      .attr('stroke', xmindTheme.relationStyle.lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#triangle-downstream)')
      .attr('marker-start', 'url(#triangle-downstream-start)')
      .attr('stroke-dasharray', '10, 3')
      .each(function () {
        const pathLength = select(this).node().getTotalLength()
        const textPos = select(this).node().getPointAtLength(pathLength / 2)
        select(this.parentNode).select('.controller-model')
          .append('text')
          .text(relationText)
          .attr('fill', xmindTheme.relationStyle.textColor)
          .attr('x', textPos.x)
          .attr('y', textPos.y)
          .attr('font-size', 11)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'ideographic')
          .attr('style', 'pointer-events: none')
      })
  } catch (error) {
    console.warn('The node of the relational connection could not be found')
  }
}

export function bacthDrawRealRelationPath (nodes) {
  relationContainer.selectAll('g').remove()
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].data
    for (let k = 0; k < node.relations.length; k++) {
      const { relationText, sourceInfo, targetInfo } = node.relations[k]
      drawRealRealtionPath(relationText, sourceInfo, targetInfo)
    }
  }
}
