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
import { ref, h, watch, computed, watchEffect } from 'vue'
import { PictureOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { SPACE_TYPE_ENUM } from '@/constants/space'
import { message } from 'ant-design-vue'
import { listMyTeamSpaceUsingPost } from '@/service/api/spaceUserController'

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
    matchRoutes: ['/my_space', '/space', '/add_picture', '/picture'],
  },
  {
    key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
    icon: () => h(TeamOutlined),
    label: '创建团队',
    title: '创建团队',
    matchRoutes: ['/add_space'],
  },
]

const teamSpaceList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  // 没有团队空间，只展示固定菜单
  if (teamSpaceList.value.length < 1) {
    return menuConfig
  }
  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
      title: space?.spaceName,
      matchRoutes: ['/space/' + spaceUser.spaceId],
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }
  return [...menuConfig, teamSpaceMenuGroup]
})

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载我的团队空间失败，' + res.data.message)
  }
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

// // 提取a-menu需要的items（过滤掉自定义的matchRoutes）
// const menuItems = finalItems.value.map((item) => {
//   const { matchRoutes, ...menuItem } = item
//   return menuItem
// })

// 当前选中菜单
const current = ref<string[]>([])
// // 定义匹配菜单的方法
// const matchMenuKey = (path: string) => {
//   // 遍历菜单配置，找到当前路径匹配的菜单key
//   for (const menu of menuConfig) {
//     // 匹配规则：
//     // 1. 路径完全等于matchRoutes中的某一项
//     // 2. 路径以matchRoutes中的某一项开头（处理/space/:id这种动态路由）
//     const isMatch = menu.matchRoutes.some((route) => path === route || path.startsWith(`${route}/`))
//     if (isMatch) {
//       return menu.key
//     }
//   }
//   return '' // 无匹配返回空
// }

// 监听路由变化，更新当前选中菜单
router.afterEach((to) => {
  // const matchedKey = matchMenuKey(to.path)
  // current.value = matchedKey ? [matchedKey] : []
  current.value = [to.path]
})

// // 额外：监听loginUser变化（防止用户登录后路由已在/space/:id，但菜单未高亮）
// watch(
//   () => loginUserStore.loginUser.id,
//   () => {
//     const matchedKey = matchMenuKey(router.currentRoute.value.path)
//     current.value = matchedKey ? [matchedKey] : []
//   },
//   { immediate: true },
// )

// 菜单路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  // router.push({
  //   path: key,
  // })
  router.push(key) //否则无法携带参数跳转,不然要多加一个query麻烦
}
</script>

<style lang="scss" scoped>
#globalSider {
  .ant-layout-sider {
    background: none;
  }
}
</style>
