<template>
  <div class="menus">
    <el-card>
      <el-button type="success"
        style="float: right; padding: 7px 15px;margin-bottom: 20px;"
        icon="el-icon-edit"
        @click="childShow = true"
        >添加菜单
      </el-button>
    <el-table
    :data="tableData"
    style="width: 100%"
    :tree-props="{ children: 'childs'}"
    default-expand-all
    row-key="id"
    :header-cell-style="{background: '#fafafa',borderBottom:'2px solid #e8e8e8'}">
    <el-table-column
      prop="title"
      label="标题"
      width="200">
      <template slot-scope="{row}">
        <!-- row.pid === null ? el-icon-folder-opened : row.pid !== null &&  -->
        <i :class="row.level === 1 ? 'el-icon-folder-opened' : row.level === 2 ? 'el-icon-document' : row.level === 3 ? 'el-icon-view':''"> {{ row.title}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="code"
      label="权限点代码">

    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      width="110">
      <template slot-scope="{row}">
        <el-button class="btnBlue" type="primary" icon="el-icon-edit" circle @click="Editchild(row)"></el-button>
        <el-button class="btnRed" type="danger" icon="el-icon-delete" circle @click="deleteChilds(row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
    <mentPopup @Refresh="menusListApi" :EditId="EditId"  :tableData="tableData" :child-show.sync="childShow"></mentPopup>
    <!-- <mentPopup  :tableData="tableData" :child-show.sync="EditchildShow"></mentPopup> -->
  </div>
</template>

<script>
import { list as menusList, remove as deleteChild } from '@/api/base/menus.js'
import mentPopup from '../components/menuPopup.vue'
export default {
    components: { mentPopup },
    data() {
        return {
            EditId: {},
            tableData: [],
            childShow: false,
            EditchildShow: false
        }
    },
    created () {
        this.menusListApi()
    },

    methods: {
        async menusListApi() {
            const { data } = await menusList()
            const newData = JSON.parse(JSON.stringify(data).replace(/"points"/g, '"childs"'))
            var level = 0// 层级从零开始，每调用一次 层级数+1
            const forData = function(newData, level) {
                level += 1
                for (var i = 0; i < newData.length; i++) {
                    var obj = newData[i]
                    obj.level = level
                    if (obj.childs) {
                        forData(obj.childs, level)
                    }
                }
            }
            forData(newData, level)// 递归调用
            this.tableData = newData
            console.log(this.tableData)
        },
        Editchild(data) {
            this.childShow = true
            console.log(data)
            this.EditId = data
            console.log(this.EditId)
        },
        async deleteChilds(data) {
            try {
                await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                await deleteChild(data)
                this.$message.success('删除成功')
                this.menusListApi()
            } catch (error) {
                this.$message.error('删除失败')
            }
        }

    }
}
</script>

<style scoped lang='less'>
  .menus {
    padding: 20px;
  }
  .btnBlue {
    background-color: #ecf5ff;
    border-color:#bfdeff;
    color: #409eff;
    &:hover {
      background-color: #409eff;
      border-color:transparent;
      color: #fff;
    }
  }
  .btnRed {
    background-color: #fef0f0;
    border-color:#fccece;
    color: #f78196;
    &:hover {
      background-color: #f78196;
      border-color:transparent;
      color: #fff;
    }
  }
  :deep(.el-table [class*=el-table__row--level]) {
    .el-table__expand-icon {
      display: none;
    }
  }
  :deep(.el-icon-arrow-right){
    display: none;
    font-size: 12px;
  }

</style>
