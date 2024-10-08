<template>
  <Sidebar ref="sidebar" title="节点样式">
    <div class="styleBox" :class="{ isDark: isDark }" v-if="activeNodes.length > 0">
      <div class="sidebarContent">
        <!-- 文字 -->
        <div class="title noTop">文本</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">字体</span>
            <el-select size="small" v-model="style.fontFamily" placeholder="" @change="update('fontFamily')">
              <el-option
                v-for="item in fontFamilyList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                :style="{ fontFamily: item.value }"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">大小</span>
            <el-select size="small" style="width: 80px" v-model="style.fontSize" placeholder="" @change="update('fontSize')">
              <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item" :style="{ fontSize: item + 'px' }">
              </el-option>
            </el-select>
          </div>
          <div class="rowItem">
            <span class="name">行高</span>
            <el-select size="small" style="width: 80px" v-model="style.lineHeight" placeholder="" @change="update('lineHeight')">
              <el-option v-for="item in lineHeightList" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="btnGroup">
            <el-tooltip :content="$t('style.color')" placement="bottom">
              <div>
                <el-popover placement="bottom" trigger="hover">
                  <template #reference>
                    <div class="styleBtn" v-popover:popover>
                      A
                      <span class="colorShow" :style="{ backgroundColor: style.color || '#eee' }"></span>
                    </div>
                  </template>
                  <Color :color="style.color" @change="changeFontColor"></Color>
                </el-popover>
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.addFontWeight')" placement="bottom">
              <div
                class="styleBtn"
                :class="{
                  actived: style.fontWeight === 'bold'
                }"
                @click="toggleFontWeight"
              >
                B
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.italic')" placement="bottom">
              <div
                class="styleBtn i"
                :class="{
                  actived: style.fontStyle === 'italic'
                }"
                @click="toggleFontStyle"
              >
                I
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.textDecoration')" placement="bottom">
              <div>
                <el-popover placement="bottom" trigger="hover">
                  <template #reference>
                    <div
                      class="styleBtn u"
                      :style="{
                        textDecoration: style.textDecoration || 'none'
                      }"
                    >
                      U
                    </div>
                  </template>
                  <el-radio-group size="small" v-model="style.textDecoration" @change="update('textDecoration')">
                    <el-radio-button label="none">{{ $t('style.none') }}</el-radio-button>
                    <el-radio-button label="underline">{{ $t('style.underline') }}</el-radio-button>
                    <el-radio-button label="line-through"> {{ $t('style.lineThrough') }} </el-radio-button>
                    <el-radio-button label="overline">{{ $t('style.overline') }}</el-radio-button>
                  </el-radio-group>
                </el-popover>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!-- 边框 -->
        <div class="title">边框</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">颜色</span>
            <el-popover placement="bottom" trigger="hover" width="auto">
              <template #reference>
                <span class="block" :style="{ width: '80px', backgroundColor: style.borderColor }"></span>
              </template>
              <Color :color="style.borderColor" @change="changeBorderColor"></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">样式</span>
            <el-select size="small" style="width: 80px" v-model="style.borderDasharray" placeholder="" @change="update('borderDasharray')">
              <el-option v-for="item in borderDasharrayList" :key="item.value" :label="item.name" :value="item.value">
                <svg width="120" height="34">
                  <line
                    x1="10"
                    y1="17"
                    x2="110"
                    y2="17"
                    stroke-width="2"
                    :stroke="style.borderDasharray === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                    :stroke-dasharray="item.value"
                  ></line>
                </svg>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">宽度</span>
            <el-select size="small" style="width: 80px" v-model="style.borderWidth" placeholder="" @change="update('borderWidth')">
              <el-option v-for="item in borderWidthList" :key="item" :label="item" :value="item">
                <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }"></span>
              </el-option>
            </el-select>
          </div>
          <div class="rowItem" v-show="style.shape === 'rectangle'">
            <span class="name">圆角</span>
            <el-select size="small" style="width: 80px" v-model="style.borderRadius" placeholder="" @change="update('borderRadius')">
              <el-option v-for="item in borderRadiusList" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </div>
        </div>
        <!-- 背景 -->
        <div class="title">背景</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">颜色</span>
            <el-popover placement="bottom" trigger="hover" width="auto">
              <template #reference>
                <span class="block" :style="{ width: '80px', backgroundColor: style.fillColor }"></span>
              </template>
              <Color :color="style.fillColor" @change="changeFillColor"></Color>
            </el-popover>
          </div>
        </div>
        <!-- 形状 -->
        <div class="title">形状</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">形状</span>
            <el-select size="small" style="width: 120px" v-model="style.shape" placeholder="" @change="update('shape')">
              <el-option v-for="item in shapeList" :key="item" :label="item.name" :value="item.value">
                <svg width="60" height="26" style="margin-top: 5px">
                  <path
                    :d="shapeListMap[item.value]"
                    fill="none"
                    :stroke="style.shape === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                    stroke-width="2"
                  ></path>
                </svg>
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 线条 -->
        <div class="title">线条</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">颜色</span>
            <el-popover placement="bottom" trigger="hover" width="auto">
              <template #reference>
                <span class="block" :style="{ width: '80px', backgroundColor: style.lineColor }"></span>
              </template>
              <Color :color="style.lineColor" @change="changeLineColor"></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">样式</span>
            <el-select
              size="small"
              style="width: 80px"
              v-model="style.lineDasharray"
              placeholder="请选择..."
              @change="update('lineDasharray')"
            >
              <el-option v-for="item in borderDasharrayList" :key="item.value" :label="item.name" :value="item.value">
                <svg width="120" height="34">
                  <line
                    x1="10"
                    y1="17"
                    x2="110"
                    y2="17"
                    stroke-width="2"
                    :stroke="style.lineDasharray === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                    :stroke-dasharray="item.value"
                  ></line>
                </svg>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">宽度</span>
            <el-select size="small" style="width: 80px" v-model="style.lineWidth" placeholder="请选择..." @change="update('lineWidth')">
              <el-option v-for="item in borderWidthList" :key="item" :label="item" :value="item">
                <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }"></span>
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 节点内边距 -->
        <div class="title noTop">内边距</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">水平</span>
            <el-slider style="width: 200px" v-model="style.paddingX" @change="update('paddingX')"></el-slider>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">垂直</span>
            <el-slider style="width: 200px" v-model="style.paddingY" @change="update('paddingY')"></el-slider>
          </div>
        </div>
      </div>
    </div>
    <div class="tipBox" v-else>
      <div class="tipIcon iconfont icontianjiazijiedian"></div>
      <div class="tipText">请选择一个节点</div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar'
