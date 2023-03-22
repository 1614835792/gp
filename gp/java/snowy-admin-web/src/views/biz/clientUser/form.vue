<template>
    <a-drawer
        :title="formData.id ? '编辑C端用户' : '增加C端用户'"
        :width="600"
        :visible="visible"
        :destroy-on-close="true"
        :footer-style="{ textAlign: 'right' }"
        @close="onClose"
    >
        <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
            <a-form-item label="账号：" name="account">
                <a-input v-model:value="formData.account" placeholder="请输入账号" allow-clear />
            </a-form-item>
            <a-form-item label="密码：" name="password">
                <a-input v-model:value="formData.password" placeholder="请输入密码" allow-clear />
            </a-form-item>
            <a-form-item label="姓名：" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入姓名" allow-clear />
            </a-form-item>
            <a-form-item label="昵称：" name="nickname">
                <a-input v-model:value="formData.nickname" placeholder="请输入昵称" allow-clear />
            </a-form-item>
            <a-form-item label="手机：" name="phone">
                <a-input v-model:value="formData.phone" placeholder="请输入手机" allow-clear />
            </a-form-item>
            <a-form-item label="用户状态：" name="userStatus">
                <a-input v-model:value="formData.userStatus" placeholder="请输入用户状态" allow-clear />
            </a-form-item>
            <a-form-item label="排序码：" name="sortCode">
                <a-input v-model:value="formData.sortCode" placeholder="请输入排序码" allow-clear />
            </a-form-item>
            <a-form-item label="扩展信息：" name="extJson">
                <a-input v-model:value="formData.extJson" placeholder="请输入扩展信息" allow-clear />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
            <a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
        </template>
    </a-drawer>
</template>

<script setup name="clientUserForm">
    import { cloneDeep } from 'lodash-es'
    import { required } from '@/utils/formRules'
    import clientUserApi from '@/api/biz/clientUserApi'
    // 抽屉状态
    const visible = ref(false)
    const emit = defineEmits({ successful: null })
    const formRef = ref()
    // 表单数据
    const formData = ref({})
    const submitLoading = ref(false)

    // 打开抽屉
    const onOpen = (record) => {
        visible.value = true
        if (record) {
            let recordData = cloneDeep(record)
            formData.value = Object.assign({}, recordData)
        }
    }
    // 关闭抽屉
    const onClose = () => {
        formRef.value.resetFields()
        formData.value = {}
        visible.value = false
    }
    // 默认要校验的
    const formRules = {
    }
    // 验证并提交数据
    const onSubmit = () => {
        formRef.value.validate().then(() => {
            submitLoading.value = true
            const formDataParam = cloneDeep(formData.value)
            clientUserApi
                .clientUserSubmitForm(formDataParam, !formDataParam.id)
                .then(() => {
                    onClose()
                    emit('successful')
                })
                .finally(() => {
                    submitLoading.value = false
                })
        })
    }
    // 抛出函数
    defineExpose({
        onOpen
    })
</script>
