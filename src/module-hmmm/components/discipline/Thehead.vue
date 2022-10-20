<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col :span="20">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item :label="text.name">
            <el-input v-model="page.subjectName"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="page.region" placeholder="请选择">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="remove">清除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Searchthediscipline"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button type="success" icon="el-icon-edit" @click="triggerevent"
          >{{text.btnname}}</el-button
        >
      </el-col>
    </el-row>
    <el-alert :closable="false" :title="`数据一共${text.counts}条`" type="info" show-icon>
    </el-alert>
  </div>
</template>

<script>
export default {
    props: {
        text: {
            path: Object,
            required: true
        }
    },
    data() {
        return {
            attribute: {},
            page: {
                subjectName: '',
                state: '',
                page: 1,
                pagesize: 10,
                region: ''
            },
            list: {}
        }
    },
    created() {
        this.list = this.$route.query.row
    },
    methods: {
        Searchthediscipline() {
            this.$emit('searchcipline', this.page)
        },
        triggerevent() {
            this.$emit('update:dialogVisible', true)
        },
        remove() {
            this.page.subjectName = ''
            this.page.region = ''
        }
    }
}
</script>

<style>
</style>