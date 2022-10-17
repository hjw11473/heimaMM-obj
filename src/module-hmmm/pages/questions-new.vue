<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部区域 -->
        <el-tabs label="试题录入" class="questions">
          <el-tab-pane label="试题录入"></el-tab-pane>
        </el-tabs>

        <!-- 表单区域 -->
        <el-form
          ref="formSate"
          :rules="rules"
          :model="formDate"
          label-width="200px"
        >
          <el-form-item label="学科:" prop="subjectID">
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
          <el-form-item label="目录:" prop="catalogID">
            <el-select
              v-model="formDate.catalogID"
              clearable
              placeholder="请选择"
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
          <el-form-item label="企业:" prop="enterpriseID">
            <el-select
              v-model="formDate.enterpriseID"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in Enterprisename"
                :key="item.id"
                :label="item.company"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市:" class="city" prop="province">
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
          <el-form-item label="方向:" prop="direction">
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
          <el-form-item label="题型:">
            <el-radio-group v-model="formDate.questionType">
              <el-radio :label="1">单选</el-radio>
              <el-radio :label="2">多选</el-radio>
              <el-radio :label="3">简答</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度:">
            <el-radio-group v-model="formDate.difficulty">
              <el-radio :label="1">简单</el-radio>
              <el-radio :label="2">一般</el-radio>
              <el-radio :label="3">困难</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="题干:" class="quill" prop="question">
            <quill-editor
              v-model="formDate.question"
              :options="editorOption"
              ref="QuillEditor"
            >
            </quill-editor>
          </el-form-item>

          <el-form-item
            label="选项:"
            v-if="formDate.questionType === 1"
            class="radiodan"
          >
            <div
              v-for="(item, index) in formDate.options"
              :key="index"
              class="radioA"
            >
              <el-radio :label="index" v-model="radio">{{
                item.code
              }}</el-radio>
              <el-input
                v-model="item.title"
                placeholder="请输入内容"
              ></el-input>
              <el-upload class="avatar-uploader" action="#" multiple :limit="3">
                <img v-if="item.img" :src="item.img" class="avatar" />
                <span style="line-height: 60px">上传图片</span>
                <i class="el-icon-close iconclose"></i>
              </el-upload>
              <br />
            </div>
            <el-button type="danger" @click="addQuestion" disabled
              ><i class="el-icon-plus"></i>增加选项与答案</el-button
            >
          </el-form-item>

          <el-form-item label="选项:" v-if="formDate.questionType === 2">
            <div
              v-for="(item, index) in formDate.options"
              :key="index"
              class="radioA"
            >
              <el-checkbox :label="index" v-model="item.isRight">{{
                item.code
              }}</el-checkbox>
              <el-input
                v-model="item.title"
                placeholder="请输入内容"
              ></el-input>
              <el-upload class="avatar-uploader" action="#" multiple :limit="3">
                <img v-if="item.img" :src="item.img" class="avatar" />
                <span style="line-height: 60px">上传图片</span>
                <i class="el-icon-close iconclose"></i>
              </el-upload>
              <br />
            </div>
            <el-button type="danger" @click="addQuestion"
              ><i class="el-icon-plus"></i>增加选项与答案</el-button
            >
          </el-form-item>

          <el-form-item label="解析视频:" prop="videoURL">
            <el-input
              v-model="formDate.videoURL"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="答案解析:" class="quill" prop="answer">
            <quill-editor
              v-model="formDate.answer"
              :options="editorOption"
              ref="QuillEditor"
            >
            </quill-editor>
          </el-form-item>
          <el-form-item label="题目备注:" class="remarks">
            <el-input type="textarea" v-model="formDate.remarks"></el-input>
          </el-form-item>
          <el-form-item label="试题标签:" class="remarks">
            <el-select
              v-model="formDate.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="item in tagList"
                :key="item.tagName"
                :label="item.tagName"
                :value="item.tagName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @clcik="Confirmsubmission">确认提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
