<template>
  <div class="container">
    <thehead
      :text="text"
      :dialogVisible.sync="dialogVisible"
      @searchcipline="getDirectorylisting"
    ></thehead>
    <subjectform
      @btnswitch="btnswitch"
      :text="text"
      :list="list"
      @open="open"
      @isvisible="isvisible"
    ></subjectform>
    <increase
      :dialogVisible.sync="dialogVisible"
      :text="text"
      @Thenewdata="Thenewdata"
    ></increase>
    <el-pagination
      background
      layout=" ->, prev, pager, next,sizes,jumper "
      class="pagination"
      :total="text.counts"
      :page-size.sync="page.pagesize"
      :current-page.sync="page.page"
      :page-sizes="[5, 10, 20, 50]"
      @size-change="getDirectorylisting"
      @current-change="getDirectorylisting"
    >
    </el-pagination>
    <!-- 修改 -->
    <el-dialog title="提示" :visible.sync="isVisible" width="40%">
      <el-form
        label-width="80px"
        :model="directorythelabel"
        :rules="directorysrules"
      >
        <el-form-item label="所属学科">
          <el-select
            v-model="directorythelabel.subjectID"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in Thelistof"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科名称" prop="directoryName">
          <el-input v-model="directorythelabel.directoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatethelabel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ------------ -->
  </div>
</template>

<script>
import Thehead from '../components/discipline/Thehead.vue'
import Subjectform from '../components/discipline/Subjectform.vue'
import increase from '../components/discipline/increase.vue'
import { simple as getThelistof } from '@/api/hmmm/tags'
import {
    list as getDirectorylisting,
    add as Thenewdirectory,
    remove as Deletethedirectory,
    changeState,
    update as updatethelabel
} from '@/api/hmmm/directorys'
export default {
    components: { Thehead, Subjectform, increase },
    data() {
        return {
            list: [],
            subjectID: '',
            text: {
                name: '目录名称',
                btnname: '新增目录',
                isinterview: true,
                counts: 0,
                tab: '目录名称',
                label: '目录名称',
                placeholder: '请输入目录名称'
            },
            dialogVisible: false,
            page: {
                page: 1,
                pagesize: 10
            },
            isVisible: false,
            directorythelabel: {
                subjectID: '',
                directoryName: '',
                id: ''
            },
            Thelistof: [],
            directorysrules: {
                directoryName: [
                    { required: true, message: '请输入目录名称', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.subjectID = this.$route.query.id === '' ? '' : this.$route.query.id
        this.getDirectorylisting()
    },
    methods: {
        async getDirectorylisting(page) {
            try {
                const arr = page ? { ...this.page } : {}
                if (this.subjectID) arr.subjectID = this.subjectID
                if (page?.subjectName) arr.directoryName = page.subjectName
                if (page?.region) arr.state = page.region
                const { data } = await getDirectorylisting(arr)
                this.list = data.items
                this.text.counts = data.counts
                this.counts = data.counts
            } catch (error) {
                console.log(error)
            }
        },
        async Thenewdata(data) {
            try {
                await Thenewdirectory(data)
                this.$message.success('新增成功')
                this.dialogVisible = false
            } catch (error) {
                console.log(error)
            }
        },
        async open(row) {
            try {
                await this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                await Deletethedirectory(row)
                this.getDirectorylisting()
                this.$message.success('删除成功')
            } catch (error) {
                console.log(error)
            }
        },
        async btnswitch(row) {
            try {
                const state = row.state === 1 ? 0 : 1
                await changeState({ id: row.id, state })
                changeState({ id: row.id, state })
                this.getDirectorylisting()
                this.$message.success('更改成功')
            } catch (error) {
                console.log(error)
            }
        },
        async getThelistof() {
            const { data } = await getThelistof()
            this.Thelistof = data
        },
        isvisible(row) {
            this.isVisible = true
            this.directorythelabel.subjectID = row.subjectID
            this.directorythelabel.directoryName = row.directoryName
            this.directorythelabel.id = row.id
        },
        async updatethelabel() {
            try {
                await updatethelabel(this.directorythelabel)
                this.isVisible = false
                this.getDirectorylisting()
                this.$message.success('修改成功')
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style scoped lang="less">
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