import Color from './Color'
import {
  fontFamilyList,
  fontSizeList,
  borderWidthList,
  borderDasharrayList,
  borderRadiusList,
  lineHeightList,
  shapeList,
  shapeListMap
} from '@/config'
import bus from '@/utils/bus.js'
import { mapState } from 'vuex'
/**
 * 
 * @Desc: 节点样式设置
 */
export default {
  name: 'Style',
  components: {
    Sidebar,
    Color
  },
  data() {
    return {
      fontSizeList,
      borderWidthList,
      borderRadiusList,
      lineHeightList,
      activeNodes: [],
      style: {
        shape: '',
        paddingX: 0,
        paddingY: 0,
        color: '',
        fontFamily: '',
        fontSize: '',
        lineHeight: '',
        textDecoration: '',
        fontWeight: '',
        fontStyle: '',
        borderWidth: '',
        borderColor: '',
        fillColor: '',
        borderDasharray: '',
        borderRadius: '',
        lineColor: '',
        lineDasharray: '',
        lineWidth: ''
      }
    }
  },
  computed: {
    ...mapState(['activeSidebar', 'isDark']),
    fontFamilyList() {
      return fontFamilyList[this.$i18n.locale] || fontFamilyList.zh
    },
    borderDasharrayList() {
      return borderDasharrayList[this.$i18n.locale] || borderDasharrayList.zh
    },
    shapeList() {
      return shapeList[this.$i18n.locale] || shapeList.zh
    },
    shapeListMap() {
      return shapeListMap[this.$i18n.locale] || shapeListMap.zh
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'nodeStyle') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    bus.on('node_active', this.onNodeActive)
  },
  beforeDestroy() {
    bus.off('node_active', this.onNodeActive)
  },
  methods: {
    /**
     * 
     * @Desc: 监听节点激活事件
     */
    onNodeActive(...args) {
      // if (this.$refs.sidebar) this.$refs.sidebar.show = false
      this.$nextTick(() => {
        this.activeNodes = [...args[0][1]]
        // if (this.$refs.sidebar) this.$refs.sidebar.show = this.activeNodes.length > 0
        this.initNodeStyle()
      })
    },

    /**
     * 
     * @Desc: 初始
     */
    initNodeStyle() {
      if (this.activeNodes.length <= 0) {
        return
      }
      ;[
        'shape',
        'paddingX',
        'paddingY',
        'color',
        'fontFamily',
        'fontSize',
        'lineHeight',
        'textDecoration',
        'fontWeight',
        'fontStyle',
        'borderWidth',
        'borderColor',
        'fillColor',
        'borderDasharray',
        'borderRadius',
        'lineColor',
        'lineDasharray',
        'lineWidth'
      ].forEach(item => {
        this.style[item] = this.activeNodes[0].getStyle(item, false)
      })
    },

    /**
     * 
     * @Desc: 修改样式
     */
    update(prop) {
      this.activeNodes.forEach(node => {
        node.setStyle(prop, this.style[prop])
      })
    },

    /**
     * 
     * @Desc: 切换加粗样式
     */
    toggleFontWeight() {
      if (this.style.fontWeight === 'bold') {
        this.style.fontWeight = 'normal'
      } else {
        this.style.fontWeight = 'bold'
      }
      this.update('fontWeight')
    },

    /**
     * 
     * @Desc: 切换字体样式
     */
    toggleFontStyle() {
      if (this.style.fontStyle === 'italic') {
        this.style.fontStyle = 'normal'
      } else {
        this.style.fontStyle = 'italic'
      }
      this.update('fontStyle')
    },

    /**
     * 
     * @Desc: 修改字体颜色
     */
    changeFontColor(color) {
      this.style.color = color
      this.update('color')
    },

    /**
     * 
     * @Desc: 修改边框颜色
     */
    changeBorderColor(color) {
      this.style.borderColor = color
      this.update('borderColor')
    },

    /**
     * 
     * @Desc: 修改线条颜色
     */
    changeLineColor(color) {
      this.style.lineColor = color
      this.update('lineColor')
    },

    /**
     * 
     * @Desc: 修改背景颜色
     */
    changeFillColor(color) {
      this.style.fillColor = color
      this.update('fillColor')
    }
  }
}
</script>

