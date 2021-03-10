<template>
  <div class="AllocMenu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分配菜单</span>
      </div>
      <el-tree
        ref="menu-tree"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedKeys"
        :data="menus"
        :props="defaultProps"
        ></el-tree>
      <div style="text-align: center">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/api/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: [] // 选中的key
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.subMenuList) { // 有子目录直接递归并返回，父级不做处理
          this.getCheckedKeys(menu.subMenuList)
          return
        }
        if (menu.selected) {
          // this.checkedKeys.push(menu.id as never) 这里使用push无法触发更新
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
      })
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },
    async onSave () {
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()

      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })

      this.$message.success('操作成功')
      this.$router.back()
    },
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>
