<template>
  <div class="app">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <div class="main">
        <div>
          <el-form-item>
            <el-input v-model="formInline.user" placeholder="根据用户名搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="QKSubmit">清空</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="list">搜索</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item>
            <el-button type="success" icon="el-icon-edit" @click="usersAdd">新增用户</el-button>
          </el-form-item>
          <!-- 引用子组件 -->
          <!-- <useradd>
      </useradd> -->
        </div>
        <!-- <el-alert
        :title="`共${counts}条记录`"
        type="info"
        show-icon>
       </el-alert> -->
      </div>
    </el-form>
    <!--通知栏 -->
    <el-row>
      <el-alert :title="`共${total}条记录`" type="info" show-icon :closable="false">
      </el-alert>
    </el-row>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#EEE' }">
      <el-table-column prop="id" label="序号" align='center'>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align='center'>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" align='center'>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align='center'>
      </el-table-column>
      <el-table-column prop="permission_group_title" label="权限组名称" align='center'>
      </el-table-column>
      <el-table-column prop="role" label="角色" align='center'>
      </el-table-column>
      <el-table-column prop="X" label="操作" align='center'>
        <template slot-scope="{row}">
          <el-button size="small" type="primary" icon="el-icon-edit" circle @click="editRole(row)"></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" circle @click="delRole(row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" align="middle" style="height:60px">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination v-if="total > 0" layout=" total, prev, pager, next, sizes, jumper" :total="total"
        :page-sizes="[2, 5, 10, 15]" :page-size.sync="page.pagesize" :current-page.sync="page.page"
        @current-change="list" @size-change="list">
      </el-pagination>
    </el-row>
    <!-- 编辑用户弹层 -->
    <!-- <el-dialog
      title="编辑用户"
      :visible.sync="addPerDialogVisible"
      width="50%"
      @close="onClose"
    >
      <el-form ref="form" :model="addPermissionForm" :rules="addPermissionRules" label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addPermissionForm.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="emile">
          <el-input v-model="addPermissionForm.code" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addPermissionForm.password" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="addPermissionForm.role" />
        </el-form-item>
        <el-form-item label="权限组名称" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="请选择">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addPermissionForm.phone" />
        </el-form-item>
         <el-form-item label="介绍">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddPermission">确 定</el-button>
      </span>
    </el-dialog> -->
    <usersAdd ref="usersAdd" :dialogVisible.sync="dialogFormVisible" @handleCloseModal="list" />
  </div>
</template>

<script>
import { list, remove } from '../../api/base/users'
import usersAdd from '../components/user-add.vue'
export default {
  components: {
    usersAdd
  },
  data() {
    return {
      formInline: {
        user: ''
      },
      tableData: [],
      total: 0,
      page: {
        page: 1,
        pagesize: 10
      },
      counts: 0,
      dialogFormVisible: false // 控制弹层，
      // addPerDialogVisible: false,
      // addPermissionForm: {
      //   name: '',
      //   code: '',
      //   description: '',
      //   enVisible: '0',
      //   type: '',
      //   pid: ''
      // },
      // addPermissionRules: {
      //   name: [
      //     { required: true, message: '请填写权限名称', trigger: 'blur' }
      //   ],
      //   code: [
      //     { required: true, message: '请填写权限标识', trigger: 'blur' }
      //   ]
      // }
    }
  },

  created() {
    this.list()
  },

  methods: {
    // onSubmit () {
    //   // this.formInline.user =
    //   this.list()
    //   console.log('submit!')
    // },

    QKSubmit() {
      this.formInline.user = ''
      this.list()
    },
    async list() {
      try {
        const { data } = await list({
          page: this.page.page,
          pagesize: this.page.pagesize,
          username: this.formInline.user
        })
        console.log(data)
        this.tableData = data.list
        this.total = data.counts
      } catch (error) {
        console.log(error)
      }
    },
    usersAdd() {
      this.dialogFormVisible = true
    },
    editRole(row) {
      console.log(row)
      this.$refs.usersAdd.formBase = { ...row }
      this.dialogFormVisible = true
    },
    async delRole(id) {
      try {
        await this.$confirm('确认删除该角色吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await remove(
          { id: id }
          // { id: ids }
        )
        console.log(res)
        // 刷新列表
        this.list()
      } catch (error) {
        console.log('cancel')
      }
    }
  }
}
</script>
<style scoped lang='less'>
.app {
  margin: 10px;
  background-color: #fff;
  padding: 0 20px;
}

.main {
  width: 100%;
  // margin: 10px;
  // background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.el-row {
  position: relative;
  margin: 10px 0;
}
</style>
