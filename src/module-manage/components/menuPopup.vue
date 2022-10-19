<template>
    <div>
    <el-dialog
    title="创建菜单"
    :visible="childShow"
    width="50%"
    @close="onclose"
    @open="onOpen">

    <el-form ref="form"  label-width="100px"  :model="ruleForm" :rules="rules"  class="demo-ruleForm" >
        <el-form-item label="权限组名称" prop="isPoint">
            <el-radio-group v-model="ruleForm.is_point">
            <el-radio :label="!flag" :disabled="disabled">菜单</el-radio>
            <el-radio :label="flag" :disabled="disabled">权限点</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="权限组名称" >
            <el-select  v-model="ruleForm.pid">
                <el-option v-for="item in tableData" :key="item.id"  :label="item.title" :value='item.id'>
                </el-option>
                <!-- <el-tree ref="tree" :data="tableData" :props="defaultProps" node-key="id" default-expand-all :default-checked-keys="defCheckKeys" /> -->
            </el-select>
        </el-form-item >
        <div v-if="showMenuBlock">
            <el-form-item label="权限代码" prop="code" >
                <el-input v-model="ruleForm.code" style="width:280px;" ></el-input>
            </el-form-item>
            <el-form-item label="权限标题" prop="title">
                <el-input v-model="ruleForm.title" style="width:280px;"></el-input>
            </el-form-item>
        </div>
        <div v-if="showPointBlock" :model="formPoints">
            <el-form-item label="权限代码" prop="code" >
                <el-input v-model="formPoints.code" style="width:280px;" ></el-input>
            </el-form-item>
            <el-form-item label="权限标题" prop="title">
                <el-input v-model="formPoints.title" style="width:280px;"></el-input>
            </el-form-item>
        </div>
    </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button  @click="onclose">取 消</el-button>
            <el-button type="primary" @click="saveRoleMenu" >确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>

<script>
import { add as menusAdd, detail as detailMenus, update as updateMenus } from '@/api/base/menus.js'
import { tranListToTreeData } from '@/utils'

export default {
    props: {
        childShow: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: () => []
        },
        EditId: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            // defCheckKeys: [],
            data: [],
            // dialogVisible: false
            showMenuBlock: true,
            showPointBlock: false,
            flag: true,
            disabled: false,
            ruleForm: {
                pid: '', // 父级Id
                // ispoint: '', // 是否权限点
                is_point: false,
                code: '', // 菜单代码
                title: '' // 标题
            },
            formPoints: {
                pid: '', // 父级Id
                is_point: '', // 是否权限点
                code: '', // 菜单代码
                title: '' // 标题
            },
            rules: {
                code: [
                    { required: true, message: '代码不能为空', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ]
            },
            defaultProps: {
                label: 'title',
                children: 'childs'
            }
        }
    },

    created() {

    },
    methods: {
        onclose() {
            this.$emit('update:childShow', false)
        },
        async onOpen() {
            this.data = tranListToTreeData(this.tableData, '')
            console.log(this.data)
            if (this.EditId.id) {
                this.disabled = true
                if (this.EditId.is_point) this.flag = false
                this.showMenuBlock = false
                this.showPointBlock = true
                console.log(this.EditId)
                const { data } = await detailMenus(this.EditId)
                this.formPoints.pid = data.pid
                this.formPoints.is_point = data.is_point
                this.formPoints.code = data.code
                this.formPoints.title = data.title
                this.ruleForm.code = this.formPoints.code
                this.ruleForm.title = this.formPoints.title
            }
        },
        async saveRoleMenu() {
            console.log(this.showPointBlock)
            try {
                if (this.showPointBlock) {
                    this.ruleForm.code = this.formPoints.code
                    this.ruleForm.title = this.formPoints.title
                    console.log(this.ruleForm)
                    await updateMenus({ id: this.EditId.id, ...this.formPoints })
                    this.$message.success('更改成功')
                }
                if (this.showMenuBlock) {
                    await menusAdd(this.ruleForm)
                    this.$message.success('添加成功')
                }
            } catch (error) {
                this.$message.error('操作失败')
            } finally {
                this.onclose()
                this.$emit('Refresh')
                this.ruleForm = {
                    pid: '', // 父级Id
                    // ispoint: '', // 是否权限点
                    is_point: false,
                    code: '', // 菜单代码
                    title: '' // 标题
                }
                this.formPoints = {
                    pid: '', // 父级Id
                    is_point: '', // 是否权限点
                    code: '', // 菜单代码
                    title: '' // 标题
                }
                this.showMenuBlock = false
                this.showPointBlock = true
                this.flag = true
                this.disabled = false
            }
        }
    }

}
</script>

<style>
    .demo-ruleForm {
        padding:0 50px 0 140px;
    }
</style>