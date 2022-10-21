<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-form
      :model="searchInfo"
      ref="searchInfo"
      label-width="100px"
      :inline="true"
      class="form"
      size="small"
    >
      <el-form-item prop="age">
        <el-input
          v-model.number="searchInfo.title"
          placeholder="根据用户名搜索"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">清除</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="success" @click="powerVisible = true">
          <i class="el-icon-edit"></i> 新增权限组</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 搜索框 -->
    <!-- 提示文案 -->
    <el-alert
      :title="
        tableData.counts ? '共' + tableData.counts + '条记录' : '共0条记录'
      "
      type="info"
      show-icon
      style="margin: 10px 0 20px 0"
    >
    </el-alert>
    <!-- 提示文案 -->
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData.list"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa' }"
    >
      <el-table-column type="selection" min-width="5%"> </el-table-column>
      <el-table-column
        label="用户名"
        min-width="42%"
        align="center"
        prop="title"
      >
      </el-table-column>
      <el-table-column
        prop="create_date"
        label="日期"
        min-width="42%"
        sortable
        :formatter="dateFormat"
      >
      </el-table-column>

      <el-table-column
        prop="address"
        label="操作"
        show-overflow-tooltip
        min-width="11%"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="update(scope)"
            style="color: #409eff; background: #ecf5ff; border-color: #b3d8ff"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="del(scope)"
            style="color: #f56c6c; background: #fef0f0; border-color: #fbc4c4"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <!-- 分页组件 -->
    <el-pagination
      background
      layout="->,prev, pager, next,sizes,jumper"
      :total="tableData.counts"
      :page-sizes="[10, 20, 30, 50]"
      @current-change="currentChange"
      @size-change="sizeChange"
      style="margin-top: 20px"
    >
    </el-pagination>
    <!-- 分页组件 -->
    <!-- 新增权限组弹出层 -->
    <getdialog
      :visible.sync="powerVisible"
      title="创建权限组"
      @cancel="
        powerVisible = false;
        powernum.title = '';
      "
    >
      <template #body>
        <el-form
          :model="powernum"
          :rules="rules"
          ref="powernum"
          label-width="120px"
        >
          <el-form-item label="用户名" label-width="120px" prop="name">
            <el-input v-model="powernum.title"></el-input>
          </el-form-item>
          <el-form-item label="权限分配">
            <el-tree
              ref="tree"
              :data="data"
              :props="props"
              node-key="id"
              :default-expanded-keys="[1]"
              show-checkbox
              @check="handleNodeClick"
            >
            </el-tree>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer" slot="footer">
          <el-button
            @click="
              powerVisible = false;
              powernum.title = '';
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </template>
    </getdialog>
    <!-- 新增权限弹出层 -->
    <!-- 修改权限弹出层 -->
    <getdialog
      :visible.sync="alterVisible"
      title="修改权限组"
      @cancel="
        alterVisible = false;
        powernum.title = '';
      "
    >
      <template #body>
        <el-form
          :model="powernum"
          :rules="rules"
          ref="powernum"
          label-width="120px"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="powernum.title"></el-input>
          </el-form-item>
          <el-form-item label="权限分配">
            <el-tree
              ref="tree"
              :data="data"
              :props="props"
              node-key="id"
              :default-expanded-keys="[1]"
              show-checkbox
              @check="handleNodeClick"
              :default-checked-keys="powernum.permissions"
            >
            </el-tree>
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="abolish">取 消</el-button>
          <el-button type="primary" @click="alter">确 定</el-button>
        </span>
      </template>
    </getdialog>
    <!-- 修改权限弹出层 -->
  </div>
</template>

<script>
import moment from "moment";
import getdialog from "../components/getDialog";
import { list, add, remove, update, detail } from "@/api/base/permissions";
import { list as listmenu } from "@/api/base/menus";

