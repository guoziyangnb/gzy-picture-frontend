import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/userLoginPage.vue'
import UserRegisterPage from '@/pages/user/userRegisterPage.vue'
import UserManagePage from '@/pages/admin/userManagePage.vue'
import PictureManagePage from '@/pages/admin/pictureManagePage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'

// 懒加载
const AddPicturePage = () => import('@/pages/AddPicturePage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicturePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      //这种写法是按需懒加载的形式，是优化首次打开站点的性能方式
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
