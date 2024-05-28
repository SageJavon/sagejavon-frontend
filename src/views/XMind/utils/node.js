import theme from '../theme'
import { isEmpty } from './index'
import { select } from 'd3-selection'
import { Text } from '@svgdotjs/svg.js'
import { hierarchy, tree } from 'd3-hierarchy'

let nodes = []
let links = []

function hasChild (_root) {
  return _root.children && _root.children.length
}

function getRandomDigit (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomId () {
  let str = ''
  for (let i = 0; i < 5; i++) {
    const range = Math.floor(Math.random() * 26)
    str += String.fromCharCode(97 + range)
  }
  return str + String(Math.random()).substring(2)
}

/**
 * 给主题设置id
 * @param {*} node
 * @param {*} update
 */
function setuniqueId (node, update) {
  node._id = update ? randomId() : node._id || randomId()
  if (hasChild(node)) {
    node.children.forEach(n => {
      setuniqueId(n, update)
    })
  }
}

/**
 * 根据根节点root平铺所有节点数据并且赋予节点x/y坐标
 * @param {*} root
 * @param { String } theme 主题类型
 * @param { String } direction 子节点展开方向，默认向右
 */
function dataTreeLayoutPackage (root, theme, direction, structure) {
  const d3Tree = tree()
  const hierarchydata = d3Tree(hierarchy(root, d => d.children))
  nodes = hierarchydata.descendants()
  setNodesStyle(nodes, theme, direction)
  calcNodeSize(nodes)
  firstWalk(nodes, direction, theme, structure)
  secondWalk(nodes, direction, theme)
  thirdWalk(nodes, direction, theme)
  setParentNodeCenter(nodes[0], direction, theme !== 'simplicity' || direction === 'bottom')
  links = hierarchydata.links()
  return {
    nodes,
    links
  }
}

/**
 * 递归计算节点长度和高度
 * @param {*} nodes
 */
function calcNodeSize (nodes) {
  nodes.forEach(node => {
    const text = node.data.text
    const { fontSize, fontWeight, fontFamily, fontStyle, textDirection } = node.style.textStyle
    const maxWidth = textDirection === 'ver' ? fontSize + 'px' : '300px'
    let { width, height } = getTextNodeRect({ text, fontSize, fontWeight, fontFamily, fontStyle, maxWidth })
    node.data.foreignObjectWidth = width
    node.data.foreignObjectHeight = height
    if (node.data.marks && node.data.marks.length) {
      width = width + node.data.marks.length * node.style.markSize - (node.data.marks.length - 1) * node.style.markSize * 0.15 + 6
      height = Math.max(height, node.style.markSize)
    }
    if (node.data.link || node.data.comment || node.data.tag) {
      if (node.data.link) {
        width += node.style.linkSize + 8
      }
      if (node.data.comment) {
        width += node.style.linkSize + 8
      }
      if (node.data.tag) {
        const tags = node.data.tag.split(';').filter(Boolean).reverse()
        const tagsInfo = []
        const tagLength = tags.reduce((prev, cur) => {
          const tagClientRect = createTextNode(cur, node.style.tagSize)
          const tagWidth = tagClientRect.width + 12
          const tagHeight = tagClientRect.height + 6
          tagsInfo.push({ tagName: cur, tagWidth, tagHeight, prevWidth: prev })
          prev += tagWidth
          return prev
        }, 0) + (tags.length + 1) * 8
        width += tagLength
        node.data.tagsInfo = tagsInfo
      } else {
        node.data.tagsInfo = []
      }
      height += !node.data.text && !(node.data.marks && node.data.marks.length) ? node.style.linkSize : 0
    }
    if (node.data.imageInfo) {
      const imageInfo = node.data.imageInfo
      node.width = (width > imageInfo.width ? width : imageInfo.width) + node.style.margin._l + node.style.margin._r
      node.height = height + node.style.margin._t + node.style.margin._b + imageInfo.height + 8
    } else {
      node.width = width + node.style.margin._l + node.style.margin._r
      node.height = height + node.style.margin._t + node.style.margin._b
    }
    if (node.data.targetSummarys?.length) {
      const summarys = node.data.targetSummarys
      for (let i = 0; i < summarys.length; i++) {
        const { width, height } = getTextNodeRect({
          text: summarys[i].text,
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: "微软雅黑, 'Microsoft YaHei'",
          maxWidth: '420px'
        })
        summarys[i].summaryWidth = width + 20
        summarys[i].summaryHeight = height + 12
      }
    }
  })
}

/**
 * 创建文字节点获取文字长和高
 * @param {*} text
 * @returns
 */
function createTextNode (text, fontSize, fontWeight = 'normal', fontFamily = "微软雅黑, 'Microsoft YaHei'") {
  if (!text) {
    return {
      width: 0,
      height: 0
    }
  }
  const node = new Text()
    .text(text)
    .font({
      size: fontSize,
      weight: fontWeight,
      family: fontFamily
    })
  const { width, height } = node.bbox()
  return {
    width,
    height
  }
}

/**
 * 长文本换行后文本宽高获取
 * @param {*} options
 */
function getTextNodeRect (options) {
  const {
    text,
    fontSize,
    fontWeight = 'normal',
    fontFamily = "黑体, SimHei, 'Heiti SC'",
    fontStyle = 'normal',
    maxWidth = '300px'
  } = options
  const textSpan = document.createElement('p')
  const spanStyle = {
    maxWidth,
    fontSize: fontSize + 'px',
    fontWeight,
    fontFamily,
    fontStyle,
    whiteSpace: 'pre-wrap',
    display: 'inline-block',
    position: 'fixed',
    left: '-2000px',
    wordBreak: 'break-all',
    lineBreak: 'anywhere'
  }
  for (const key in spanStyle) {
    textSpan.style[key] = spanStyle[key]
  }
  textSpan.innerText = text
  document.body.append(textSpan)
  const { width, height } = textSpan.getBoundingClientRect()
  textSpan.remove()
  return {
    width: fontStyle === 'italic' ? width + 2 : width,
    height
  }
}

/**
 * 根据节点所在层级设置节点样式（文字大小，背景色，文字颜色，边框，边框颜色...）
 * @param {*} nodes
 * @param { String } themeType 主题类型
 * @param { String } direction 子节点展开方向
 */
function setNodesStyle (nodes, themeType, direction) {
  const len = nodes.filter(n => n.depth === 1).length
  nodes.forEach((node, i) => {
    if (node.depth === 1) {
      node.currentIdx = i - 1
    }
    if (node.depth > 1) {
      node.currentIdx = node.parent.currentIdx
    }
    node.style = (theme[themeType][node.depth] || theme[themeType].normal).getStyle()
    if (node.depth > 0 && themeType !== 'simplicity') {
      const colors = node.style.colors
      const textColors = node.style.textColors || []
      const colorLen = colors.length
      const positionIdx = (direction === 'left' ? len + node.currentIdx : node.currentIdx) % colorLen
      node.style.lineStyle.fill = node.style.lineStyle.fill || colors[positionIdx]
      if (node.depth === 1) {
        node.style.fill = colors[positionIdx]
        node.style.textStyle.color = textColors[positionIdx]
      }
      if (node.depth > 1) {
        node.style.fill = node.style.fill || colors[positionIdx] + '18'
      }
    }
    const {
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textDecoration,
      textDirection,
      align,
      textColor,
      strokeColor,
      strokeStyle,
      strokeWidth,
      borderRadius,
      backgroundColor,
      lineStyle,
      lineWidth,
      lineColor,
      verticalInner,
      horizontalInner,
      horizontalOutter
    } = node.data.customStyle || {}
    if (!isEmpty(fontFamily)) {
      node.style.textStyle.fontFamily = fontFamily
    }
    if (!isEmpty(fontSize)) {
      node.style.textStyle.fontSize = fontSize
    }
    if (!isEmpty(fontWeight)) {
      node.style.textStyle.fontWeight = fontWeight
    }
    if (!isEmpty(fontStyle)) {
      node.style.textStyle.fontStyle = fontStyle
    }
    if (!isEmpty(textDecoration)) {
      node.style.textStyle.textDecoration = textDecoration
    }
    if (!isEmpty(textDirection)) {
      node.style.textStyle.textDirection = textDirection
    }
    if (!isEmpty(align)) {
      node.style.textStyle.align = align
    }
    if (!isEmpty(textColor)) {
      node.style.textStyle.color = textColor
    }
    if (!isEmpty(strokeColor)) {
      node.style.stroke = strokeColor
    }
    if (!isEmpty(strokeStyle)) {
      node.style.strokeStyle = strokeStyle
    }
    if (!isEmpty(strokeWidth)) {
      node.style.strokeWidth = strokeWidth
    }
    if (!isEmpty(borderRadius)) {
      node.style.rx = borderRadius
      node.style.ry = borderRadius
    }
    if (!isEmpty(backgroundColor)) {
      node.style.fill = backgroundColor
    }
    if (!isEmpty(lineStyle)) {
      node.style.lineStyle.dot = lineStyle
    }
    if (!isEmpty(lineWidth)) {
      node.style.lineStyle.lineWidth = lineWidth
    }
    if (!isEmpty(lineColor)) {
      node.style.lineStyle.fill = lineColor
    }
    if (!isEmpty(verticalInner)) {
      node.style.margin._t = verticalInner
      node.style.margin._b = verticalInner
    }
    if (!isEmpty(horizontalInner)) {
      node.style.margin._l = horizontalInner
      node.style.margin._r = horizontalInner
    }
    if (!isEmpty(horizontalOutter)) {
      node.style.spacing = horizontalOutter
    }
  })
}

/**
 * 首次遍历节点树动态计算节点的横坐标x和子节点的总高度
 * @param {*} nodes
 * @param { String } direction 子节点展开方向
 */
function firstWalk (nodes, direction, themeName, structure) {
  nodes.forEach(node => {
    node.direction = direction
    node.gap = node.depth === 0 && structure === 'swdt'
      ? Math.min(node.width / 2, 60) : 0
    if (node.parent && direction === 'right') {
      node.x = node.parent.x + node.parent.width + (node.parent.style.spacing || 22)
    }
    if (node.parent && direction === 'left') {
      node.x = node.parent.x - node.width - (node.parent.style.spacing || 22)
    }
    if (node.parent && direction === 'bottom') {
      node.y = node.parent.y + node.parent.height + 36
    }
    if (hasChild(node)) {
      const len = node.children.length
      const initHeight =
      node.depth < 1 ||
      themeName !== 'simplicity' ||
      direction === 'bottom'
        ? 0
        : -node.children[0].height
      node.childrenAreaHeight = (node.children || []).reduce((prev, cur) => {
        return prev + cur[direction === 'bottom' ? 'width' : 'height']
      }, initHeight) + (len - 1) * 16
    } else {
      node.childrenAreaHeight = 0
    }
  })
}

/**
 * 左右布局第二次遍历动态计算每个节点的y坐标
 * 上下布局第二次遍历动态计算每个节点的x坐标
 * @param {*} nodes
 * @param { String } direction 子节点展开方向
 */
function secondWalk (nodes, direction, themeName) {
  if (direction !== 'bottom') {
    nodes.forEach(node => {
      if (hasChild(node)) {
        if (node.depth < 1 || themeName !== 'simplicity') {
          const firstChild = node.children[0]
          const lastChild = node.children[node.children.length - 1]
          let startY = node.y + node.height / 2 - node.childrenAreaHeight / 2
          if (firstChild.height !== lastChild.height) {
            startY = node.height / 2 + node.y - (node.childrenAreaHeight - (firstChild.height + lastChild.height) / 2) / 2 - firstChild.height / 2
          }
          node.children.forEach(n => {
            n.y = startY
            startY += n.height + 16
          })
        } else {
          const ratio = node.depth === 1 ? 2 : 1
          const y = node.y + node.height / ratio - node.childrenAreaHeight / 2 - node.children[0].height
          let startY = y
          node.children.forEach(n => {
            n.y = startY
            startY += n.height + 16
          })
        }
      }
    })
  } else {
    nodes.forEach(node => {
      if (hasChild(node)) {
        const x = node.x + node.width / 2 - node.childrenAreaHeight / 2
        let startX = x
        node.children.forEach(n => {
          n.x = startX
          startX += n.width + 16
        })
      }
    })
  }
}

/**
 * 第三次遍历判断子节点所占的高度之和是否大于该节点自身高度，若高于自身高度则重新计算子节点y坐标
 * @param {*} nodes
 * @param { String } direction 子节点展开方向
 */
function thirdWalk (nodes, direction, themeName) {
  if (direction !== 'bottom') {
    nodes.forEach(node => {
      if (node.depth < 1 || themeName !== 'simplicity') {
        const difference = node.childrenAreaHeight - node.height
        if (difference > 0) {
          const upOffset = node.y - node.children[0].y
          const downOffset = node.children[node.children.length - 1].y + node.children[node.children.length - 1].height - node.y - node.height
          updateBrothers(node, upOffset, downOffset, direction)
        }
      } else {
        if (hasChild(node)) {
          if (node.children[0].y <= node.y || node.children?.length > 1) {
            const prevHeight = Math.max(node.y - node.children[0].y, 0)
            const nextHeight = Math.max((node.childrenAreaHeight - (node.depth === 1 ? node.height : 0)) / 2, 0)
            updateBrothersV2(node, prevHeight, nextHeight)
          }
        }
      }
    })
  } else {
    nodes.forEach(node => {
      const difference = node.childrenAreaHeight - node.width
      if (difference > 0) {
        const upOffset = node.x - node.children[0].x
        const downOffset = node.children[node.children.length - 1].x + node.children[node.children.length - 1].width - node.x - node.width
        updateBrothers(node, upOffset, downOffset, direction)
      }
    })
  }
}

/**
 * 更新兄弟节点y坐标
 * @param {*} node
 * @param {*} addHeight
 * @param { String } direction 子节点展开方向
 */
function updateBrothers (node, upOffset, downOffset, direction) {
  if (node.parent) {
    const childrenList = node.parent.children
    const index = childrenList.findIndex(item => item === node)
    childrenList.forEach((item, _index) => {
      if (item === node) return
      if (_index < index) {
        item[direction !== 'bottom' ? 'y' : 'x'] -= upOffset
        if (hasChild(item)) {
          updateChildren(item.children, direction !== 'bottom' ? 'y' : 'x', -upOffset)
        }
      } else if (_index > index) {
        item[direction !== 'bottom' ? 'y' : 'x'] += downOffset
        if (hasChild(item)) {
          updateChildren(item.children, direction !== 'bottom' ? 'y' : 'x', downOffset)
        }
      }
    })
    updateBrothers(node.parent, upOffset, downOffset, direction)
  }
}

function updateBrothersV2 (node, prevHeight, nextHeight) {
  if (node.parent) {
    const childrenList = node.parent.children
    const index = childrenList.findIndex(item => item === node)
    childrenList.forEach((item, _index) => {
      if (item === node) return
      let _offset = 0
      if (_index < index) {
        _offset = -prevHeight
      } else if (_index > index) {
        _offset = nextHeight
      }
      item.y += _offset
      if (hasChild(item)) {
        updateChildren(item.children, 'y', _offset)
      }
    })
    updateBrothersV2(node.parent, prevHeight, nextHeight)
  }
}

/**
 * 更新节点的所有子节点的位置
 * @param {*} children
 * @param {*} prop
 * @param {*} offset
 */
function updateChildren (children, prop, offset) {
  children.forEach((item) => {
    item[prop] += offset
    if (hasChild(item)) {
      updateChildren(item.children, prop, offset)
    }
  })
}

/**
 * 父节点的位置相对于子节点居中显示
 * @param {*} node
 * @param {*} direction
 * @param {*} updateChild
 */
function setParentNodeCenter (node, direction, updateChild) {
  function _c (node, direction) {
    const pos = direction === 'bottom' ? 'x' : 'y'
    const sizeName = direction === 'bottom' ? 'width' : 'height'
    const children = node.children || []
    if (children.length) {
      const firstChild = children[0]
      const lastChild = children[children.length - 1]
      const area = firstChild[pos] + firstChild[sizeName] / 2 + lastChild[pos] + lastChild[sizeName] / 2
      const parentCenter = Number((area / 2).toFixed(5))
      if (Number((node[pos] + node[sizeName] / 2).toFixed(5)) !== parentCenter) {
        node[pos] = parentCenter - node[sizeName] / 2
        if (node.parent) {
          _c(node.parent, direction)
        }
      }
    }
    // 主题为simplicity模式下只更新root节点相对于子节点居中即可
    if (updateChild) {
      for (let i = 0; i < children.length; i++) {
        _c(children[i], direction)
      }
    }
  }
  _c(node, direction)

  // 当结构为思维导图的时候，左右两颗树的根节点位置需要统一调整，同时递归调整子节点
  const offsetX = node.x
  const offsetY = node.y
  function _t (node) {
    node.x -= offsetX
    node.y -= offsetY
    if (hasChild(node)) {
      for (let i = 0; i < node.children.length; i++) {
        _t(node.children[i])
      }
    }
  }
  _t(node)
}

/**
 * 获取指定主题下的最后一个子主题列表
 * @param {*} node
 * @param {*} posXList
 */
function maxChildRefPosX (node, posXList = []) {
  if (!hasChild(node)) {
    posXList.push(node)
  } else {
    for (let i = 0; i < node.children.length; i++) {
      maxChildRefPosX(node.children[i], posXList)
    }
  }
}

/**
 * 设置指定主题下最右侧极大值X坐标
 * @param {*} posXList
 * @param {*} id
 */
function setMaxSummaryPosX (posXList, id) {
  for (let i = 0; i < posXList.length; i++) {
    const maxPosX = posXList[i].x + posXList[i].width + (posXList[i].data.expand ? 0 : 22)
    if (posXList[i].data._id === id) {
      posXList[i].maxPosX = maxPosX
    } else {
      posXList[i].maxPosX = getTargetMaxPosX(posXList[i], maxPosX, id)
    }
  }
}

/**
 *
 * @param {*} node
 * @param {*} maxPosX
 * @param {*} id
 * @returns
 */
function getTargetMaxPosX (node, maxPosX, id) {
  const targetSummarys = node.data.targetSummarys
  const summaryWidth = targetSummarys?.length ? Math.max(...targetSummarys.map(o => o.summaryWidth)) : 0
  maxPosX += (summaryWidth ? summaryWidth + 42 : 0)
  if (node.parent && node.parent.data._id !== id) {
    maxPosX = getTargetMaxPosX(node.parent, maxPosX, id)
  }
  return maxPosX
}

/**
 * 设置指定主题下最左端极小值X坐标
 * @param {*} posXList
 * @param {*} id
 */
function setMinSummaryPosX (posXList, id) {
  for (let i = 0; i < posXList.length; i++) {
    const minPosX = posXList[i].x - (posXList[i].data.expand ? 0 : 22)
    if (posXList[i].data._id === id) {
      posXList[i].minPosX = minPosX
    } else {
      posXList[i].minPosX = getTargetMinPosX(posXList[i], minPosX, id)
    }
  }
}

/**
 *
 * @param {*} node
 * @param {*} minPosX
 * @param {*} id
 * @returns
 */
function getTargetMinPosX (node, minPosX, id) {
  const targetSummarys = node.data.targetSummarys
  const summaryWidth = targetSummarys?.length ? Math.max(...targetSummarys.map(o => o.summaryWidth)) : 0
  minPosX -= (summaryWidth ? summaryWidth + 42 : 0)
  if (node.parent && node.parent.data._id !== id) {
    minPosX = getTargetMinPosX(node.parent, minPosX, id)
  }
  return minPosX
}

/**
 * 获取当前节点包括字节点四个顶点坐标
 * @param {*} node
 * @returns
 */
function getXmindSummaryPos (node) {
  const direction = node.direction
  const posXList = []
  maxChildRefPosX(node, posXList)
  direction === 'right' ? setMaxSummaryPosX(posXList, node.data._id) : setMinSummaryPosX(posXList, node.data._id)
  const nodeSortMaxX = direction === 'right'
    ? posXList.sort((a, b) => a.maxPosX - b.maxPosX)
    : node.descendants().sort((a, b) => (a.x + a.width) - (b.x + b.width))
  const nodeSortMinX = direction === 'right'
    ? node.descendants().sort((a, b) => a.x - b.x)
    : posXList.sort((a, b) => a.minPosX - b.minPosX)
  const nodeSortMinY = node.descendants().sort((a, b) => a.y - b.y)
  const nodeSortMaxY = node.descendants().sort((a, b) => (a.y + a.height) - (b.y + b.height))
  const minXNode = nodeSortMinX[0]
  const maxXNode = nodeSortMaxX[nodeSortMaxX.length - 1]
  const minYNode = nodeSortMinY[0]
  const maxYNode = nodeSortMaxY[nodeSortMaxY.length - 1]
  const minX = direction === 'right' ? minXNode.x : minXNode.minPosX - 16
  const maxX = direction === 'right' ? maxXNode.maxPosX + 16 : maxXNode.x + maxXNode.width
  const minY = minYNode.y
  const maxY = maxYNode.y + maxYNode.height
  return {
    minX,
    maxX,
    minY,
    maxY
  }
}

/**
 * 根据关联连线的源和目标计算连线的起始点结束点以及三次贝塞尔曲线的两个控制点
 * @param {*} source
 * @param {*} target
 */
export function getNodeRelationPathPoints (source, target) {
  const { id: sourceId, pointDiff: startPointDiff, controllerDiff: startCDiff } = source
  const { id: targetId, pointDiff: endPointDiff, controllerDiff: endCDiff } = target
  const sourceRect = select(`#${sourceId}`).datum()
  const targetRect = select(`#${targetId}`).datum()
  const start = { x: startPointDiff.x + sourceRect.x, y: startPointDiff.y + sourceRect.y }
  const end = { x: endPointDiff.x + targetRect.x, y: endPointDiff.y + targetRect.y }
  const c1 = { x: start.x + startCDiff.x, y: start.y + startCDiff.y }
  const c2 = { x: end.x + endCDiff.x, y: end.y + endCDiff.y }
  return {
    start,
    end,
    c1,
    c2
  }
}

export function setRootEdgeSourceGap (data) {
  const rootEdges = data.filter(d => d.source.depth === 0)
  const len = rootEdges.length
  const splitLen = Math.floor(len / 2)
  const percentage = 100 / splitLen * 0.75
  for (let i = 0; i < rootEdges.length; i++) {
    if (i < splitLen) {
      rootEdges[i].target.gapLen = i * percentage
    } else {
      rootEdges[i].target.gapLen = (i - splitLen) * percentage
    }
  }
}

export {
  getRandomDigit,
  randomId,
  hasChild,
  setuniqueId,
  calcNodeSize,
  dataTreeLayoutPackage,
  maxChildRefPosX,
  setMaxSummaryPosX,
  getXmindSummaryPos
}