// 富文本工具栏配置
import {
    difficulty,
    questionType,
    direction
} from '../../api/hmmm/constants.js'
import fackClickOutSide from '../../utils/fackClickOutSide.js'
import { list } from '../../api/hmmm/subjects.js'
import { list as companyslist } from '../../api/hmmm/companys.js'
import { simple } from '../../api/hmmm/directorys.js'
import { add } from '../../api/hmmm/questions.js'
import { provinces, citys, datas } from '../../api/hmmm/citys.js'
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    // [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    // [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    // [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    // [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
    // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    // [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    // [{ font: [] }], // 字体种类-----[{ font: [] }]
    // [{ align: [] }], // 对齐方式-----[{ align: [] }]
    // ['clean'], // 清除文本格式-----['clean']
    ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
    ['image', 'link'] // 链接、图片、视频-----['link', 'image', 'video']
]
export default {
    mixins: [fackClickOutSide],
    name: 'HrsaasIndex',
    data() {
        return {
            // 富文本编辑器功能
            editorOption: {
                placeholder: '请输入文本...',
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: toolbarOptions
                    }
                }
            },
            i: 0,
            radio: '', // 单选
            checkList: [], // 多选
            tagList: [], // 标签列表
            // 表单
            formDate: {
                subjectID: '',
                catalogID: '',
                enterpriseID: '',
                province: '',
                city: '',
                direction: '',
                questionType: 1,
                difficulty: 1,
                question: '',
                options: [
                    {
                        code: 'A', // 代码
                        title: '', // 标题
                        img: '', // 图片URL
                        isRight: false // 是否正确答案 true/false
                    },
                    {
                        code: 'B', // 代码
                        title: '', // 标题
                        img: '', // 图片URL
                        isRight: false // 是否正确答案 true/false
                    },
                    {
                        code: 'C', // 代码
                        title: '', // 标题
                        img: '', // 图片URL
                        isRight: false // 是否正确答案 true/false
                    },
                    {
                        code: 'D', // 代码
                        title: '', // 标题
                        img: '', // 图片URL
                        isRight: false // 是否正确答案 true/false
                    }
                ],
                videoURL: '',
                answer: '',
                remarks: '',
                tags: ''
            },
            // 表单校验
            rules: {
                subjectID: [{ required: true, message: '请选择学科' }],
                catalogID: [{ required: true, message: '请选择目录' }],
                enterpriseID: [{ required: true, message: '请选择企业' }],
                province: [{ required: true, message: '请选择地区' }],
                direction: [{ required: true, message: '请选择方向' }],
                question: [{ required: true, message: '请输入题干' }],
                videoURL: [{ required: true, message: '请输入解析视频地址' }],
                answer: [{ required: true, message: '请输入答案解析' }]
            },
            difficulty, // 难度select
            questionType, // 试题类型select
            Listofdisciplines: [], // 学科select
            simplelist: [], // 二级目录select
            Enterprisename: [], // 企业名称
            direction, // 方向select
            provinceslist: [], // 省份
            citysList: [], // 城市
            datas
        }
    },
    created() {
        this.getlistAPI()
        this.getcompanyslistAPI()
        this.provincesslist()
    },
    methods: {
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
        // 获取企业列表
        async getcompanyslistAPI() {
            const { data } = await companyslist({ pagesize: 10000 })
            // console.log(data)
            this.Enterprisename = data.items
        },
        // 城市省渲染
        provincesslist() {
            this.provinceslist = provinces(this.datas)
            // console.log(provinces(this.datas))
        },
        // 城市市渲染
        cityslist() {
            this.citysList = citys(this.formDate.province)
            // console.log(this.citysList)
        },
        // 随机顺序生成ABCDE...字母的函数
        setDesc() {
            const letterArr = []
            // 字母A的code值是65，但因为已经到字母D了，所以直接从69E开始循环
            for (let i = 69; i < 91; i++) {
                letterArr[i] = String.fromCharCode(i)
            }
            return letterArr
        },
        // 增加选项和答案按钮
        addQuestion() {
            // 调用随机顺序生成ABCDE...字母的函数，可以打印randomAbc 数组看下
            // 有69个元素是空的，所以直接进行了截取
            const randomAbc = this.setDesc().splice(69)
            const res = [
                ...this.formDate.options,
                {
                    code: randomAbc[this.i],
                    title: '',
                    img: '',
                    isRight: false
                }
            ]
            this.i++
            this.formDate.options = res
        },
        // 确认提交按钮
        async Confirmsubmission() {
            await this.$refs.formSate.validate()
            const res = await add(this.formDate)
            console.log(res)
        }
    }
}
</script>

<style lang="scss" scoped>
// tab栏删除样式
.iconclose {
  position: absolute;
  top: -8px;
  right: -8px;
  color: #000;
  font-size: 10px;
  padding: 2px;
  border-radius: 50%;
  border: 1px solid #000;
}

.city {
  width: 400px;
}
.radioA {
  display: flex;
  align-items: center;
}
</style>

<style scoped>
.quill /deep/ .ql-container {
  height: 200px;
}

.questions /deep/ .el-tabs__item {
  color: #000;
  cursor: default;
}

.questions /deep/ .el-tabs__active-bar {
  background-color: #e4e7ed;
  cursor: default;
}

/* ----------选项样式------------ */
.radioA /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  width: 100px;
  height: 60px;
  position: relative;
}

.radioA /deep/ .el-radio {
  display: flex;
  align-items: center;
  margin-right: 0;
}
.radioA /deep/ .el-checkbox {
  display: flex;
  align-items: center;
}

.radioA /deep/ .el-radio__label {
  display: flex;
  align-items: center;
}

.radioA /deep/ .el-checkbox__label {
  display: flex;
  align-items: center;
}

.radioA /deep/ .el-input {
  margin: 0 20px;
}

.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar {
  width: 100px;
  height: 60px;
  display: block;
}

/* ----------选项样式------------ */

/* ----------select,input,textarea样式------------ */
.dashboard-container /deep/ .el-select {
  width: 400px;
  height: 36px;
}

.dashboard-container /deep/ .el-input {
  width: 400px;
  height: 36px;
}

.dashboard-container /deep/ .el-input {
  width: 400px;
  height: 36px;
}

.dashboard-container /deep/ .el-textarea {
  width: 400px;
  height: 96px;
}

.city /deep/ .el-select {
  width: 200px;
  height: 36px;
}

.city /deep/ .el-input--suffix {
  width: 200px;
  height: 36px;
}

/* ----------select,input,textarea样式------------ */
</style>
