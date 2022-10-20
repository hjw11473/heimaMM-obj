<template>
  <div class="container">
    <thehead
      :text="text"
      :dialogVisible.sync="dialogVisible"
      @searchcipline="getTags"
    ></thehead>
    <subjectform
      :text="text"
      :list="list"
      @btnswitch="btnswitch"
      @open="open"
      @isvisible="isvisible"
    ></subjectform>
    <increase
      :dialogVisible.sync="dialogVisible"
      :text="text"
      @Thenewdata="Thenewdata"
    ></increase>
    <!-- 分页 -->
    <el-pagination
      background
      layout=" ->, prev, pager, next,sizes,jumper "
      class="pagination"
      :total="text.counts"
      :page-size.sync="page.pagesize"
      :current-page.sync="page.page"
      :page-sizes="[5, 10, 20, 50]"
      @size-change="getTags"
      @current-change="getTags"
    >
    </el-pagination>
    <!-- -------- -->
    <!-- 修改 -->
    <el-dialog title="提示" :visible.sync="isVisible" width="40%">
      <el-form label-width="80px" :model="Modifythelabel" :rules="tagsrules">
        <el-form-item label="所属学科">
          <el-select
          v-model="Modifythelabel.subjectID"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in Thelistof"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="学科名称" prop="tagName">
          <el-input v-model="Modifythelabel.tagName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatethelabel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Thehead from '../components/discipline/Thehead.vue'
import Subjectform from '../components/discipline/Subjectform'
import increase from '../components/discipline/increase'
import {
    list as getTags,
    add as addTags,
    remove as Removethelabel,
    changeState,
    update as updatethelabel
} from '@/api/hmmm/tags'
import { simple as getThelistof } from '@/api/hmmm/subjects'
export default {
    components: { Thehead, Subjectform, increase },
    data() {
        return {
            list: [],
            subjectID: '',
            text: {
                name: '标签名称',
                btnname: '新增标签',
                tab: '标签名称',
                counts: 0,
                isinterview: true,
                label: '标签名称',
                placeholder: '请输入标签名称'
            },
            page: {
                page: 1,
                pagesize: 10
            },
            dialogVisible: false,
            isVisible: false,

            Modifythelabel: {
                subjectID: '',
                tagName: '',
                id: ''
            },
            item: {},
            Thelistof: [],
            tagsrules: {
                tagName: [
                    { required: true, message: '请输入学科名称', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.subjectID = this.$route.query.id === '' ? '' : this.$route.query.id
        this.getTags()
        this.getThelistof()
    },
    methods: {
        async getTags(page) {
            try {
                const arr = page ? { ...this.page } : {}
                if (this.subjectID) arr.subjectID = this.subjectID
                if (page?.subjectName) arr.tagName = page.subjectName
                if (page?.region) arr.state = page.region
                const { data } = await getTags(arr)
                this.counts = data.counts
                this.list = data.items
                this.text.counts = data.counts
            } catch (error) {
                console.log(error)
            }
        },
        async Thenewdata(data) {
            const tagName = data.directoryName
            try {
                await addTags({ tagName, subjectID: data.subjectID })
                this.dialogVisible = false
                this.getTags()
                this.resetFields()
                this.$message.success('新增成功')
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
                await Removethelabel(row.id)
                this.getTags()
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
                this.getTags()
                this.$message.success('更改成功')
            } catch (error) {
                console.log(error)
            }
        },
        isvisible(row) {
            this.isVisible = true
            this.Modifythelabel.subjectID = row.subjectID
            this.Modifythelabel.tagName = row.tagName
            this.Modifythelabel.id = row.id
        },
        async getThelistof() {
            const { data } = await getThelistof()
            this.Thelistof = data
        },
        async updatethelabel() {
            try {
                await updatethelabel(this.Modifythelabel)
                this.isVisible = false
                this.getTags()
                this.$message.success('修改成功')
            } catch (error) {
                console.log(error)
            }
        }
    }
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