<!-- /**
  sm：小屏幕设备（如平板），对应屏幕宽度 ≥ 576px
  md：中等屏幕设备（如小桌面），对应屏幕宽度 ≥ 768px
  xl：超大屏幕设备（如大桌面），对应屏幕宽度 ≥ 1200px
  :sm="24" 表示在小屏幕设备上，这个 a-col 占满整个行（24 格，Ant Design 栅格系统默认一行分为 24 格）
*/ -->
<template>
  <div id="PictureDetailPage">
    <a-row :gutter="[16, 16]">
      <!-- 图片展示区 -->
      <a-col :sm="24" :md="16" :xl="18" class="picture-preview">
        <a-card title="图片预览">
          <a-image style="max-height: 600px; object-fit: contain" :src="picture.url" />
        </a-card>
      </a-col>
      <!-- 图片信息区 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name ?? '未命名' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              <a-tag color="green">{{ picture.category ?? '默认' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag" color="blue">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
          </a-descriptions>
          <!-- 图片操作 -->
          <a-space wrap>
            <a-button type="primary" @click="doDownload">
              免费下载
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>

            <a-button
              v-if="canReview"
              :icon="h(EditOutlined)"
              danger
              type="primary"
              @click="handleReview(picture, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              撤销审核
            </a-button>
            <a-button v-if="canEdit" :icon="h(EditOutlined)" type="default" @click="doEdit">
              编辑
            </a-button>
            <a-button v-if="canEdit" :icon="h(DeleteOutlined)" danger @click="doDelete">
              删除
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { message } from 'ant-design-vue'
import {
  deletePictureUsingPost,
  getPictureVoByIdUsingGet,
  doPictureReviewUsingPost,
} from '@/service/api/pictureController.ts'
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { downloadImage, formatSize } from '@/utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import router from '@/router'
import { PIC_REVIEW_STATUS_ENUM } from '@/constants/picture'

interface Props {
  id: string | number
}

const props = defineProps<Props>()
const picture = ref<API.PictureVO>({})

// 获取图片详情
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props?.id as number,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchPictureDetail()
})

const loginUserStore = useLoginUserStore()
// 是否具有编辑权限
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  // 未登录不可编辑
  if (!loginUser.id) {
    return false
  }
  // 仅本人或管理员可编辑
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

// 是否具有编辑权限
const canReview = computed(() => {
  const loginUser = loginUserStore.loginUser
  // 未登录不可编辑
  if (!loginUser.id) {
    return false
  }
  if (!picture.value.spaceId) {
    // 管理员且审核通过可编辑
    return loginUser.userRole === 'admin' && picture.value.reviewStatus === 1
  } else {
    return false
  }
})

// 编辑
const doEdit = () => {
  router.push({
    path: '/add_picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}
// 删除
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
}

// 处理下载
const doDownload = () => {
  downloadImage(picture.value.url, picture.value?.name) //webpack打包后，无法使用window.open，使用downloadImage方法下载图片
  // window.open(picture.value.url) 原生方法，适用于电脑端
}

// 撤销操作
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage = '图片有问题，管理员撤销审核'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0) {
    message.success('撤销操作成功')
    // 重新获取详细数据
    fetchPictureDetail()
  } else {
    message.error('撤销操作失败，' + res.data.message)
  }
}
</script>

<style lang="scss" scoped>
#PictureDetailPage {
  padding: 16px;
  // padding-bottom: 64px;
}
:deep(.picture-preview .ant-card-body) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
