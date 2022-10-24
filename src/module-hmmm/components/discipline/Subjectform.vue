<template>
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="序号" type="index" width="100"> </el-table-column>
      <el-table-column label="所属学科" prop="subjectName"> </el-table-column>
      <el-table-column :label="text.tab">
        <template slot-scope="{ row }">
          {{ row.directoryName ? row.directoryName : row.tagName }}
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="{ row }">
          {{ row.username ? row.username : "录入管理员" }}
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="180">
        <template slot-scope="{ row }">
          {{ row.addDate | parseTimeByString }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="{ row }">
          {{ row.state === 1 ? "已启用" : "已禁用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template slot-scope="{ row }">
          <el-button type="text" @click="$emit('btnswitch',row)">{{
            isstate(row)
          }}</el-button>
          <el-button type="text" :disabled="row.state === 1" @click="$emit('isvisible',row)">修改</el-button>
          <el-button
            type="text"
            :disabled="row.state === 1"
            @click="$emit('open', row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- ---------- -->
    <!-- 分页 -->

    <!-- ---------- -->
    <!-- 修改弹出层 -->

    <!-- ----------- -->
  </div>
</template>

<script>
export default {
    props: {
        text: {
            path: Object,
            required: true
        },
        list: {
            path: Array,
            required: true
        }

    },
    data() {
        return {
            discipline: {
                subjectName: ''
            },
            pig: '学科名称',
            state: 0,
            isfromvisible: false

        }
    },
    created() {},
    watch: {},
    methods: {
        isvisible() {
            this.$emit('update:dialogVisible', false)
        }
    },
    computed: {
        isstate() {
            return function (row) {
                return row.state === 1 ? '禁用' : '启用'
            }
        }
    }
}
</script>

<style>
</style>