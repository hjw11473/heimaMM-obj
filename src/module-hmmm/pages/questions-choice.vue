<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <span style="color:#ffcad8;">说明：目前支持学科和关键字条件筛选</span>
        <!-- 头部区域 -->
        <div class="header">
          <el-button size="small" type="success" @click="Addtestquestions">
            <i class="el-icon-edit"></i>
            新增试题
          </el-button>
        </div>

        <!-- 搜索区域 -->
        <el-form
          ref="formSate"
          :model="formDate"
          label-width="80px"
          class="forms"
        >
          <el-form-item label="学科:">
            <el-select
              v-model="formDate.subjectID"
              clearable
              placeholder="请选择"
              @change="getsimple"
            >
              <el-option
                v-for="item in Listofdisciplines"
                :key="item.id"
                :label="item.subjectName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级目录:">
            <el-select
              v-model="formDate.catalogID"
              clearable
              placeholder="请选择"
              @blur="gettagssimple"
            >
              <el-option
                v-for="item in simplelist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签:">
            <el-select v-model="formDate.tags" clearable placeholder="请选择">
              <el-option
                v-for="item in tagssimplelist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字:">
            <el-input
              v-model="formDate.keyword"
              placeholder="请选择"
            ></el-input>
          </el-form-item>
          <el-form-item label="试题类型:">
            <el-select
              v-model="formDate.questionType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in questionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度:">
            <el-select
              v-model="formDate.difficulty"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in difficulty"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方向:">
            <el-select
              v-model="formDate.direction"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in direction"
                :key="index"
                :label="item"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="录入人:">
            <el-select
              v-model="formDate.creatorID"
              clearable
              placeholder="请选择"
            >
              <el-option label="item" value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目备注:">
            <el-input
              v-model="formDate.remarks"
              placeholder="请选择"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业简称:">
            <el-input
              v-model="formDate.shortName"
              placeholder="请选择"
            ></el-input>
          </el-form-item>
          <el-form-item label="城市:">
            <div style="display: flex">
              <el-select
                v-model="formDate.province"
                clearable
                placeholder="请选择"
                @change="cityslist"
              >
                <el-option
                  v-for="(item, index) in provinceslist"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-select v-model="formDate.city" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in citysList"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="float: right">
              <el-button @click="eliminate">清除</el-button>
              <el-button type="primary" @click="searchs">搜索</el-button>
            </div>
          </el-form-item>
        </el-form>

        <!-- 切换区域 -->
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="全部" name="first"></el-tab-pane>
          <el-tab-pane label="待审核" name="second"></el-tab-pane>
          <el-tab-pane label="已审核" name="third"></el-tab-pane>
          <el-tab-pane label="已拒绝" name="fourth"></el-tab-pane>
        </el-tabs>

        <!-- 表单数据显示区域 -->
        <div class="displays">
          <el-alert :title="`数据一共${counts}条`" type="info" show-icon>
          </el-alert>
        </div>

        <!-- 表单区域 -->
        <el-table class="table" :data="items" stripe style="width: 100%">
          <el-table-column
            align="center"
            prop="number"
            label="试题编号"
            width="180"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="subject"
            label="学科"
            width="180"
          >
          </el-table-column>
          <el-table-column align="center" prop="catalog" label="目录">
          </el-table-column>
          <el-table-column
            align="center"
            prop="questionType"
            label="题型"
            :formatter="questionTypeformatter"
          >
          </el-table-column>
          <el-table-column align="center" label="题干">
            <template slot-scope="{ row }">
              <span v-html="row.question"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="addDate" label="录入时间">
            <template slot-scope="{ row }">
              {{ row.addDate | parseTime }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="difficulty"
            label="难度"
            :formatter="difficultyformatter"
          >
          </el-table-column>
          <el-table-column align="center" prop="creator" label="录入人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="creatorID"
            label="审核状态"
            :formatter="chkTypeformatter"
          >
          </el-table-column>
          <el-table-column align="center" prop="chkRemarks" label="审核意见">
          </el-table-column>
          <el-table-column align="center" prop="creator" label="审核人">
          </el-table-column>
          <el-table-column
            align="center"
            prop=""
            label="发布状态"
            :formatter="publishTypeformatter"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            fixed="right"
            width="220"
          >
            <template class="operation" slot-scope="{ row }">
              <el-button type="text" @click="preview(row)">预览</el-button>
              <el-button
                type="text"
                :disabled="row.chkState === 0 || row.chkState === 2"
                @click="toexamine(row)"
                >审核
              </el-button>
              <el-button type="text" :disabled="row.chkState === 2"
               @click="modifys(row.id)" >修改</el-button
              >
              <el-button type="text" @click="shelves(row)">{{
                row.publishState === 0 ? "下架" : "上架"
              }}</el-button>
              <el-button type="text" @click="deletelist(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
          background
          layout="prev, pager, next,sizes"
          style="float: right;margin: 20px;"
          :total="counts"
          :current-page.sync="formDate.page"
          :page-size.sync="formDate.pagesize"
          :page-sizes="[2, 5, 10]"
          @current-change="choice"
          @size-change="choice"
        >
        </el-pagination>
      </el-card>
    </div>

    <!-- 题目预览对话框 -->
    <questionspreview :questionItem="questionItem" :dialogVisible.sync="isshows"></questionspreview>
    <!-- 题目审核 -->
    <questionscheck
      @chkRemarkslist="choice"
      ref="tionscheck"
      :dialogFormVisible.sync="isshow1"
      :rowadopt="rowadopt"
    >
    </questionscheck>
  </div>
</template>

<script>
import {
    difficulty,
    questionType,
    direction,
    chkType,
    publishType
} from '../../api/hmmm/constants.js'
import fackClickOutSide from '../../utils/fackClickOutSide.js'
import { choice, remove, choicePublish, detail } from '../../api/hmmm/questions.js'
import { list } from '../../api/hmmm/subjects.js'
import { simple } from '../../api/hmmm/directorys.js'
import { simple as tagssimple } from '../../api/hmmm/tags.js'
import { provinces, citys, datas } from '../../api/hmmm/citys.js'
import { parseTime } from '../../utils/index.js'

import questionspreview from '../components/questions-preview.vue'
import questionscheck from '../components/questions-check.vue'
export default {
    mixins: [fackClickOutSide],
    components: { questionspreview, questionscheck },
    data() {
        return {
            questionItem: {},
            isshows: false,
            isshow1: false,
            activeName: 'first',
            formDate: {
                subjectID: '',
                catalogID: '',
                tags: '',
                keyword: '',
                questionType: '',
                difficulty: '',
                direction: '',
                creatorID: '',
                remarks: '',
                shortName: '',
                province: '',
                city: '',
                page: 1,
                pagesize: 5
            },
            // 精选题库列表
            items: [],
            page: 0, // 当前页数
            pagesize: 0, // 当前页面显示数量
            counts: 0, // 基础题库列表总数
            difficulty, // 难度select
            questionType, // 试题类型select
            Listofdisciplines: [], // 学科select
            simplelist: [], // 二级目录select
            tagssimplelist: [], // 标签select
            direction, // 方向select
            provinceslist: [], // 省份
            citysList: [], // 城市
            datas, // 城市数据
            parseTime, // 时间过滤器
            rowadopt: {} // 审核数据
            // provinces
            // citys: datas.datas // 城市名称
        }
    },
    created() {
        this.choice()
        this.getlistAPI()
        this.getsimple()
        this.provincesslist()
        this.cityslist()
    },
    methods: {
    // 获取精选题库列表
        async choice() {
            const { data } = await choice({ page: this.formDate.page, pagesize: this.formDate.pagesize })
            // console.log(data)
            this.items = data.items
            this.page = data.page
            this.pagesize = data.pagesize
            this.counts = data.counts
        },
        // 获取学科select
        async getlistAPI() {
            try {
                const { data } = await list()
                this.Listofdisciplines = data.items
            } catch (err) {
                console.log(err)
            }
        },
        // 获取二级目录
        async getsimple() {
            const data = await simple({ subjectID: this.formDate.subjectID })
            // console.log(data)
            this.simplelist = data.data
        },
        // 获取标签
        async gettagssimple() {
            const data = await tagssimple({ subjectID: this.formDate.subjectID })
            // console.log(data)
            this.tagssimplelist = data.data
        },
        // 城市省渲染
        provincesslist() {
            this.provinceslist = provinces(this.datas)
            // console.log(provinces(this.datas))
        },
        // 城市市渲染
        cityslist() {
            this.citysList = citys(this.formDate.province)
            // console.log(citys(this.formDate.province))
        },
        // 题型数据更换
        questionTypeformatter(row, column, cellValue) {
            const res = questionType.find((item) => item.value === +cellValue)
            // console.log(res)
            return res ? res.label : ''
        },
        // 难度数据更换
        difficultyformatter(row, column, cellValue) {
            const res = difficulty.find((item) => item.value === +cellValue)
            // console.log(res)
            return res ? res.label : ''
        },
        // 审核状态数据更换
        chkTypeformatter(row, column, cellValue) {
            const res = chkType.find((item) => item.value === cellValue)
            return res ? res.label : ''
        },
        // 发布状态数据更换
        publishTypeformatter(row, column, cellValue) {
            const res = publishType.find((item) => item.questionType === cellValue)
            return res ? res.label : ''
        },
        // Tabs标签栏切换
        async handleClick(tab, event) {
            if (tab.index === '0') {
                this.choice()
            } else if (tab.index === '1') {
                const { data } = await choice({
                    page: 1,
                    pagesize: 5,
                    chkState: 0
                })
                this.items = data.items
                this.page = data.page
                this.pagesize = data.pagesize
                this.counts = data.counts
            } else if (tab.index === '2') {
                const { data } = await choice({
                    page: 1,
                    pagesize: 5,
                    chkState: 1
                })
                this.items = data.items
                this.page = data.page
                this.pagesize = data.pagesize
                this.counts = data.counts
            } else if (tab.index === '3') {
                const { data } = await choice({
                    page: 1,
                    pagesize: 5,
                    chkState: 2
                })
                this.items = data.items
                this.page = data.page
                this.pagesize = data.pagesize
                this.counts = data.counts
            }
        },
        // 清除按钮
        eliminate() {
            this.$refs.formSate.resetFields()
            this.formDate = {
                subjectID: '',
                catalogID: '',
                tags: '',
                keyword: '',
                questionType: '',
                difficulty: '',
                direction: '',
                creatorID: '',
                remarks: '',
                shortName: '',
                province: '',
                city: ''
            }
            this.choice()
        },
        // 搜索按钮
        async searchs() {
            const res = await choice(this.formDate)
            // console.log(res)
            this.items = res.data.items
        },
        // 新增试题
        Addtestquestions() {
            this.$router.push('new')
        },
        // 预览试题
        async preview(row) {
            const { data } = await detail({ id: row.id })
            this.questionItem = data
            this.isshows = true
        },
        // 修改试题
        modifys(id) {
            this.$router.push({
                path: 'new' + '?type=Basics' + '&quert=selected',
                query: {
                    id
                }
            })
        },
        // 审核功能
        toexamine(row) {
            console.log(row)
            this.isshow1 = true
            this.rowadopt = { ...row }
            this.$refs.tionscheck.textarea = row.chkRemarks
        },
        // 上下架功能
        async shelves(row) {
            const arr = row.publishState === 0 ? '下架' : '上架'
            await this.$confirm('您确认' + arr + '这道题目吗?', '提示', {
                type: 'warning'
            })
            // console.log(row)
            if (row.publishState === 0) {
                row.publishState = 1
            } else {
                row.publishState = 0
            }
            await choicePublish(row)
            this.choice()
        },
        // 删除列表
        async deletelist(row) {
            try {
                await this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
                    type: 'warning'
                })
                await remove(row)
                this.items = this.items.filter((item) => item.id !== row.id)
                this.$message.success('删除成功')
            } catch (err) {
                console.log(err)
            }
        }
    }
}
</script>

<style scoped lang="less">
.forms {
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}

.header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.displays {
  margin-bottom: 20px;
}
</style>

<style scoped>
.forms /deep/ .el-form-item {
  flex: 0 0 25%;
  margin-bottom: 20px;
}

.forms /deep/ .el-select {
  width: 100%;
}

/* 关闭clonse的icon */
.displays /deep/ .el-icon-close {
  display: none;
}

.table /deep/ .el-table__cell {
  background-color: #fafafa;
  color: #909399;
}

/* ---------操作详情------------- */
.operation /deep/ .el-button .el-button--primary {
  background-color: #ecf5ff;
}

/* ---------操作详情------------- */
</style>
