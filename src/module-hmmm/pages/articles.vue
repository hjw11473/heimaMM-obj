<template>
  <div class='interview-container'>
  <el-card class="box-card">
      <!-- 搜索栏 -->
   <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
      <el-row>
       <el-col :span="6">
           <el-form-item label="标签名称">
          <el-input v-model="formInline.keyword"></el-input>
        </el-form-item>
       </el-col>

      <el-col :span="12">
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
            </el-col>
              <!-- 新增用户 -->
       <el-col :span="5">
        <el-row type="flex" justify="end">
           <el-button type="success" icon="el-icon-edit" @click="newTips">新增技巧</el-button>
        </el-row>
       </el-col>
      </el-row>
    </el-form>
    <!-- 通知栏 -->
    <el-row>
       <el-alert
          :title="`共${counts}条记录`"
          type="info"
          show-icon
          :closable="false">
        </el-alert>
    </el-row>
    <!-- 表格 -->
       <el-row>
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        :index="1"
        width="80">
      </el-table-column>
      <el-table-column
        prop="title"
        label="文章标题"
        width="400">
      </el-table-column>
      <el-table-column
        prop="visits"
        label="阅题数"
         width="170">
      </el-table-column>
       <el-table-column
         prop="username"
         label="录入人"
         width="170"
         >
      </el-table-column>
       <el-table-column
        label="录入时间"
         width="170">
        <template v-slot="{ row }">
            {{ row.createTime | parseTimeByString }}
          </template>
      </el-table-column>
       <el-table-column
        prop="state"
        label="状态"
         width="100"
         :formatter="formattertags">
      </el-table-column>
       <el-table-column
        label="操作"
        width="180">
         <template slot-scope="{row}">
           <el-button @click="handleClick(row)" type="text" size="small">预览</el-button>
           <el-button type="text" size="small" @click="enable(row)" >
            {{row.state === 1 ? '禁用' : '启用'}}
            </el-button>
           <el-button type="text" size="small" :disabled="row.state === 1" @click="edit(row)">修改</el-button>
           <el-button type="text" size="small" :disabled="row.state === 1" @click="del(row)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    </el-row>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between" align="middle" style="height:60px">
      <el-col :span="12"></el-col>
     <el-col :span="12">
        <el-row type="flex" justify="end">
           <el-pagination
          background
          @size-change="ChangeSize"
          @current-change="ChangePage"
          :current-page="page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout=" prev, pager, next, sizes, jumper"
          :total="counts"
          >
        </el-pagination>
        </el-row>
     </el-col>
    </el-row>
  </el-card>
  <!-- 新增文章弹层 -->
  <articles-add ref="article" :dialog-visible.sync="dialogVisible" @renderTheList="renderTheList"></articles-add>
  <!-- 预览弹层 -->
  <articles-preview :previewTheStructure="previewTheStructure" :dialog-visible.sync="dialogPreVisible"></articles-preview>
  </div>
</template>

<script>
import { list, changeState } from '@/api/hmmm/articles.js'
import baseApi from '@/api/base/baseApi.js'
import ArticlesAdd from '../components/articles-add.vue'
import ArticlesPreview from '../components/articles-preview.vue'
export default {
    name: 'ArticlePage',
    components: {
        ArticlesAdd,
        ArticlesPreview
    },
    data() {
        return {
            // 搜索框数据
            formInline: {
                keyword: '',
                state: '',
                page: 1,
                pageSize: 10
            },
            tableData: [], // 表格数据
            counts: 0,
            page: 1,
            pageSize: 10,
            dialogVisible: false,
            dialogPreVisible: false, // 预览弹层
            previewTheStructure: {} // 弹层结构
        }
    },
    created() {
        // 调用接口渲染数据
        this.renderTheList()
    },
    methods: {
        renderTheList() {
            this.list({
                page: this.page,
                pageSize: this.pageSize
            })
        },
        async list(datas) {
            const { data } = await list(datas)
            this.tableData = data.items
            this.counts = data.counts
            this.pageSize = data.pageSize
        },
        // 搜索
        onSubmit() {
            for (const key in this.formInline) {
                if (this.formInline[key] === '') {
                    delete this.formInline[key]
                }
                this.list(this.formInline)
            }
        },
        // 清除
        clear() {
            this.formInline = {}
        },
        // 新增技巧
        newTips() {
            this.dialogVisible = true
        },
        // 预览
        async handleClick(row) {
            this.previewTheStructure = row
            this.dialogPreVisible = true
        },
        // 启用
        async enable(row) {
            const state = row.state === 1 ? 0 : 1
            try {
                await changeState({
                    id: row.id,
                    state
                })
                this.renderTheList()
                this.$message.success(`${state === 0 ? '禁用成功' : '启用成功'}`)
            } catch (error) {
                this.$message.error('更新失败')
            }
        },
        // 修改
        edit(row) {
            this.$refs.article.formDate = row
            this.dialogVisible = true
        },
        // 删除
        del(row) {
            console.log(row)
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
        // 状态格式化
        formattertags(row, column, cellValue, index) {
            const obj = baseApi.statusCode.find(item => item.id === cellValue.toString())
            return obj ? obj.value : '未知'
        }
    }
}
</script>

<style scoped lang='scss'>
// self
.interview-container{
  padding: 10px;
  .box-card {
    width: 100%;
    min-height: 500px;
  }
}
</style>
