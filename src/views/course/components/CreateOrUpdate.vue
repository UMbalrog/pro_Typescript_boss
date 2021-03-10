<template>
  <div class="ereate-course">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="activeStep" simple>
          <el-step
            :title="item.title"
            :icon="item.icon"
            v-for="(item, index) in steps"
            :key="index"
            @click.native="activeStep = index"
          ></el-step>
        </el-steps>
      </div>

    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ]
    }
  },
  methods: {
  }
})
</script>
<style lang="scss" scoped></style>
