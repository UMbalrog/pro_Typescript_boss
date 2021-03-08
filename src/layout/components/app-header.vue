<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="usermsg.portrait || require('@/assets/default-avatar.png')"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{usermsg.userName}}</el-dropdown-item>
        <el-dropdown-item
        divided
        @click.native="loginout"
        >退出</el-dropdown-item>
        <!-- .native绑定根元素 -->
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getInfo } from '@/api/user.ts'

export default Vue.extend({
  name: 'AppHeader',
  data () {
    return {
      usermsg: {}
    }
  },
  created () {
    this.getusermsg()
  },
  methods: {
    async getusermsg () {
      const { data } = await getInfo()
      if (data.state === 1) this.usermsg = data.content
    },
    loginout () {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认执行这里
        // 清除登录状态
        this.$store.commit('setUser', null)

        // 跳转到登录页面
        this.$router.push({
          path: '/login'
        })

        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => { // 取消执行这里
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
