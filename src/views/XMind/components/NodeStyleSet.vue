<!-- eslint-disable @typescript-eslint/no-var-requires -->
<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { defineComponent, reactive, ref, toRefs, watch } from 'vue'
import mitter from '../mitt'
import {
  BORDERRADIUSOPTIONS,
  EDGELINESIZEOPTIONS,
  FONTFAMILYOPTIONS,
  FONTSIZEOPTIONS,
  STROKESTYLEOPTIONS,
  STROKEWIDTHOPTIONS,
  TEXTDECARATIONOPTIONS,
  predefineColors,
} from '../config'
const edgeStyleList = [

  { img: 'https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/xmind/1.svg', value: '1' },
  { img: 'https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/xmind/2.svg', value: '2' },
  { img: 'https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/xmind/3.svg', value: '3' },
  { img: 'https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/xmind/4.svg', value: '4' },
]
export default defineComponent({
  components: { ElConfigProvider },
  props: {
    subjectStyle: {
      type: Object,
      default: () => null,
    },
    isRoot: Boolean,
  },
  setup(props, context) {
    const currentEdgeStyle = ref('2')
    const isCompact = ref(false)
    const styleObject = reactive({
      fontFamily: null, // 字体
      fontSize: 12, // 字号
      fontWeight: 'normal', // 是否粗体
      fontStyle: 'normal', // 是否斜体
      textDecoration: 'none', // 划线
      textColor: null, // 文字颜色
      textDirection: 'hor', // 文本方向
      align: 'left', // 对齐方向
      strokeColor: null, // 边框颜色
      strokeStyle: null, // 边框样式
      strokeWidth: 0, // 边框宽度
      borderRadius: 0, // 圆角
      backgroundColor: null, // 背景色
      lineColor: null, // 线条颜色
      lineStyle: null, // 连线样式
      lineWidth: null, // 连线尺寸
      verticalInner: 10, // 垂直内边距
      horizontalInner: 20, // 水平内边距
      horizontalOutter: 22, // 水平外边距
    })

    function handlerUpdateStyle(filedValue, filedName, gloab) {
      if ([
        'fontWeight',
        'fontStyle',
        'textColor',
        'strokeColor',
        'lineColor',
        'backgroundColor',
      ].includes(filedName))
        styleObject[filedName] = filedValue

      mitter.emit('update-subject-style', { filedValue, filedName, gloab })
    }

    function updateEdgeStyle(value) {
      currentEdgeStyle.value = value
      context.emit('update-edge-style', value)
    }

    watch(() => props.subjectStyle, (newVal) => {
      if (newVal)
        Object.assign(styleObject, newVal)
    }, { deep: true })

    return {
      zhCn,
      edgeStyleList,
      isCompact,
      currentEdgeStyle,
      predefineColors,
      FONTFAMILYOPTIONS,
      FONTSIZEOPTIONS,
      STROKESTYLEOPTIONS,
      STROKEWIDTHOPTIONS,
      BORDERRADIUSOPTIONS,
      TEXTDECARATIONOPTIONS,
      EDGELINESIZEOPTIONS,
      ...toRefs(styleObject),
      handlerUpdateStyle,
      updateEdgeStyle,
    }
  },
})
</script>

