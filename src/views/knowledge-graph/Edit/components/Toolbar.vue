<template>
  <div class="toolbarContainer" :class="{ isDark: isDark }">
    <div class="toolbar" ref="toolbarRef">
      <!-- 节点操作 -->
      <div class="toolbarBlock">
        这是课程的思维导图，其中颜色越深表示你向大模型提问的次数越多，我们会为你推荐相关的题目
        <!-- <ToolbarNodeBtnList :list="horizontalList"></ToolbarNodeBtnList> -->
        <!-- 更多 -->
        <!-- <el-popover v-model="popoverShow" placement="bottom-end" width="120" trigger="hover" v-if="showMoreBtn" style="margin-left: 20px">
          <ToolbarNodeBtnList dir="v" :list="verticalList" @click.native="popoverShow = false"></ToolbarNodeBtnList>
          <div slot="reference" class="toolbarBtn">
            <span class="icon iconfont icongongshi"></span>
            <span class="text">{{ $t('toolbar.more') }}</span>
          </div>
        </el-popover> -->
      </div>
      <!-- 通用操作 -->
      <!-- <div class="toolbarBlock">
        <div class="toolbarBtn" @click="emit('showOutline')">
          <span class="icon iconfont iconfuhao-dagangshu"></span>
          <span class="text">{{ $t('toolbar.displayOutline') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showBaseStyle')">
          <span class="icon iconfont iconyangshi"></span>
          <span class="text">{{ $t('toolbar.baseStyle') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showTheme')">
          <span class="icon iconfont iconjingzi"></span>
          <span class="text">{{ $t('toolbar.theme') }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showStructure')">
          <span class="icon iconfont iconjiegou"></span>
          <span class="text">{{ $t('toolbar.strusture') }}</span>
        </div>
      </div> -->
      <!-- 导出 -->
      <div class="toolbarBlock">
        <!-- <div class="toolbarBtn" @click="createNewLocalFile">
          <span class="icon iconfont iconxinjian"></span>
          <span class="text">新建</span>
        </div>
        <div class="toolbarBtn" @click="openLocalFile">
          <span class="icon iconfont icondakai"></span>
          <span class="text">打开</span>
        </div> -->
        <!-- <div class="toolbarBtn" @click="saveLocalFile">
          <span class="icon iconfont iconlingcunwei"></span>
          <span class="text">保存</span>
        </div> -->
        <div class="toolbarBtn" @click="emit('showImport')">
          <span class="icon iconfont icondaoru"></span>
          <span class="text">导入</span>
        </div>
        <div class="toolbarBtn" @click="emit('showExport')">
          <span class="icon iconfont iconexport"></span>
          <span class="text">导出</span>
        </div>
        <!-- <div class="toolbarBtn" @click="emit('showShortcutKey')">
          <span class="icon iconfont iconjianpan"></span>
          <span class="text">{{ $t('toolbar.shortcutKey') }}</span>
        </div> -->
      </div>
    </div>
    <NodeImage></NodeImage>
    <NodeHyperlink></NodeHyperlink>
    <NodeIcon></NodeIcon>
    <NodeNote></NodeNote>
    <NodeTag></NodeTag>
    <Export></Export>
    <Import></Import>
  </div>
</template>

<script>
import NodeImage from './NodeImage'
import NodeHyperlink from './NodeHyperlink'
import NodeIcon from './NodeIcon'
import NodeNote from './NodeNote'
import NodeTag from './NodeTag'
import Export from './Export'
import Import from './Import'
import { mapState } from 'vuex'
import { ElNotification } from 'element-plus'
import exampleData from 'simple-mind-map/example/exampleData'
import { getData } from '@/api'
import bus from '@/utils/bus.js'
import ToolbarNodeBtnList from './ToolbarNodeBtnList.vue'
import { throttle } from 'simple-mind-map/src/utils/index'

/**
 * 
 * @Desc: 工具栏
 */
let fileHandle = null
export default {
  name: 'Toolbar',
  components: {
    NodeImage,
    NodeHyperlink,
    NodeIcon,
    NodeNote,
    NodeTag,
    Export,
    Import,
    ToolbarNodeBtnList
  },
  data() {
    return {
      list: [
        'back',
        'forward',
        'painter',
        'siblingNode',
        'childNode',
        'deleteNode',
        'image',
        'icon',
        'link',
        'note',
        'tag',
        'summary',
        'associativeLine',
        'formula'
      ],
      horizontalList: [],
      verticalList: [],
      showMoreBtn: true,
      popoverShow: false
    }
  },
  computed: {
    ...mapState(['isHandleLocalFile', 'isDark'])
  },
  watch: {
    isHandleLocalFile(val) {
      if (!val) {
        ElNotification.closeAll()
      }
    }
  },
  created() {
    bus.on('write_local_file', this.onWriteLocalFile)
  },
  mounted() {
    this.computeToolbarShow()
    this.computeToolbarShowThrottle = throttle(this.computeToolbarShow, 300)
    window.addEventListener('resize', this.computeToolbarShowThrottle)
    bus.on('lang_change', this.computeToolbarShowThrottle)
  },
  beforeDestroy() {
    bus.off('write_local_file', this.onWriteLocalFile)
    window.removeEventListener('resize', this.computeToolbarShowThrottle)
    bus.off('lang_change', this.computeToolbarShowThrottle)
  },
  methods: {
    // 计算工具按钮如何显示
    computeToolbarShow() {
      const windowWidth = window.innerWidth - 40
      const all = [...this.list]
      let index = 1
      const loopCheck = () => {
        if (index > all.length) return done()
        this.horizontalList = all.slice(0, index)
        this.$nextTick(() => {
          const width = this.$refs.toolbarRef.getBoundingClientRect().width
          if (width < windowWidth) {
            index++
            loopCheck()
          } else if (index > 0 && width > windowWidth) {
            index--
            this.horizontalList = all.slice(0, index)
            done()
          }
        })
      }
      const done = () => {
        this.verticalList = all.slice(index)
        this.showMoreBtn = this.verticalList.length > 0
      }
      loopCheck()
    },
    /**
     * 
     * @Desc: 监听本地文件读写
     */
    onWriteLocalFile(content) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.writeLocalFile(content)
      }, 1000)
    },
    /**
     * 
     * @Desc: 打开本地文件
     */
    async openLocalFile() {
      try {
        let [_fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: '',
              accept: {
                'application/json': ['.smm']
              }
            }
          ],
          excludeAcceptAllOption: true,
          multiple: false
        })
        if (!_fileHandle) {
          return
        }
        fileHandle = _fileHandle
        if (fileHandle.kind === 'directory') {
          this.$message.warning(this.$t('toolbar.selectFileTip'))
          return
        }
        this.readFile()
      } catch (error) {
        console.log('error', error)
        if (error.toString().includes('aborted')) {
          return
        }
        this.$message.warning(this.$t('toolbar.notSupportTip'))
      }
    },

    onPainterStart() {
      this.isInPainter = true
    },

    onPainterEnd() {
      this.isInPainter = false
    },

    /**
     * 
     * @Desc: 读取本地文件
     */
    async readFile() {
      let file = await fileHandle.getFile()
      let fileReader = new FileReader()
      fileReader.onload = async () => {
        this.$store.commit('setIsHandleLocalFile', true)
        this.setData(fileReader.result)
        ElNotification.closeAll()
        ElNotification({
          title: this.$t('toolbar.tip'),
          message: `${this.$t('toolbar.editingLocalFileTipFront')}${file.name}${this.$t('toolbar.editingLocalFileTipEnd')}`,
          duration: 0,
          showClose: true
        })
      }
      fileReader.readAsText(file)
    },

    /**
     * 
     * @Desc: 渲染读取的数据
     */
    setData(str) {
      try {
        let data = JSON.parse(str)
        if (typeof data !== 'object') {
          throw new Error(this.$t('toolbar.fileContentError'))
        }
        if (data.root) {
          this.isFullDataFile = true
        } else {
          this.isFullDataFile = false
          data = {
            ...exampleData,
            root: data
          }
        }
        bus.emit('setData', data)
      } catch (error) {
        console.log(error)
        this.$message.error(this.$t('toolbar.fileOpenFailed'))
      }
    },

    /**
     * 
     * @Desc: 写入本地文件
     */
    async writeLocalFile(content) {
      if (!fileHandle || !this.isHandleLocalFile) {
        return
      }
      if (!this.isFullDataFile) {
        content = content.root
      }
      let string = JSON.stringify(content)
      const writable = await fileHandle.createWritable()
      await writable.write(string)
      await writable.close()
    },

    /**
     * 
     * @Desc: 创建本地文件
     */
    async createNewLocalFile() {
      await this.createLocalFile(exampleData)
    },

    /**
     * 
     * @Desc: 另存为
     */
    async saveLocalFile() {
      let data = getData()
      await this.createLocalFile(data)
    },

    /**
     * 
     * @Desc: 创建本地文件
     */
    async createLocalFile(content) {
      try {
        let _fileHandle = await window.showSaveFilePicker({
          types: [
            {
              description: '',
              accept: { 'application/json': ['.smm'] }
            }
          ],
          suggestedName: this.$t('toolbar.defaultFileName')
        })
        if (!_fileHandle) {
          return
        }
        const loading = this.$loading({
          lock: true,
          text: this.$t('toolbar.creatingTip'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        fileHandle = _fileHandle
        this.$store.commit('setIsHandleLocalFile', true)
        this.isFullDataFile = true
        await this.writeLocalFile(content)
        await this.readFile()
        loading.close()
      } catch (error) {
        console.log(error)
        if (error.toString().includes('aborted')) {
          return
        }
        this.$message.warning(this.$t('toolbar.notSupportTip'))
      }
    },
    emit: (...agrs) => bus.emit(...agrs)
  }
}
</script>

<style lang="less" scoped>
.toolbarContainer {
  &.isDark {
    .toolbar {
      color: hsla(0, 0%, 100%, 0.9);
      .toolbarBlock {
        background-color: #262a2e;
      }
      .toolbarBtn {
        .icon {
          background: transparent;
          border-color: transparent;
        }
        &:hover {
          &:not(.disabled) {
            .icon {
              background: hsla(0, 0%, 100%, 0.05);
            }
          }
        }
        &.disabled {
          color: #54595f;
        }
      }
    }
  }
  .toolbar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    width: max-content;
    display: flex;
    padding: 0 20px;
    padding-top: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(26, 26, 26, 0.8);
    z-index: 2;

    .toolbarBlock {
      display: flex;
      background-color: #fff;
      padding: 10px 20px;
      border-radius: 6px;
      box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.06);
      margin-right: 20px;

      &:last-of-type {
        margin-right: 0;
      }
    }

    .toolbarBtn {
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      margin-right: 20px;
      flex-shrink: 0;

      &:last-of-type {
        margin-right: 0;
      }

      &:hover {
        &:not(.disabled) {
          .icon {
            background: #f5f5f5;
          }
        }
      }

      &.active {
        .icon {
          background: #f5f5f5;
        }
      }

      &.disabled {
        color: #bcbcbc;
        cursor: not-allowed;
        pointer-events: none;
      }

      .icon {
        display: flex;
        height: 26px;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 0 5px;
      }

      .text {
        margin-top: 3px;
      }
    }
  }
}
</style>
