<template>
  <div class="picture-search-form">
    <!-- 搜索框 -->
    <a-form name="searchParams" layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称、简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="searchParams.category"
          style="min-width: 180px"
          :options="categoryOptions"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          style="min-width: 180px"
          mode="tags"
          :options="tagOptions"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item>
      <a-form-item label="日期" name="dateRange">
        <a-range-picker
          style="width: 400px"
          show-time
          v-model:value="dateRange"
          :placeholder="['编辑开始时间', '编辑结束时间']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="searchParams.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-input v-model:value="searchParams.introduction" placeholder="请输入简介" allow-clear />
      </a-form-item>
      <a-form-item label="宽度" name="picWidth">
        <a-input-number v-model:value="searchParams.picWidth" />
      </a-form-item>
      <a-form-item label="高度" name="picHeight">
        <a-input-number v-model:value="searchParams.picHeight" />
      </a-form-item>
      <a-form-item label="格式" name="picFormat">
        <a-input v-model:value="searchParams.picFormat" placeholder="请输入格式" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
          <a-button type="primary" danger html-type="reset" @click="doClear">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import { listPictureTagCategoryUsingGet } from '@/service/api/pictureController'
import { message } from 'ant-design-vue'

interface Props {
  onSearch?: (searchParams: API.PictureQueryRequest) => void
}

const props = defineProps<Props>()

//---------日期----------------
const dateRange = ref<[]>([])
type RangeValue = [Dayjs, Dayjs]

/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: RangeValue, dateStrings: string[]) => {
  if (dates.length >= 2) {
    /**
     * ? 这种后端如果是Date类型的话，前端传ISO字符串就行不然报错
     * Cannot parse date "Fri Dec 19 2025 17:19:55 GMT+0800 (中国标准时间)": not compatible with any of standard forms
     *  ("yyyy-MM-dd'T'HH:mm:ss.SSSX", "yyyy-MM-dd'T'HH:mm:ss.SSS", "EEE, dd MMM yyyy HH:mm:ss zzz", "yyyy-MM-dd"))
     */
    searchParams.startEditTime = dates[0].toDate().toISOString()
    searchParams.endEditTime = dates[1].toDate().toISOString()
  } else {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }
}

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  searchText: '',
  category: '',
  tags: [],
  startEditTime: '',
  endEditTime: '',
  name: '',
  introduction: '',
  picWidth: undefined,
  picHeight: undefined,
  picFormat: '',
})

// 日期范围预设
const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

// 获取数据
const doSearch = () => {
  // 重置页码
  props?.onSearch?.(searchParams)
}

// ------------标签和分类选项---------------
const categoryOptions = ref<tagCategoryList[]>([])
const tagOptions = ref<tagCategoryList[]>([])
interface tagCategoryList {
  value?: string
  label?: string
}
// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('加载选项失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

// 清理
const doClear = () => {
  // 取消所有对象的值
  // Object.keys(searchParams).forEach((key) => {
  //   searchParams[key] = undefined
  // })
  searchParams.searchText = ''
  searchParams.category = ''
  searchParams.tags = []
  searchParams.name = ''
  searchParams.introduction = ''
  searchParams.picWidth = undefined
  searchParams.picHeight = undefined
  searchParams.picFormat = ''
  dateRange.value = []
  props.onSearch?.(searchParams)
}
</script>

<style lang="scss" scoped>
.picture-search-form {
  .ant-form-item {
    margin-top: 16px;
  }
}
</style>
