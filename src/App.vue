<script setup lang="ts">
import BasicLayout from '@/layout/BasicLayout.vue'
import { healthUsingGet } from '@/service/api/mainController'

healthUsingGet().then((res) => {
  console.log(res)
})
</script>

<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>
<style>
/* #app {
  height: 100%;
} */
</style>
