<template>
  <div class="questions-container">
    <el-card shadow="always">
      <el-form ref="keyForm" label-width="80px">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-form-item label="关键字" size="small">
              <el-input v-model="searchID" placeholder="根据编号搜索" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small">
              <el-button type="default">清除</el-button>
              <el-button type="primary">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-alert
        style="margin-bottom: 15px"
        type="info"
        show-icon
        :closable="false"
      >
        <template #title> 数据一共 {{ total }} 条 </template>
      </el-alert>
      <Table
        v-loading="loading"
        :tableData="randomsList"
        :previewDialog.sync="previewDialog"
        @getDetail="getDetail"
      >
      </Table>
      <el-pagination
        style="margin-top: 20px; text-align: right"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,sizes,jumper"
        :current-page.sync="currentPage"
        :page-sizes="[20, 30, 50, 100]"
        :page-size="20"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <div class="questions-preview">
      <questionsPreview
        :previewDialog.sync="previewDialog"
        :previewData="previewData"
      />
    </div>
  </div>
</template>

<script>
import { randoms, detail } from '@/api/hmmm/questions.js'
import Table from '../components/Table.vue'
import questionsPreview from '../components/questionsPreview.vue'

export default {
    name: 'QuestionsRandoms',
    components: { Table, questionsPreview },
    props: {},
    data() {
        return {
            searchID: '',
            currentPage: 1,
            pageSize: 20,
            randomsList: [],
            total: 0,
            loading: false,
            previewDialog: false,
            previewData: {}
        }
    },
    created() {
        this.assignFn()
    },
    watch: {},
    computed: {},
    methods: {
    // 获取列表数据
        async assignFn() {
            try {
                this.loading = true
                const {
                    data: { counts, items }
                } = await randoms({ page: this.currentPage, pagesize: this.pageSize })
                console.log(items)
                this.total = counts
                this.randomsList = items
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        // 改变每页显示个数
        handleSizeChange(currentPageSize) {
            this.pageSize = currentPageSize
            this.assignFn()
        },
        // 跳转页面
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.assignFn()
        },
        // 获取详情
        async getDetail(item) {
            const { data } = await detail({ id: item.id })
            this.previewData = data
            console.log(data)
        }
    }
}
</script>
<style lang="scss" scoped>
.questions-container {
  padding: 0 10px;
  margin: 10px 0;
  .el-card {
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: 0.3s;
    .el-card__body {
      padding: 20px;
      .el-col-12 {
        text-align: right;
      }
    }
  }
}
</style>
