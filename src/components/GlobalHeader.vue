<template>
  <div id="globalHeader">
    <!--这是ant design响应式布局，左右固定，中间响应式展示-->
    <a-row :wrap="false">
      <a-col flex="200px">
        <!--其中，RouterLink 组件的作用是支持超链接跳转(不刷新页面)，是vue-router自带的组件-->
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.jpg" alt="logo" />
            <div class="title">阳神云图库</div>
          </div>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="250px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <!-- a-dropdown组件有点问题，他不能有多个元素，所以需要把多余的用<a-space>组件抱起来 -->
              <a-space>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
          <div class="language-selector">
            <a-dropdown-button type="primary" :trigger="['click']" @click.prevent>
              {{ localeStore.languageName }}
              <template #overlay>
                <a-menu @click="doLanguageChange">
                  <a-menu-item
                    v-for="locale in Object.keys(LOCALE_ENUM)"
                    :key="locale"
                    @click="doLanguageChange(locale)"
                  >
                    {{ LOCALE_ENUM[locale] }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined, InsertRowAboveOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/service/api/userController'
import { message } from 'ant-design-vue'
import { computed } from 'vue'
import { useLocaleStore } from '@/stores/useLocaleStore'
import type { SupportedLocaleKey } from '@/stores/useLocaleStore'
import LOCALE_ENUM from '@/config/localeEnum'

const router = useRouter() //路由对象
const loginUserStore = useLoginUserStore() // 登录用户状态
loginUserStore.fetchLoginUser() // 获取登录用户信息
const localeStore = useLocaleStore() // 语言状态

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

//原始菜单数据
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片',
  },
  {
    key: '/admin/userManage',
    icon: () => h(InsertRowAboveOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
]

// 过滤菜单数据
const filterItems = (items = [] as MenuProps['items']) => {
  return items?.filter((item) => {
    // 过滤掉不需要显示的菜单
    if (
      item?.key?.toString().startsWith('/admin') &&
      loginUserStore.loginUser.userRole !== 'admin'
    ) {
      return false
    }
    return true
  })
}

// 处理后的菜单数据
const items = computed(() => filterItems(originItems))

// 菜单路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 退出登录
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  // console.log(res)
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login') //这是一个异步事件
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}

// 切换语言
const doLanguageChange: MenuProps['onClick'] = ({ key }) => {
  localeStore.setLocale(key as SupportedLocaleKey)
}
</script>

<style lang="scss" scoped>
#globalHeader {
  .title-bar {
    display: flex;
    align-items: center;
    .title {
      color: black;
      font-size: 18px;
      margin-left: 16px;
    }

    .logo {
      height: 48px;
    }
  }

  .user-login-status {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .language-selector {
      margin-left: 16px;
    }
  }
}
</style>
