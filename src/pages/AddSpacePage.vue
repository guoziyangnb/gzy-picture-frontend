<template>
  <div id="addSpacePage">
    <h1 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改空间' : '创建空间' }}
    </h1>

    <!-- 这里必须要指定name，跟model一样，包括里面的<a-form-item></a-form-item>,否则上传的值会有点问题 -->
    <a-form name="spaceForm" layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间名称" />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请输入空间级别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button
          class="foot-btn"
          type="primary"
          :loading="loading"
          html-type="submit"
          style="width: 100%"
          >{{ route.query?.id ? '编辑' : '创建' }}</a-button
        >
      </a-form-item>
      <a-card title="空间级别介绍">
        <a-typography-paragraph>
          * 目前仅支持开通普通版，如需升级空间，请联系
          <a href="https://codefather.cn" target="_blank">程序员鱼皮</a>。
        </a-typography-paragraph>
        <a-typography-paragraph v-for="spaceLevel in spaceLevelList" :key="spaceLevel.value">
          {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}, 数量
          {{ spaceLevel.maxCount }}
        </a-typography-paragraph>
      </a-card>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  editSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
} from '@/service/api/spaceController'
import { SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { formatSize } from '@/utils/index'

const space = ref<API.SpaceVO>()
const spaceForm = reactive<API.SpaceAddRequest | API.SpaceEditRequest>({})
const loading = ref(false)

// 用来跳转路由，beforEach等用的
const router = useRouter()

const spaceLevelList = ref<API.SpaceLevel[]>([])

// 获取空间级别
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
    console.log('🚀 ~ fetchSpaceLevelList ~ spaceLevelList:', spaceLevelList)
  } else {
    message.error('加载空间级别失败，' + res.data.message)
  }
}

onMounted(() => {
  fetchSpaceLevelList()
})

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const spaceId = space.value?.id
  loading.value = true
  let res
  if (spaceId) {
    res = await editSpaceUsingPost({
      id: spaceId,
      ...spaceForm,
    })
  } else {
    res = await addSpaceUsingPost({
      ...spaceForm,
    })
  }
  if (res.data.code === 0 && res.data.data) {
    message.success(spaceId ? '更新空间成功' : '创建空间成功')
    // 跳转到空间详情页
    router.push({
      path: `/space/${spaceId ?? res.data.data}`,
    })
  } else {
    message.error(spaceId ? '更新空间失败:' : '创建空间失败' + res.data.message)
  }
  loading.value = false
}

// 获取页面信息，比如页面路由、页面的元信息
const route = useRoute()

// 获取空间的数据
const getOldSpace = async () => {
  // 获取数据
  const id = route.query?.id
  if (id) {
    const res = await getSpaceVoByIdUsingGet({
      id: id as string,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      space.value = data
      // 填充表单
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
    }
  }
}

onMounted(() => {
  getOldSpace()
})
</script>

<style lang="scss" scoped>
#addSpacePage {
  padding: 20px;
  max-width: 720px;
  margin: 0 auto;
  .foot-btn {
    margin-bottom: 28px;
  }
}
</style>
