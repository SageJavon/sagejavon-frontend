<template>
  <div class="editContainer">
    <div class="mindMapContainer" ref="mindMapContainer"></div>
    <Count :mindMap="mindMap" v-if="!isZenMode"></Count>
    <!-- <Navigator :mindMap="mindMap"></Navigator> -->
    <!-- <NavigatorToolbar :mindMap="mindMap" v-if="!isZenMode"></NavigatorToolbar> -->
    <!-- <OutlineSidebar :mindMap="mindMap"></OutlineSidebar> -->
    <Style v-if="!isZenMode"></Style>
    <BaseStyle :data="mindMapData" :mindMap="mindMap"></BaseStyle>
    <Theme v-if="mindMap" :mindMap="mindMap"></Theme>
    <!-- <Structure :mindMap="mindMap"></Structure> -->
    <!-- <ShortcutKey></ShortcutKey> -->
    <!-- <Contextmenu v-if="mindMap" :mindMap="mindMap"></Contextmenu> -->
    <!-- <RichTextToolbar v-if="mindMap" :mindMap="mindMap"></RichTextToolbar> -->
    <!-- <NodeNoteContentShow v-if="mindMap" :mindMap="mindMap"></NodeNoteContentShow> -->
    <!-- <NodeImgPreview v-if="mindMap" :mindMap="mindMap"></NodeImgPreview> -->
    <!-- <SidebarTrigger v-if="!isZenMode"></SidebarTrigger> -->
    <!-- <Search v-if="mindMap" :mindMap="mindMap"></Search> -->
    <!-- <NodeIconSidebar v-if="mindMap" :mindMap="mindMap"></NodeIconSidebar> -->
    <!-- <NodeIconToolbar v-if="mindMap" :mindMap="mindMap"></NodeIconToolbar> -->
    <!-- <OutlineEdit v-if="mindMap" :mindMap="mindMap"></OutlineEdit> -->
    <!-- <Scrollbar v-if="isShowScrollbar && mindMap" :mindMap="mindMap"></Scrollbar> -->
    <!-- <FormulaSidebar v-if="mindMap" :mindMap="mindMap"></FormulaSidebar> -->
  </div>
</template>

<script>
import { toRaw } from 'vue'
import MindMap from 'simple-mind-map'
import MiniMap from 'simple-mind-map/src/plugins/MiniMap.js'
import Watermark from 'simple-mind-map/src/plugins/Watermark.js'
import KeyboardNavigation from 'simple-mind-map/src/plugins/KeyboardNavigation.js'
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js'
import Export from 'simple-mind-map/src/plugins/Export.js'
import Drag from 'simple-mind-map/src/plugins/Drag.js'
import Select from 'simple-mind-map/src/plugins/Select.js'
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import AssociativeLine from 'simple-mind-map/src/plugins/AssociativeLine.js'
import TouchEvent from 'simple-mind-map/src/plugins/TouchEvent.js'
import NodeImgAdjust from 'simple-mind-map/src/plugins/NodeImgAdjust.js'
import SearchPlugin from 'simple-mind-map/src/plugins/Search.js'
import Painter from 'simple-mind-map/src/plugins/Painter.js'
import ScrollbarPlugin from 'simple-mind-map/src/plugins/Scrollbar.js'
import Formula from 'simple-mind-map/src/plugins/Formula.js'
import Cooperate from 'simple-mind-map/src/plugins/Cooperate.js'
import OutlineSidebar from './OutlineSidebar'
import Style from './Style'
import BaseStyle from './BaseStyle'
import Theme from './Theme'
import Structure from './Structure'
import Count from './Count'
import NavigatorToolbar from './NavigatorToolbar'
import ShortcutKey from './ShortcutKey'
import Contextmenu from './Contextmenu'
import RichTextToolbar from './RichTextToolbar'
import NodeNoteContentShow from './NodeNoteContentShow.vue'
import Navigator from './Navigator.vue'
import NodeImgPreview from './NodeImgPreview.vue'
import SidebarTrigger from './SidebarTrigger.vue'
import { getData, storeData, storeConfig } from '@/api'
import bus from '@/utils/bus.js'
import { mapState } from 'vuex'
import icon from '@/config/icon'
import customThemeList from '@/customThemes'
import CustomNodeContent from './CustomNodeContent.vue'
// import Color from './Color.vue'
// import Vue from 'vue'
// import Vue from '/node_modules/vue/dist/vue.js';

