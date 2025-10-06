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
