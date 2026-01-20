/**
 * 图片审核状态枚举
 */
export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0, // 待审核
  PASS: 1, // 通过
  REJECT: 2, // 拒绝
}

export const PIC_REVIEW_STATUS_MAP = {
  0: '待审核',
  1: '通过',
  2: '拒绝',
}

export const PIC_REVIEW_STATUS_OPTIONS = Object.entries(PIC_REVIEW_STATUS_MAP).map(
  ([key, label]) => {
    return {
      label,
      value: Number(key),
    }
  },
)

export const ERROR_PICTURE =
  // 'https://img2.baidu.com/it/u=3145328477,3176755321&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'

  'https://gzypicture-1339229861.cos.ap-nanjing.myqcloud.com/gzyPicture/public/1878374171889680385/2025-12-29_uv86a0yuy862ejxc.webp'

export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  ENTER_EDIT: 'ENTER_EDIT',
  EXIT_EDIT: 'EXIT_EDIT',
  EDIT_ACTION: 'EDIT_ACTION',
}

export const PICTURE_EDIT_MESSAGE_TYPE_MAP = {
  INFO: '发送通知',
  ERROR: '发送错误',
  ENTER_EDIT: '进入编辑状态',
  EXIT_EDIT: '退出编辑状态',
  EDIT_ACTION: '执行编辑操作',
}

export const PICTURE_EDIT_ACTION_ENUM = {
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  ROTATE_LEFT: 'ROTATE_LEFT',
  ROTATE_RIGHT: 'ROTATE_RIGHT',
}

export const PICTURE_EDIT_ACTION_MAP = {
  ZOOM_IN: '放大操作',
  ZOOM_OUT: '缩小操作',
  ROTATE_LEFT: '左旋操作',
  ROTATE_RIGHT: '右旋操作',
}