export default {
  components: {
    getdialog,
  },
  data() {
    return {
      //树状图信息
      data: [
        {
          title: "系统菜单和页面权限点",
          childs: [],
          id: 0,
        },
      ],
      //树状图指定label和children
      props: {
        label: "title",
        children: "childs",
      },
      // 表单校验规则
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      },
      tableData: [], //表格参数
      searchInfo: {
        page: "1",
        pagesize: "10",
        title: "",
      }, //查询请求参数
      set: {
        title: "",
        permissions: "",
      }, //创建请求参数
      powernum: {
        title: "",
        permissions: [], //权限
        id: "",
      }, //权限组请求参数
      powerVisible: false, //控制权限组弹出层
      alterVisible: false, //控制修改权限弹出层
    };
  },
  created() {
    this.getList();
    this.getMenus();
  },
  methods: {
    //获取列表数据
    async getList() {
      const { data } = await list(this.searchInfo);
      this.tableData = data;
    },
    //时间格式化
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    // 搜索按钮
    async search() {
      const { data } = await list(this.searchInfo);
      this.tableData = data;
    },
    // 清除按钮
    reset() {
      this.searchInfo.title = "";
      this.getList();
    },
    // 新增权限组
    async add() {
      try {
        const res = await add(this.powernum);
        this.dialogVisible = false;
        this.$message("新增成功");
      } catch (err) {
        console.log(err);
        this.$message(err);
      }
    },
    //点击修改并获取详情
    async update(scope) {
      this.alterVisible = true;
      this.powernum.title = scope.row.title;
      const res = await detail(scope.row);
      this.powernum.permissions = res.data.permissions;
      this.data[0].permissions = this.powernum.permissions;
      this.powernum.id = scope.row.id;
    },
    // 修改权限组
    async alter() {
      try {
        const res = await update(this.powernum);
        this.$message("修改权限成功");
      } catch (err) {
        console.log(err);
        this.$message("修改权限失败");
      }
    },
    // 获取权限分配列表
    async getMenus() {
      const res = await listmenu();
      this.data[0].childs = res.data;
      this.data[0].id = 1;
      res.data.map((i) => {
        if (i.childs)
          i.childs.map((mes) => {
            if (mes.childs) mes.childs = mes.points;
          });
      });
      console.log(this.data);
    },
    //删除
    async del(scope) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          await remove({
            id: scope.row.id,
          });
          console.log(1);
          this.getList();
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          console.log(err);
        });
    },
    //tree点击事件，可以获取到点击点对应数据
    handleNodeClick(data, res) {
      if (data.childs) {
        this.powernum.permissions.push(data.id);
        if (data.childs.childs) {
          this.powernum.permissions.push(data.childs.id);
        }
      } else {
        this.powernum.permissions.push(data.id);
      }
      this.powernum.permissions = res.checkedNodes.map(function (i) {
        return i.id;
      });
      this.data[0].permissions = this.powernum.permissions;
      console.log(this.powernum.permissions);
    },
    //页面跳转
    currentChange(page) {
      this.searchInfo.page = page;
      this.getList(this.searchInfo);
    },
    //页面size发生改变
    sizeChange(pagesize) {
      this.searchInfo.pagesize = pagesize;
      this.getList(this.searchInfo);
    },
    //取消弹出层并清空数据
    abolish() {
      // 首先获取node
      let node = this.$refs.tree.getNode(this.data[0].id).parent;
      // 这里的this.data是指的树的数据;而id是指，:node-key="id"这里的id。从而获取到整个树的node
      // 然后便历树，将所有的checked改成false
      node.childNodes.map((val) => {
        val.checked = false;
        if (val.childNodes && val.childNodes.length > 0) {
          val.childNodes.map((value) => {
            value.checked = false;
          });
        }
      });
      this.alterVisible = false;
      this.powernum.title = "";
    },
  },
};
</script>

<style scoped lang="less">
.app-container {
  margin: 20px;
  background-color: #fff;
}
.form {
  position: relative;
}
.fr {
  position: absolute;
  right: 0;
}

::v-deep .el-tree-node__content {
  height: 36px;
}
::v-deep .el-tree {
  margin-top: 8px;
}
::v-deep .el-form--inline {
  height: 33px;
  margin-bottom: 18px;
}
</style>
