<script setup lang="ts">
import "@/assets/text/text.css"
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme } = useTheme()
const { language } = useLanguage()

const themeOverrides = {
  common: {
    primaryColor: 'rgba(3, 34, 81, 1)',
  }
}
</script>

<template>
  <NConfigProvider class="h-full" :theme="theme" :theme-overrides="themeOverrides" :locale="language">
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>

<style>
* {
  font-family: "PingFang", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
}
</style>