<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        基础题库
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

        <!-- 表单数据显示区域 -->
        <div class="displays">
          <el-alert :title="`数据一共${counts}条`" type="info" show-icon>
          </el-alert>
        </div>

        <!-- 表单区域 -->
        <el-table class="table" :data="items" stripe style="width: 100%" v-loading="loading">
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
            label="操作"
            fixed="right"
            width="220"
          >
            <template class="operation" slot-scope="{ row }">
              <el-button type="primary" plain circle @click="preview(row)">
                <i class="el-icon-view"></i>
              </el-button>
              <el-button type="success" plain circle @click="edit(row)">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button type="info" plain circle @click="deletelist(row)">
                <i class="el-icon-delete"></i>
              </el-button>
              <el-button type="warning" plain circle @click="AddSelection(row)">
                <i class="el-icon-check"></i>
              </el-button>
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
    <questionspreview :rows="rows" :dialogFormVisible.sync="isshow"></questionspreview>
  </div>
</template>

<script>
import {
    difficulty,
    questionType,
    direction
} from '../../api/hmmm/constants.js'
import fackClickOutSide from '../../utils/fackClickOutSide.js'
import { list, remove, choiceAdd } from '../../api/hmmm/questions.js'
import { simple } from '../../api/hmmm/directorys.js'
import { simple as tagssimple } from '../../api/hmmm/tags.js'
import { provinces, citys, datas } from '../../api/hmmm/citys.js'
import { parseTime } from '../../utils/index.js'

import questionspreview from '../components/questions-preview.vue'
export default {
    mixins: [fackClickOutSide],
    components: { questionspreview },
    data() {
        return {
            loading: false,
            isshow: false,
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
            rowadopt: {}, // 审核数据
            rows: {} // 预览试题的数据
            // choiceState: 1 // 自定义的上架数据
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
    // 获取基础题库列表
        async choice() {
            const { data } = await list({ page: this.formDate.page, pagesize: this.formDate.pagesize })
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
        },
        // 搜索按钮
        async searchs() {
            const res = await list(this.formDate)
            // console.log(res)
            this.items = res.data.items
        },
        // 新增试题
        Addtestquestions() {
            this.$router.push('new' + '?type=newadd')
        },
        // 预览试题
        preview(row) {
            // console.log(row)
            this.rows = { ...row }
            this.isshow = true
        },
        // 编辑基础题库功能
        async edit(row) {
            // console.log(row)
            this.$router.push({
                path: 'new' + '?type=Basics',
                query: {
                    ...row
                }
            })
        },
        // 删除列表
        async deletelist(row) {
            try {
                await this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
                    type: 'warning'
                })
                this.loading = true
                await remove(row)
                this.items = this.items.filter((item) => item.id !== row.id)
                this.$message.success('删除成功')
                this.choice()
            } catch (err) {
                console.log(err)
            } finally {
                this.loading = false
            }
        },
        // 加入精选
        async AddSelection(row) {
            console.log(row)
            try {
                await this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
                    type: 'warning'
                })
                await choiceAdd({
                    id: row.id,
                    choiceState: 1
                })
                this.choice()
                this.$message.success('加入精选成功')
            } catch (err) {
                console.log(err)
            } finally {
                this.loading = false
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
