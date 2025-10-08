<template>
  <div id="addPictureBatchPage">
    <h2 style="margin-bottom: 16px">批量创建图片</h2>

    <!-- 这里必须要指定name，跟model一样，包括里面的<a-form-item></a-form-item>,否则上传的值会有点问题 -->
    <a-form name="formData" layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="关键词" name="searchText">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" />
      </a-form-item>
      <a-form-item label="抓取数量" name="count">
        <a-input-number
          v-model:value="formData.count"
          placeholder="请输入数量"
          style="min-width: 325px"
          :min="1"
          :max="30"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="名称前缀" name="namePrefix">
        <a-input v-model:value="formData.namePrefix" placeholder="请输入名称前缀，会自动补充序号" />
      </a-form-item>
      <!-- <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="formData.category"
          :options="categoryOptions"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="formData.tags"
          mode="tags"
          :options="tagOptions"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item> -->
      <a-form-item>
        <a-button
          class="foot-btn"
          type="primary"
          html-type="submit"
          style="width: 100%"
          :loading="loading"
          >批量创建</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { uploadPictureByBatchUsingPost } from '@/service/api/pictureController.ts'

const formData = reactive<API.PictureUploadByBatchRequest>({
  count: 10,
})
const loading = ref(false)

// 用来跳转路由，beforEach等用的
const router = useRouter()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async () => {
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success(`成功批量创建图片${res.data.data}张`)
    // 跳转到主页
    router.push({
      path: `/`,
    })
  } else {
    message.error('批量创建图片失败，' + res.data.message)
  }
  loading.value = false
}

// // 标签和分类选项
// const categoryOptions = ref<tagCategoryList[]>([])
// const tagOptions = ref<tagCategoryList[]>([])
// interface tagCategoryList {
//   value?: string
//   label?: string
// }
// // 获取标签和分类选项
// const getTagCategoryOptions = async () => {
//   const res = await listPictureTagCategoryUsingGet()
//   if (res.data.code === 0 && res.data.data) {
//     // 转换成下拉选项组件接受的格式
//     tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
//       return {
//         value: data,
//         label: data,
//       }
//     })
//     categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
//       return {
//         value: data,
//         label: data,
//       }
//     })
//   } else {
//     message.error('加载选项失败，' + res.data.message)
//   }
// }

// onMounted(() => {
//   getTagCategoryOptions()
// })
</script>

<style lang="scss" scoped>
#addPictureBatchPage {
  padding: 20px;
  max-width: 720px;
  margin: 0 auto;
  .foot-btn {
    margin-bottom: 28px;
  }
}
</style>