// import router from '../../../router'
import store from '../../../store'
import i18n from '../../../i18n'
import Search from './Search.vue'
import NodeIconSidebar from './NodeIconSidebar.vue'
import NodeIconToolbar from './NodeIconToolbar.vue'
import OutlineEdit from './OutlineEdit.vue'
import { showLoading, hideLoading } from '@/utils/loading'
import handleClipboardText from '@/utils/handleClipboardText'
import Scrollbar from './Scrollbar.vue'
import exampleData from 'simple-mind-map/example/exampleData'
import FormulaSidebar from './FormulaSidebar.vue'
import { getKnowledge } from './apis/get_knowledge'
import {revertJson} from './apis/treeReverter'

// 注册插件
MindMap.usePlugin(MiniMap)
  .usePlugin(Watermark)
  .usePlugin(Drag)
  .usePlugin(KeyboardNavigation)
  .usePlugin(ExportPDF)
  .usePlugin(ExportXMind)
  .usePlugin(Export)
  .usePlugin(Select)
  .usePlugin(AssociativeLine)
  .usePlugin(NodeImgAdjust)
  .usePlugin(TouchEvent)
  .usePlugin(SearchPlugin)
  .usePlugin(Painter)
  .usePlugin(ScrollbarPlugin)
  .usePlugin(Formula)
// .usePlugin(Cooperate)// 协同插件

// 注册自定义主题
customThemeList.forEach(item => {
  MindMap.defineTheme(item.value, item.theme)
})

/**
 * 
 * @Desc: 编辑区域
 */
