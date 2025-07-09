<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
//ant组件默认设置中文
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
</script>

<template>
  <div id="basicLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header"><GlobalHeader /> </a-layout-header>
      <a-layout-content class="content">
        <!-- a-config-provider :locale="zhCN" 设置组件，可以设置语言、主题等 -->
        <a-config-provider :locale="zhCN">
          <router-view />
        </a-config-provider>
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://www.codefather.cn" target="_blank"> 编程导航 by 程序员 ———— 阳神 </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style lang="scss" scoped>
#basicLayout {
  .header {
    padding-inline: 20px;
    //padding-inline 相当于 padding-left 和 padding-right 的合并，也就是给元素的左右两侧都设置了 20 像素的内边距。
    // 这样元素内部的内容在水平方向上会与元素边界有 20 像素的间隔空间，使内容不会紧紧贴边，视觉上更舒适
    margin-bottom: 16px;
    color: unset; //表示将属性值恢复到其默认的初始值（如果该属性有继承性，就从父元素继承；如果没有继承性，就采用浏览器默认定义的初始值
    background: white;
  }
  .content {
    background: linear-gradient(to right, #fefefe, #fff);
    padding: 20px;
  }
  .footer {
    background: #efefef;
    padding: 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
