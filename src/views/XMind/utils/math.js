/**
 * 根据两个点p1, p2计算两点连线的直线表达式
 * @param {*} p1
 * @param {*} p2
 * @returns { k, b }
 */
export function getLinearExpression (p1, p2) {
  const { x: x1, y: y1 } = p1
  const { x: x2, y: y2 } = p2
  const k = (y2 - y1) / (x2 - x1)
  const b = y1 - k * x1
  return {
    k, b
  }
}

/**
 * 根据矩形左上角定点坐标和宽高计算矩形四个定点的坐标
 * @param {*} clientRect
 */
export function getRectFourPointPos (clientRect) {
  const { x, y, width, height } = clientRect
  // 依次返回左上，右上，右下，左下四个点坐标
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height }
  ]
}

/**
 * 根据矩形的四条边所在的横坐标和纵坐标及直线表达式获取直线和矩形的交点
 * @param {*} points
 * @param {*} expression
 */
export function getRectLineIntersectionPoint ({ y1, x1, y2, x2 }, expression) {
  const cachePoints = []
  const { k, b } = expression
  const p1 = { x: (y1 - b) / k, y: y1 }
  const p2 = { x: x1, y: k * x1 + b }
  const p3 = { x: (y2 - b) / k, y: y2 }
  const p4 = { x: x2, y: k * x2 + b }
  if (p1.x <= x1 && p1.x >= x2) {
    cachePoints.push(p1)
  }
  if (p2.y >= y1 && p2.y <= y2) {
    cachePoints.push(p2)
  }
  if (p3.x <= x1 && p3.x >= x2) {
    cachePoints.push(p3)
  }
  if (p4.y >= y1 && p4.y <= y2) {
    cachePoints.push(p4)
  }
  return cachePoints
}

/**
 * 获取多个点内到指定点距离最短的点坐标
 * @param {*} targetPoint
 * @param {*} points
 */
export function getMinDistancePoint (targetPoint, points) {
  let minPoint = null
  let minDistance = Infinity
  const { x: x1, y: y1 } = targetPoint
  points.forEach(p => {
    const { x, y } = p
    const distance = Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2)
    if (distance < minDistance) {
      minDistance = distance
      minPoint = p
    }
  })
  return minPoint
}

/**
 * 判断某个点是否在多边形内
 * @param {*} p1
 * @param {*} polygon
 * @returns
 */
export function queryPtInPolygon (p1, polygon) {
  let p3; let p4; let count = 0
  const p2 = { x: 1000000000000, y: p1.y }
  // 对每条边都和射线作对比
  for (let i = 0; i < polygon.length - 1; i++) {
    p3 = polygon[i]
    p4 = polygon[i + 1]
    if (checkCross(p1, p2, p3, p4) === true) {
      count++
    }
  }
  p3 = polygon[polygon.length - 1]
  p4 = polygon[0]
  if (checkCross(p1, p2, p3, p4) === true) {
    count++
  }
  return count % 2 !== 0
}

/**
 * 判断两条线段是否相交
 * @param {*} p1
 * @param {*} p2
 * @param {*} p3
 * @param {*} p4
 * @returns
 */
export function checkCross (p1, p2, p3, p4) {
  const v1 = { x: p1.x - p3.x, y: p1.y - p3.y }
  const v2 = { x: p2.x - p3.x, y: p2.y - p3.y }
  const v3 = { x: p4.x - p3.x, y: p4.y - p3.y }
  const v = crossMul(v1, v3) * crossMul(v2, v3)
  Object.assign(v1, { x: p3.x - p1.x, y: p3.y - p1.y })
  Object.assign(v2, { x: p4.x - p1.x, y: p4.y - p1.y })
  Object.assign(v3, { x: p2.x - p1.x, y: p2.y - p1.y })
  return !!((v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0))
}

/**
 * 计算向量叉乘
 * @param {*} v1
 * @param {*} v2
 * @returns
 */
export function crossMul (v1, v2) {
  return v1.x * v2.y - v1.y * v2.x
}

/**
 * 判断两个矩形是否重叠
 * @param {*} sourceR
 * @param {*} targetR
 * @returns
 */
export function collideRect (sourceR, targetR) {
  const maxX = sourceR.x + sourceR.width >= targetR.x + targetR.width ? sourceR.x + sourceR.width : targetR.x + targetR.width
  const maxY = sourceR.y + sourceR.height >= targetR.y + targetR.height ? sourceR.y + sourceR.height : targetR.y + targetR.height
  const minX = sourceR.x <= targetR.x ? sourceR.x : targetR.x
  const minY = sourceR.y <= targetR.y ? sourceR.y : targetR.y

  if (maxX - minX <= sourceR.width + targetR.width && maxY - minY <= sourceR.height + targetR.height) {
    return true
  }
  return false
}

/**
 * 判断一个矩形是否在某一个矩形区域内
 * @param {*} sourceRect
 * @param {*} targetRect
 */
export function isRectangleInside (sourceRect, targetRect) {
  const { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight } = sourceRect
  const { x: targetX, y: targetY, width: targetWidth, height: targetHeight } = targetRect
  if (
    (targetX > sourceX) &&
    (targetY > sourceY) &&
    (targetX + targetWidth < sourceX + sourceWidth) &&
    (targetY + targetHeight < sourceY + sourceHeight)
  ) {
    return true
  }
  return false
}

/**
 * 节点拖动占位符连线获取起始坐标和结束坐标
 * @param {*} params
 */
export function getEdgeStartEndCoordinate (params) {
  const { direction, enterNodeInfo, dir, parentNodeInfo, atLast } = params
  const { x, y, width, height } = enterNodeInfo
  // const isRoot = !parentNodeInfo.parent
  if (direction === 'bottom') {
    const endX = atLast ? x + width / 2 : dir === 'down' ? x + width + 36 : x - 36
    const startX = atLast ? x + width / 2 : parentNodeInfo.x + parentNodeInfo.width / 2
    const startY = atLast ? y + height : parentNodeInfo.y + parentNodeInfo.height
    const endY = atLast ? y + height + 12 : y + 6
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      rect: { x: endX - 23, y: endY }
    }
  }
  let startX, endX
  const endY = atLast ? y + height / 2 : dir === 'down' ? y + height + 12 : y - 12
  const startY = atLast ? y + height / 2 : parentNodeInfo.y + parentNodeInfo.height / 2
  if (direction === 'right') {
    endX = atLast ? x + width + 20 : x
    startX = atLast ? x + width : parentNodeInfo.x + parentNodeInfo.width - parentNodeInfo.gap
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      rect: { x: endX, y: endY - 9 }
    }
  }
  if (direction === 'left') {
    endX = atLast ? x - 20 : x + width
    startX = atLast ? x : parentNodeInfo.x + parentNodeInfo.gap
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      rect: { x: endX - 46, y: endY - 9 }
    }
  }
}
