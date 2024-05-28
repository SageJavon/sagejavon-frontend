<script>
import { storeToRefs } from 'pinia'
import { select, selectAll } from 'd3-selection'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom'
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { preventWindowDefault, shortcutKeydown } from './shortcutKey'
import edgeStyleMap from './theme/edgeStyle'
import { collideRect, getEdgeStartEndCoordinate, getLinearExpression, getMinDistancePoint, getRectLineIntersectionPoint, isRectangleInside } from './utils/math'
import { dataTreeLayoutPackage, getNodeRelationPathPoints, randomId, setuniqueId } from './utils/node'
import {
  backupRootDeleteChild,
  bacthUpdateNodeCustomStyle,
  batchDeleteXmindNode,
  batchInsertXmindNode,
  batchRecursiveTreeValue,
  batchReferenceStyle,
  batchResetNodeStyle,
  copyOrCutXmindNode,
  createNodeIntance,
  debounce,
  deleteXmindNode,
  expandAllNodes,
  exportJSON,
  exportPNG,
  exportSVG,
  getNodeCustomStyle,
  getTargetDataById,
  gloabUpdateNodeCustomStyle,
  imageToBase64,
  insertXmindNode,
  moveXmindNode,
  recursiveTreeValue,
  resetRootNodeStyle,
  splitLeftRightRoot,
  statisticTreeCount,
  storageRootRelaTime,
  toogleExpandXmindNode,
} from './utils'
import {
  createCanvasContainer,
  createCustomXMindDEFS,
  drawAllSelectDomain,
  drawImageControlNode,
  drawRealRealtionPath,
  gloabupdateColorStyle,
  renderDeleteEdges,
  renderDeleteNodes,
  renderNewEdges,
  renderNewNodes,
  renderUpdateEdges,
  renderUpdateNodes,
  renderVirtualRelationPath,
  renderXmindOtherElement,
  updateRedrawNodeStyle,
  updateRenderVirtualRelationPath,
} from './graph/draw'
import mitter from './mitt'
import theme from './theme'
import Editor from './components/Editor.vue'
import CommandBar from './components/CommandBar.vue'
import ThumbXMind from './components/ThumbXMind.vue'
import UploadImage from './components/UploadImage.vue'
import ContextMenu from './components/ContextMenu.vue'
import TiptapEditor from './components/TiptapEditor.vue'
import TopActionBar from './components/TopActionBar.vue'
import DataStructure from './components/DataStructure.vue'
import IconSelectModal from './components/IconSelectModal.vue'
import SidebarTriggerContainer from './components/SidebarTriggerContainer.vue'
import { xmindMap } from '@/store'
let root = window.localStorage.getItem('root')
  ? JSON.parse(window.localStorage.getItem('root'))
  : createNodeIntance('中心主题')
