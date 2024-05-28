import { hasChild, randomId } from './node'

export function isEmpty(data) {
  if (
    data === null
    || data === undefined
    || data === ''
    || JSON.stringify(data) === '{}'
  )
    return true

  return false
}

/**
 * 递归遍历插入节点
 * @param {*} nodes
 * @param {*} id
 * @param { String } type 插入为同级节点或者自己节点 brother - 同级节点  child - 子集节点
 */
export function insertXmindNode(nodes, id, type, insertNode) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]._id === id) {
      if (type === 'brother') {
        nodes.push(createNodeIntance())
      }
      else if (type === 'child') {
        nodes[i].children = [
          ...(nodes[i].children || []),
          insertNode || createNodeIntance(),
        ]
      }
      break
    }
    if (hasChild(nodes[i]))
      insertXmindNode(nodes[i].children, id, type, insertNode)
  }
}

/**
 * 批量插入节点
 * @param {*} nodes
 * @param {*} ids
 * @param { String } type 插入为同级节点或者自己节点 brother - 同级节点  child - 子集节点
 */
export function batchInsertXmindNode(nodes, ids, type) {
  for (let i = 0; i < nodes.length; i++) {
    const idx = ids.findIndex(id => id === nodes[i]._id)
    if (idx > -1) {
      if (type === 'brother') {
        nodes.push(createNodeIntance())
      }
      else if (type === 'child') {
        nodes[i].children = [
          ...(nodes[i].children || []),
          createNodeIntance(),
        ]
      }
      ids.splice(idx, 1)
      if (ids.length === 0)
        return
    }
    if (hasChild(nodes[i]))
      batchInsertXmindNode(nodes[i].children, ids, type)
  }
}

export function batchReferenceStyle(node, ids, style) {
  const idx = ids.findIndex(id => id === node._id)
  if (idx > -1) {
    node.customStyle = { ...node.customStyle || {}, ...style }
    ids.splice(idx, 1)
    if (ids.length === 0)
      return
  }
  if (hasChild(node)) {
    for (let i = 0; i < node.children.length; i++)
      batchReferenceStyle(node.children[i], ids, style)
  }
}

/**
* 递归遍历节点删除指定的节点
* @param {*} nodes
* @param {*} id
*/
export function deleteXmindNode(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]._id === id) {
      nodes.splice(i, 1)
      break
    }
    if (hasChild(nodes[i]))
      deleteXmindNode(nodes[i].children, id)
  }
}

/**
* 批量删除节点
* @param {*} nodes
* @param {*} ids
*/
export function batchDeleteXmindNode(nodes, ids) {
  for (let i = 0; i < nodes.length; i++) {
    const idx = ids.findIndex(id => id === nodes[i]._id)
    if (idx > -1) {
      nodes.splice(i, 1)
      ids.splice(idx, 1)
      i--
    }
    else {
      if (hasChild(nodes[i]))
        batchDeleteXmindNode(nodes[i].children, ids)
    }
  }
}

/**
 * 上下移节点
 * @param {*} nodes
 * @param {*} id
 * @param {*} arrow up - 上移 down - 下移
 */
export function moveXmindNode(nodes, id, arrow) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]._id === id) {
      if (arrow === 'up') {
        if (i !== 0) {
          const tNode = nodes.splice(i, 1)[0]
          nodes.splice(i - 1, 0, tNode)
        }
      }
      else if (arrow === 'down') {
        if (i !== nodes.length - 1) {
          const tNode = nodes.splice(i, 1)[0]
          nodes.splice(i + 1, 0, tNode)
        }
      }
      break
    }
    if (hasChild(nodes[i]))
      moveXmindNode(nodes[i].children, id, arrow)
  }
}

/**
 * 剪切拷贝节点
 * @param {*} node
 * @param {*} id
 * @param {*} iscut
 */
export function copyOrCutXmindNode(nodes, node, id, iscut = false) {
  if (node._id === id) {
    const copyNodeInstance = JSON.parse(JSON.stringify(node))
    if (iscut)
      deleteXmindNode(nodes, id)
    else
      copyNodeInstance.relations = null

    return copyNodeInstance
  }
  if (hasChild(node)) {
    for (let i = 0; i < node.children.length; i++) {
      const copyNodeInstance = copyOrCutXmindNode(nodes, node.children[i], id, iscut)
      if (copyNodeInstance)
        return copyNodeInstance
    }
  }
}

/**
 * 收起展开子节点
 * @param {*} node
 * @param {*} id
 * @param { Boolean } expand true - 展开 false - 收起
 */
