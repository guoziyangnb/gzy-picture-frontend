import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import locales from '@/config/index'
import dayjs from 'dayjs'
import LOCALE_ENUM from '@/config/localeEnum'

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
  // 根据你 App.vue 的修改，将默认语言设置为英文
  const currentLocaleKey = ref<SupportedLocaleKey>('enUS')

  // Ant Design Vue 的语言包
  const appLocale = computed(() => locales[currentLocaleKey.value])

  // 当前语言的显示名称
  const languageName = computed(() => {
    return LOCALE_ENUM[currentLocaleKey.value]
  })

  // 设置语言的 action
  function setLocale(key: SupportedLocaleKey) {
    currentLocaleKey.value = key
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
