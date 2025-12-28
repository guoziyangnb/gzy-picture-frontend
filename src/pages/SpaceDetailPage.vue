<!-- /**
  sm：小屏幕设备（如平板），对应屏幕宽度 ≥ 576px
  md：中等屏幕设备（如小桌面），对应屏幕宽度 ≥ 768px
  xl：超大屏幕设备（如大桌面），对应屏幕宽度 ≥ 1200px
  :sm="24" 表示在小屏幕设备上，这个 a-col 占满整个行（24 格，Ant Design 栅格系统默认一行分为 24 格）
*/ -->
<template>
  <div id="SpaceDetailPage">
    <!-- 空间详情展示区 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">
          + 创建图片
        </a-button>
        <a-button
          type="primary"
          style="background-color: orange"
          :icon="h(EditOutlined)"
          @click="doBatchEdit"
        >
          批量编辑</a-button
        >
        <a-tooltip
          :title="`当前占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            type="circle"
            :percent="(((space.totalSize ?? 0) * 100) / (space.maxSize ?? 1)).toFixed(2)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>

    <!-- 搜索表单 -->
    <PictureSearchForm :onSearch="onSearch" />

    <!-- 按颜色搜索 -->
    <a-form-item label="按颜色搜索" style="margin-top: 16px">
      <ColorPicker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>

    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading" :shpwOp="true" :onReload="fetchData" />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} 条/ ${space.maxCount}`"
      @change="onPageChange"
    />
    <BatchEditPictureModal
      ref="batchEditPictureModalRef"
      :spaceId="id"
      :pictureList="dataList"
      :onSuccess="onBatchEditPictureSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import { getSpaceVoByIdUsingGet } from '@/service/api/spaceController'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/service/api/pictureController'
import { formatSize } from '@/utils'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
import { EditOutlined } from '@ant-design/icons-vue'

interface Props {
  id: string | number
}

const props = defineProps<Props>()
const space = ref<API.SpaceVO>({})

// ------- 获取空间详情 --------
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props?.id as number,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
  fetchData()
})

// --------- 获取图片详情 ----------
const total = ref(0)
const loading = ref(true)
const dataList = ref<API.PictureVO[]>([])
// 搜索条件
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id as number,
    ...searchParams.value,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 搜索  -> 重置分页参数，params是子传父传过来的
const onSearch = (newSearcParams: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearcParams,
    current: 1,
  }
  fetchData()
}

// 颜色选择器
const onColorChange = async (color: string) => {
  loading.value = true
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id as number,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// -------------批量编辑图片----------------
// 分享弹窗引用
const batchEditPictureModalRef = ref()

// 批量编辑成功后，刷新数据
const onBatchEditPictureSuccess = () => {
  fetchData()
}

// 打开批量编辑弹窗
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}
</script>

<style lang="scss" scoped>
#SpaceDetailPage {
  padding: 16px;
  // padding-bottom: 64px;
}
:deep(.space-preview .ant-card-body) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
