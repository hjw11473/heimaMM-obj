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
      <div><slot name="footer"></slot></div>
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
  created() {
    console.log(1);
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

<style></style>