export function toogleExpandXmindNode(node, id, expand) {
  if (node._id === id) {
    node.expand = expand
    if (!expand)
      node.childCount = node.children.length
    else
      node.childCount = 0

    return
  }
  if (hasChild(node)) {
    node.children.forEach((n) => {
      toogleExpandXmindNode(n, id, expand)
    })
  }
}

/**
 * 收起展开所有节点
 * @param {*} node
 * @param { Boolean } expand true - 展开 false - 收起
 */
export function expandAllNodes(node, expand) {
  if (!hasChild(node)) {
    node.expand = true
  }
  else {
    node.expand = expand
    if (!expand)
      node.childCount = node.children?.length
    else
      node.childCount = 0

    node.children.forEach((n) => {
      expandAllNodes(n, expand)
    })
  }
}

/**
 * 备份根节点隐藏所有节点属性expand为false的所有子节点
 * @param {*} node
 * @returns
 */
export function backupRootDeleteChild(node) {
  const backNodenode = JSON.parse(JSON.stringify(node))
  function backup(root) {
    if (!root.expand)
      root.children = null

    if (hasChild(root)) {
      root.children.forEach((n) => {
        backup(n)
      })
    }
  }
  backup(backNodenode)
  return backNodenode
}

/**
 * 左右布局的时候给root按照下标分为左右两个root
 * @param {*} root
 * @param { * } structure 思维导图结构
 */
export function splitLeftRightRoot(root, structure) {
  if (structure !== 'swdt') {
    return {
      leftRoot: {},
      rightRoot: root,
    }
  }
  const [leftRoot, rightRoot] = [{ ...root, children: [] }, { ...root, children: [] }]
  if (hasChild(root)) {
    const len = root.children.length
    const cacheNodes = setRightLeftNodes(root.children)
    for (let i = 0; i < cacheNodes.length; i++) {
      if (rightRoot.children.length + cacheNodes[i].length <= Math.floor(len / 2))
        rightRoot.children.push(...cacheNodes[i])
      else
        leftRoot.children.push(...cacheNodes[i])
    }
  }
  return {
    leftRoot,
    rightRoot,
  }
}

/**
 * 在两个节点之间有概要关系时，思维导图结构下把有关联的节点放在同一侧
 * @param {*} nodes
 * @returns
 */
function setRightLeftNodes(nodes) {
  const cacheNodes = []
  for (let i = 0; i < nodes.length; i++) {
    const targetSummarys = nodes[i].targetSummarys
    // 节点不存在概要关系
    if (!targetSummarys?.length) {
      cacheNodes.push([nodes[i]])
      continue
    }
    const cache = [nodes[i]]
    _c(cache, targetSummarys, i)
    cacheNodes.push(cache)
  }

  function _c(cache, targetSummarys, i) {
    const maxIdx = Math.max(...targetSummarys.map(o => nodes.findIndex(kk => kk._id === o.id)))
    if (maxIdx > i) {
      const len = maxIdx - i
      const betweenNodes = nodes.splice(i + 1, len)
      cache.push(...betweenNodes)
      for (let k = 0; k < betweenNodes.length; k++) {
        if (betweenNodes[k].targetSummarys?.length)
          _c(cache, betweenNodes[k].targetSummarys, i)
      }
      i -= len
    }
  }
  return cacheNodes
}

/**
 * 递归树节点找到指定数据更新指定的key值
 * @param { Object } node 节点数据
 * @param { String } id 节点唯一标识
 * @param { String } key 需要更新的节点key字段
 * @param { String } value 更新后的值
 */
export function recursiveTreeValue(node, id, key, value) {
  if (node._id === id) {
    if (key.includes('.')) {
      const keys = key.split('.')
      node[keys[0]][keys[1]] = value
    }
    else {
      node[key] = value
    }
    return
  }
  if (hasChild(node)) {
    node.children.forEach((n) => {
      recursiveTreeValue(n, id, key, value)
    })
  }
}

/**
 * 批量节点更新指定样式
 * @param {*} node
 * @param {*} ids
 * @param {*} key
 * @param {*} value
 * @returns
 */
export function bacthUpdateNodeCustomStyle(node, ids, key, value) {
  const idx = ids.findIndex(o => o === node._id)
  if (idx > -1) {
    if (node.customStyle) {
      node.customStyle[key] = value
    }
    else {
      node.customStyle = {}
      node.customStyle[key] = value
    }
    ids.splice(idx, 1)
    if (!ids.length)
      return
  }
  if (hasChild(node)) {
    node.children.forEach((n) => {
      bacthUpdateNodeCustomStyle(n, ids, key, value)
    })
  }
}

/**
 * 全局节点自定义样式更新
 * @param {*} node
 * @param {*} key
 * @param {*} value
 */