export default {
  name: 'Edit',
  components: {
    OutlineSidebar,
    Style,
    BaseStyle,
    Theme,
    Structure,
    Count,
    NavigatorToolbar,
    ShortcutKey,
    Contextmenu,
    RichTextToolbar,
    NodeNoteContentShow,
    Navigator,
    NodeImgPreview,
    SidebarTrigger,
    Search,
    NodeIconSidebar,
    NodeIconToolbar,
    OutlineEdit,
    Scrollbar,
    FormulaSidebar
  },
  data() {
    return {
      enableShowLoading: true,
      mindMapData: {},
      mindMap: null,
      prevImg: '',
      storeConfigTimer: null
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode,
      openNodeRichText: state => state.localConfig.openNodeRichText,
      useLeftKeySelectionRightKeyDrag: state => state.localConfig.useLeftKeySelectionRightKeyDrag,
      isShowScrollbar: state => state.localConfig.isShowScrollbar
    })
  },
  watch: {
    openNodeRichText() {
      if (this.openNodeRichText) {
        this.addRichTextPlugin()
      } else {
        this.removeRichTextPlugin()
      }
    }
  },
  mounted () {
    // 获取知识图谱
    // 获取知识图谱
    getKnowledge().then(res => {
      console.log(res.data.data);
      const dataArray = res.data.data;

      // 遍历数组中的各个对象
      for (let i = 0; i < dataArray.length; i++) {
        // 跳过第一个节点
        if (i === 0) continue;

        const obj = dataArray[i];
        const queryCount = obj.query; // 获取 query 的值
        const color = this.getColor(queryCount); // 根据 query 的值计算颜色

        // 在 name 中查找最后一个分号的位置
        const lastSemicolonIndex = obj.name.lastIndexOf(';');
        if (lastSemicolonIndex !== -1) {
          // 在最后一个分号的位置之前插入背景颜色
          obj.name = obj.name.slice(0, lastSemicolonIndex) + `; background-color: ${color};` + obj.name.slice(lastSemicolonIndex);
        } else {
          // 如果没有分号，则直接添加背景颜色
          obj.name += `background-color: ${color};`;
        }
      }

      // 将修改后的数据传递给 bus.emit
      bus.emit('setData', revertJson(dataArray));
    }).catch(err => {
      console.error(err);
    });



    showLoading()
    // this.showNewFeatureInfo()
    this.getData()
    this.init()
    bus.on('execCommand', this.execCommand)
    bus.on('paddingChange', this.onPaddingChange)
    bus.on('export', this.export)
    bus.on('setData', this.setData)
    bus.on('startTextEdit', this.handleStartTextEdit)
    bus.on('endTextEdit', this.handleEndTextEdit)
    bus.on('createAssociativeLine', this.handleCreateLineFromActiveNode)
    bus.on('startPainter', this.handleStartPainter)
    bus.on('node_tree_render_end', this.handleHideLoading)
    bus.on('showLoading', this.handleShowLoading)
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    bus.off('execCommand', this.execCommand)
    bus.off('paddingChange', this.onPaddingChange)
    bus.off('export', this.export)
    bus.off('setData', this.setData)
    bus.off('startTextEdit', this.handleStartTextEdit)
    bus.off('endTextEdit', this.handleEndTextEdit)
    bus.off('createAssociativeLine', this.handleCreateLineFromActiveNode)
    bus.off('startPainter', this.handleStartPainter)
    bus.off('node_tree_render_end', this.handleHideLoading)
    bus.off('showLoading', this.handleShowLoading)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {

  // 根据 query 的值计算颜色
  getColor(queryCount) {
      // 假设最大查询次数为 10
      const maxQueryCount = 10;
      // 最小颜色值
      const minColorValue = 100;
      // 最大颜色值
      const maxColorValue = 255;

      // 计算颜色值
      const colorStep = (maxColorValue - minColorValue) / maxQueryCount;
      // 根据查询次数计算颜色值
      const colorValue = Math.round(maxColorValue - queryCount * colorStep);

      // 返回 rgba 格式的颜色值
      return `rgba(${colorValue}, ${colorValue}, ${colorValue}, 0.7)`;
  },


    handleStartTextEdit() {
      this.mindMap.renderer.startTextEdit()
    },

    handleEndTextEdit() {
      this.mindMap.renderer.endTextEdit()
    },

    handleCreateLineFromActiveNode() {
      this.mindMap.associativeLine.createLineFromActiveNode()
    },

    handleStartPainter() {
      this.mindMap.painter.startPainter()
    },

    handleResize() {
      this.mindMap.resize()
    },

    // 显示loading
    handleShowLoading() {
      this.enableShowLoading = true
      showLoading()
    },
    // 渲染结束后关闭loading
    handleHideLoading() {
      if (this.enableShowLoading) {
        this.enableShowLoading = false
        hideLoading()
      }
    },
    /**
     * 
     * @Desc: 获取思维导图数据，实际应该调接口获取
     */
    getData() {
      const data = getData()
      this.mindMapData = data
      return data
    },

    // 通过toRaw方法拿到mindMap的原始数据
    // 解决vue3的mindMap变量被proxy代理了，mindMap变成Proxy里面有些动态的属性就不兼容了
    // 需要通过toRaw的形式，拿到mindMap的原始引用
    getMindMap() {
      return toRaw(this.mindMap)
    },

    /**
     * 
     * @Desc: 存储数据当数据有变时
     */
    bindSaveEvent() {
      bus.on('data_change', data => {
        storeData(data)
      })
      bus.on('view_data_change', data => {
        clearTimeout(this.storeConfigTimer)
        this.storeConfigTimer = setTimeout(() => {
          storeConfig({
            view: data
          })
        }, 300)
      })
    },

    /**
     * 
     * @Desc: 手动保存
     */
    manualSave() {
      // let data = this.mindMap.command.getCopyData()
      // storeData(data)
      // let viewData = this.mindMap.view.getTransformData()
      // storeConfig({
      //   view: viewData,
      // })
      let data = this.mindMap.getData(true)
      storeConfig(data)
    },

    /**
     * 
     * @Desc: 初始化
     */
    init() {
      let hasFileURL = this.hasFileURL()
      let { root, layout, theme, view, config } = this.getData()
      // 如果url中存在要打开的文件，那么思维导图数据、主题、布局都使用默认的
      if (hasFileURL) {
        root = {
          data: {
            text: this.$t('edit.root')
          },
          children: []
        }
        layout = exampleData.layout
        theme = exampleData.theme
        view = null
      }
      this.mindMap = new MindMap({
        el: this.$refs.mindMapContainer,
        data: root,
        fit: false,
        layout: 'mindMap',
        theme: 'rose',
        themeConfig: theme.config,
        viewData: view,
        nodeTextEditZIndex: 1000,
        nodeNoteTooltipZIndex: 1000,
        customNoteContentShow: {
          show: (content, left, top, node) => {
            bus.emit('showNoteContent', [content, left, top, node])
          },
          hide: () => {
            // bus.emit('hideNoteContent')
          }
        },
        ...(config || {}),
        iconList: [...icon],
        useLeftKeySelectionRightKeyDrag: this.useLeftKeySelectionRightKeyDrag,
        customInnerElsAppendTo: null,
        enableAutoEnterTextEditWhenKeydown: true,
        customHandleClipboardText: handleClipboardText,
        handleIsSplitByWrapOnPasteCreateNewNode: () => {
          return this.$confirm(this.$t('edit.splitByWrap'), this.$t('edit.tip'), {
            confirmButtonText: this.$t('edit.yes'),
            cancelButtonText: this.$t('edit.no'),
            type: 'warning'
          })
        }
        // isUseCustomNodeContent: true,
        // 示例1：组件里用到了router、store、i18n等实例化vue组件时需要用到的东西
        // customCreateNodeContent: (node) => {
        //   let el = document.createElement('div')
        //   let Comp = Vue.extend(Color)
        //   let comp = new Comp({
        //     router,
        //     store,
        //     i18n
        //   })
        //   comp.$mount(el)
        //   return comp.$el
        // },
        // 示例2：组件里没有用到示例1的东西
        // customCreateNodeContent: (node) => {
        //   let el = document.createElement('div')
        //   let Comp = Vue.extend(CustomNodeContent)
        //   let comp = new Comp({
        //     propsData: {
        //       html: node.nodeData.data.text
        //     }
        //   })
        //   comp.$mount(el)
        //   return comp.$el
        // }
      })
      if (this.openNodeRichText) this.addRichTextPlugin()
      this.mindMap.keyCommand.addShortcut('Control+s', () => {
        this.manualSave()
      })
      // 转发事件
      ;[
        'node_active',
        'data_change',
        'view_data_change',
        'back_forward',
        'node_contextmenu',
        'node_click',
        'draw_click',
        'expand_btn_click',
        'svg_mousedown',
        'mouseup',
        'mode_change',
        'node_tree_render_end',
        'rich_text_selection_change',
        'transforming-dom-to-images',
        'generalization_node_contextmenu',
        'painter_start',
        'painter_end',
        'scrollbar_change',
        'scale'
      ].forEach(event => {
        this.getMindMap().on(event, (...args) => {
          if (['node_contextmenu', 'node_active', 'rich_text_selection_change'].includes(event)) {
            bus.emit(event, args)
          } else {
            bus.emit(event, ...args)
          }
        })
      })
      this.bindSaveEvent()
      this.testDynamicCreateNodes()
      // 解析url中的文件
      if (hasFileURL) {
        bus.emit('handle_file_url')
      }
      // 协同测试
      this.cooperateTest()
      window.mindMap = this.mindMap
      // 销毁
      // setTimeout(() => {
      //   console.log('销毁')
      //   this.mindMap.destroy()
      // }, 10000)
      // 测试
      // setTimeout(() => {
      //   console.log(this.mindMap.renderer.root.getRect())
      //   console.log(this.mindMap.renderer.root.getRectInSvg())
      // }, 5000);
    },

    // url中是否存在要打开的文件
    hasFileURL() {
      const fileURL = this.$route.query.fileURL
      if (!fileURL) return false
      return /\.(smm|json|xmind|md|xlsx)$/.test(fileURL)
    },

    /**
     * 
     * @Desc: 动态设置思维导图数据
     */
    setData(data) {
      this.handleShowLoading()
      this.mindMap.setData(data)
      if (data.root) {
        this.getMindMap().setFullData(data)
      } else {
        this.getMindMap().setData(data)
      }
      this.mindMap.view.reset()
      this.manualSave()
    },

    /**
     * 
     * @Desc: 重新渲染
     */
    reRender() {
      this.getMindMap().reRender()
    },

    /**
     * 
     * @Desc: 执行命令
     */
    execCommand(args) {
      this.getMindMap().execCommand(...(Array.isArray(args) ? args : [args]))
    },

    /**
     * 
     * @Desc: 导出
     */
    async export(args) {
      try {
        showLoading()
        await this.mindMap.export(...args)
        hideLoading()
      } catch (error) {
        hideLoading()
        console.log(error)
      }
    },

    /**
     * 
     * @Desc: 修改导出内边距
     */
    onPaddingChange(data) {
      this.mindMap.updateConfig(data)
    },

    /**
     * 
     * @Desc: 显示新特性提示
     */
    showNewFeatureInfo() {
      let showed = localStorage.getItem('SIMPLE_MIND_MAP_NEW_FEATURE_TIP_1')
      if (!showed) {
        this.$notify.info({
          title: this.$t('edit.newFeatureNoticeTitle'),
          message: this.$t('edit.newFeatureNoticeMessage'),
          duration: 0,
          onClose: () => {
            localStorage.setItem('SIMPLE_MIND_MAP_NEW_FEATURE_TIP_1', true)
          }
        })
      }
    },

    /**
     * 
     * @Desc: 加载节点富文本编辑插件
     */
    addRichTextPlugin() {
      if (!this.mindMap) return
      this.mindMap.addPlugin(RichText)
    },

    /**
     * 
     * @Desc: 移除节点富文本编辑插件
     */
    removeRichTextPlugin() {
      this.mindMap.removePlugin(RichText)
    },
    // 测试动态插入节点
    testDynamicCreateNodes() {
      // return
      setTimeout(() => {
        // 动态给指定节点添加子节点
        // this.mindMap.execCommand(
        //   'INSERT_CHILD_NODE',
        //   false,
        //   this.mindMap.renderer.root,
        //   {
        //     text: '自定义内容'
        //   },
        //   [
        //     {
        //       data: {
        //         text: '自定义子节点'
        //       }
        //     }
        //   ]
        // )
        // 动态给指定节点添加同级节点
        // this.mindMap.execCommand(
        //   'INSERT_NODE',
        //   false,
        //   null,
        //   {
        //     text: '自定义内容'
        //   },
        //   [
        //     {
        //       data: {
        //         text: '自定义同级节点'
        //       },
        //       children: [
        //         {
        //           data: {
        //             text: '自定义同级节点2'
        //           },
        //           children: []
        //         }
        //       ]
        //     }
        //   ]
        // )
        // 动态插入多个子节点
        // this.mindMap.execCommand('INSERT_MULTI_CHILD_NODE', null, [
        //   {
        //     data: {
        //       text: '自定义节点1'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点1-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   },
        //   {
        //     data: {
        //       text: '自定义节点2'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点2-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   }
        // ])
        // 动态插入多个同级节点
        // this.mindMap.execCommand('INSERT_MULTI_NODE', null, [
        //   {
        //     data: {
        //       text: '自定义节点1'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点1-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   },
        //   {
        //     data: {
        //       text: '自定义节点2'
        //     },
        //     children: [
        //       {
        //         data: {
        //           text: '自定义节点2-1'
        //         },
        //         children: []
        //       }
        //     ]
        //   }
        // ])
        // 动态删除指定节点
        // this.mindMap.execCommand('REMOVE_NODE', this.mindMap.renderer.root.children[0])
      }, 5000)
    },

    // 协同测试
    cooperateTest() {
      if (this.mindMap.cooperate && this.$route.query.userName) {
        this.mindMap.cooperate.setProvider(null, {
          roomName: 'demo-room',
          signalingList: ['ws://192.168.3.125:4444']
        })
        this.mindMap.cooperate.setUserInfo({
          id: Math.random(),
          name: this.$route.query.userName,
          color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'][Math.floor(Math.random() * 5)],
          avatar:
            Math.random() > 0.5
              ? 'https://img0.baidu.com/it/u=4270674549,2416627993&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1696006800&t=4d32871d14a7224a4591d0c3c7a97311'
              : ''
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editContainer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  .mindMapContainer {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }
}
</style>
