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
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [], // 列表的默认值必须是箭头函数形式
  loading: false,
})

const router = useRouter()
// 跳转至图片详情
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<style lang="scss" scoped></style>