export function gloabUpdateNodeCustomStyle(node, key, value) {
  if (node.customStyle) {
    node.customStyle[key] = value
  }
  else {
    node.customStyle = {}
    node.customStyle[key] = value
  }
  if (hasChild(node)) {
    node.children.forEach((n) => {
      gloabUpdateNodeCustomStyle(n, key, value)
    })
  }
}

/**
 * 重置整个画布节点样式
 * @param {*} root
 * @param {*} deep
 */
export function resetRootNodeStyle(root) {
  root.customStyle = undefined
  if (hasChild(root)) {
    for (let k = 0; k < root.children.length; k++)
      resetRootNodeStyle(root.children[k])
  }
}

/**
 * 批量节点重置样式
 * @param {*} node
 * @param {*} ids
 * @returns
 */
export function batchResetNodeStyle(node, ids) {
  const idx = ids.findIndex(o => o === node._id)
  if (idx > -1) {
    node.customStyle = undefined
    ids.splice(idx, 1)
    if (!ids.length)
      return
  }
  if (hasChild(node)) {
    node.children.forEach((n) => {
      batchResetNodeStyle(n, ids)
    })
  }
}

/**
 * 根据_id获取指定数据
 * @param {*} data
 * @param {*} value
 */
export function getTargetDataById(data, id) {
  if (data._id === id)
    return data

  if (hasChild(data)) {
    for (let i = 0; i < data.children.length; i++) {
      const d = getTargetDataById(data.children[i], id)
      if (d)
        return d
    }
  }
}

export function batchRecursiveTreeValue(node, ids, key, value) {
  const idx = ids.findIndex(id => id === node._id)
  if (idx > -1) {
    node[key] = value
    ids.splice(idx, 1)
  }
  if (hasChild(node) && ids.length) {
    node.children.forEach((n) => {
      batchRecursiveTreeValue(n, ids, key, value)
    })
  }
}

/**
 * 初始化新增节点的数据信息
 */
export function createNodeIntance(text) {
  return {
    text: text || '分支主题',
    children: null,
    _id: randomId(),
    expand: true,
    childCount: 0,
  }
}

/**
 * 更新root数据后实时存储数据
 */
export function storageRootRelaTime(root) {
  window.localStorage.setItem('root', JSON.stringify(root))
}

/**
 * 导出 svg
 * @param { String } htmlStr
 */
export function exportSVG(htmlStr) {
  const blob = new Blob([htmlStr], {
    type: 'image/svg+xml',
  })
  const file = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = file
  a.download = 'xmind.svg'
  a.click()
}

/**
 * 导出 png
 * @param { String } htmlStr
 */
export async function exportPNG(htmlStr) {
  try {
    const blob = new Blob([htmlStr], {
      type: 'image/svg+xml',
    })
    const imageSrc = await blobToUrl(blob)
    const file = await imageToBase64(imageSrc)
    const a = document.createElement('a')
    a.href = file
    a.download = 'xmind.png'
    a.click()
  }
  catch (error) {
    console.log(error)
  }
}

/**
 * blob 转成 base64
 * @param {*} blob
 * @returns
 */
function blobToUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (evt) => {
      resolve(evt.target.result)
    }
    reader.onerror = (err) => {
      reject(err)
    }
    reader.readAsDataURL(blob)
  })
}

/**
 * 导出json
 * @param {*} json
 */
export function exportJSON(name, json) {
  const blob = new Blob([json])
  const file = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = file
  a.download = `${name}.json`
  a.click()
}

export function debounce(func, delay) {
  let timer = null
  return function () {
    const self = this
    const args = arguments
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      func.apply(self, args)
    }, delay)
  }
}

/**
 * 计算节点树所有文字个数和节点个数
 */
export function statisticTreeCount(root) {
  let [len, count] = [0, 0]
  function getStatistic(root) {
    const tagLength = (root.tag?.split(';') || [])
      .reduce((prev, cur) => {
        prev += cur.length
        return prev
      }, 0)
    len
        += (root.text?.length || 0)
        + (root.summary?.length || 0) + tagLength
    count += 1
    if (hasChild(root)) {
      for (let i = 0; i < root.children.length; i++)
        getStatistic(root.children[i])
    }
  }
  getStatistic(root)
  return {
    len, count,
  }
}

/**
 * src to base64
 * @param {*} svgUrl
 * @returns
 */
export function imageToBase64(svgUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        resolve(canvas.toDataURL())
      }
      catch (error) {
        reject(error)
      }
    }
    img.onerror = (e) => {
      reject(e)
    }
    img.src = svgUrl
  })
}

/**
 * 节点样式获取
 */
export function getNodeCustomStyle(node) {
  const {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecoration,
    textDirection,
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
    horizontalOutter,
  } = node.customStyle || {}
  return {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecoration,
    textDirection,
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
    horizontalOutter,
  }
}
