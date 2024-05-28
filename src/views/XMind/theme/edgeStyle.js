function getRootLinePath (gradient, lineWidth, { sx, sy }, { tx, ty }) {
  const offsetY = Math.abs(ty - sy)
  const offsetX = Math.abs(tx - sx)
  const unitX = tx > sx ? 1 : -1
  const unitY = ty > sy ? -1 : ty < sy ? 1 : 0
  if (offsetY < offsetX) {
    sx += Math[unitX > 0 ? 'min' : 'max'](unitX * (offsetX - offsetY), unitX * 30)
  }
  if (gradient) {
    lineWidth = Number(lineWidth.split('-')[1])
    if (unitY === 0) {
      return `M${sx} ${sy - 1} ${tx} ${ty - 1} ${tx} ${ty + 1} ${sx} ${sy + 1} z`
    }
    return `M${sx} ${sy} Q${sx + offsetX / 10 * unitX} ${ty} ${tx} ${ty} Q${sx + offsetX / 10 * unitX} ${ty} ${sx - (5 + lineWidth)} ${sy} z`
  }
  return `M${sx} ${sy} Q${sx + offsetX / 10 * unitX} ${ty + offsetY / 30 * unitY} ${tx} ${ty}`
}

export default {
  1: function ({ sourcePoint, targetPoint, isRoot, gradient, lineWidth, structure }) {
    const { sx, sy } = sourcePoint
    const { tx, ty } = targetPoint
    if (isRoot && structure === 'swdt') {
      return getRootLinePath(gradient, lineWidth, sourcePoint, targetPoint)
    }
    if (tx < sx) {
      return `M${sx} ${sy} L${sx - 12} ${sy} Q${sx - 12} ${ty} ${tx} ${ty}`
    } else {
      return `M${sx} ${sy} L${sx + 12} ${sy} Q${sx + 12} ${ty} ${tx} ${ty}`
    }
  },

  2: function ({ sourcePoint, targetPoint, isRoot, gradient, lineWidth, structure }) {
    const { sx, sy } = sourcePoint
    const { tx, ty } = targetPoint
    if (isRoot && structure === 'swdt') {
      return getRootLinePath(gradient, lineWidth, sourcePoint, targetPoint)
    }
    if (tx > sx) {
      if (ty < sy) {
        return `M${sx} ${sy} L${sx + 12} ${sy} ${sx + 12} ${ty + 5} A 5 5 -90 0 1 ${sx + 17} ${ty} L${tx} ${ty}`
      } else if (ty > sy) {
        return `M${sx} ${sy} L${sx + 12} ${sy} ${sx + 12} ${ty - 5} A 5 5 -90 0 0 ${sx + 17} ${ty} L${tx} ${ty}`
      } else {
        return `M${sx} ${sy} L${sx + 15} ${sy} L${sx + 15} ${ty} ${tx} ${ty}`
      }
    } else {
      if (ty < sy) {
        return `M${sx} ${sy} L${sx - 12} ${sy} ${sx - 12} ${ty + 5} A 5 5 0 0 0 ${sx - 17} ${ty} L${tx} ${ty}`
      } else if (ty > sy) {
        return `M${sx} ${sy} L${sx - 12} ${sy} ${sx - 12} ${ty - 5} A 5 5 0 0 1 ${sx - 17} ${ty} L${tx} ${ty}`
      } else {
        return `M${sx} ${sy} L${sx - 15} ${sy} L${sx - 15} ${ty} ${tx} ${ty}`
      }
    }
  },

  3: function ({ sourcePoint, targetPoint, isRoot, gradient, lineWidth, structure }) {
    const { sx, sy } = sourcePoint
    const { tx, ty } = targetPoint
    if (isRoot && structure === 'swdt') {
      return getRootLinePath(gradient, lineWidth, sourcePoint, targetPoint)
    }
    if (tx < sx) {
      return `M${sx} ${sy} L${sx - 12} ${sy} L${sx - 12} ${ty} ${tx} ${ty}`
    } else {
      return `M${sx} ${sy} L${sx + 12} ${sy} L${sx + 12} ${ty} ${tx} ${ty}`
    }
  },

  4: function ({ sourcePoint, targetPoint, isRoot, gradient, lineWidth, structure }) {
    const { sx, sy } = sourcePoint
    const { tx, ty } = targetPoint
    const diff = Math.abs(tx - sx) / 2
    if (isRoot && structure === 'swdt') {
      return getRootLinePath(gradient, lineWidth, sourcePoint, targetPoint)
    }
    if (tx < sx) {
      return `M${sx} ${sy} C${sx - diff} ${sy} ${tx + diff} ${ty} ${tx} ${ty}`
    } else {
      return `M${sx} ${sy} C${sx + diff} ${sy} ${tx - diff} ${ty} ${tx} ${ty}`
    }
  },

  5: function ({ sourcePoint, targetPoint, isRoot, gradient, lineWidth }) {
    const { sx, sy } = sourcePoint
    const { tx, ty } = targetPoint
    const diff = Math.abs(tx - sx) * (tx < sx ? -1.15 : 1.15)
    if (isRoot) {
      if (gradient) {
        lineWidth = Number(lineWidth.split('-')[1]) * 2
        return `M${sx} ${sy} C${sx + diff} ${sy} ${tx - diff} ${ty} ${tx} ${ty} C${tx - diff - lineWidth} ${ty} ${sx + diff + lineWidth} ${sy} ${sx} ${sy} z`
      }
    }
    const radius = isRoot ? 10 : 5
    if (ty === sy) {
      return `M${sx + radius} ${sy} L${tx - radius} ${ty}`
    }
    const sf = ty > sy ? 1 : 0
    const minus = ty > sy ? -1 : 1
    return `M${sx + radius} ${sy} A${radius} ${radius} 0 0 ${sf} ${sx + radius * 2} ${sy + radius * (sf === 1 ? 1 : -1)} L${sx + radius * 2} ${ty + radius * minus} A${radius} ${radius} 0 0 ${sf ? 0 : 1} ${sx + radius * 3} ${ty}`
  }
}
