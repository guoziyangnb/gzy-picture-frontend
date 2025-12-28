<!-- 图片列表组件 -->
<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 5 }"
      :data-source="props.dataList"
      :loading="props.loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="display: flex; justify-content: center">
          <!-- 单张图片 -->
          <a-card hoverable style="width: 300px" @click="doClickPicture(picture)">
            <template #cover>
              <!-- object-fit: cover 表示图片展示的时候自适应展示 -->
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                loading="lazy"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <!-- <a-flex></a-flex> flex标签组件 -->
                <a-flex>
                  <!-- 分类 -->
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <!-- 标签 -->
                  <a-tag v-for="tag in picture.tags" :key="tag" color="blue">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <a-tooltip
                v-for="action in actions"
                :key="action.key"
                :color="action.color || 'blue'"
              >
                <template #title>{{ action.label }}</template>
                <component :is="action.icon" @click="(e: any) => action.handler(picture, e)" />
              </a-tooltip>
              <!-- <a-tooltip color="blue">
                <template #title>分享</template>
                <ShareAltOutlined @click="(e: any) => doShare(picture, e)" />
              </a-tooltip>
              <a-tooltip color="blue">
                <template #title>搜索</template>
                <SearchOutlined @click="(e: any) => doSearch(picture, e)" />
              </a-tooltip>
              <a-tooltip color="blue">
                <template #title>编辑</template>
                <EditOutlined @click="(e: any) => doEdit(picture, e)" />
              </a-tooltip>
              <a-tooltip color="blue">
                <template #title>删除</template>
                <DeleteOutlined @click="(e: any) => doDelete(picture, e)" />
              </a-tooltip> -->
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/service/api/pictureController'
import { message } from 'ant-design-vue'
import ShareModal from './ShareModal.vue'
import { ref } from 'vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [], // 列表的默认值必须是箭头函数形式
  loading: false,
  showOp: true,
})

// 定义操作按钮配置
const actions = [
  {
    key: 'share',
    label: '分享',
    icon: ShareAltOutlined,
    color: 'blue',
    handler: (picture: API.PictureVO, e: PointerEvent) => doShare(picture, e),
  },
  {
    key: 'search',
    label: '搜索',
    icon: SearchOutlined,
    color: 'blue',
    handler: (picture: API.PictureVO, e: PointerEvent) => doSearch(picture, e),
  },
  {
    key: 'edit',
    label: '编辑',
    icon: EditOutlined,
    color: 'blue',
    handler: (picture: API.PictureVO, e: PointerEvent) => doEdit(picture, e),
  },
  {
    key: 'delete',
    label: '删除',
    icon: DeleteOutlined,
    color: 'blue',
    handler: (picture: API.PictureVO, e: PointerEvent) => doDelete(picture, e),
  },
]

const router = useRouter()
// 跳转至图片详情
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// 搜索
// 点击事件的 e 是 PointerEvent 类型
const doSearch = (picture: API.PictureVO, e: PointerEvent) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
}

// 编辑
const doEdit = (picture: API.PictureVO, e: PointerEvent) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除
const doDelete = async (picture: API.PictureVO, e: PointerEvent) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 让外层刷新
    props?.onReload?.()
  } else {
    message.error('删除失败')
  }
}

// -------------分享操作-----------------------
// 分享弹窗引用
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()

// 分享
const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  // 打开分享弹窗
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}
</script>

<style lang="scss" scoped></style>
