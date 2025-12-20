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
        :items="menuItems"
        :style="{ height: '100%', borderRight: 0 }"
        @click="doMenuClick"
      >
      </a-menu>
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { ref, h, watch } from 'vue'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const router = useRouter() //路由对象
const loginUserStore = useLoginUserStore() // 登录用户状态
loginUserStore.fetchLoginUser() // 获取登录用户信息

// 原始菜单数据
const menuConfig = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
    title: '公共图库',
    matchRoutes: ['/'], // 匹配的路由
  },
  {
    key: '/my_space',
    icon: () => h(UserOutlined),
    label: '我的空间',
    title: '我的空间',
    // 匹配/my_space、/space/:id、/add_space这些路由
    matchRoutes: ['/my_space', '/space', '/add_space'],
  },
]

// 提取a-menu需要的items（过滤掉自定义的matchRoutes）
const menuItems = menuConfig.map((item) => {
  const { matchRoutes, ...menuItem } = item
  return menuItem
})

// 当前选中菜单
const current = ref<string[]>([])
// 定义匹配菜单的方法
const matchMenuKey = (path: string) => {
  // 遍历菜单配置，找到当前路径匹配的菜单key
  for (const menu of menuConfig) {
    // 匹配规则：
    // 1. 路径完全等于matchRoutes中的某一项
    // 2. 路径以matchRoutes中的某一项开头（处理/space/:id这种动态路由）
    const isMatch = menu.matchRoutes.some((route) => path === route || path.startsWith(`${route}/`))
    if (isMatch) {
      return menu.key
    }
  }
  return '' // 无匹配返回空
}

// 监听路由变化，更新当前选中菜单
router.afterEach((to) => {
  const matchedKey = matchMenuKey(to.path)
  current.value = matchedKey ? [matchedKey] : []
})

// 额外：监听loginUser变化（防止用户登录后路由已在/space/:id，但菜单未高亮）
watch(
  () => loginUserStore.loginUser.id,
  () => {
    const matchedKey = matchMenuKey(router.currentRoute.value.path)
    current.value = matchedKey ? [matchedKey] : []
  },
  { immediate: true },
)

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
