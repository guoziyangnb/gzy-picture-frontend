import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import locales from '@/config/index'
import dayjs from 'dayjs'
import LOCALE_ENUM from '@/config/localeEnum'

// 1. 定义一个 localStorage 的键名
const LOCALE_STORAGE_KEY = 'app-locale'

export type SupportedLocaleKey =
  | 'zhCN'
  | 'enUS'
  | 'deDE'
  | 'frFR'
  | 'jaJP'
  | 'arEG'
  | 'ruRU'
  | 'esES'
  | 'itIT'
  | 'koKR'

/**
 * 存储语言的全局状态
 */
export const useLocaleStore = defineStore('locale', () => {
  // 2. 从 localStorage 读取初始值，如果没有则使用 'enUS' 作为默认值
  const currentLocaleKey = ref<SupportedLocaleKey>(
    (localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocaleKey) || 'enUS',
  )

  // Ant Design Vue 的语言包
  const appLocale = computed(() => locales[currentLocaleKey.value])

  // 当前语言的显示名称
  const languageName = computed(() => {
    return LOCALE_ENUM[currentLocaleKey.value]
  })

  // 设置语言的 action
  function setLocale(key: SupportedLocaleKey) {
    currentLocaleKey.value = key
    // 3. 当语言变化时，将其保存到 localStorage
    localStorage.setItem(LOCALE_STORAGE_KEY, key)
  }

  // 监听appLocale语言变化，并动态加载对应的 dayjs 语言包
  watch(
    appLocale,
    (newLocale) => {
      if (newLocale?.locale) {
        dayjs.locale(newLocale.locale)
      }
    },
    { immediate: true },
  )

  return { appLocale, languageName, setLocale, currentLocaleKey }
})
