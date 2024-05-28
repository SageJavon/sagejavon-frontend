<script>
import axios from 'axios'
import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import { exportJSON } from '../utils'
import JsonCodemirror from './JsonCodemirror.vue'
export default defineComponent({
  components: {
    JsonCodemirror,
  },
  props: {
    uploadType: {
      type: String,
      default: 'image',
    },
  },
  setup(props, context) {
    const jsonFile = ref(null)
    const imageFile = ref(null)
    const width = ref(0)
    const height = ref(0)

    function beforeUpload(file) {
      if (props.uploadType === 'image') {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng)
          message.error('只能上传图片')

        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M)
          message.error('上传的图片大小不能超过5M')

        return isJpgOrPng && isLt5M
      }
      else {
        const isJson = file.type.toLowerCase() === 'application/json'
        if (!isJson)
          message.error('只能上传.json格式文件')

        return isJson
      }
    }

    async function customHttpRequest({ file }) {
      if (props.uploadType === 'image') {
        const picSrc = await getBase64(file)
        imageFile.value = picSrc
        const data = await loadImageAsync(imageFile.value)
        width.value = data.width
        height.value = data.height
      }
      else {
        try {
          const data = await analysisJSON(file)
          jsonFile.value = data
          message.success('解析JSON文件成功')
        }
        catch (error) {
          message.error(error.message || '解析JSON文件失败')
        }
      }
    }

    /**
     * json文件解析获取json数据
     * @param { File } file
     */
    function analysisJSON(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          try {
            JSON.parse(reader.result)
            resolve(reader.result)
          }
          catch (error) {
            const err = new Error('JSON文件格式不正确')
            reject(err)
          }
        }
        reader.onerror = function () {
          const err = new Error('解析JSON文件失败')
          reject(err)
        }
      })
    }

    function loadImageAsync(url) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = function () {
          resolve(image)
        }
        image.onerror = function () {
          reject(new Error(`Could not load image at ${url}`))
        }
        image.src = url
      })
    }

    /**
     * get base64
     * @param {*} file
     * @returns
     */
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }

    function setUploadImage() {
      if (!imageFile.value && !jsonFile.value)
        return
      if (props.uploadType === 'image') {
        const max = Math.max(width.value, height.value)
        const ratio = max / 180
        context.emit('set-image', {
          url: imageFile.value,
          width: width.value > 180 ? (width.value / ratio > 180 ? 180 : width.value / ratio) : width.value,
          height: height.value > 180 ? (height.value / ratio > 180 ? 180 : height.value / ratio) : height.value,
        })
      }
      else {
        context.emit('set-json', jsonFile.value)
      }
    }

    async function downJSONTemplate() {
      try {
        const data = await axios.get(`${process.env.BASE_URL}static/template.json`)
        exportJSON('template', JSON.stringify(data.data))
      }
      catch (error) {
        message.error('下载模板失败')
      }
    }

    function closeModal() {
      context.emit('close')
    }

    return {
      imageFile,
      jsonFile,
      closeModal,
      beforeUpload,
      customHttpRequest,
      setUploadImage,
      downJSONTemplate,
    }
  },
})
</script>

<template>
  <div class="upload-image-modal">
    <div class="upload-image-title">
      <p>{{ uploadType === 'image' ? '图片上传' : 'JSON文件解析' }}</p>
      <div class="template-down">
        <span v-if="uploadType === 'json'" @click.stop="downJSONTemplate">模板下载</span>
        <i class="ri-close-fill" @click="closeModal" />
      </div>
    </div>
    <div v-if="!jsonFile" class="upload-image-content">
      <a-upload-dragger
        name="file"
        :multiple="false"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :custom-request="customHttpRequest"
        action="#"
      >
        <div v-if="!imageFile" class="upload-block">
          <p class="ant-upload-drag-icon">
            <i class="ri-upload-cloud-fill" />
          </p>
          <p class="ant-upload-text">
            将文件拖到此处或者<span>点击上传</span>
          </p>
          <p class="ant-upload-hint">
            {{ uploadType === 'image' ? '只能上传图片格式文件' : '只能上传.JSON格式文件' }}
          </p>
        </div>
        <div v-if="imageFile" class="image-preview">
          <img :src="imageFile" alt="">
        </div>
      </a-upload-dragger>
    </div>
    <div v-else class="json-preview">
      <JsonCodemirror :code="jsonFile" />
    </div>
    <footer>
      <a-button @click="closeModal">
        取消
      </a-button>
      <a-button
        type="primary"
        :disabled="!imageFile && !jsonFile"
        @click="setUploadImage"
      >
        确定
      </a-button>
    </footer>
  </div>
</template>

<style lang="less">
.upload-image-modal {
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  width: 460px;
  height: 500px;
  margin: -300px 0 0 -300px;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0px 0px 18px 5px rgba(0,0,0,0.1);
  .upload-image-title {
    height: 42px;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    align-items: center;
    padding: 0 12px;
    justify-content: space-between;
    p {
      color: #000;
      font-size: 14px;
    }
    .template-down {
      display: flex;
      align-items: center;
      color: #4c4c4c;
      span {
        cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
        text-align: right;
        font-size: 12px;
        margin-right: 5px;
      }
      i {
        font-size: 18px;
        cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
      }
    }
  }
  .upload-image-content {
    flex: 1;
    height: 0;
    padding: 30px;
    .ant-upload-drag {
      border: none;
      border-radius: 4px;
      .ant-upload-btn {
        padding: 0;
        display: block;
        .upload-block {
          background: #f2f6ff;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          height: 100%;
          padding: 16px;
          .ant-upload-text {
            font-size: 14px;
            span {
              color: #4269df;
            }
          }
          .ant-upload-hint {
            font-size: 12px;
            margin-top: 10px;
          }
          .ant-upload-drag-icon {
            margin-bottom: 0;
            .ri-upload-cloud-fill {
              color: #4269df;
              font-size: 68px;
            }
          }
        }
        .image-preview {
          width: 100%;
          height: 100%;
          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
  .json-preview {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    padding: 12px;
  }
  footer {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid #f1f1f1;
    padding: 0 26px;
    button {
      margin-left: 12px;
    }
  }
}
</style>
