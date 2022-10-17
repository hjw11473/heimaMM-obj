<template>
  <el-dialog
    id="app"
    title="题目审核"
    :visible.sync="dialogFormVisible"
    :before-close="cloes"
  >
    <!-- 表头 -->
    <div style="margin-bottom: 20px;">
      <el-radio v-model="radio" label="1">通过</el-radio>
      <el-radio v-model="radio" label="2">拒绝</el-radio>
    </div>

    <div>
      <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入审核意见"
      v-model="textarea"
      >
    </el-input>
  </div>

  <div style="margin-left: 50%;margin-top: 40px;">
    <el-button @click="cloes">取消</el-button>
  <el-button type="primary" @click="confirm">确认</el-button>
  </div>
  </el-dialog>
</template>

<script>
import { choiceCheck } from '../../api/hmmm/questions.js'
export default {
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: false
        },
        rowadopt: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            radio: '1',
            textarea: '',
            loading: false
        }
    },
    methods: {
    // 关闭弹窗
        cloes() {
            this.$emit('update:dialogFormVisible', false)
            console.log(this.$parent)
        },
        // 试题审核
        async confirm() {
            await choiceCheck(
                {
                    id: this.rowadopt.id,
                    chkState: +this.radio,
                    chkRemarks: this.textarea
                })
            // console.log(res)
            this.$message.success('审核成功')
            this.$emit('chkRemarkslist')
            this.$emit('update:dialogFormVisible', false)
        }
    }
}
</script>

<style scoped lang="scss">
.types {
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}

.types span {
  flex: 0 0 25%;
  margin-bottom: 20px;
}
</style>
<style scoped>
#app /deep/ .el-dialog {
  width: 400px;
  /* height: 100%; */
}
</style>
