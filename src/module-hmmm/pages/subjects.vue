<template>
  <div class="container">
    <!-- 头部结构 -->
    <el-row type="flex" justify="space-between">
      <el-col :span="12">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="学科名称">
            <el-input v-model="page.subjectName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="page.subjectName = ''">清除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDiscipline">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button type="success" icon="el-icon-edit" @click="istitle">新增学科</el-button>
      </el-col>
    </el-row>
    <el-alert :closable="false" :title="`数据一共${counts}条`" type="info" show-icon>
    </el-alert>
    <!-- ----------- -->
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column label="学科名称" prop="subjectName" width="140">
      </el-table-column>
      <el-table-column label="创建者" prop="username" width="140">
      </el-table-column>
      <el-table-column label="创建日期" width="150">
        <template slot-scope="{ row }">
          {{ row.addDate | parseTimeByString }}
        </template>
      </el-table-column>
      <el-table-column label="前台是否显示">
        <template slot-scope="{ row }">
          {{ row.isFrontDisplay === 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="二级目录" prop="twoLevelDirectory">
      </el-table-column>
      <el-table-column label="标签" prop="tags"> </el-table-column>
      <el-table-column label="题目数量" prop="totals"> </el-table-column>
      <el-table-column label="操作" width="230">
        <template slot-scope="{ row }">
          <el-button type="text" @click="Toclassify(row.id)">学科分类</el-button>
          <el-button type="text" @click="Tolabel(row.id)">学科标签</el-button>
          <el-button type="text" @click="Modifythe(row)">修改</el-button>
          <el-button type="text" @click="open(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- ---------- -->
    <!-- 分页 -->
    <el-pagination background layout=" ->, prev, pager, next,sizes,jumper " class="pagination" :total="counts"
      :page-size.sync="page.pagesize" :current-page.sync="page.page" :page-sizes="[5, 10, 20, 50]"
      @size-change="getDiscipline" @current-change="getDiscipline">
    </el-pagination>
    <!-- ---------- -->
    <!-- 弹出层 -->
    <el-dialog :title="titles" :visible.sync="dialogVisible" width="30%">
      <el-form label-width="80px" :model="discipline" :rules="rules" ref="disciplineform">
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="discipline.subjectName" placeholder="请输入学科名称"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isFrontDisplay">
          <el-switch v-model="discipline.isFrontDisplay"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="newdiscipline">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ---------- -->
    <!-- 删除弹出层 -->
    <!-- ----------- -->
  </div>
</template>

<script>
import {
    detail as getDiscipline,
    add as newdiscipline,
    update as updatecipline,
    remove as removecipline
} from '@/api/hmmm/subjects'
export default {
    data() {
        return {
            counts: 0,
            tableData: [],
            page: {
                subjectName: '',
                page: 1,
                pagesize: 10
            },
            discipline: {
                id: null,
                isFrontDisplay: true,
                subjectName: ''
            },
            rules: {
                subjectName: [
                    { required: true, message: '请输入学科名称', trigger: 'blur' }
                ]
            },
            dialogVisible: false,
            titles: ''
        }
    },
    created() {
        this.getDiscipline()
    },
    methods: {
        istitle() {
            this.titles = '新增学科'
            this.dialogVisible = true
        },
        async getDiscipline() {
            const {
                data: { items, counts }
            } = await getDiscipline(this.page)
            this.counts = counts
            this.tableData = items
        },
        recovery() {
            this.discipline = {
                id: null,
                isFrontDisplay: true,
                subjectName: ''
            }
        },
        async newdiscipline() {
            try {
                await this.$refs.disciplineform.validate()
                if (this.titles === '修改学科') {
                    await updatecipline(this.discipline)
                } else {
                    await newdiscipline(this.discipline)
                }
                this.getDiscipline()
                this.dialogVisible = false
                this.$message.success(this.titles === '修改学科' ? '修改学科成功' : '新增学科成功')
                this.recovery()
            } catch (error) {
                this.$message.error('新增失败')
            }
        },
        Modifythe(row) {
            this.discipline.id = row.id
            this.discipline.subjectName = row.subjectName
            this.titles = '修改学科'
            this.dialogVisible = true
        },
        async open(row) {
            try {
                await this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                await removecipline(row.id)
                this.getDiscipline()
                this.$message.success('删除成功')
            } catch (error) {
                console.log(error)
            }
        },
        Toclassify(id) {
            this.$router.push({
                path: '/subjects/directorys',
                query: { id }
            })
        },
        Tolabel(id) {
            this.$router.push({
                path: '/subjects/tags',
                query: { id }
            })
        }
    },
    computed: {}
}
</script>

<style scoped lang='less'>
.pagination {
  margin-top: 20px;
}

.container {
  margin: 10px;
  padding: 20px;
  background-color: #fff;
}

.el-row--flex.is-justify-space-between {
  padding-right: 10px;
}
</style>