<style lang="less" scoped>
.styleBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &.isDark {
    .sidebarContent {
      .title {
        color: #fff;
      }
      .row {
        .rowItem {
          .name {
            color: hsla(0, 0%, 100%, 0.6);
          }
        }
        .styleBtn {
          background-color: #363b3f;
          color: hsla(0, 0%, 100%, 0.6);
          border-color: hsla(0, 0%, 100%, 0.1);
        }
      }
    }
  }
  .tab {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 0 20px;
  }
}
.tipBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  .tipIcon {
    font-size: 100px;
  }
}

.sidebarContent {
  padding: 20px;
  padding-top: 10px;

  .title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(26, 26, 26, 0.9);
    margin-bottom: 10px;
    margin-top: 20px;

    &.noTop {
      margin-top: 0;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .btnGroup {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .rowItem {
      display: flex;
      align-items: center;

      .name {
        font-size: 12px;
        margin-right: 10px;
      }

      .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;

        &.disabled {
          background-color: #f5f7fa !important;
          border-color: #e4e7ed !important;
          color: #c0c4cc !important;
          cursor: not-allowed !important;
        }
      }
    }

    .styleBtn {
      position: relative;
      width: 50px;
      height: 30px;
      background: #fff;
      border: 1px solid #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;

      &.actived {
        background-color: #eee;
      }

      &.disabled {
        background-color: #f5f7fa !important;
        border-color: #e4e7ed !important;
        color: #c0c4cc !important;
        cursor: not-allowed !important;
      }

      &.i {
        font-style: italic;
      }

      &.u {
      }

      .colorShow {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
      }
    }
  }
}
.borderLine {
  display: inline-block;
  width: 100%;
  background-color: #000;
  &.isDark {
    background-color: #fff;
  }
}
</style>
<style lang="less">
.el-select-dropdown__item.selected {
  .borderLine {
    background-color: #409eff;
  }
}
</style>
