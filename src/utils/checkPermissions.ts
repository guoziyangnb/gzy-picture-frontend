import { computed } from 'vue'
import type { Ref } from 'vue'
// import { SPACE_PERMISSION_ENUM } from '@/constants/space'

// 通用权限检查函数
export function createPermissionChecker(permission: string, space: Ref<API.SpaceVO>) {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
// export const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
// export const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
// export const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
// export const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)
