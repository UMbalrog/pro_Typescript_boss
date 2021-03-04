// ts 中将.vue文件转换为ts可识别的vue函数
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
