<template>
  <div id="userManagePage">
    <a-flex justify="space-between" style="margin-top: -20px">
      <h2>图片管理</h2>
      <a-button type="primary" href="/add_picture" target="_blank">+ 创建图片</a-button>
    </a-flex>

    <!-- 搜索框 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称、简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="类型">
        <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
      </a-form-item>
      <a-form-item label="标签">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          style="min-width: 180px"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 10px"></div>

    <!-- 表格 -->
    <!-- :scroll="{ x: 'max-content' }" -->
    <!-- 表格宽度自适应 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableCahnge"
    >
      <!-- 自定义表格内容 -->
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'tags'">
          <span>
            <TagOutlined />
            标签
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <CaretDownOutlined />
            操作
          </span>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="120" />
        </template>
        <template v-else-if="column.dataIndex === 'tags'">
          <a-space nowrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag" color="blue">{{
              tag
            }}</a-tag>
          </a-space>
        </template>
        <!-- 图片信息 -->
        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽高：{{ record.picWidth }}px × {{ record.picHeight }}px</div>
          <div>宽高比{{ record.picScale }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) }} KB</div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button :href="`/add_picture?id=${record.id}`" target="_blank">编辑</a-button>
            <a-button danger @click="doDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { TagOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { deletePictureUsingPost, listPictureByPageUsingPost } from '@/service/api/pictureController'
import { ref, reactive, onMounted, computed } from 'vue'
import dayjs from 'dayjs'

//表格列名
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

// 表格分页
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true, // 显示可改变每页条数
    showTotal: (total: Number) => `共 ${total} 条`, // 显示总条数
  }
})

// 表格变化时请求数据
const doTableCahnge = (page: any, filters: any, sorter: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
// 获取数据
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 删除数据
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>

<style lang="scss" scoped>
#userManagePage {
  padding: 20px;
}
</style>
