<script setup lang="ts">
import BasicLayout from '@/layout/BasicLayout.vue'
// import { healthUsingGet } from '@/service/api/mainController'
import { useLocaleStore } from './stores/useLocaleStore'

// 国际化设置
// import locales from '@/config/index'
// import dayjs from 'dayjs'
// import 'dayjs/locale/zh-cn'
// import { ref, watch } from 'vue'

// // 设置 dayjs 默认语言为中文
// dayjs.locale('zh-cn')

// //监听当前的语言选择
// const appLocale = ref(locales.enUS)
// watch(appLocale, (val) => {
//   dayjs.locale(val.locale)
// })

//接口测试
// healthUsingGet().then((res) => {
//   console.log(res)
// })

const localeStore = useLocaleStore()
</script>

<template>
  <!-- a-config-provider :locale="zhCN" 设置组件，可以设置语言、主题等 -->
  <a-config-provider :locale="localeStore.appLocale">
    <div id="app">
      <BasicLayout />
    </div>
  </a-config-provider>
</template>

<style>
/* #app {
  height: 100%;
} */
</style>
