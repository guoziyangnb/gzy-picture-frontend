<template>
  <div id="mySpace">
    <p>正在跳转，请稍候...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listSpaceVoByPageUsingPost } from '@/service/api/spaceController'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { SPACE_TYPE_ENUM } from '@/constants/space'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 检查用户是否有个人空间
const checkUserSpace = async () => {
  /**
   *   
   * 先梳理业务流程，跳转到该页面时：
      - 用户未登录，则直接跳转到登录页面
      - 如果用户已登录，会获取该用户已创建的空间
      - 如果有，则进入第一个空间
      - 如果没有，则跳转到创建空间页面
   */
  const loginUser = loginUserStore.loginUser
  // 用户未登录跳转到登录页
  if (!loginUser?.id) {
    router.replace('/user/login')
    return
  }
  // 获取用户空间信息
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
    spaceType: SPACE_TYPE_ENUM.PRIVATE, // 默认是私有空间
  })
  if (res.data.code === 0) {
    if ((res.data.data?.records?.length as number) > 0) {
      // 如果有进入到第一个空间
      const space = res.data.data.records[0]
      router.replace(`/space/${space.id}`)
    } else {
      // 没有就创建空间
      router.replace('/add_space')
      message.warn('请先创建空间')
    }
  } else {
    message.error('加载我的空间失败，' + res.data.message)
  }
}

// 在页面加载时检查用户空间
onMounted(() => {
  checkUserSpace()
})
</script>
