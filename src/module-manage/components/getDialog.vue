<template>
  <div>
    <el-dialog
      :title="title"
      :visible="visible"
      width="50%"
      :before-close="handleClose"
    >
      <slot name="header"></slot>
      <slot name="body"> </slot>
      <span slot="footer" class="dialog-footer">
        <slot name="footer"></slot
      ></span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      Number,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClose() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form {
  // margin: 0 auto;
  width: 400px;
  margin-left: 120px;
}
</style>
