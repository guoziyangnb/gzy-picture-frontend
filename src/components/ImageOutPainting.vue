<template>
  <a-modal
    width="800px"
    class="image-out-painting"
    v-model:visible="visible"
    title="AI 扩图"
    :footer="false"
    @cancel="closeModal"
  >
    <a-row gutter="16" justify="center">
      <a-col span="12">
        <h4>原始图片</h4>
        <a-image
          :src="picture?.url"
          :alt="picture?.name"
          style="max-width: 100%; border-radius: 8px"
        />
      </a-col>
      <a-col span="12">
        <h4>扩图结果</h4>
        <a-image
          v-if="!!!taskId && !resultImageUrl && resultImageUrl !== ''"
          :src="ERROR_PICTURE"
          alt="扩图结果"
          style="max-width: 100%; border-radius: 8px"
        ></a-image>
        <div v-if="!!taskId" class="lottie-loader">
          <Vue3Lottie :animationData="AstronautJSON" :height="400" :width="400" />
        </div>
        <a-image
          v-if="resultImageUrl"
          :src="resultImageUrl"
          :alt="picture?.name"
          style="max-width: 100%; border-radius: 8px"
        />
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex gap="16" justify="center">
      <!-- !!taskId 两个！转换成boolean值 -->
      <a-button type="primary" :loading="!!taskId" ghost @click="createTask">生成图片</a-button>
      <a-button v-if="resultImageUrl" type="primary" :loading="uploadLoading" @click="handleUpload"
        >应用结果</a-button
      >
    </a-flex>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import {
  uploadPictureByUrlUsingPost,
  createPictureOutPaintingTaskRequestUsingPost,
  getPictureOutPaintingTaskUsingGet,
} from '@/service/api/pictureController'
import { message } from 'ant-design-vue'
import { Vue3Lottie } from 'vue3-lottie'
import AstronautJSON from '@/assets/lottie/loading.json'
import { ERROR_PICTURE } from '@/constants/picture'

interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

//-----------------生成图片-----------------
// 生成图的url
const resultImageUrl = ref<string>()
// 任务 id
const taskId = ref<string | null>()

/**
 * 创建任务
 */
const createTask = async () => {
  if (!props.picture?.id) {
    return
  }
  const res = await createPictureOutPaintingTaskRequestUsingPost({
    pictureId: props.picture.id,
    // 可以根据需要设置扩图参数
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建任务成功，请耐心等待，不要退出界面')
    taskId.value = res.data.data.output?.taskId
    // 开启轮询
    startPolling()
  } else {
    message.error('创建任务失败，' + res.data.data?.message)
  }
}

// 轮询定时器
// ? 浏览器环境用 ReturnType<typeof setInterval>
// ? node环境用 NodeJS.Timeout
let pollingTimer: ReturnType<typeof setInterval> | null = null

// 清理轮询定时器
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
}

// 开始轮询
const startPolling = () => {
  if (!taskId.value) return

  pollingTimer = setInterval(async () => {
    try {
      const res = await getPictureOutPaintingTaskUsingGet({
        taskId: taskId.value as string,
      })
      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output
        if (taskResult?.taskStatus === 'SUCCEEDED') {
          message.success('扩图任务成功')
          resultImageUrl.value = taskResult.outputImageUrl
          // 清理轮询
          clearPolling()
        } else if (taskResult?.taskStatus === 'FAILED') {
          message.error('扩图任务失败:' + taskResult?.message)
          // 清理轮询
          clearPolling()
        }
      }
    } catch (error) {
      console.error('轮询任务状态失败', error)
      message.error('检测任务状态失败，请稍后重试' + error)
      clearPolling()
    }
  }, 3000) // 每隔 3 秒轮询一次
}

// 清理定时器，避免内存泄漏
onUnmounted(() => {
  clearPolling()
})

// --------------应用结果按钮-------------------
const uploadLoading = ref<boolean>(false)

const handleUpload = async () => {
  uploadLoading.value = true
  try {
    const params: API.PictureUploadRequest = {
      fileUrl: resultImageUrl.value,
      spaceId: props.spaceId,
    }
    if (props.picture) {
      params.id = props.picture.id //这个要指定的，又可能是编辑图片
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      // 关闭弹窗
      closeModal()
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (e: any) {
    console.error('图片上传失败', e)
    message.error('图片上传失败', e)
  } finally {
    uploadLoading.value = false
  }
}

// 是否可见
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
}

// 暴露函数给父组件
defineExpose({
  openModal,
})
</script>

<style lang="scss">
.image-out-painting {
  text-align: center;
}
</style>
