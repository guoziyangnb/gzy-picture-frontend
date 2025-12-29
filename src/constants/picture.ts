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
