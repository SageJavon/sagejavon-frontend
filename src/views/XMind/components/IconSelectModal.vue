<script>
import { defineComponent, ref } from 'vue'
import { imageMarkers, markIcons } from '../config'
export default defineComponent({
  setup(_props, context) {
    const typeName = ref('mark')

    function closeModal() {
      context.emit('close')
    }

    function selectTiezhiIcon(iconItem) {
      context.emit('select-tiezhi-icon', iconItem)
    }

    return {
      typeName,
      imageMarkers,
      markIcons,
      closeModal,
      selectTiezhiIcon,
    }
  },
})
</script>

<template>
  <div class="tiezhi-iconselect-modal">
    <div class="modal-title">
      <div class="ul-type">
        <span
          :class="{ active: typeName === 'mark' }"
          @click="typeName = 'mark'"
        >
          <i class="ri-star-smile-line" />
        </span>
        <span
          :class="{ active: typeName === 'tiezhi' }"
          @click="typeName = 'tiezhi'"
        >
          <i class="ri-landscape-line" />
        </span>
        <em>双击插入</em>
      </div>
      <i class="ri-close-line" @click="closeModal" />
    </div>

    <div v-if="typeName === 'tiezhi'" class="content">
      <div class="image-marker-list">
        <div
          v-for="item in imageMarkers"
          :key="item.name"
          class="image-marker-list-item"
        >
          <p>{{ item.name }}</p>
          <div class="list-item_value">
            <div
              v-for="itemName in item.children"
              :key="itemName.src"
              class="image-marker"
              @dblclick="selectTiezhiIcon(itemName.src)"
            >
              <img :src="itemName.src" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="typeName === 'mark'" class="content">
      <div v-for="item in markIcons" :key="item.type" class="mark-block">
        <p>{{ item.typeName }}</p>
        <div class="mark-list">
          <div
            v-for="itemName in item.icons"
            :key="itemName.icon"
            class="mark-icon-item"
            @dblclick="selectTiezhiIcon({ ...itemName, type: item.type })"
          >
            <svg aria-hidden="true" width="24" height="24">
              <use :xlink:href="`#${itemName.icon}`" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.tiezhi-iconselect-modal {
  position: fixed;
  top: 80px;
  right: 100px;
  background: #fff;
  width: 290px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 0px 18px 5px rgba(0,0,0,0.1);
  .modal-title {
    display: flex;
    height: 42px;
    border-bottom: 1px solid #f1f1f1;
    justify-content: space-between;
    padding: 0 12px;
    align-items: center;
    i {
      color: #999;
      cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
      font-size: 18px;
    }
    .ul-type {
      span {
        display: inline-block;
        padding: 0 20px;
        line-height: 22px;
        border-radius: 4px;
        margin-right: 12px;
        &.active {
          background-color: rgb(242,242,242);
        }
        cursor: pointer;
        i {
          color: #000;
          text-align: center;
          font-size: 16px;
          position: relative;
          top: 2px;
        }
      }
      em {
        font-size: 12px;
        color: #999;
        font-weight: normal;
        font-style: normal;
        transform: scale(.8);
        position: relative;
        left: -5px;
        top: 4px;
        display: inline-block;
        letter-spacing: 1px;
      }
    }
  }
  .content {
    height: 560px;
    padding: 20px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .image-marker-list {
      &-item {
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        p {
          font-size: 13px;
          color: #1D1F20;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .list-item_value {
          display: flex;
          flex-wrap: wrap;
          .image-marker {
            width: 20%;
            border-radius: 4px;
            margin-top: 6px;
            &:hover {
              background: rgb(242,242,242);
            }
            img {
              height: 42px;
              display: block;
              margin: 0 auto;
              cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
            }
          }
        }
      }
    }
    .mark-block {
      margin-bottom: 12px;
      p {
        color: #1D1F20;
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 8px;
        user-select: none;
      }
      .mark-list {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        .mark-icon-item {
          margin: 2px 4px;
          cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
        }
      }
    }
  }
}
</style>
