<template>
  <div class="enterprisemanage-container">
    <el-card class="box-card">
      <!-- 头部搜索 -->
      <div class="formdate" >
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="formInline.tags"></el-input>
        </el-form-item>

        <el-form-item label="城市">
          <el-select v-model="formInline.province" placeholder="选择省级城市" @change="changeProvince">
            <el-option v-for="(item, index) in provincesList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地区">
          <el-select v-model="formInline.city" placeholder="选择子级城市">
            <el-option v-for="(item, index) in citysList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业简称">
          <el-input v-model="formInline.shortName"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formInline.state" placeholder="选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button style="margin-left:40px" @click="clear">清除</el-button>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>

        <el-form-item />

        <!-- 新增用户 -->
        <el-form-item>
          <el-button style="float: right;" type="success" icon="el-icon-edit" @click="addNewUsers">新增用户</el-button>
        </el-form-item>
      </el-form>
    </div>

      <!--通知栏 -->
      <el-row>
        <el-alert :title="`共${counts}条记录`" type="info" show-icon :closable="false">
        </el-alert>
      </el-row>

      <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" type="index" :index="1" >
          </el-table-column>
          <el-table-column align="center"  prop="number" label="企业编号">
          </el-table-column>
          <el-table-column align="center"  prop="shortName" label="企业简称" >
          </el-table-column>
          <el-table-column align="center"  prop="tags" label="标签">
          </el-table-column>
          <el-table-column align="center"  prop="creatorID" label="创建者" >
          </el-table-column>
          <el-table-column align="center"  label="创建日期">
            <template v-slot="{ row }">
              {{ row.addDate | parseTimeByString }}
            </template>
          </el-table-column>
          <el-table-column align="center"  prop="remarks" label="备注" >
          </el-table-column>
          <el-table-column align="center"  prop="state" label="状态" :formatter="formattertags">
          </el-table-column>
          <el-table-column align="center"  label="操作" width="250">
            <template slot-scope="{row}">
              <el-button type="primary" icon="el-icon-edit" circle @click="edit(row)" plain></el-button>
              <el-tooltip class="item" effect="dark" :content="row.state === 1 ? '禁用':'启用'" placement="top">
                <el-button :type="row.state === 0 ? 'warning' : 'success'"
                  :icon="row.state === 0 ? 'el-icon-close' : 'el-icon-check'" circle @click="disable(row)" plain>
                </el-button>
              </el-tooltip>
              <el-button type="danger" icon="el-icon-delete" circle @click="del(row)" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="space-between" align="middle" style="height:60px">
        <el-col :span="12"></el-col>
        <el-col :span="12">
          <el-row type="flex" justify="end">
            <el-pagination background @size-change="ChangeSize" @current-change="ChangePage" :current-page="page"
              :page-sizes="[10, 20, 30, 50]" :page-size="10" layout=" prev, pager, next, sizes, jumper" :total="counts">
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>
      <!-- 弹出层 -->
      <companys-add @refresh-TheList="renderTheList" :dialogFormVisible.sync="dialogFormVisible" :titleInfo="titinfo"
        :formBase.sync="formBase"></companys-add>
    </el-card>
  </div>
</template>

<script>
import { list, remove, disabled } from '@/api/hmmm/companys.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
import baseApi from '@/api/base/baseApi.js'
import CompanysAdd from '../components/companys-add.vue'
export default {
    data() {
        return {
            formInline: {
                tags: '',
                shortName: '',
                province: '',
                city: '',
                state: '',
                page: 1,
                pageSize: 10
            },
            tableData: [],
            page: 1, // 当前页
            counts: 0, // 总条数
            pageSize: 10, // 当前页码显示的条数
            provincesList: [], // 省份城市列表
            citysList: [], // 子城市列表
            formBase: {}, // 传过去的数据
            titinfo: {}, // 传过去的标题
            dialogFormVisible: false // 控制弹层
        }
    },

    created() {
        this.renderTheList()
        this.provinces()
    },
    components: {
        CompanysAdd
    },
    methods: {
    // 渲染列表
        renderTheList() {
            this.list({
                page: this.page,
                pageSize: this.pageSize
            })
        },
        // 请求数据
        async list(datas) {
            const { data } = await list(datas)
            this.counts = data.counts
            this.tableData = data.items
            this.pageSize = data.pageSize
        },
        async onSubmit() {
            // 搜索时过滤搜索对象
            for (const key in this.formInline) {
                if (this.formInline[key] === '') {
                    delete this.formInline[key]
                }
            }
            this.list(this.formInline)
        },
        // 编辑
        edit(row) {
            this.formBase = { ...row }
            this.dialogFormVisible = true
        },
        // 禁用
        async disable(row) {
            console.log(row)
            try {
                await this.$confirm(`此操作将${row.state === 1 ? '禁用' : '启用'} ? 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                // 如果是禁用，则启用，反之，启用
                await disabled({
                    id: row.id,
                    state: row.state === 1 ? 0 : 1
                })
                this.$message.success(`已成功${row.state === 1 ? '禁用' : '启用'}`)
                // 重新渲染列表
                this.renderTheList()
            } catch (error) {
                this.$message.error('已取消')
            }
        },
        // 删除
        async del(row) {
            try {
                await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                await remove(row)
                this.renderTheList()
                this.$message.success('删除成功')
            } catch (error) {
                this.$message.error('删除失败')
            }
        },
        // 页码发生改变
        ChangePage(val) {
            this.page = val
            this.renderTheList()
        },
        // 数据条数改变
        ChangeSize(val) {
            this.pageSize = val
            this.renderTheList()
        },
        // 省级城市选择
        changeProvince(val) {
            // 获取子城市列表
            this.citysList = citys(val)
        },
        // 获取省会城市列表
        provinces() {
            this.provincesList = provinces()
        },
        // 格式化状态
        formattertags(row, column, cellValue, index) {
            const obj = baseApi.statusCode.find(item => item.id === cellValue.toString())
            return obj ? obj.value : '未知'
        },
        // 新增用户
        addNewUsers() {
            this.titinfo.text = '创建'
            this.titinfo.pageTitle = '用户'
            // 打开弹层 赋值初始值
            this.formBase = {}
            this.dialogFormVisible = true
        },
        // 清除搜索框表单数据
        clear() {
            this.formInline = {}
        }
    }
}
</script>

<style scoped lang='scss'>
// self
.enterprisemanage-container {
  padding: 20px;

  .box-card {
    width: 100%;
    min-height: 500px;
  }
}

</style>

<style scoped lang="scss">
// ele
.el-form-item,
.el-form-item--medium {
  margin-right: 0px;
}

// ::v-deep .el-input__inner {
//   width: 100%;
//   height: 32px;
// }

::v-deep .el-form-item__content {
  width: 100%;
}

::v-deep .el-pagination__editor.el-input .el-input__inner {
  width: 46px;
}

::v-deep .el-select {
  width: 100%;
}
::v-deep .el-form{
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}
::v-deep .el-form-item {
  display: flex;
  flex: 0 0 25%;
  margin-bottom: 20px;
}
</style>
