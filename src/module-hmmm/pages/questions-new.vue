<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="岗位信息" name="third">
            <el-form ref="form" :model="form" label-width="200px">
              <el-form-item label="姓名:">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="学科:">
                <el-select v-model="value" clearable placeholder="请选择">
                  <el-option label="item" value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目录:">
                <el-select v-model="value" clearable placeholder="请选择">
                  <el-option label="item" value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="企业:">
                <el-select v-model="value" clearable placeholder="请选择">
                  <el-option label="item" value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="城市:">
                <el-select v-model="value" clearable placeholder="请选择">
                  <el-option label="item" value="item">
                  </el-option>
                </el-select>
                <el-select v-model="value" clearable placeholder="请选择">
                  <el-option label="item" value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="方向:">
                <el-select v-model="value" clearable placeholder="请选择">
                  <el-option label="item" value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题型:">
                <el-radio v-model="radio" label="2">单选</el-radio>
                <el-radio v-model="radio" label="2">多选</el-radio>
                <el-radio v-model="radio" label="2">简答</el-radio>
              </el-form-item>
              <el-form-item label="难度:">
                <el-radio v-model="radio" label="2">简单</el-radio>
                <el-radio v-model="radio" label="2">一般</el-radio>
                <el-radio v-model="radio" label="2">困难</el-radio>
              </el-form-item>
            </el-form>
            <el-button type="primary">更新</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// import RichText from '../components/RichText.vue'
export default {
    name: 'HrsaasIndex',
    components: {
    // RichText
    },
    data() {
        return {
            activeName: 'first',
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入员工名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '名称应在3个到10个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输员工入密码', trigger: 'blur' },
                    { min: 6, message: '密码长度最小6位', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getUserDetailByIdAPI()
    },
    methods: {
    // 获取当前点击用户的账号信息
        async getUserDetailByIdAPI() {
            const res = await getUserDetailById(this.$route.params.id)
            console.log(res)
            this.form = res
        },
        // 更新账户信息
        async update() {
            try {
                await this.$refs.form.validate((adopt, Failed) => {
                    console.log(adopt)
                    console.log(Failed)
                })
                const res = await saveUserDetailById(this.form)
                this.$message.success('更新成功')
                console.log(res)
            } catch (err) {
                console.log(err)
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

<style  scoped>

</style>