<template>
  <div class="nodestyleset-modal">
    <ElConfigProvider :locale="zhCn">
      <!-- 节点样式设置 -->
      <div v-show="subjectStyle">
        <div class="style-block">
          <p class="set-title">
            文字
          </p>
          <div class="modal">
            <p>字体</p>
            <a-select
              v-model:value="fontFamily"
              size="middle"
              placeholder="请选择"
              style="width: 200px"
              dropdown-class-name="font-family-select"
              @change="handlerUpdateStyle($event, 'fontFamily')"
            >
              <a-select-option
                v-for="item in FONTFAMILYOPTIONS"
                :key="item.value"
                :value="item.value"
              >
                <span :style="{ 'font-family': item.value, 'line-height': '30px' }">{{ item.label }}</span>
              </a-select-option>
            </a-select>
          </div>
          <div class="modal">
            <div class="c">
              <p>字号</p>
              <a-select
                v-model:value="fontSize"
                :options="FONTSIZEOPTIONS"
                size="middle"
                placeholder="请选择"
                style="width: 100px"
                @change="handlerUpdateStyle($event, 'fontSize')"
              />
            </div>
            <div class="c">
              <p>划线</p>
              <a-select
                v-model:value="textDecoration"
                :options="TEXTDECARATIONOPTIONS"
                size="middle"
                placeholder="请选择"
                style="width: 100px"
                @change="handlerUpdateStyle($event, 'textDecoration')"
              />
            </div>
          </div>
          <div class="modal">
            <div class="c">
              <p>颜色</p>
              <el-color-picker
                v-model="textColor"
                :teleported="false"
                show-alpha
                :predefine="predefineColors"
                @active-change="handlerUpdateStyle($event, 'textColor')"
              />
            </div>
            <div class="c">
              <div
                title="加粗"
                class="font"
                :class="{ active: fontWeight === 'bold' }"
                @click="handlerUpdateStyle(fontWeight === 'bold' ? 'normal' : 'bold', 'fontWeight')"
              >
                <span class="ri-bold" />
              </div>
              <div
                title="斜体"
                class="font"
                :class="{ active: fontStyle === 'italic' }"
                @click="handlerUpdateStyle(fontStyle === 'italic' ? 'normal' : 'italic', 'fontStyle')"
              >
                <span class="ri-italic" />
              </div>
            </div>
          </div>
          <div class="modal">
            <p>文本方向</p>
            <a-radio-group
              v-model:value="textDirection"
              size="small"
              button-style="solid"
              @change="handlerUpdateStyle($event.target.value, 'textDirection')"
            >
              <a-radio-button value="hor" style="font-size: 12px;">
                横向
              </a-radio-button>
              <a-radio-button value="ver" style="font-size: 12px;">
                竖向
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="modal">
            <p>对齐方向</p>
            <a-radio-group
              v-model:value="align"
              size="small"
              button-style="solid"
              @change="handlerUpdateStyle($event.target.value, 'align')"
            >
              <a-radio-button value="left" style="font-size: 12px;">
                <i class="ri-align-left" />
              </a-radio-button>
              <a-radio-button value="center" style="font-size: 12px;">
                <i class="ri-align-center" />
              </a-radio-button>
              <a-radio-button value="right" style="font-size: 12px;">
                <i class="ri-align-right" />
              </a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <div class="style-block">
          <p class="set-title">
            边框
          </p>
          <div class="modal w_50">
            <div class="c">
              <p>颜色</p>
              <el-color-picker
                v-model="strokeColor"
                :teleported="false"
                show-alpha
                :predefine="predefineColors"
                @active-change="handlerUpdateStyle($event, 'strokeColor')"
              />
            </div>
            <div class="c">
              <p>样式</p>
              <a-select
                v-model:value="strokeStyle"
                :options="STROKESTYLEOPTIONS"
                size="middle"
                placeholder="请选择"
                style="width: 100px"
                @change="handlerUpdateStyle($event, 'strokeStyle')"
              />
            </div>
            <div class="c">
              <p>宽度</p>
              <a-select
                v-model:value="strokeWidth"
                :options="STROKEWIDTHOPTIONS"
                size="middle"
                placeholder="请选择"
                style="width: 100px"
                @change="handlerUpdateStyle($event, 'strokeWidth')"
              />
            </div>
            <div class="c">
              <p>圆角</p>
              <a-select
                v-model:value="borderRadius"
                :options="BORDERRADIUSOPTIONS"
                size="middle"
                placeholder="请选择"
                style="width: 100px"
                @change="handlerUpdateStyle($event, 'borderRadius')"
              />
            </div>
          </div>
        </div>
        <div class="style-block">
          <p class="set-title">
            填充
          </p>
          <div class="modal">
            <p>颜色</p>
            <el-color-picker
              v-model="backgroundColor"
              :teleported="false"
              show-alpha
              :predefine="predefineColors"
              @active-change="handlerUpdateStyle($event, 'backgroundColor')"
            />
          </div>
        </div>
        <div class="style-block">
          <p class="set-title">
            连线
          </p>
          <div class="modal w_50">
            <div class="c">
              <p>颜色</p>
              <el-color-picker
                v-model="lineColor"
                :teleported="false"
                show-alpha
                :predefine="predefineColors"
                @active-change="handlerUpdateStyle($event, 'lineColor')"
              />
            </div>
            <div class="c">
              <p>样式</p>
              <a-select
                v-model:value="lineStyle"
                :options="STROKESTYLEOPTIONS"
                size="middle"
                placeholder="请选择"
                style="width: 100px"
                @change="handlerUpdateStyle($event, 'lineStyle')"
              />
            </div>
          </div>
          <div class="modal">
            <div class="c">
              <p>尺寸</p>
              <a-select
                v-model:value="lineWidth"
                size="middle"
                placeholder="请选择"
                style="width: 200px"
                @change="handlerUpdateStyle($event, 'lineWidth')"
              >
                <a-select-opt-group
                  v-for="item in EDGELINESIZEOPTIONS.slice(0, isRoot ? 2 : 1)"
                  :key="item.label"
                  :label="item.label"
                >
                  <a-select-option
                    v-for="itemName in item.options"
                    :key="itemName.value"
                    :value="itemName.value"
                  >
                    {{ itemName.label }}
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
            </div>
          </div>
        </div>
        <div class="style-block">
          <p class="set-title">
            边距
          </p>
          <div class="modal">
            <p>垂直内边距</p>
            <div style="width: 200px">
              <a-slider
                v-model:value="verticalInner"
                :max="200"
                @afterChange="handlerUpdateStyle($event, 'verticalInner')"
              />
            </div>
          </div>
          <div class="modal">
            <p>水平内边距</p>
            <div style="width: 200px">
              <a-slider
                v-model:value="horizontalInner"
                :max="100"
                @afterChange="handlerUpdateStyle($event, 'horizontalInner')"
              />
            </div>
          </div>
          <div class="modal">
            <p>水平外边距</p>
            <div style="width: 200px">
              <a-slider
                v-model:value="horizontalOutter"
                :max="200"
                :min="15"
                @afterChange="handlerUpdateStyle($event, 'horizontalOutter')"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="!subjectStyle" class="gloab-subject-modal">
        <div class="style-block">
          <p class="set-title">
            全局样式
          </p>
          <div class="modal">
            <p>字体</p>
            <a-select
              v-model:value="fontFamily"
              size="middle"
              placeholder="请选择"
              style="width: 200px"
              dropdown-class-name="font-family-select"
              @change="handlerUpdateStyle($event, 'fontFamily', true)"
            >
              <a-select-option
                v-for="item in FONTFAMILYOPTIONS"
                :key="item.value"
                :value="item.value"
              >
                <span :style="{ 'font-family': item.value, 'line-height': '30px' }">{{ item.label }}</span>
              </a-select-option>
            </a-select>
          </div>
          <div class="modal">
            <div class="c">
              <p>字号</p>
              <a-select
                v-model:value="fontSize"
                :options="FONTSIZEOPTIONS"
                size="middle"
                placeholder="请选择"
                style="width: 100px"
                @change="handlerUpdateStyle($event, 'fontSize', true)"
              />
            </div>
          </div>
          <div class="modal">
            <p>填充颜色</p>
            <el-color-picker
              v-model="backgroundColor"
              :teleported="false"
              show-alpha
              :predefine="predefineColors"
              @active-change="handlerUpdateStyle($event, 'backgroundColor', true)"
            />
          </div>
          <div class="modal">
            <div class="c">
              <p>文字颜色</p>
              <el-color-picker
                v-model="textColor"
                :teleported="false"
                show-alpha
                :predefine="predefineColors"
                @active-change="handlerUpdateStyle($event, 'textColor', true)"
              />
            </div>
            <div class="c">
              <div
                title="加粗"
                class="font"
                :class="{ active: fontWeight === 'bold' }"
                @click="handlerUpdateStyle(fontWeight === 'bold' ? 'normal' : 'bold', 'fontWeight', true)"
              >
                <span class="ri-bold" />
              </div>
              <div
                title="斜体"
                class="font"
                :class="{ active: fontStyle === 'italic' }"
                @click="handlerUpdateStyle(fontStyle === 'italic' ? 'normal' : 'italic', 'fontStyle', true)"
              >
                <span class="ri-italic" />
              </div>
            </div>
          </div>
          <div class="modal">
            <p>分支样式</p>
            <div class="branch-style-list">
              <span
                v-for="item in edgeStyleList"
                :key="item.value"
                :class="{ selected: currentEdgeStyle === item.value }"
                @click="updateEdgeStyle(item.value)"
              >
                <img :src="item.img" alt="">
              </span>
            </div>
          </div>
        </div>
      </div>
    </ElConfigProvider>
  </div>
