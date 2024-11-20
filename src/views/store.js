import { createStore } from 'vuex'
import exampleData from 'simple-mind-map/example/exampleData'
import { storeLocalConfig } from '@/api'

const store = createStore({
  state: {
    mindMapData: null, // 思维导图数据
    isHandleLocalFile: false, // 是否操作的是本地文件
    localConfig: {
      // 本地配置
      isZenMode: false, // 是否是禅模式
      openNodeRichText: true, // 是否开启节点富文本
      useLeftKeySelectionRightKeyDrag: false, // 鼠标行为
      isShowScrollbar: false // 是否显示滚动条
    },
    activeSidebar: '', // 当前显示的侧边栏
    isDark: false, // 是否是暗黑模式
    isOutlineEdit: false, // 是否是大纲编辑模式
    isReadonly: false // 是否只读
  },
  mutations: {
    /**
     * 
     * @Desc: 设置思维导图数据
     */
    setMindMapData(state, data) {
      state.mindMapData = data
    },
    /**
     * 
     * @Desc: 设置操作本地文件标志位
     */
    setIsHandleLocalFile(state, data) {
      state.isHandleLocalFile = data
    },
    /**
     * 
     * @Desc: 设置本地配置
     */
    setLocalConfig(state, data) {
      state.localConfig = {
        ...state.localConfig,
        ...data
      }
      storeLocalConfig(state.localConfig)
    },
    /**
     * 
     * @Desc: 设置当前显示的侧边栏
     */
    setActiveSidebar(state, data) {
      state.activeSidebar = data
    },
    /**
     * 
     * @Desc: 设置暗黑模式
     */
    setIsDark(state, data) {
      state.isDark = data
    },
    /**
     * 
     * @Desc: 设置大纲编辑模式
     */
    setIsOutlineEdit(state, data) {
      state.isOutlineEdit = data
    },
    // 设置是否只读
    setIsReadonly(state, data) {
      state.isReadonly = data
    }
  },
  actions: {
    /**
     * 
     * @Desc: 设置初始思维导图数据
     */
    getUserMindMapData(ctx) {
      try {
        let { data } = {
          data: {
            data: {
              mindMapData: exampleData
            }
          }
        }
        ctx.commit('setMindMapData', data.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
})

export default store
