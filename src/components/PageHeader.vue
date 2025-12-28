<template>
  <div id="globalHeader">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回"
      sub-title=""
      @back="goBack"
    />
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter() //路由对象
const goBack = () => {
  router.go(-1)
  // router.back() //返回上一页
}
</script>