</template>

<style lang="less">
.nodestyleset-modal {
  .style-block {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .set-title {
      font-size: 14px;
      color: #000;
      line-height: 24px;
      font-weight: 600;
      font-family: fangzhengheiti;
    }
    .modal {
      display: flex;
      align-items: center;
      margin-top: 16px;
      &.w_50 {
        flex-wrap: wrap;
        justify-content: space-between;
        .c {
          width: 46%;
          margin-right: 0 !important;
          margin-bottom: 8px;
        }
      }
      .c {
        display: flex;
        align-items: center;
        &:not(:last-child) {
          margin-right: 15px;
        }
        .font {
          width: 50px;
          line-height: 28px;
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
          margin-right: 12px;
          border: 1px solid #f1f1f1;
          &.active {
            background-color: #eee;
          }
          span {
            font-size: 18px;
            vertical-align: middle;
            color: #2c3e50;
          }
        }
      }
      p {
        font-size: 12px;
        margin-right: 8px;
        color: #4c4c4c;
        flex-shrink: 0;
      }
      .branch-style-list {
        display: flex;
        flex: 1;
        width: 0;
        justify-content: space-between;
        span {
          width: 24%;
          border-radius: 4px;
          cursor: pointer;
          padding: 4px 0;
          img {
            width: 90%;
          }
          &.selected, &:hover {
            background-color: #eee;
          }
        }
      }
    }
  }
  .gloab-subject-modal {
  }
}
</style>
