import { h } from 'vue'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/userLoginPage.vue'
import UserRegisterPage from '@/pages/user/userRegisterPage.vue'
import UserManagePage from '@/pages/admin/userManagePage.vue'
import PictureManagePage from '@/pages/admin/pictureManagePage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
import ACCESS_ENUM from '@/access/accessEnum'
import { HomeOutlined, InsertRowAboveOutlined, FileImageOutlined } from '@ant-design/icons-vue'

// 懒加载
const AddPicturePage = () => import('@/pages/AddPicturePage.vue')

export const routes = [
  {
    path: '/',
    name: '主页',
    component: HomePage,
    meta: {
      menuOrder: 1,
      icon: () => h(HomeOutlined),
    },
  },
  {
    path: '/add_picture',
    name: '创建图片',
    component: AddPicturePage,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/user/login',
    name: '用户登录',
    component: UserLoginPage,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/user/register',
    name: '用户注册',
    component: UserRegisterPage,
    meta: {
      hideInMenu: true, // 菜单项需要隐藏的
    },
  },
  {
    path: '/admin/userManage',
    name: '用户管理',
    component: UserManagePage,
    meta: {
      menuOrder: 2,
      access: ACCESS_ENUM.ADMIN, //该菜单项需要管理员权限的
      icon: () => h(InsertRowAboveOutlined),
    },
  },
  {
    path: '/admin/pictureManage',
    name: '图片管理',
    component: PictureManagePage,
    meta: {
      menuOrder: 3,
      access: ACCESS_ENUM.ADMIN,
      icon: () => h(FileImageOutlined),
    },
  },
  {
    path: '/picture/:id',
    name: '图片详情',
    component: PictureDetailPage,
    props: true, //这样可以直接通过props.id获取到url上的动态id的信息了
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/others',
    name: '编程导航',
    //这种写法是按需懒加载的形式，是优化首次打开站点的性能方式
    // component: () => import('../views/AboutView.vue'),
    meta: {
      menuOrder: 999,
      label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    },
  },
]
