<template>
    <div class="app-container">
      <el-card shadow="never">
        <el-button class="filter-item fr" size="small" style="margin-left: 10px;" type="success" icon="el-icon-edit"  @click="addMenus">添加菜单</el-button>
        <!-- 树形表格 -->
        <TreeTable
          :data="tableData"
          :columns="columns"
          :tree-structure="true"
          :defaultExpandAll="true"
          :listLoading="listLoading"
          @handleUpdate="handleUpdate"
          @removeUser='removeUser'
        >
        </TreeTable>
      </el-card>
      <!-- 弹出层 -->
      <mentPopup
        ref="menuRef"
        :text="text"
        :PointDataList="tableData"
        @newDataes="menusList"
      />
    </div>
  </template>

<script>
import TreeTable from '@/components/TreeTable/index.vue'
import mentPopup from '../components/menu-add.vue'
import { list as menusList, remove as deleteChild } from '@/api/base/menus.js'
export default {
    name: 'Menus',
    components: { TreeTable, mentPopup },
    data () {
        return {
            listLoading: false,
            textTitle: false,
            tableData: [],
            columns: [
                { text: '标题', prop: 'title', value: 'title', width: 220 },
                { text: '权限点代码', prop: 'code', value: 'code' }
            ]
        }
    },
    created () {
        this.menusList()
    },
    methods: {
        async menusList () {
            try {
                this.listLoading = true
                const { data } = await menusList()
                this.tableData = data
            } finally {
                this.listLoading = false
            }
        },
        // 新增菜单
        addMenus () {
            this.textTitle = true
            this.$refs.menuRef.dialogFormV()
            this.$refs.menuRef.handleResetForm() // 进入前重置表单清空
        },
        // 编辑菜单
        handleUpdate (row) {
            this.textTitle = false
            this.$refs.menuRef.dialogFormV()
            const f = row.childs || row.points ? 'menu' : 'points'
            this.$refs.menuRef.changeType(f)
            this.$refs.menuRef.hanldeEditForm(row.id) // ref是弹出框的ref，拿到他身上的这个方法hanldeEditForm
        },
        async removeUser (data) {
            try {
                await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                console.log(data)
                await deleteChild({ id: data.id })
                this.$message.success('删除成功')
                this.menusList()
            } catch (error) {
                this.$message.error('删除失败')
            }
        }
    },
    computed: {
        text () {
            return this.textTitle ? '创建菜单' : '编辑菜单'
        }
    }
}
</script>

  <style scoped lang='less'>
  </style>