let svg = null
let mindContainer = null
let canvasWidth = 0
let canvasHeight = 0
let nodes = []
let edges = []
let scaleNumberTimer = null
let eventTransform = null
let domainStart = null
let hasMoveEvent = false
let dragIngSubject = null
let summaryArea = null
let summaryBrothers = []
let dragTargetAttrs = null
const debounceUpdateFileds = ['textColor', 'strokeColor', 'backgroundColor', 'lineColor']
export default defineComponent({
  components: {
    Editor,
    CommandBar,
    ContextMenu,
    TopActionBar,
    IconSelectModal,
    ThumbXMind,
    DataStructure,
    UploadImage,
    TiptapEditor,
    SidebarTriggerContainer,
  },
  setup() {
    const store = xmindMap()
    const { openThumb, readOnly, immersion } = storeToRefs(store)
    const thumbXminRef = ref(null)
    const dataStructureRef = ref(null)
    const contextMenuType = ref(null)
    const currentTheme = ref(localStorage.getItem('theme') || 'primary')
    const currentStructure = ref(localStorage.getItem('structure') || 'ljjgt')
    const currentEdgeStyle = ref(localStorage.getItem('edgeStyleValue') || '2')
    const copyNodeInstance = ref(null)
    const copyStyle = ref(null)
    const position = ref({ x: 0, y: 0, tx: 0, ty: 0 })
    const editorTypeName = ref('text')
    const currentMarkIcon = ref(null)
    const customDeleteModalPos = ref(null)
    const scaleNumber = ref(100)
    const currnentNode = ref(null)
    const selectNodes = ref([])
    const editorVisible = ref(false)
    const contextVisible = ref(false)
    const scaleNumberVisible = ref(false)
    const tiezhiIconVisible = ref(false)
    const structureVisible = ref(false)
    const uploadImageVisible = ref(false)
    const uploadJson = ref(false)
    const historyStep = ref([JSON.parse(JSON.stringify(root))])
    const currentStep = ref(0)
    const textLen = ref(0)
    const nodeCount = ref(0)
    const uploadType = ref(null)
    const tipTapPosition = ref(null)
    const valueComment = ref(null)
    const boundingClient = ref(null)
    const selectCombinationId = ref(null)
    const editorNodeValue = ref(null)
    const currentInsertSummaryId = ref(null)
    const drawRelationIng = ref(false)
    const controlName = ref(null)
    const summaryControlName = ref(null)
    const imageContolName = ref(null)
    const relationNodeSubject = ref(null)
    const isPastState = ref(true)
    const editorPosition = ref(null)
    const backgroundColor = computed(() => {
      return theme[currentTheme.value].backgroundColor
    })

    onMounted(() => {
      preventWindowDefault()
      shortcutKeydown()
      mitter.on('node-handler-click', ({ event, _this }) => {
        if (drawRelationIng.value)
          return drawRelationPathEnd(event)

        nodeHandlerClick(event, _this)
      })
      mitter.on('node-context-click', ({ event, _this }) => {
        nodeContextClick(event, _this)
      })
      mitter.on('node-handler-dblclick', ({ event, _this }) => {
        nodeHandlerDblclick(event, _this)
      })
      mitter.on('node-handler-mouseenter', ({ event, _this }) => {
        nodeHandlerMouseEnter(event, _this)
      })
      mitter.on('node-handler-mouseleave', ({ event, _this }) => {
        nodeHandlerMouseLeave(event, _this)
      })
      mitter.on('node-handler-draging', ({ event, _this }) => {
        nodeHandlerDragIng(event, _this)
      })
      mitter.on('node-handler-dragend', ({ event, _this }) => {
        nodeHandlerDragEnd(event, _this)
      })
      mitter.on('mark-handler-click', ({ event, _this }) => {
        markHandlerClick(event, _this)
      })
      mitter.on('expand-node-click', ({ event, _this }) => {
        expandNodeClick(event, _this)
      })
      mitter.on('comment-handler-click', ({ event, _this }) => {
        commentIconHandlerClick(event, _this)
      })
      mitter.on('summary-handler-mouseenter', ({ event, _this }) => {
        summaryHandlerMouseEnter(null, event, _this)
      })
      mitter.on('summary-handler-mouseleave', ({ event, _this }) => {
        summaryHandlerMouseLeave(event, _this)
      })
      mitter.on('summary-handler-click', ({ event, _this }) => {
        summaryHandlerClick(null, event, _this)
      })
      mitter.on('summary-handler-dblclick', ({ event, _this }) => {
        summaryHandlerDblclick(event, _this)
      })
      mitter.on('image-handler-click', ({ event, _this }) => {
        imageHandlerDblclick(event, _this)
      })
      mitter.on('expand-handler-click', ({ event, _this }) => {
        event.stopPropagation()
        const currnentNode = select(_this).datum()
        toogleExpandXmindNode(root, currnentNode.data._id, false)
        updateXmindCanvas()
      })
      mitter.on('relation-node-handler-click', ({ event, _this }) => {
        relationNodeHandlerClick(event, _this)
      })
      mitter.on('relation-node-contextmenu', ({ event, _this }) => {
        relationNodeContextmenu(event, _this)
      })
      mitter.on('relation-node-dblclick', ({ event, _this }) => {
        relationNodeDBlclick(event, _this)
      })
      mitter.on('relation-controller-mousedown', ({ event, _this }) => {
        event.stopPropagation()
        controlName.value = select(_this)
          .attr('class')
        relationNodeSubject.value = select(_this.parentNode)
          .classed('active-relation', true)
          .datum()
      })
      const debounceUpdateStyle = debounce((filedName, filedValue) => {
        bacthUpdateNodeCustomStyle(root, selectNodes.value.map(o => o.data._id), filedName, filedValue)
        updateXmindCanvas(false)
      }, 300)
      const debounceGloabUpdateStyle = debounce((filedName, filedValue) => {
        gloabUpdateNodeCustomStyle(root, filedName, filedValue)
        updateXmindCanvas(false)
      })
      mitter.on('update-subject-style', ({ filedName, filedValue, gloab }) => {
        if (!debounceUpdateFileds.includes(filedName)) {
          // 全局节点
          if (!gloab)
            bacthUpdateNodeCustomStyle(root, selectNodes.value.map(o => o.data._id), filedName, filedValue)
          else
            gloabUpdateNodeCustomStyle(root, filedName, filedValue)

          updateXmindCanvas(false)
        }
        else {
          if (!gloab) {
            for (let i = 0; i < selectNodes.value.length; i++)
              updateRedrawNodeStyle({ filedValue, filedName, id: selectNodes.value[i].data._id })

            debounceUpdateStyle(filedName, filedValue)
          }
          else {
            gloabupdateColorStyle(root, filedValue, filedName)
            debounceGloabUpdateStyle(filedName, filedValue)
          }
        }
      })
      shortcutMitters()
      initMindmindContainer('zx-xmind-map')
      window.addEventListener('resize', resizeXmindMap)
    })

    onBeforeUnmount(() => {
      mitter.all.clear()
      window.removeEventListener('resize', resizeXmindMap)
    })

    /**
     * 初始化画布渲染所有元素
     * @param { String } id 生成画布容器id
     */
    function initMindmindContainer(id) {
      const ele = document.getElementById(id)
      canvasWidth = ele.clientWidth
      canvasHeight = ele.clientHeight
      const zoom = structureZoom()
      svg = select(ele)
        .append('svg')
        .attr('id', 'zx-xmind-map-svg')
        .attr('width', canvasWidth)
        .attr('height', canvasHeight)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .on('contextmenu', outterContextClick)
        .call(zoom)
        .on('dblclick.zoom', null)
      select('.xmind-map-container')
        .on('mousedown', mouseStartMoveOnScreen)
        .on('mousemove', mouseMoveIngOnScreen)
        .on('mouseup', mouseEndMoveOnScreen)
      mindContainer = svg
        .append('g')
        .attr('class', 'map-outter-container')
      createCustomXMindDEFS()
      initRnderCanvas()
      const localTransform = localStorage.getItem('transform')
      setXMindMapCenter(localTransform ? JSON.parse(localTransform) : undefined)
      drawImageControlNode(mindContainer)
    }

    /**
     * 构造画布缩放可拖动zoom实例
     */
    function structureZoom() {
      const zoom = d3Zoom()
        .scaleExtent([0.1, 10])
        .filter(event => event.ctrlKey && event.buttons <= 1)
        .wheelDelta(event => -event.deltaY * (event.deltaMode ? 120 : 1) / 500)
        .on('start', function (event) {
          hiddenPopover()
          removeNodeHighLight()
          hideElementControlNode()
          if (event.sourceEvent && event.sourceEvent.type !== 'wheel')
            select(this).classed('grabbing', true)

          exitDrawRelation()
        })
        .on('zoom', (event) => {
          clearTimeout(scaleNumberTimer)
          mindContainer.attr('transform', () => {
            eventTransform = event.transform
            localStorage.setItem('transform', JSON.stringify(eventTransform))
            return eventTransform
          })
          scaleNumber.value = Math.round(event.transform.k * 100)
          if (event.sourceEvent && event.sourceEvent.type === 'wheel')
            scaleNumberVisible.value = true

          const { top, right, bottom, left } = mindContainer.node().getBoundingClientRect()
          boundingClient.value = {
            top, right, bottom, left,
          }
        })
        .on('end', function () {
          select(this).classed('grabbing', false)
          scaleNumberTimer = setTimeout(() => {
            scaleNumberVisible.value = false
          }, 600)
        })
      return zoom
    }

    /**
     * 画布局中
     */
    function setXMindMapCenter(transform) {
      if (select('.x-mind-root-theme').empty())
        return
      const zoom = structureZoom()
      const { width, height } = select('.x-mind-root-theme').node().getBoundingClientRect()
      nextTick(() => {
        if (!transform) {
          svg
            .call(zoom.transform,
              zoomIdentity
                .translate((canvasWidth - width) / 4, (canvasHeight - height) / 2).scale(1))
        }
        else {
          const { x, y, k } = transform
          svg
            .call(zoom.transform,
              zoomIdentity
                .translate(x, y)
                .scale(k))
        }
      })
    }

    function moveXmindMap({ x, y }) {
      const scalceRadio = 0.1 / (scaleNumber.value / 100)
      const zoom = structureZoom()
      svg
        .call(zoom.transform,
          zoomIdentity
            .translate(eventTransform.x - x / scalceRadio, eventTransform.y - y / scalceRadio)
            .scale(eventTransform.k))
    }

    function resizeXmindMap() {
      const ele = document.getElementById('zx-xmind-map')
      canvasWidth = ele.clientWidth
      canvasHeight = ele.clientHeight
      svg
        .attr('width', canvasWidth)
        .attr('height', canvasHeight)
    }

    function setXMindMapScale(command) {
      let k = Math.ceil(eventTransform.k * 10 + (command === 'reduce' ? -1 : 1)) / 10
      if (k <= 0.1)
        k = 0.1
      else if (k >= 10)
        k = 10

      const zoom = structureZoom()
      svg
        .call(zoom.transform,
          zoomIdentity
            .translate(eventTransform.x, eventTransform.y)
            .scale(k))
    }

    function updateSelectNodeHighLight(event) {
      const selections = select('.mind-map-nodebox')
        .selectAll('.x-mind-nodetheme')
      removeNodeHighLight()
      selections.nodes().forEach((selection) => {
        const collide = collideRect(
          { x: Math.min(domainStart.x, event.x), y: Math.min(domainStart.y, event.y), width: Math.abs(event.x - domainStart.x), height: Math.abs(event.y - domainStart.y) },
          selection.getBoundingClientRect(),
        )
        if (collide) {
          selectNodes.value.push(select(selection).datum())
          const id = select(selection).datum().data._id
          nodeHighLight(id)
        }
      })
    }

    /**
     * 画布主题节点和连线边节点数据计算
     */
    function getNodeEdgesData() {
      try {
        const backupRoot = backupRootDeleteChild(root)
        const { leftRoot, rightRoot } = splitLeftRightRoot(backupRoot, currentStructure.value)
        const packageLayoutdataLeft = dataTreeLayoutPackage(leftRoot, currentTheme.value, 'left', currentStructure.value)
        const packageLayoutdataRight = dataTreeLayoutPackage(rightRoot,
          currentTheme.value,
          currentStructure.value === 'zzjgt'
            ? 'bottom'
            : 'right', currentStructure.value)
        const leftNodes = packageLayoutdataLeft.nodes.slice(1)
        const leftLinks = packageLayoutdataLeft.links
        const rightNodes = packageLayoutdataRight.nodes
        const rightLinks = packageLayoutdataRight.links
        nodes = [...leftNodes, ...rightNodes]
        edges = [...leftLinks, ...rightLinks]
        if (currentStructure.value === 'kht') {
          for (let i = 0; i < edges.length; i++) {
            const edge = edges[i]
            const parent = edge.target.parent
            const idx = parent.children.findIndex(o => o.data._id === edge.target.data._id)
            if (idx !== 0 && idx !== parent.children.length - 1) {
              edges.splice(i, 1)
              i--
            }
          }
        }
        return {
          nodes,
          edges,
        }
      }
      catch (error) {
        console.error(error)
        uploadImageVisible.value = false
        uploadJson.value = false
        message.error('json文件格式不符合，请参照格式模板上传')
      }
    }

    function initRnderCanvas() {
      createCanvasContainer(mindContainer)
      const { nodes = [], edges = [] } = getNodeEdgesData() || {}
      const relationNodes = nodes.filter(node => node.data.relations?.length)
      renderNewNodes(nodes, theme[currentTheme.value], currentStructure.value)
      renderNewEdges(edges)
      renderXmindOtherElement(undefined, relationNodes)
      thumbXminRef.value.setThumbAttrs(nodes, edges, theme[currentTheme.value], currentStructure.value)
      thumbXminRef.value.initThumbMindContainer()
      const statistic = statisticTreeCount(root)
      textLen.value = statistic.len
      nodeCount.value = statistic.count
    }

    /**
     * 新增、编辑、删除节点后整体画布更新
     * @param { Boolean } clearable 更新画布的时候是否需要清除当前选中的节点
     * @param { Boolean } appendHistory 更新画布的时候是否需要把当前数据存入历史数据中
     */
    function updateXmindCanvas(clearable = true, appendHistory = true) {
      const { nodes = [], edges = [] } = getNodeEdgesData() || {}
      const relationNodes = nodes.filter(node => node.data.relations?.length)
      renderNewNodes(nodes, theme[currentTheme.value], currentStructure.value)
      renderUpdateNodes(nodes)
      renderDeleteNodes(nodes)
      renderNewEdges(edges)
      renderUpdateEdges(edges)
      renderDeleteEdges(edges)
      renderXmindOtherElement(currentInsertSummaryId.value, relationNodes)
      storageRootRelaTime(root)
      thumbXminRef.value.setThumbAttrs(nodes, edges, theme[currentTheme.value], currentStructure.value)
      thumbXminRef.value.updateThumbXmindCanvas()
      const statistic = statisticTreeCount(root)
      textLen.value = statistic.len
      nodeCount.value = statistic.count
      if (clearable) {
        hiddenPopover()
        removeNodeHighLight()
      }
      else {
        contextVisible.value = false
        selectAll('.select-node')
          .classed('select-node', false)
          .select('.select-rect-border')
          .remove()
        for (let i = 0; i < selectNodes.value.length; i++)
          nodeHighLight(selectNodes.value[i].data._id)
      }
      if (appendHistory)
        appendXmindHistory()

      removeSummaryNodeHighLight()
      hideElementControlNode()
    }

    function nodeHandlerDblclick(event, _this) {
      event.stopPropagation()
      removeNodeHighLight()
      hideElementControlNode()
      currnentNode.value = select(_this).datum()
      nodeHighLight(currnentNode.value.data._id)
      editorTypeName.value = 'text'
      editorVisible.value = true
      selectNodes.value.push(currnentNode.value)
      if (currnentNode.value.data.text)
        editorPosition.value = select(_this).select('.x-mind-node-text').node().getBoundingClientRect()
      else
        editorPosition.value = select(_this).node().getBoundingClientRect()
    }

    function nodeHandlerDragIng(event, _this) {
      event.sourceEvent.stopPropagation()
      const subject = event.subject
      if (!subject.parent || editorVisible.value)
        return
      if (!dragIngSubject) {
        const childNodedata = select(_this)
          .classed('draging-elemet-graph-5', true)
          .raise().datum().descendants()
        childNodedata.forEach((node) => {
          if (node.data._id !== subject.data._id)
            select(`#${node.data._id}`).classed('draging-elemet-graph-2', true)

          selectAll(`[data-id*=${node.data._id}]`).classed('draging-elemet-graph-2', true)
        })
        select('.mind-map-edgebox')
          .selectAll('g')
          .filter(path => childNodedata.find(o => o.data._id === path.target.data._id))
          .classed('draging-elemet-graph-2', true)
        select(_this)
          .clone(true)
          .classed('clone-draging-node draging-elemet-graph-2', true)
        dragIngSubject = subject
        svg.classed('moving', true)
        hideElementControlNode()
      }
      const { tx = 0, ty = 0 } = select(_this).datum()
      select(_this).datum().tx = tx + event.dx
      select(_this).datum().ty = ty + event.dy
      select(_this).attr('transform', `translate(${tx + event.dx}, ${ty + event.dy})`)
      if (dragTargetAttrs)
        renderDragShadowNode(event.sourceEvent)
    }

    function nodeHandlerDragEnd() {
      if (!dragIngSubject)
        return
      if (dragTargetAttrs) {
        const { dir, atLast, enterNodeInfo, parentNodeInfo } = dragTargetAttrs
        const parentId = atLast ? enterNodeInfo.id : parentNodeInfo.data._id
        const parentNode = getTargetDataById(root, parentId)
        const dragTarget = copyOrCutXmindNode(root.children, root, dragIngSubject.data._id, true)
        if (!atLast) {
          const idx = parentNode.children.findIndex(o => o._id === enterNodeInfo.id)
          parentNode.children.splice(dir === 'up' ? idx : idx + 1, 0, dragTarget)
        }
        else {
          parentNode.children = [...(parentNode.children || []), dragTarget]
        }
        dragTargetAttrs = null
      }
      select('.drag-shadow-node').style('display', 'none')
      select('.drag-shadow-edge').style('display', 'none')
      selectAll('.draging-elemet-graph-2').classed('draging-elemet-graph-2', false)
      selectAll('.draging-elemet-graph-5').classed('draging-elemet-graph-5', false)
      selectAll('.clone-draging-node').remove()
      svg.classed('moving', false)
      dragIngSubject = null
      updateXmindCanvas()
    }

    function nodeHandlerClick(event, _this) {
      event.stopPropagation()
      removeSummaryNodeHighLight()
      removeRelationNodeHighLight()
      hideElementControlNode()
      if (!event.altKey) {
        removeNodeHighLight()
        currnentNode.value = select(_this).datum()
        const id = currnentNode.value.data._id
        nodeHighLight(id)
        selectNodes.value.push(currnentNode.value)
      }
      else {
        const data = select(_this).datum()
        const id = data.data._id
        const hasSelect = select(`#${id}`).classed('select-node')
        if (hasSelect) {
          select(`#${id}`)
            .classed('select-node', false)
            .select('.select-rect-border')
            .remove()
          const idx = selectNodes.value.findIndex(n => n.data._id === data.data._id)
          selectNodes.value.splice(idx, 1)
        }
        else {
          nodeHighLight(id)
          selectNodes.value.push(data)
        }
        if (selectNodes.value.length > 1)
          currnentNode.value = null
        else
          currnentNode.value = selectNodes.value[0] || null
      }
    }

    function markHandlerClick(event, _this) {
      event.stopPropagation()
      const data = select(_this).datum()
      const pos = select(_this).node().getBoundingClientRect()
      const ratio = scaleNumber.value / 100
      customDeleteModalPos.value = {
        x: pos.x - (80 - data.style.markSize * ratio) / 2 + 2 * ratio,
        y: pos.y + (data.style.markSize + 4) * ratio + 16,
      }
      removeMarkHighlight()
      markHighLight(_this)
      currentMarkIcon.value = data
    }

    function outterContextClick(event) {
      const [w, h] = [190, 240]
      const [x, y] = [event.pageX, event.pageY]
      let [tx, ty] = [0, 0]
      x + w > canvasWidth && (tx = -w)
      y + h > canvasHeight && (ty = -h)
      position.value = { x, y, tx, ty }
      contextMenuType.value = 'global'
      contextVisible.value = true
    }

    /**
     * 获取可编辑div内容
     * @param { String } value
     * @param { String } editorTypeName
     */
    function setEditableValue(value, editorTypeName) {
      if (editorTypeName === 'relation') {
        const relationId = relationNodeSubject.value.relationId
        const sourceId = relationNodeSubject.value.source.id
        select(`#relation-${relationId}`)
          .select('.controller-model')
          .datum({
            ...relationNodeSubject.value,
            relationText: value,
          })
          .select('text')
          .text(value)
        const sourceData = getTargetDataById(root, sourceId)
        const relations = sourceData.relations
        const targetRelation = relations.find(o => o.relationId === relationId)
        targetRelation.relationText = value
        storageRootRelaTime(root)
        hiddenPopover()
        removeRelationNodeHighLight()
        relationNodeSubject.value = null
        appendXmindHistory()
        return
      }
      if (editorTypeName === 'summary') {
        const ids = selectCombinationId.value.split('-')
        const target = getTargetDataById(root, ids[0])
        const summary = target.targetSummarys.find(o => o.id === ids[1])
        summary.text = value
      }
      else {
        recursiveTreeValue(
          root,
          currnentNode.value.data._id,
          editorTypeName,
          value,
        )
      }
      updateXmindCanvas()
    }

    function contextMenuClick(operate, type) {
      const ids = selectNodes.value.map(n => n.data._id)
      switch (operate) {
        case 'insert-brother':
          if (type === 'single')
            insertXmindNode(root.children || [], currnentNode.value.data._id, 'brother')
          else if (type === 'global')
            batchInsertXmindNode(root.children || [], ids, 'brother')

          updateXmindCanvas()
          break
        case 'insert-child':
          if (type === 'single')
            insertXmindNode([root], currnentNode.value.data._id, 'child')
          else if (type === 'global')
            batchInsertXmindNode(root.children || [], ids, 'child')

          updateXmindCanvas()
          break
        case 'insert-tupian':
          contextVisible.value = false
          uploadType.value = 'image'
          uploadImageVisible.value = true
          break
        case 'insert-marker':
          contextVisible.value = false
          tiezhiIconVisible.value = true
          break
        case 'insert-tag':
          contextVisible.value = false
          editorTypeName.value = 'tag'
          editorVisible.value = true
          break
        case 'insert-link':
          contextVisible.value = false
          editorTypeName.value = 'link'
          editorVisible.value = true
          break
        case 'insert-beizhu': {
          contextVisible.value = false
          const { _id: id, comment } = currnentNode.value.data
          insertNodeComment(id, comment)
          break
        }
        case 'up':
          moveXmindNode(root.children || [], currnentNode.value.data._id, 'up')
          updateXmindCanvas(false)
          break
        case 'down':
          moveXmindNode(root.children || [], currnentNode.value.data._id, 'down')
          updateXmindCanvas(false)
          break
        case 'copy':
          isPastState.value = true
          copyNodeInstance.value = copyOrCutXmindNode(root.children, root, currnentNode.value.data._id)
          hiddenPopover()
          break
        case 'copy-style':
          copyStyle.value = getNodeCustomStyle(currnentNode.value.data)
          hiddenPopover()
          break
        case 'reference-style':
          if (type === 'single')
            batchReferenceStyle(root, [currnentNode.value.data._id], copyStyle.value)
          else if (type === 'global')
            batchReferenceStyle(root, ids, copyStyle.value)

          updateXmindCanvas()
          hiddenPopover()
          break
        case 'reset-style':
          if (type === 'single')
            batchResetNodeStyle(root, [currnentNode.value.data._id])
          else if (type === 'global')
            batchResetNodeStyle(root, ids)

          updateXmindCanvas()
          hiddenPopover()
          break
        case 'cut':
          isPastState.value = false
          copyNodeInstance.value = copyOrCutXmindNode(root.children, root, currnentNode.value.data._id, true)
          updateXmindCanvas()
          break
        case 'delete-pic':
          if (type === 'single')
            recursiveTreeValue(root, currnentNode.value.data._id, 'imageInfo', null)
          else if (type === 'global')
            batchRecursiveTreeValue(root, ids, 'imageInfo', null)

          updateXmindCanvas()
          break
        case 'delete-link':
          if (type === 'single')
            recursiveTreeValue(root, currnentNode.value.data._id, 'link', null)
          else if (type === 'global')
            batchRecursiveTreeValue(root, ids, 'link', null)

          updateXmindCanvas()
          break
        case 'past': {
          const paseNode = JSON.parse(JSON.stringify(copyNodeInstance.value))
          if (isPastState.value)
            setuniqueId(paseNode, true)

          insertXmindNode([root], currnentNode.value.data._id, 'child', paseNode)
          updateXmindCanvas()
          if (!isPastState.value)
            copyNodeInstance.value = null

          break
        }
        case 'noexpand-all':
          expandAllNodes(root, false)
          updateXmindCanvas()
          break
        case 'expand-all':
          expandAllNodes(root, true)
          updateXmindCanvas()
          break
        case 'delete':
          if (type === 'single')
            deleteXmindNode(root.children || [], currnentNode.value.data._id)
          else if (type === 'global')
            batchDeleteXmindNode(root.children || [], ids)

          updateXmindCanvas()
          break
        case 'canvas-center':
          setXMindMapCenter()
          break
      }
    }

    function handlerActionClick(action) {
      console.log(action)
      switch (action) {
        case 'prev-step':
          currentStep.value += 1
          root = JSON.parse(JSON.stringify(historyStep.value[currentStep.value]))
          updateXmindCanvas(undefined, false)
          break
        case 'next-step':
          currentStep.value -= 1
          root = JSON.parse(JSON.stringify(historyStep.value[currentStep.value]))
          updateXmindCanvas(undefined, false)
          break
        case 'insert-brother':
          insertXmindNode(root.children || [], currnentNode.value.data._id, 'brother')
          updateXmindCanvas()
          break
        case 'insert-child':
          insertXmindNode([root], currnentNode.value.data._id, 'child')
          updateXmindCanvas()
          break
        case 'insert-tupian':
          uploadType.value = 'image'
          uploadImageVisible.value = true
          break
        case 'insert-tag':
          editorTypeName.value = 'tag'
          editorVisible.value = true
          break
        case 'dagang':
          structureVisible.value = true
          nextTick(() => {
            dataStructureRef.value.setDataList([root])
          })
          break
        case 'insert-marker':
          tiezhiIconVisible.value = true
          break
        case 'insert-link':
          editorTypeName.value = 'link'
          editorVisible.value = true
          break
        case 'insert-beizhu': {
          const { _id: id, comment } = currnentNode.value.data
          insertNodeComment(id, comment)
          break
        }
        case 'insert-relation': {
          drawRelationIng.value = true
          const id = currnentNode.value.data._id
          const clientRect = select(`#${id}`).datum()
          const { x, y, width, height } = clientRect
          renderVirtualRelationPath({ x: x - 4, y: y - 4, width: width + 8, height: height + 8, id })
          break
        }
        case 'insert-summary': {
          const targetSummarys = currnentNode.value.data.targetSummarys
          const currentId = currnentNode.value.data._id
          if (!targetSummarys?.length) {
            currentInsertSummaryId.value = `${currentId}-${currentId}`
            recursiveTreeValue(root, currentId, 'targetSummarys', [{ id: currentId, text: '概要' }])
            updateXmindCanvas()
          }
          else {
            if (!targetSummarys.find(o => o.id === currentId)) {
              currentInsertSummaryId.value = `${currentId}-${currentId}`
              targetSummarys.push({ id: currentId, text: '概要' })
              recursiveTreeValue(root, currentId, 'targetSummarys', targetSummarys.map(o => ({ id: o.id, text: o.text })))
              updateXmindCanvas()
              return
            }
            summaryHandlerMouseEnter(`${currentId}-${currentId}`)
            summaryHandlerClick(`${currentId}-${currentId}`)
          }
          break
        }
        case 'export-svg':
          getSvgData().then((res) => {
            exportSVG(res)
          })
          break
        case 'export-png':
          getSvgData().then((res) => {
            exportPNG(res)
          })
          break
        case 'export-json':
          exportJSON('xmind', JSON.stringify(root))
          break
        case 'import-json':
          console.log('import-json')
          uploadImageVisible.value = true
          uploadType.value = 'json'
          uploadJson.value = true
          break
        default:
          break
      }
    }

    function nodeContextClick(event, _this) {
      event.stopPropagation()
      event.preventDefault()
      hiddenPopover()
      removeNodeHighLight()
      hideElementControlNode()
      currnentNode.value = select(_this).datum()
      const id = currnentNode.value.data._id
      nodeHighLight(id)
      const [w, h] = [190, 380]
      const [x, y] = [event.pageX, event.pageY]
      let [tx, ty] = [0, 0]
      x + w > canvasWidth && (tx = -w)
      y + h > canvasHeight && (ty = -h)
      position.value = { x, y, tx, ty }
      contextMenuType.value = 'single'
      contextVisible.value = true
      selectNodes.value.push(currnentNode.value)
    }

    function expandNodeClick(_event, _this) {
      const currnentNode = select(_this).datum()
      toogleExpandXmindNode(root, currnentNode.data._id, true)
      updateXmindCanvas()
    }

    function commentIconHandlerClick(_event, _this) {
      currnentNode.value = select(_this).datum()
      const { _id: id, comment } = currnentNode.value.data
      insertNodeComment(id, comment)
    }

    function nodeHandlerMouseEnter(_event, _this) {
      select(_this).select('.expand-circle')
        .transition().duration(300)
        .attr('r', 6)
        .attr('opacity', 1)
      select(_this).select('.expand-path')
        .transition().duration(300)
        .attr('opacity', 1)
      if (dragIngSubject) {
        const data = select(_this).datum()
        if (!data.parent)
          return
        const direction = data.direction
        const boundingClientRect = select(_this).node().getBoundingClientRect()
        const enterNodeInfo = {
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height,
          top: boundingClientRect.top,
          left: boundingClientRect.left,
          hasChild: !!data.children?.length,
          id: data.data._id,
        }
        dragTargetAttrs = {
          direction,
          enterNodeInfo,
          parentNodeInfo: data.parent,
        }
      }
    }

    function nodeHandlerMouseLeave(_event, _this) {
      select(_this).select('.expand-circle')
        .transition().duration(300)
        .attr('r', 4)
        .attr('opacity', 0)
      select(_this).select('.expand-path')
        .transition().duration(300)
        .attr('opacity', 0)
      if (dragIngSubject) {
        dragTargetAttrs = null
        select('.drag-shadow-node').style('display', 'none')
        select('.drag-shadow-edge').style('display', 'none')
      }
    }

    /**
     * 渲染拖动节点后节点即将存在位置的占位符
     * @param {*} _event
     */
    function renderDragShadowNode(_event) {
      const dragShadowNode = select('.drag-shadow-node').style('display', 'block')
      const dragShadowEdge = select('.drag-shadow-edge').style('display', 'block')
      const { parentNodeInfo, enterNodeInfo, direction } = dragTargetAttrs
      const { width, height, top, left, hasChild } = enterNodeInfo
      // 被拖拽的节点在目标节点的前面还是后面
      let [dir, atLast] = [null, false]
      if (direction !== 'bottom')
        dir = top + (height / 2) * eventTransform.k > _event.y ? 'up' : 'down'
      else
        dir = left + (width / 2) * eventTransform.k > _event.x ? 'up' : 'down'

      // 被拖拽的节点是否作为目标节点的子集
      if (direction === 'right')
        atLast = (width * eventTransform.k + left - _event.x < 20) && !hasChild
      else if (direction === 'left')
        atLast = (_event.x - left) < 20 && !hasChild
      else if (direction === 'bottom')
        atLast = (height * eventTransform.k + top - _event.y < 12) && !hasChild

      dragTargetAttrs.dir = dir
      dragTargetAttrs.atLast = atLast
      const { start, end, rect } = getEdgeStartEndCoordinate({ direction, parentNodeInfo, enterNodeInfo, dir, atLast })
      dragShadowNode.select('rect')
        .attr('x', rect.x)
        .attr('y', rect.y)
      dragShadowEdge.select('path')
        .attr('d', () => {
          if (direction !== 'bottom') {
            return edgeStyleMap[currentEdgeStyle.value]({
              sourcePoint: { sx: start.x, sy: start.y },
              targetPoint: { tx: end.x, ty: end.y },
              isRoot: !parentNodeInfo.parent && !atLast,
              gradient: false,
              lineWidth: 1,
            })
          }
          const [sx, sy] = [start.x, start.y]
          const [tx, ty] = [end.x, end.y]
          const unit = tx > sx ? -1 : 1
          if (tx !== sx)
            return `M${sx} ${sy} L${sx} ${sy + 18} L${tx + 5 * unit} ${sy + 18} Q${tx} ${sy + 18} ${tx} ${sy + 23} L${tx} ${ty}`

          return `M${sx} ${sy} L${tx} ${ty}`
        })
    }

    function summaryHandlerMouseEnter(parentId, _event, _this) {
      const combinationId = parentId || select(_this).datum().parentId
      if (select(`#summary-path-${combinationId}`).select('.select-target-summary').empty()) {
        select(`#summary-path-${combinationId}`)
          .select('.high-border')
          .attr('stroke', 'rgb(46,189,255)')
          .attr('stroke-dasharray', function () {
            return `0 ${select(this).node().getTotalLength()}`
          })
          .transition()
          .duration(300)
          .attr('stroke-dasharray', function () {
            return `${select(this).node().getTotalLength()} 0`
          })
        const ids = combinationId.split('-')
        const sourceId = ids[0]
        const { x, y, width, height, upArea, downArea } = select(`#summary-path-${combinationId} > g`).datum()
        select(`#summary-path-${combinationId}`)
          .select('g')
          .append('rect')
          .attr('class', 'select-target-summary')
          .attr('x', x)
          .attr('y', y)
          .attr('width', width)
          .attr('height', height)
          .attr('stroke-width', 2)
          .attr('stroke', 'rgb(46,189,255)')
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', 'none')
          .attr('stroke-dasharray', function () {
            return `0 ${select(this).node().getTotalLength()}`
          })
          .transition()
          .duration(300)
          .attr('stroke-dasharray', function () {
            return `${select(this).node().getTotalLength()} 0`
          })
        select(`#summary-path-${combinationId}`)
          .select('g')
          .selectAll('.control-point')
          .data(['up', 'down'])
          .enter()
          .append('rect')
          .attr('class', d => `control-point ${d}`)
          .attr('x', x + width / 2 - 4)
          .attr('y', (_d, idx) => idx === 0 ? y - 4 : y + height - 4)
          .attr('width', 8)
          .attr('height', 8)
          .attr('stroke-width', 2)
          .attr('stroke', 'rgb(46,189,255)')
          .attr('fill', '#fff')
          .attr('opacity', 0)
          .on('mousedown', function (event) {
            event.stopPropagation()
            summaryControlName.value = select(this).attr('class')
            const sourcedata = select(`#${sourceId}`).datum()
            summaryBrothers = sourcedata.parent.children
            summaryArea = {
              upArea,
              downArea,
            }
          })
      }
    }

    function summaryHandlerMouseLeave(_event, _this) {
      if (!select(_this).classed('active-summary-node')) {
        select(_this)
          .classed('active-summary-node', false)
          .select('.high-border')
          .attr('stroke', 'none')
        select(_this)
          .selectAll('.select-target-summary, .control-point')
          .remove()
      }
    }

    function summaryHandlerClick(parentId, event, _this) {
      event && event.stopPropagation()
      if (readOnly.value)
        return
      removeNodeHighLight()
      hideElementControlNode()
      const id = parentId || select(_this).datum().parentId
      selectAll('.mind-map-summarybox > g > g')
        .filter(n => n.parentId !== id)
        .classed('active-summary-node', false)
        .selectAll('.select-target-summary, .control-point')
        .remove()
      selectAll('.mind-map-summarybox > g > g')
        .filter(n => n.parentId !== id)
        .select('.high-border')
        .attr('stroke', 'none')
      select(`#summary-path-${id}`)
        .select('g')
        .classed('active-summary-node', true)
        .selectAll('.control-point')
        .attr('opacity', 1)
      selectCombinationId.value = id
    }

    function summaryHandlerDblclick(event, _this) {
      event.stopPropagation()
      if (readOnly.value)
        return
      const combinationId = select(_this).datum().parentId
      editorTypeName.value = 'summary'
      editorNodeValue.value = select(`#summary-path-${combinationId} .node-summary-description`).text()
      editorVisible.value = true
    }

    function imageHandlerDblclick(event, _this) {
      event.stopPropagation()
      if (readOnly.value)
        return
      const imageNode = select(_this)
      const x = Number(imageNode.attr('x'))
      const y = Number(imageNode.attr('y'))
      const width = Number(imageNode.attr('width'))
      const height = Number(imageNode.attr('height'))
      const controlNode = select('.element-drag-controller')
        .attr('data-id', select(_this.parentNode.parentNode).attr('id'))
        .raise()
        .style('display', 'block')
      controlNode.select('image').remove()
      controlNode
        .select('path')
        .attr('d', `M${x} ${y} H${x + width} V${y + height} H${x} V${y}`)
      controlNode.select('.top-left-point').attr('x', x - 4).attr('y', y - 4)
      controlNode.select('.top-right-point').attr('x', x + width - 4).attr('y', y - 4)
      controlNode.select('.bottom-right-point').attr('x', x + width - 4).attr('y', y + height - 4)
      controlNode.select('.bottom-left-point').attr('x', x - 4).attr('y', y + height - 4)
      controlNode
        .insert(() => imageNode.clone().node(), 'path')
        .attr('opacity', 0.4)
      controlNode.selectAll('.control-point')
        .on('mousedown', function (event) {
          event.stopPropagation()
          imageContolName.value = select(this).attr('class').split(' ')[0]
          if (['top-left-point', 'bottom-right-point'].includes(imageContolName.value))
            svg.classed('nw-resize', true)
          else
            svg.classed('ne-resize', true)
        })

      removeNodeHighLight()
      removeSummaryNodeHighLight()
      removeRelationNodeHighLight()
    }

    function relationNodeHandlerClick(event, _this) {
      event.stopPropagation()
      if (hasMoveEvent) {
        hasMoveEvent = false
        return hasMoveEvent
      }
      if (select(_this).classed('active-relation'))
        return
      removeNodeHighLight()
      hideElementControlNode()
      select('.mind-map-relationbox')
        .selectAll('.active-relation')
        .classed('active-relation', false)
        .select('.active-rela-relation-path').attr('opacity', 0)
        .each(function () {
          select(this.parentNode)
            .selectAll('line, rect, circle').style('display', 'none')
        })
      select(_this).classed('active-relation', true)
    }

    function relationNodeContextmenu(event, _this) {
      event.stopPropagation()
      event.preventDefault()
      relationNodeSubject.value = select(_this).datum()
      const pathElement = select(_this.parentNode).select('.rela-relation-path').node()
      const pathLength = pathElement.getTotalLength()
      const textPos = pathElement.getPointAtLength(pathLength / 2)
      const { x, y, k } = eventTransform
      customDeleteModalPos.value = {
        x: textPos.x * k + x - 40,
        y: textPos.y * k + y + 20,
        type: 'relation',
      }
    }

    function relationNodeDBlclick(event, _this) {
      event.stopPropagation()
      editorTypeName.value = 'relation'
      relationNodeSubject.value = select(_this).datum()
      editorNodeValue.value = relationNodeSubject.value.relationText
      editorVisible.value = true
    }

    function deleteNodeElement() {
      if (customDeleteModalPos.value.type !== 'relation')
        deleteIconMark()
      else
        deleteNodeRelation()
    }

    /**
     * 插入图片
     */
    function setNodeImage(imageInfo) {
      if (!currnentNode.value)
        return
      recursiveTreeValue(root, currnentNode.value.data._id, 'imageInfo', imageInfo)
      uploadImageVisible.value = false
      updateXmindCanvas()
    }

    /**
     * 导入json文件渲染画布
     */
    function setCanvasJson(data) {
      root = JSON.parse(data)
      updateXmindCanvas()
      nextTick(setXMindMapCenter)
    }

    /**
     * 删除标记
     */
    function deleteIconMark() {
      if (!currentMarkIcon.value)
        return
      const { marks, icon } = currentMarkIcon.value
      const idx = marks.findIndex(m => m.icon === icon)
      marks.splice(idx, 1)
      recursiveTreeValue(root, currentMarkIcon.value._id, 'marks', marks)
      updateXmindCanvas()
      currentMarkIcon.value = null
      customDeleteModalPos.value = null
    }

    /**
     * 删除节点之间的关系连线
     */
    function deleteNodeRelation() {
      if (relationNodeSubject.value) {
        const sourceId = relationNodeSubject.value.source.id
        const relationId = relationNodeSubject.value.relationId
        const sourceData = getTargetDataById(root, sourceId)
        const relations = sourceData.relations || []
        const idx = relations.findIndex(o => o.relationId === relationId)
        relations.splice(idx, 1)
        storageRootRelaTime(root)
        customDeleteModalPos.value = null
        select(`#relation-${relationId}`).remove()
        appendXmindHistory()
      }
    }

    /**
     * 插入备注信息以及备注信息回显
     */
    function insertNodeComment(id, comment) {
      const nodeClientRect = select(`#${id}`).node().getBoundingClientRect()
      valueComment.value = comment
      tipTapPosition.value = {
        top: nodeClientRect.top + nodeClientRect.height + 10,
        left: nodeClientRect.left + nodeClientRect.width / 2,
      }
    }

    /**
     * 插入插画贴纸或者标记贴纸
     */
    async function insertMarkerIcon(iconItem) {
      if (!currnentNode.value)
        return
      if (!iconItem.type) {
        // 先用https远程连接图片渲染
        recursiveTreeValue(root, currnentNode.value.data._id, 'imageInfo', {
          url: iconItem,
          width: 50,
          height: 50,
        })
        const id = currnentNode.value.data._id
        updateXmindCanvas(false)
        const base64 = await imageToBase64(iconItem)
        // 渲染完成后异步获取图片的base64地址进行替换
        recursiveTreeValue(root, id, 'imageInfo', {
          url: base64,
          width: 50,
          height: 50,
        })
        storageRootRelaTime(root)
      }
      else {
        const { data } = select(`#${currnentNode.value.data._id}`).datum()
        const marks = data.marks || []
        const idx = marks.findIndex(m => m.type === iconItem.type)
        if (idx > -1)
          marks.splice(idx, 1, iconItem)
        else
          marks.unshift(iconItem)

        recursiveTreeValue(root, currnentNode.value.data._id, 'marks', marks)
        updateXmindCanvas(false)
      }
    }

    /**
     * 插入备注信息
     */
    function getCommentHtml(html) {
      if (html !== '<p><br></p>')
        recursiveTreeValue(root, currnentNode.value.data._id, 'comment', html)
      else
        recursiveTreeValue(root, currnentNode.value.data._id, 'comment', null)

      tipTapPosition.value = null
      updateXmindCanvas()
    }

    function updateXMindTheme(theme) {
      resetSubjectStyle(true)
      currentTheme.value = theme
      updateXmindCanvas(undefined, false)
      localStorage.setItem('theme', theme)
    }

    function updateXMindStructure(structure, prevStructure) {
      currentStructure.value = structure
      if (structure === 'kht') {
        currentEdgeStyle.value = '5'
        localStorage.setItem('edgeStyleValue', '5')
      }
      if (prevStructure === 'kht') {
        currentEdgeStyle.value = '2'
        localStorage.setItem('edgeStyleValue', '2')
      }
      localStorage.setItem('structure', structure)
      updateXmindCanvas(undefined, false)
    }

    function updateXMindEdgeStyle(edgeStyle) {
      currentEdgeStyle.value = edgeStyle
      localStorage.setItem('edgeStyleValue', edgeStyle)
      updateXmindCanvas(undefined, false)
    }

    function resetSubjectStyle(isGloab) {
      if (isGloab) {
        resetRootNodeStyle(root)
        updateXmindCanvas()
        return
      }
      batchResetNodeStyle(root, selectNodes.value.map(o => o.data._id))
      updateXmindCanvas()
    }

    /**
     * 重置画布缩放系数克隆画布节点得到html字符串
     */
    async function getSvgData() {
      const container = mindContainer
        .attr('transform', 'translate(0, 0) scale(1)')
      const { width, height, y, x } = container
        .node()
        .getBoundingClientRect()
      container.attr('transform', `translate(${Math.abs(x) + 20}, ${Math.abs(y) + 20}) scale(1)`)
      svg
        .attr('width', width + 40)
        .attr('height', height + 40)
      const cloneSvg = svg
        .clone(true)
        .attr('style', 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -1;')
      cloneSvg.select('.map-outter-container')
        .insert('rect', ':first-child')
        .attr('x', x - 20)
        .attr('y', y - 20)
        .attr('width', width + 40)
        .attr('height', height + 40)
        .attr('fill', backgroundColor.value)
      cloneSvg.selectAll('.node-text-description, .node-summary-description')
        .style('white-space', 'pre-wrap')
        .style('line-height', 'inherit')
        .style('padding', 0)
        .style('margin', 0)
        .style('line-break', 'anywhere')
        .style('word-break', 'break-all')
      cloneSvg.selectAll('.node-summary-description')
        .style('font-weight', 'bold')
        .style('font-size', '12px')
      svg
        .attr('width', canvasWidth)
        .attr('height', canvasHeight)
      container
        .attr('transform', eventTransform)
      // 所有http网络图片url转成base64格式再进行导出
      const imageList = cloneSvg.selectAll('image').nodes().filter((node) => {
        return select(node).attr('href').includes('http')
      })
      const data = await Promise.all(imageList.map((node) => {
        return imageToBase64(select(node).attr('href'))
      }))
      imageList.forEach((node, i) => {
        select(node).attr('href', data[i])
      })
      cloneSvg.remove()
      return cloneSvg.node().outerHTML
    }

    /**
     * node节点选中高亮样式设置
     * @param {*} section
     */
    function nodeHighLight(id) {
      select(`#${id}`)
        .classed('select-node', true)
        .insert('rect', ':first-child')
        .attr('class', 'select-rect-border')
        .attr('stroke', theme[currentTheme.value].select.stroke)
        .attr('stroke-width', theme[currentTheme.value].select.strokeWidth)
        .attr('x', d => d.x - d.style.strokeWidth / 2 - 3)
        .attr('y', d => d.y - d.style.strokeWidth / 2 - 3)
        .attr('width', d => d.width + (d.style.strokeWidth / 2 + 3) * 2)
        .attr('height', d => d.height + (d.style.strokeWidth / 2 + 3) * 2)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', 'transparent')
    }

    function markHighLight(_this) {
      select(_this)
        .classed('mark-select', true)
        .select('rect')
        .attr('stroke', theme[currentTheme.value].select.stroke)
    }

    function mouseStartMoveOnScreen(event) {
      if (event.buttons === 1 && !readOnly.value) {
        domainStart = { x: event.x, y: event.y }
        hiddenPopover()
        removeSummaryNodeHighLight()
        removeRelationNodeHighLight()
        hideElementControlNode()
      }
      if (drawRelationIng.value)
        exitDrawRelation()
    }

    function mouseMoveIngOnScreen(event) {
      if (domainStart)
        drawAllSelectDomain(event, domainStart, updateSelectNodeHighLight)

      if (drawRelationIng.value) {
        const { x, y } = event
        const { x: tx, y: ty, k } = eventTransform
        updateRenderVirtualRelationPath({ x1: (x - tx) / k, y1: (y - ty) / k })
      }
      if (controlName.value) {
        hasMoveEvent = true
        if (controlName.value.includes('rect'))
          relationPathControlMove(event)
        else if (controlName.value.includes('circle'))
          relationPathPointMove(event)
      }
      if (summaryControlName.value)
        summaryControlMove(event)

      if (imageContolName.value)
        imageControlPointMove(event)
    }

    /**
     * 概要连线上的控制点拖动修改概要范围
     * @param {*} event
     */
    function summaryControlMove(event) {
      const y = event.movementY / eventTransform.k
      const pageY = event.pageY
      const targetEle = select('.mind-map-summarybox .select-target-summary')
      const height = Number(targetEle.attr('height'))
      const oldY = Number(targetEle.attr('y'))
      const controlEle = select(`.${summaryControlName.value.split(' ')[1]}`)
      const controlEleY = controlEle.node().getBoundingClientRect().y
      const controlY = Number(controlEle.attr('y'))
      // 鼠标y坐标不在区域y坐标区间内不执行拖动
      if ((y < 0 && pageY > controlEleY) || (y > 0 && pageY < controlEleY))
        return

      const idx = pageY > controlEleY ? 1 : 0
      if (summaryControlName.value.includes('down')) {
        if ((height + y + oldY <= summaryArea.downArea[0]) || ((height + y + oldY >= summaryArea.downArea[1]))) {
          targetEle.attr('height', summaryArea.downArea[idx] - oldY)
          controlEle.attr('y', summaryArea.downArea[idx] - 4)
          return
        }
        targetEle.attr('height', height + y)
        controlEle.attr('y', controlY + y)
      }
      else if (summaryControlName.value.includes('up')) {
        if ((oldY + y <= summaryArea.upArea[0]) || (oldY + y >= summaryArea.upArea[1])) {
          targetEle.attr('y', summaryArea.upArea[idx])
          targetEle.attr('height', height - summaryArea.upArea[idx] + oldY)
          controlEle.attr('y', controlY + summaryArea.upArea[idx] - oldY)
          return
        }
        targetEle.attr('y', oldY + y)
        targetEle.attr('height', height - y)
        controlEle.attr('y', controlY + y)
      }
      svg.classed('n-resize', true)
    }

    /**
     * 节点关系连线上的控制点拖动
     * @param {*} event
     */
    function relationPathControlMove(event) {
      const k = eventTransform.k
      const { movementX: x, movementY: y } = event
      const touchName = controlName.value.split('-')[0]
      const keyName = touchName === 'start' ? 'source' : 'target'
      relationNodeSubject.value[keyName].controllerDiff.x += x / k
      relationNodeSubject.value[keyName].controllerDiff.y += y / k
      const { relationId, source, target } = relationNodeSubject.value
      try {
        const { start, end, c1, c2 } = getNodeRelationPathPoints(source, target)
        updateRelationElementPos(relationId, touchName, keyName, c1, c2, start, end)
      }
      catch (error) {
        console.warn('The node of the relational connection could not be found')
      }
    }

    function relationPathPointMove(event) {
      const { x, y } = event
      const { x: tx, y: ty, k } = eventTransform
      const touchName = controlName.value.split('-')[0]
      const keyName = touchName === 'start' ? 'source' : 'target'
      const movePoint = { x: (x - tx) / k, y: (y - ty) / k }
      const { relationId, source, target } = relationNodeSubject.value
      const targetNodeData = select(`#${keyName === 'source' ? source.id : target.id}`).datum()
      const centerPoint = { x: targetNodeData.x + targetNodeData.width / 2, y: targetNodeData.y + targetNodeData.height / 2 }
      const expression = getLinearExpression(movePoint, centerPoint)
      const intersectPoints = getRectLineIntersectionPoint({
        y1: targetNodeData.y - 4,
        x1: targetNodeData.x + targetNodeData.width + 4,
        y2: targetNodeData.y + targetNodeData.height + 4,
        x2: targetNodeData.x - 4,
      }, expression)
      const targetMinPoint = getMinDistancePoint({ x: movePoint.x, y: movePoint.y }, intersectPoints)
      relationNodeSubject.value[keyName].pointDiff.x = targetMinPoint.x - targetNodeData.x
      relationNodeSubject.value[keyName].pointDiff.y = targetMinPoint.y - targetNodeData.y
      try {
        const { start, end, c1, c2 } = getNodeRelationPathPoints(source, target)
        select(`#relation-${relationId}`)
          .select('.controller-model')
          .select(`.${touchName}-circle`)
          .datum(keyName === 'source' ? start : end)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
        updateRelationElementPos(relationId, touchName, keyName, c1, c2, start, end)
      }
      catch (error) {
        console.warn('The node of the relational connection could not be found')
      }
    }

    function imageControlPointMove(event) {
      const controlNode = select('.element-drag-controller')
      const imageNode = controlNode.select('image')
      const x = Number(imageNode.attr('x'))
      const y = Number(imageNode.attr('y'))
      const width = Number(imageNode.attr('width'))
      const height = Number(imageNode.attr('height'))
      const ratio = width / height
      let [startX, startY, currentWidth] = [0, 0, 0]
      const pointClientRect = controlNode.select(`.${imageContolName.value}`).node().getBoundingClientRect()
      if (event.x > pointClientRect.x && event.movementX <= 0)
        return
      if (event.x < pointClientRect.x && event.movementX >= 0)
        return
      if (imageContolName.value.includes('top-left')) {
        // 左上角控制点拖动
        startX = x + event.movementX
        startY = y + event.movementX / ratio
        currentWidth = width - event.movementX
      }
      else if (imageContolName.value.includes('top-right')) {
        // 右上角控制点拖动
        startX = x
        startY = y - event.movementX / ratio
        currentWidth = width + event.movementX
      }
      else if (imageContolName.value.includes('bottom-right')) {
        // 右下角控制点拖动
        startX = x
        startY = y
        currentWidth = width + event.movementX
      }
      else {
        // 左下角控制点拖动
        startX = x + event.movementX
        startY = y
        currentWidth = width - event.movementX
      }
      const currentHeight = currentWidth / ratio
      if (currentWidth <= 20 || currentHeight <= 20 || currentWidth >= 800)
        return

      controlNode
        .select('path')
        .attr('d', `M${startX} ${startY} H${startX + currentWidth} V${startY + currentHeight} H${startX} V${startY}`)
      controlNode
        .select('image')
        .attr('x', startX)
        .attr('y', startY)
        .attr('width', currentWidth)
        .attr('height', currentHeight)
      controlNode.select('.top-left-point').attr('x', startX - 4).attr('y', startY - 4)
      controlNode.select('.top-right-point').attr('x', startX + currentWidth - 4).attr('y', startY - 4)
      controlNode.select('.bottom-right-point').attr('x', startX + currentWidth - 4).attr('y', startY + currentHeight - 4)
      controlNode.select('.bottom-left-point').attr('x', startX - 4).attr('y', startY + currentHeight - 4)
    }

    function updateRelationElementPos(relationId, touchName, keyName, c1, c2, start, end) {
      select(`#relation-${relationId}`)
        .select('.controller-model')
        .select(`.${touchName}-rect`)
        .datum(keyName === 'source' ? c1 : c2)
        .attr('x', d => d.x - 4)
        .attr('y', d => d.y - 4)
      select(`#relation-${relationId}`)
        .select('.rela-relation-path')
        .attr('d', `M${start.x} ${start.y}, C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`)
      select(`#relation-${relationId}`)
        .select('.controller-model')
        .select('.active-rela-relation-path')
        .attr('d', `M${start.x} ${start.y}, C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`)
      select(`#relation-${relationId}`)
        .select('.controller-model')
        .select(`.${touchName}-line`)
        .datum({ move: keyName === 'source' ? start : end, to: keyName === 'source' ? c1 : c2 })
        .attr('x1', d => d.move.x)
        .attr('y1', d => d.move.y)
        .attr('x2', d => d.to.x)
        .attr('y2', d => d.to.y)
      const pathElement = select(`#relation-${relationId}`)
        .select('.rela-relation-path').node()
      const pathLength = pathElement.getTotalLength()
      const textPos = pathElement.getPointAtLength(pathLength / 2)
      select(`#relation-${relationId}`)
        .select('text')
        .attr('x', textPos.x)
        .attr('y', textPos.y)
      svg.classed('grabbing', true)
    }

    function mouseEndMoveOnScreen() {
      domainStart = null
      select('.all-select-domain').remove()
      if (selectNodes.value.length === 1)
        currnentNode.value = selectNodes.value[0]

      if (controlName.value)
        moveControllerEnd()

      if (summaryControlName.value)
        moveSummaryControlEnd()

      if (imageContolName.value) {
        const id = select('.element-drag-controller').attr('data-id')
        const width = Number(select('.element-drag-controller image').attr('width'))
        const height = Number(select('.element-drag-controller image').attr('height'))
        const data = getTargetDataById(root, id)
        data.imageInfo.width = width
        data.imageInfo.height = height
        imageContolName.value = null
        svg.classed('nw-resize', false)
        svg.classed('ne-resize', false)
        updateXmindCanvas()
      }
    }

    /**
     * 概要控制点移动后抬起的一瞬间获取被概要区域包围的所有兄弟节点
     */
    function moveSummaryControlEnd() {
      const summaryLineArea = select('.select-target-summary')
      const sourceRect = {
        x: -99999,
        y: Number(summaryLineArea.attr('y')),
        width: 99999 * 2,
        height: Number(summaryLineArea.attr('height')),
      }
      const cacheIds = []
      for (let i = 0; i < summaryBrothers.length; i++) {
        if (isRectangleInside(sourceRect, summaryBrothers[i]))
          cacheIds.push(summaryBrothers[i].data._id)
      }
      const combinationIds = selectCombinationId.value.split('-')
      if (combinationIds[0] === cacheIds[0]) {
        const target = getTargetDataById(root, combinationIds[0])
        const targetSummarys = target.targetSummarys
        if (cacheIds[cacheIds.length - 1] !== combinationIds[1]) {
          const summary = targetSummarys.find(o => o.id === combinationIds[1])
          const hasExist = targetSummarys.findIndex(o => o.id === cacheIds[cacheIds.length - 1])
          if (hasExist > -1)
            targetSummarys.splice(hasExist, 1)

          summary.id = cacheIds[cacheIds.length - 1]
        }
      }
      else {
        const target = getTargetDataById(root, combinationIds[0])
        const idx = target.targetSummarys.findIndex(o => o.id === combinationIds[1])
        const text = target.targetSummarys[idx].text
        if (idx > -1)
          target.targetSummarys.splice(idx, 1)

        const newSource = getTargetDataById(root, cacheIds[0])
        const summary = (newSource.targetSummarys || []).find(o => o.id === cacheIds[cacheIds.length - 1])
        if (!summary) {
          newSource.targetSummarys = [...(newSource.targetSummarys || []), {
            id: cacheIds[cacheIds.length - 1],
            text,
          }]
        }
      }
      removeSummaryNodeHighLight()
      svg.classed('n-resize', false)
      summaryControlName.value = false
      updateXmindCanvas()
    }

    function drawRelationPathEnd(event) {
      const target = select(event.target).datum()
      const relationId = randomId()
      const source = select('.virtual-relation-path').datum()
      const { id, minPoint, x, y } = source
      const targetCenter = {
        x: target.x + target.width / 2,
        y: target.y + target.height / 2,
      }
      const expression = getLinearExpression(minPoint, targetCenter)
      const intersectPoints = getRectLineIntersectionPoint({
        y1: target.y - 4,
        x1: target.x + target.width + 4,
        y2: target.y + target.height + 4,
        x2: target.x - 4,
      }, expression)
      const targetMinPoint = getMinDistancePoint({ x: minPoint.x, y: minPoint.y }, intersectPoints)
      const unit = x < targetMinPoint.x ? 1 : -1
      const relationText = '关系'
      const sourceInfo = {
        id,
        pointDiff: { x: minPoint.x - x, y: minPoint.y - y },
        controllerDiff: { x: unit * 100, y: 0 },
      }
      const targetInfo = {
        id: target.data._id,
        pointDiff: { x: targetMinPoint.x - target.x, y: targetMinPoint.y - target.y },
        controllerDiff: { x: -unit * 100, y: 0 },
      }
      drawRealRealtionPath(relationId, relationText, sourceInfo, targetInfo)
      const sourceNodeData = getTargetDataById(root, id)
      sourceNodeData.relations = [...(sourceNodeData.relations || []), {
        relationId, sourceInfo, targetInfo, relationText,
      }]
      storageRootRelaTime(root)
      appendXmindHistory()
      exitDrawRelation()
    }

    function moveControllerEnd() {
      try {
        const { relationId, source, target } = relationNodeSubject.value
        const sourceId = source.id
        const sourceNodeData = getTargetDataById(root, sourceId)
        const relations = sourceNodeData.relations
        const idx = relations.findIndex(o => o.relationId === relationId)
        const targetRelationItem = relations[idx]
        if (controlName.value.includes('start')) {
          relations.splice(idx, 1, {
            ...targetRelationItem,
            sourceInfo: source,
          })
        }
        else {
          relations.splice(idx, 1, {
            ...targetRelationItem,
            targetInfo: target,
          })
        }
        storageRootRelaTime(root)
        appendXmindHistory()
      }
      catch (error) {
        console.warn('drag node error')
      }
      controlName.value = null
      relationNodeSubject.value = null
      svg.classed('grabbing', false)
    }

    function exitDrawRelation() {
      drawRelationIng.value = false
      select('.mind-map-relationbox')
        .select('.virtual-relation-path')
        .remove()
    }

    function appendXmindHistory() {
      currentStep.value = 0
      historyStep.value.unshift(JSON.parse(JSON.stringify(root)))
    }

    function hiddenPopover() {
      editorVisible.value = false
      contextVisible.value = false
      tiezhiIconVisible.value = false
      uploadImageVisible.value = false
      uploadJson.value = false
      customDeleteModalPos.value = null
      tipTapPosition.value = null
      editorPosition.value = null
      removeMarkHighlight()
    }

    function removeNodeHighLight() {
      selectAll('.select-node')
        .classed('select-node', false)
        .select('.select-rect-border')
        .remove()
      currnentNode.value = null
      selectNodes.value = []
      editorVisible.value = false
    }

    function removeSummaryNodeHighLight() {
      selectAll('.mind-map-summarybox > g > g')
        .classed('active-summary-node', false)
        .selectAll('.select-target-summary, .control-point')
        .remove()
      selectAll('.mind-map-summarybox > g > g')
        .select('.high-border')
        .attr('stroke', 'none')
      selectCombinationId.value = null
      currentInsertSummaryId.value = null
    }

    function removeRelationNodeHighLight() {
      select('.mind-map-relationbox')
        .selectAll('.active-relation')
        .classed('active-relation', false)
        .select('.active-rela-relation-path').attr('opacity', 0)
        .each(function () {
          select(this.parentNode)
            .selectAll('line, rect, circle').style('display', 'none')
        })
    }

    function removeMarkHighlight() {
      selectAll('.mark-select')
        .classed('mark-select', false)
        .select('rect')
        .attr('stroke', 'transparnet')
    }

    function hideElementControlNode() {
      select('.element-drag-controller').style('display', 'none')
    }

    function outXmindClick() {
      hiddenPopover()
      removeNodeHighLight()
      removeSummaryNodeHighLight()
      removeRelationNodeHighLight()
      hideElementControlNode()
    }

    function shortcutMitters() {
      mitter.on('select-all', () => {
        hiddenPopover()
        removeNodeHighLight()
        hideElementControlNode()
        const selections = select('.mind-map-nodebox')
          .selectAll('.x-mind-nodetheme')
        selections.nodes().forEach((selection) => {
          selectNodes.value.push(select(selection).datum())
          const id = select(selection).datum().data._id
          nodeHighLight(id)
        })
        if (selectNodes.value.length > 1)
          currnentNode.value = null
        else
          currnentNode.value = selectNodes.value[0] || null
      })
      mitter.on('insert-brother', () => {
        const ids = selectNodes.value.map(n => n.data._id)
        if (ids.length) {
          batchInsertXmindNode([root], ids, 'brother')
          updateXmindCanvas()
        }
      })
      mitter.on('insert-child', () => {
        const ids = selectNodes.value.map(n => n.data._id)
        if (ids.length) {
          batchInsertXmindNode([root], ids, 'child')
          updateXmindCanvas()
        }
      })
      mitter.on('move-up', () => {
        if (currnentNode.value) {
          moveXmindNode(root.children || [], currnentNode.value.data._id, 'up')
          updateXmindCanvas(false)
        }
      })
      mitter.on('move-down', () => {
        if (currnentNode.value) {
          moveXmindNode(root.children || [], currnentNode.value.data._id, 'down')
          updateXmindCanvas(false)
        }
      })
      mitter.on('copy', () => {
        if (currnentNode.value) {
          isPastState.value = true
          copyNodeInstance.value = copyOrCutXmindNode(root.children, root, currnentNode.value.data._id)
          hiddenPopover()
        }
      })
      mitter.on('cut', () => {
        if (currnentNode.value && currnentNode.value.parent) {
          isPastState.value = false
          copyNodeInstance.value = copyOrCutXmindNode(root.children, root, currnentNode.value.data._id, true)
          updateXmindCanvas()
        }
      })
      mitter.on('past', () => {
        if (currnentNode.value && copyNodeInstance.value) {
          const paseNode = JSON.parse(JSON.stringify(copyNodeInstance.value))
          if (isPastState.value)
            setuniqueId(paseNode, true)

          insertXmindNode([root], currnentNode.value.data._id, 'child', paseNode)
          updateXmindCanvas()
          if (!isPastState.value)
            copyNodeInstance.value = null
        }
      })
      mitter.on('delete', () => {
        // 删除节点
        const ids = selectNodes.value.map(n => n.data._id)
        if (ids.length) {
          batchDeleteXmindNode(root.children || [], ids)
          updateXmindCanvas()
          return
        }
        // 删除概要
        if (selectCombinationId.value) {
          const nodeIds = selectCombinationId.value.split('-')
          const target = getTargetDataById(root, nodeIds[0])
          const targetSummarys = target.targetSummarys
          const idx = targetSummarys.findIndex(o => o.id === nodeIds[1])
          if (idx > -1) {
            targetSummarys.splice(idx, 1)
            updateXmindCanvas()
          }
        }
        // 删除图片
        if (select('.element-drag-controller').style('display') === 'block') {
          const id = select('.element-drag-controller').attr('data-id')
          recursiveTreeValue(root, id, 'imageInfo', null)
          updateXmindCanvas()
        }
      })
      mitter.on('step-prev', () => {
        if (historyStep.value.length > 1 && currentStep.value < historyStep.value.length - 1) {
          currentStep.value += 1
          root = JSON.parse(JSON.stringify(historyStep.value[currentStep.value]))
          updateXmindCanvas(undefined, false)
        }
      })
      mitter.on('step-next', () => {
        if (currentStep.value >= 1) {
          currentStep.value -= 1
          root = JSON.parse(JSON.stringify(historyStep.value[currentStep.value]))
          updateXmindCanvas(undefined, false)
        }
      })
    }

    watch(() => readOnly.value, (newVal) => {
      if (newVal) {
        hiddenPopover()
        removeNodeHighLight()
        removeSummaryNodeHighLight()
        removeRelationNodeHighLight()
        hideElementControlNode()
      }
    })

    return {
      root,
      openThumb,
      readOnly,
      immersion,
      editorTypeName,
      currentTheme,
      currentStructure,
      currentEdgeStyle,
      copyStyle,
      scaleNumber,
      historyStep,
      currentStep,
      textLen,
      nodeCount,
      backgroundColor,
      position,
      currnentNode,
      contextMenuType,
      selectNodes,
      uploadType,
      editorVisible,
      contextVisible,
      copyNodeInstance,
      scaleNumberVisible,
      tiezhiIconVisible,
      structureVisible,
      uploadImageVisible,
      uploadJson,
      customDeleteModalPos,
      tipTapPosition,
      valueComment,
      themeValue: theme[currentTheme.value],
      nodes,
      edges,
      thumbXminRef,
      dataStructureRef,
      boundingClient,
      editorNodeValue,
      drawRelationIng,
      editorPosition,
      updateXmindCanvas,
      setEditableValue,
      moveXmindMap,
      setXMindMapScale,
      hiddenPopover,
      contextMenuClick,
      handlerActionClick,
      insertMarkerIcon,
      deleteNodeElement,
      updateXMindTheme,
      updateXMindStructure,
      updateXMindEdgeStyle,
      resetSubjectStyle,
      removeNodeHighLight,
      setNodeImage,
      setCanvasJson,
      getCommentHtml,
      setXMindMapCenter,
      outXmindClick,
      removeSummaryNodeHighLight,
      removeRelationNodeHighLight,
    }
  },
})
</script>

<template>
  <div class="xmind-map-container">
    <div
      id="zx-xmind-map"
      :class="{ 'xmind-readonly': readOnly, 'xmind-relationing': drawRelationIng }"
      :style="{ 'background-color': backgroundColor }"
      @click="outXmindClick"
    />

    <transition :name="!editorPosition ? 'editor-fade-in' : null">
      <Editor
        v-if="editorVisible"
        :value="['summary', 'relation'].includes(editorTypeName)
          ? editorNodeValue
          : currnentNode.data[editorTypeName]"
        :editor-type-name="editorTypeName"
        :position="editorPosition"
        @mousedown.stop
        @set-editable-value="setEditableValue"
      />
    </transition>

    <ContextMenu
      v-if="contextVisible"
      :node="currnentNode"
      :copy-node="copyNodeInstance"
      :copy-style="copyStyle"
      :batch-nodes="selectNodes"
      :type="contextMenuType"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(${position.tx}px, ${position.ty}px)`,
      }"
      @mousedown.stop
      @context-click="contextMenuClick"
    />

    <transition name="scale-fade-in">
      <div
        v-show="scaleNumberVisible"
        class="scale-number-model"
      >
        {{ scaleNumber }}%
      </div>
    </transition>

    <TopActionBar
      v-show="!immersion"
      :history-step="historyStep"
      :current-step="currentStep"
      :batch-nodes="selectNodes"
      :structure="currentStructure"
      :is-root="!currnentNode?.parent"
      :node-id="currnentNode?.data._id"
      @mousedown.stop
      @h-click="handlerActionClick"
    />

    <transition name="tiezhi-fade-in">
      <IconSelectModal
        v-if="tiezhiIconVisible"
        @mousedown.stop
        @select-tiezhi-icon="insertMarkerIcon"
        @close="tiezhiIconVisible = false"
      />
    </transition>

    <transition name="structure-fade-in">
      <DataStructure
        v-if="structureVisible"
        ref="dataStructureRef"
        @close="structureVisible = false"
      />
    </transition>

    <div
      v-if="customDeleteModalPos"
      :style="{ left: `${customDeleteModalPos.x}px`, top: `${customDeleteModalPos.y}px` }"
      class="delete-mark-icon"
      @mousedown.stop
    >
      <i class="ri-delete-bin-6-line" @click.stop="deleteNodeElement" />
    </div>

    <transition v-if="uploadJson" name="tiezhi-fade-in">
      <UploadImage
        :upload-type="uploadType"
        @mousedown.stop
        @set-image="setNodeImage"
        @set-json="setCanvasJson"
        @close="uploadJson = false"
      />
    </transition>

    <TiptapEditor
      v-if="Boolean(tipTapPosition)"
      :top="tipTapPosition.top"
      :left="tipTapPosition.left"
      :value="valueComment"
      @mousedown.stop
      @get-comment-html="getCommentHtml"
    />

    <ThumbXMind
      ref="thumbXminRef"
      :class="{ 'thumb-hidden': !openThumb }"
      :scale-number="scaleNumber / 100"
      :bounding-client="boundingClient"
      @move-map="moveXmindMap"
    />

    <CommandBar
      v-show="!immersion"
      :scale-number="scaleNumber"
      @set-scale="setXMindMapScale"
      @reset-xmind-style="resetSubjectStyle(true)"
      @set-map-center="setXMindMapCenter"
    />

    <div class="x-mind-statistic">
      <p>字数 {{ textLen }}</p>
      <p>主题 {{ nodeCount }}</p>
    </div>
  </div>
  <SidebarTriggerContainer
    v-show="!immersion"
    :theme="currentTheme"
    :structure="currentStructure"
    :current-subject="selectNodes[selectNodes.length - 1]"
    :edge-style="currentEdgeStyle"
    @update-theme="updateXMindTheme"
    @update-structure="updateXMindStructure"
    @update-edge-style="updateXMindEdgeStyle"
  />
</template>

<style lang="less">
.ant-checkbox-wrapper {
  .ant-checkbox + span {
    position: relative;
    top: -1px;
    padding-left: 4px;
  }
  .ant-checkbox-inner {
    width: 14px !important;
    height: 14px !important;
    border-radius: 0;
    position: relative;
    top: 0;
    &::after {
      top: 5px;
      left: 20.5%;
    }
  }
}
</style>

<style scoped lang="less">
#zx-xmind-map {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  user-select: none;
  :deep(#zx-xmind-map-svg) {
    cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.pngg'), auto;
    &.grabbing {
      cursor: grabbing;
    }
    &.moving {
      cursor: move;
      .mind-map-summarybox, .mind-map-relationbox {
        pointer-events: none;
      }
    }
    &.n-resize, .control-point {
      cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsdGVyPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTEzIDVoLTJ2M2gtMVY1SDhsMi41LTNMMTMgNVptMCA2djFIOHYtMWg1Wm0tMiA4aDJsLTIuNSAzTDggMTloMnYtNGgxdjRaIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTEzIDVoLTJ2M2gtMVY1SDhsMi41LTNMMTMgNVpNOSA2SDhhMSAxIDAgMCAxLS43NjgtMS42NGwyLjUtM2ExIDEgMCAwIDEgMS41MzYgMGwyLjUgM0ExIDEgMCAwIDEgMTMgNmgtMXYyYTEgMSAwIDAgMS0xIDFoLTFhMSAxIDAgMCAxLTEtMVY2Wm01IDZhMSAxIDAgMCAxLTEgMUg4YTEgMSAwIDAgMS0xLTF2LTFhMSAxIDAgMCAxIDEtMWg1YTEgMSAwIDAgMSAxIDF2MVptLS4wOTQgNi41NzZhMSAxIDAgMCAxLS4xMzggMS4wNjRsLTIuNSAzYTEgMSAwIDAgMS0xLjUzNiAwbC0yLjUtM0ExIDEgMCAwIDEgOCAxOGgxdi0zYTEgMSAwIDAgMSAxLTFoMWExIDEgMCAwIDEgMSAxdjNoMWExIDEgMCAwIDEgLjkwNi41NzZaTTEwIDE5di00aDF2NGgybC0yLjUgM0w4IDE5aDJabTMtN3YtMUg4djFoNVoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjkiLz48L2c+PGRlZnM+PGZpbHRlciBpZD0iYSIgeD0iNiIgeT0iMCIgd2lkdGg9IjExIiBoZWlnaHQ9IjI2IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+PGZlT2Zmc2V0IGR4PSIxIiBkeT0iMSIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEiLz48ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPjxmZUJsZW5kIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDZfNDY4MSIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDZfNDY4MSIgcmVzdWx0PSJzaGFwZSIvPjwvZmlsdGVyPjwvZGVmcz48L3N2Zz4=') 11 11, auto;
    }
    &.nw-resize, .top-left-point, .bottom-right-point {
      cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsdGVyPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTcuMzE3IDQuMjgzIDUuOTAzIDUuNjk3bDIuMTIxIDIuMTIxLS43MDcuNzA3LTIuMTIxLTIuMTIxTDMuNzggNy44MTggMy40MjggMy45M2wzLjg4OS4zNTRabTQuMjQzIDQuMjQyLjcwNy43MDctMy41MzYgMy41MzYtLjcwNy0uNzA3IDMuNTM2LTMuNTM2Wm00LjI0MiA3LjA3MSAxLjQxNS0xLjQxNC4zNTMgMy44OS0zLjg4OS0uMzU0IDEuNDE0LTEuNDE1LTIuODI4LTIuODI4LjcwNy0uNzA3IDIuODI4IDIuODI4WiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik03LjMxNyA0LjI4MyA1LjkwMyA1LjY5N2wyLjEyMSAyLjEyMS0uNzA3LjcwNy0yLjEyMS0yLjEyMS0xLjQxNCAxLjQxNC0uMzU0LTMuODg5IDMuODkuMzU0Wk01LjE5NiA3LjgxOGwtLjcwNy43MDdhMSAxIDAgMCAxLTEuNzAzLS42MTZsLS4zNTQtMy44OUExIDEgMCAwIDEgMy41MiAyLjkzNGwzLjg4OS4zNTRhMSAxIDAgMCAxIC42MTYgMS43MDNsLS43MDcuNzA3TDguNzMxIDcuMTFhMSAxIDAgMCAxIDAgMS40MTRsLS43MDcuNzA3YTEgMSAwIDAgMS0xLjQxNCAwTDUuMTk2IDcuODE4Wm03Ljc3OC43MDdhMSAxIDAgMCAxIDAgMS40MTRsLTMuNTM2IDMuNTM2YTEgMSAwIDAgMS0xLjQxNCAwbC0uNzA3LS43MDdhMSAxIDAgMCAxIDAtMS40MTRsMy41MzYtMy41MzZhMSAxIDAgMCAxIDEuNDE0IDBsLjcwNy43MDdabTQuNTgzIDQuNzE3YTEgMSAwIDAgMSAuNjU2Ljg1bC4zNTMgMy44ODlhMSAxIDAgMCAxLTEuMDg2IDEuMDg2bC0zLjg5LS4zNTRhMSAxIDAgMCAxLS42MTYtMS43MDNsLjcwNy0uNzA3LTIuMTIxLTIuMTIxYTEgMSAwIDAgMSAwLTEuNDE0bC43MDctLjcwN2ExIDEgMCAwIDEgMS40MTQgMGwyLjEyMiAyLjEyMS43MDctLjcwN2ExIDEgMCAwIDEgMS4wNDctLjIzM1ptLTIuNDYyIDMuMDYxLTIuODI4LTIuODI4LjcwNy0uNzA3IDIuODI5IDIuODI4IDEuNDE0LTEuNDE0LjM1MyAzLjg5LTMuODg5LS4zNTQgMS40MTQtMS40MTVabS0yLjgyOC03LjA3LS43MDctLjcwOC0zLjUzNiAzLjUzNi43MDcuNzA3IDMuNTM2LTMuNTM2WiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuOSIvPjwvZz48ZGVmcz48ZmlsdGVyIGlkPSJhIiB4PSIxLjQyOCIgeT0iMS45MjkiIHdpZHRoPSIyMC4xNDMiIGhlaWdodD0iMjAuMTQyIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+PGZlT2Zmc2V0IGR4PSIxIiBkeT0iMSIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEiLz48ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPjxmZUJsZW5kIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDZfNDY4MiIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDZfNDY4MiIgcmVzdWx0PSJzaGFwZSIvPjwvZmlsdGVyPjwvZGVmcz48L3N2Zz4=') 11 11, auto;
    }
    &.ne-resize, .top-right-point, .bottom-left-point {
      cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsdGVyPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTcuMzE3IDE3LjcxNy0xLjQxNC0xLjQxNCAyLjEyMS0yLjEyMS0uNzA3LS43MDctMi4xMjEgMi4xMjEtMS40MTUtMS40MTQtLjM1MyAzLjg4OSAzLjg4OS0uMzU0Wm00LjI0My00LjI0Mi43MDctLjcwN0w4LjczIDkuMjMybC0uNzA3LjcwNyAzLjUzNiAzLjUzNlptNC4yNDItNy4wNzEgMS40MTUgMS40MTQuMzUzLTMuODktMy44ODkuMzU0IDEuNDE0IDEuNDE1LTIuODI4IDIuODI4LjcwNy43MDcgMi44MjgtMi44MjhaIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0ibTcuMzE3IDE3LjcxNy0xLjQxNC0xLjQxNCAyLjEyMS0yLjEyMS0uNzA3LS43MDctMi4xMjEgMi4xMjEtMS40MTQtMS40MTQtLjM1NCAzLjg4OSAzLjg5LS4zNTRabS0yLjEyMS0zLjUzNS0uNzA3LS43MDdhMSAxIDAgMCAwLTEuNzAzLjYxNmwtLjM1NCAzLjg5YTEgMSAwIDAgMCAxLjA4NyAxLjA4NmwzLjg4OS0uMzU0YTEgMSAwIDAgMCAuNjE2LTEuNzAzbC0uNzA3LS43MDcgMS40MTQtMS40MTRhMSAxIDAgMCAwIDAtMS40MTRsLS43MDctLjcwN2ExIDEgMCAwIDAtMS40MTQgMGwtMS40MTQgMS40MTRabTcuNzc4LS43MDdhMSAxIDAgMCAwIDAtMS40MTRMOS40MzggOC41MjVhMSAxIDAgMCAwLTEuNDE0IDBsLS43MDcuNzA3YTEgMSAwIDAgMCAwIDEuNDE0bDMuNTM2IDMuNTM2YTEgMSAwIDAgMCAxLjQxNCAwbC43MDctLjcwN1ptNC41ODMtNC43MTdhMSAxIDAgMCAwIC42NTYtLjg1bC4zNTMtMy44ODlhMSAxIDAgMCAwLTEuMDg2LTEuMDg2bC0zLjg5LjM1NGExIDEgMCAwIDAtLjYxNiAxLjcwM2wuNzA3LjcwNy0yLjEyMSAyLjEyYTEgMSAwIDAgMCAwIDEuNDE1bC43MDcuNzA3YTEgMSAwIDAgMCAxLjQxNCAwbDIuMTIyLTIuMTIxLjcwNy43MDdhMSAxIDAgMCAwIDEuMDQ3LjIzM1ptLTIuNDYyLTMuMDYxLTIuODI4IDIuODI4LjcwNy43MDcgMi44MjktMi44MjggMS40MTQgMS40MTQuMzUzLTMuODktMy44ODkuMzU0IDEuNDE0IDEuNDE1Wm0tMi44MjggNy4wNy0uNzA3LjcwOC0zLjUzNi0zLjUzNi43MDctLjcwNyAzLjUzNiAzLjUzNloiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjkiLz48L2c+PGRlZnM+PGZpbHRlciBpZD0iYSIgeD0iMS40MjgiIHk9IjEuOTI5IiB3aWR0aD0iMjAuMTQzIiBoZWlnaHQ9IjIwLjE0MiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPjxmZU9mZnNldCBkeD0iMSIgZHk9IjEiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxIi8+PGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0Ii8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz48ZmVCbGVuZCBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3dfMjA2XzQ2ODAiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMjA2XzQ2ODAiIHJlc3VsdD0ic2hhcGUiLz48L2ZpbHRlcj48L2RlZnM+PC9zdmc+') 11 11, auto;
    }
  }
}

.scale-number-model {
  position: fixed;
  width: 130px;
  color: #fff;
  text-align: center;
  line-height: 60px;
  background: rgba(0, 0, 0, 0.7);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  font-size: 28px;
  border-radius: 6px;
  pointer-events: none;
}

.x-mind-statistic {
  position: fixed;
  bottom: 10px;
  left: 10px;
  box-shadow: 0px 0px 18px 5px rgba(0,0,0,0.1);
  background: #fff;
  white-space: nowrap;
  display: flex;
  padding: 6px 8px;
  border-radius: 4px;
  z-index: 1200;
  user-select: none;
  p {
    font-size: 12px;
    margin: 0 6px;
    color: #4c4c4c;
  }
}

.delete-mark-icon {
  width: 80px;
  height: 42px;
  background: rgba(255,255,255,.9);
  box-shadow: 0 2px 16px 0 rgba(0,0,0,.3);
  position: fixed;
  z-index: 1000;
  top: 200px;
  left: 200px;
  border-radius: 4px;
  text-align: center;
  line-height: 42px;
  i {
    cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
    counter-reset: #4c4c4c;
  }
  &:after {
    content: '';
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid rgba(255,255,255,0.9);
    border-left: 8px solid transparent;
    left: 50%;
    transform: translateX(-50%);
    top: -16px;
    position: absolute;
  }
}

.x-mind-operate-menu {
  position: fixed;
}
.editor-fade-in-enter-active, .editor-fade-in-leave-active {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  transition: .3s ease;
}
.editor-fade-in-enter-from,
.editor-fade-in-leave-to {
  transform: translateX(-50%) translateY(-30px);
  opacity: 0;
}

.scale-fade-in-enter-active, .scale-fade-in-leave-active {
  transition: 0.5s linear;
  opacity: 1;
}
.scale-fade-in-enter-from,
.scale-fade-in-leave-to {
  opacity: 0;
}

.tiezhi-fade-in-enter-active, .tiezhi-fade-in-leave-active {
  transition: 0.2s linear;
  opacity: 1;
  transform: translateY(0);
}
.tiezhi-fade-in-enter-from,
.tiezhi-fade-in-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.structure-fade-in-enter-active, .structure-fade-in-leave-active {
  transition: 0.2s ease-in-out;
  opacity: 1;
  transform: translateX(0);
}
.structure-fade-in-enter-from,
.structure-fade-in-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

<style lang="less">
.xmind-readonly {
  .mind-map-edgebox, .mind-map-nodebox {
    pointer-events: none;
  }
}

.xmind-relationing {
  .x-mind-node-text,
  .child-ref-expand,
  .select-node {
    pointer-events: none;
  }
}

.draging-elemet-graph {
  &-5 {
    pointer-events: none;
    opacity: .5;
  }
  &-2 {
    transition: .3s;
    pointer-events: none;
    opacity: .2;
    .child-ref-expand {
      display: none;
    }
  }
}

.xmind-node-mark, .xmind-node-link, .xmind-node-comment {
  g, svg {
    cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
  }
}

.ant-checkbox-wrapper, .ant-switch, .ant-dropdown-menu-item, .child-ref-expand, .xmind-node-childcount {
  cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
  a {
    cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
  }
  .ant-checkbox-inner {
    border-color: #817d7d;
  }
}

.rela-relation-path {
  animation: relation-path-move 10s infinite linear;
}

.nodedragenter-shadow, .drag-shadow-node {
  pointer-events: none;
}

.node-summary-description, .node-text-description {
  word-break: break-all;
  white-space: pre-wrap;
  line-height: inherit;
  padding: 0;
  margin: 0;
  line-break: anywhere;
  &.node-summary-description {
    font-size: 12px;
    font-weight: bold;
  }
}

@keyframes relation-path-move {
  from {
    stroke-dashoffset: 200;
  }
  to {
    stroke-dashoffset: -200;
  }
}
</style>
