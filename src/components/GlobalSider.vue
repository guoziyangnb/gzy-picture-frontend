<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      width="200"
      style="background: #fff"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="originItems"
        @click="doMenuClick"
        :style="{ height: '100%', borderRight: 0 }"
      >
      </a-menu>
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { ref, h } from 'vue'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const router = useRouter() //路由对象
const loginUserStore = useLoginUserStore() // 登录用户状态
loginUserStore.fetchLoginUser() // 获取登录用户信息

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 原始菜单数据
const originItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
    title: '公共图库',
  },
  {
    key: '/my_space',
    icon: () => h(UserOutlined),
    label: '我的空间',
    title: '我的空间',
  },
]

// 菜单路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}
</script>

<style lang="scss" scoped>
#globalSider {
  .ant-layout-sider {
    background: none;
  }
}
</style>
