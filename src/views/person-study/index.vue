<template>
  <NSpace vertical size="large">
    <NLayout has-sider sider-placement="right">
      <NLayout style="max-height: 320px" />
      <NLayoutSider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="240"
        :native-scrollbar="false" style="max-height: 320px">
        <NMenu :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
      </NLayoutSider>
    </NLayout>
  </NSpace>
</template>

<script lang="ts" setup>
import { h, Component } from 'vue'
import { NIcon, NSpace, NLayout, NLayoutSider, NMenu } from 'naive-ui'
import {
  BookOutline as BookIcon
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '推荐题目列表',
    key: 'dance-dance-dance',
    icon: renderIcon(BookIcon),
    children: [
      {
        type: 'group',
        label: '知识点',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator'
          },
          {
            label: '羊男',
            key: 'sheep-man'
          }
        ]
      }
    ]
  }
]

</script>
