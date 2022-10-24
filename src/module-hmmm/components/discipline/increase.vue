<template>
  <div>
    <!-- 弹出层 -->
    <el-dialog title="新增目录" :visible="dialogVisible" width="30%">
      <el-form
        label-width="80px"
        :model="discipline"
        :rules="rules"
        ref="disciplineform"
      >
        <el-form-item label="所属学科" >
            <el-select v-model="discipline.subjectID" placeholder="请选择" style="width:100%">
              <el-option v-for="item in form" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="text.label" prop="subjectName">
          <el-input
            v-model="discipline.directoryName"
            :placeholder="text.placeholder"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isvisible">取 消</el-button>
        <el-button type="primary" @click="Dududu">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ---------- -->
  </div>
</template>

<script>
import { simple as Getalistofdisciplines } from '@/api/hmmm/subjects'
export default {
    props: {
        dialogVisible: {
            path: Boolean,
            default: false
        },
        text: {
            path: Object,
            required: true
        }
    },
    data() {
        return {
            discipline: {
                directoryName: '',
                subjectID: ''
            },
            rules: {
                directoryName: [
                    { required: true, message: '请输入学科名称', trigger: 'blur' }
                ]
            },
            form: []
        }
    },
    created() {
        this.Getalistofdisciplines()
    },
    methods: {
        isvisible() {
            this.$emit('update:dialogVisible', false)
        },
        // 获取学科列表
        async Getalistofdisciplines() {
            const { data } = await Getalistofdisciplines()
            this.form = data
        },
        async Dududu() {
            try {
                await this.$refs.disciplineform.validate()
                this.$emit('Thenewdata', this.discipline, this.$refs.disciplineform)
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>
</style>