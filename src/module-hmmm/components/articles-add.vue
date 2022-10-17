<template>
  <div class='container'>
  <el-dialog
  :title="`${formDate.id ? '编辑' : '新增'}`"
  :visible="dialogVisible"
  width="60%"
  :before-close="handleClose">
   <!-- 表单区域 -->
        <el-form ref="formSate" :model="formDate" :rules="rules" label-width="100px">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="formDate.title"></el-input>
          </el-form-item>
          <!-- 富文本编辑器 -->
           <el-form-item label="题干:" class="quill" prop="articleBody">
            <quill-editor class="text-container" v-model="formDate.articleBody" :options="editorOption" ref="QuillEditor">
            </quill-editor>
          </el-form-item>

         <el-form-item label="视频地址">
            <el-input v-model="formDate.videoURL"></el-input>
          </el-form-item>
        </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="addArticleBtn">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { add, update } from '@/api/hmmm/articles.js'
// 富文本工具栏配置
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    // [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
    ['image', 'link'] // 链接、图片、视频-----['link', 'image', 'video']
]
export default {
    data() {
        return {
            editorOption: {
                placeholder: '请输入文本...',
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: toolbarOptions
                    }
                }
            },
            // 表单
            formDate: {
                title: '',
                articleBody: '',
                videoURL: ''
            },
            // 表单校验
            rules: {
                title: [{ required: true, message: '文章标题必填', trigger: 'blur' }],
                articleBody: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
            }
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            required: true
        }
    },
    components: {

    },
    methods: {
        handleClose() {
            this.$emit('update:dialogVisible', false)
            this.formDate = {}
            this.$refs.formSate.resetFields()
        },
        // 点击确认按钮
        async addArticleBtn() {
            try {
                // 判断是编辑还是新增
                if (this.formDate.id) {
                    // 编辑状态
                    await update(this.formDate)
                    this.$message.success('更新成功')
                } else {
                    await add(this.formDate)
                    this.$message.success('添加成功')
                }
                // 更新页面
                this.$emit('renderTheList')
                this.handleClose()
            } catch (error) {
                this.$message.error('更新失败')
            }
        }
    }
}
</script>

<style scoped lang='less'>
  // element
  ::v-deep .ql-container {
    height: 300px;
  }
</style>
