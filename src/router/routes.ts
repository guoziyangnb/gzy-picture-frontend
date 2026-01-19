import { h } from 'vue'
import {
  HomeOutlined,
  InsertRowAboveOutlined,
  FileImageOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/userLoginPage.vue'
import UserRegisterPage from '@/pages/user/userRegisterPage.vue'
import UserManagePage from '@/pages/admin/userManagePage.vue'
import PictureManagePage from '@/pages/admin/pictureManagePage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
import ACCESS_ENUM from '@/access/accessEnum'
import SpaceManagePage from '@/pages/admin/spaceManagePage.vue'
import SpaceDetailPage from '@/pages/SpaceDetailPage.vue'

// 懒加载
const AddPicturePage = () => import('@/pages/AddPicturePage.vue')
const AddPictureBatchPage = () => import('@/pages/AddPictureBatchPage.vue')
const AddSpacePage = () => import('@/pages/AddSpacePage.vue')
const MySpacePage = () => import('@/pages/MySpacePage.vue')
const SearchPicturePage = () => import('@/pages/SearchPicturePage.vue')
const SpaceAnalyzePage = () => import('@/pages/SpaceAnalyzePage.vue')
const SpaceUserManagePage = () => import('@/pages/admin/spaceUserManagePage.vue')

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
      menuOrder: 3,
      access: ACCESS_ENUM.USER,
      icon: () => h(FileImageOutlined),
    },
  },
  {
    path: '/add_picture/batch',
    name: '批量创建图片',
    component: AddPictureBatchPage,
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
      menuOrder: 4,
      access: ACCESS_ENUM.ADMIN,
      icon: () => h(FileImageOutlined),
    },
  },
  {
    path: '/add_space',
    name: '创建空间',
    component: AddSpacePage,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/my_space',
    name: '我的空间',
    component: MySpacePage,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/admin/spaceManage',
    name: '空间管理',
    component: SpaceManagePage,
    meta: {
      menuOrder: 5,
      access: ACCESS_ENUM.ADMIN,
      icon: () => h(TeamOutlined),
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
    path: '/search_picture',
    name: '图片搜索',
    component: SearchPicturePage,
    props: true, //这样可以直接通过props.id获取到url上的动态id的信息了
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/space/:id',
    name: '空间详情',
    component: SpaceDetailPage,
    props: true,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/space_analyze',
    name: '空间分析',
    component: SpaceAnalyzePage,
    props: true,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/spaceUserManage/:id',
    name: '空间成员管理',
    component: SpaceUserManagePage,
    props: true,
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
