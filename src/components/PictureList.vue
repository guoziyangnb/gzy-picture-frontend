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
              <a-space @click="(e: any) => doSearch(picture, e)">
                <SearchOutlined />
                搜索
              </a-space>
              <a-space @click="(e: any) => doEdit(picture, e)">
                <EditOutlined />
                编辑
              </a-space>
              <a-space @click="(e: any) => doDelete(picture, e)">
                <DeleteOutlined />
                删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/service/api/pictureController'
import { message } from 'ant-design-vue'

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
</script>

<style lang="scss" scoped></style>
