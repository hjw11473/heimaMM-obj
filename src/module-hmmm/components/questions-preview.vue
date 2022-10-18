<template>
  <el-dialog
    id="app"
    title="题目预览"
    :visible.sync="dialogFormVisible"
    :before-close="cloes"
    @open="getdetailAPI"
  >
    <!-- 表头 -->
    <div class="types" style="margin: 20px">
      <span>【题型】：{{ questionTypes }}题 </span>
      <span>【编号】：{{ Topicpreview.id }}</span>
      <span>【难度】：{{ difficultyss }}</span>
      <span>【标签】：{{ Topicpreview.tags ? rows.tags : "暂未标签" }}</span>
      <span>【学科】：{{ Topicpreview.subjectName }}</span>
      <span>【目录】：{{ Topicpreview.directoryName }}</span>
      <span>【方向】：{{ Topicpreview.direction }}</span>
    </div>
    <hr />

    <!-- 单多选择区域 -->
    <div style="margin: 0 20px">
      <div>
        【题干】：<span
          style="color: #409eff"
          v-html="Topicpreview.question"
        ></span>
      </div>
      <p style="margin: 0; margin-bottom: 20px">
        {{ questionTypes }}题选项：（以下选中的选项为正确答案）
      </p>
      <div>
        <!-- 单选 -->
        <!-- <el-radio-group v-model="radio">
          <el-radio :label="3">备选项</el-radio>
          <el-radio :label="6">备选项</el-radio>
          <el-radio :label="9">备选项</el-radio>
        </el-radio-group> -->
        <!-- 多选 -->
        <el-checkbox-group
          :value="Multiplechoice"
          style="display: flex; flex-direction: column"
        >
          <el-checkbox
            v-for="(item, index) in Topicpreview.options"
            :key="index"
            :label="item.isRight"
            style="margin-bottom: 20px"
          >
            <template>
              <!-- <span>{{ item.code }}</span> -->
              <span>{{ item.title }}</span>
              <img :src="item.img" alt="" />
            </template>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <hr />

    <!-- 视频预览区域 -->
    <div style="margin: 20px">
      <span>【参考答案】：</span>
      <el-button type="danger" size="small" @click="isshows = !isshows"
        >视频答案预览</el-button
      >
      <div style="margin-top: 10px" v-if="isshows">
        <video
          width="320"
          height="240"
          controls
          loop="loop"
          autoplay="autoplay"
          preload="auto"
        >
          <!-- <source src="https://www.runoob.com/try/demo_source/mov_bbb.mp4" type="video/mp4" /> -->
          <source :src="Topicpreview.videoURL" />
        </video>
      </div>
    </div>
    <hr />

    <!-- 答案解析区域 -->
    <div style="margin: 20px">
      <span>【参考解析】：<span v-html="Topicpreview.answerID"></span></span>
    </div>
    <hr />

    <!-- 答案解析区域 -->
    <div style="margin: 20px">
      <span>【参考备注】：<span v-html="Topicpreview.remarks"></span></span>
    </div>

    <!-- footer插槽 -->
    <div style="margin: 50px 20px 0; margin-left: 90%">
      <el-button size="medium" type="primary" @click="cloes">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { difficulty, questionType } from '../../api/hmmm/constants.js'
import { detail } from '../../api/hmmm/questions.js'
export default {
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: false
        },
        rows: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            formData: {
                username: ''
            },
            loading: false,
            isshows: false,
            Multiplechoice: [], // 多选框数组
            Topicpreview: [] // 题目预览数据
            // questionType: ''
        }
    },
    methods: {
    // 关闭弹窗
        cloes() {
            this.$emit('update:dialogFormVisible', false)
        },
        // 获取题目预览数据
        async getdetailAPI() {
            const { data } = await detail({ id: this.rows.id })
            this.Topicpreview = data
            console.log(data)
        }
    },
    computed: {
    // 显示题型
        questionTypes() {
            const res = questionType.find(
                (item) => item.value === +this.Topicpreview.questionType
            )
            return res ? res.label : ''
        },
        // 显示难易度
        difficultyss() {
            const res = difficulty.find(
                (item) => item.value === +this.Topicpreview.difficulty
            )
            return res ? res.label : ''
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
  width: 900px;
  /* height: 100%; */
}
</style>
