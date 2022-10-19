<template>
  <el-dialog
  title="预览文章"
  :visible="dialogVisible"
  width="50%"
  :before-close="handleClose">
  <div>
        <h2>{{ previewTheStructure.title }}</h2>
        <p class="pinfo">
          <span>{{ previewTheStructure.createTime | parseTimeByString }}</span>
          <span>{{ previewTheStructure.username }}</span>
          <span><i class="el-icon-view"></i> {{ previewTheStructure.visits }}</span>
        </p>
        <div class="count" v-html="previewTheStructure.articleBody"></div>
      </div>
</el-dialog>
</template>

<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        previewTheStructure: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:dialogVisible', false)
        }
    }
}
</script>

<style scoped lang='less'></style>
