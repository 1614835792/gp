<template>
    <a-card :bordered="false">
        <a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
            <a-row :gutter="24">
                <a-col :span="6">
                    <a-form-item label="账号" name="account">
                        <a-input v-model:value="searchFormState.account" placeholder="请输入账号" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="密码" name="password">
                        <a-input v-model:value="searchFormState.password" placeholder="请输入密码" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="姓名" name="name">
                        <a-input v-model:value="searchFormState.name" placeholder="请输入姓名" />
                    </a-form-item>
                </a-col>
                <a-col :span="6" v-show="advanced">
                    <a-form-item label="昵称" name="nickname">
                        <a-input v-model:value="searchFormState.nickname" placeholder="请输入昵称" />
                    </a-form-item>
                </a-col>
                <a-col :span="6" v-show="advanced">
                    <a-form-item label="手机" name="phone">
                        <a-input v-model:value="searchFormState.phone" placeholder="请输入手机" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-button type="primary" @click="table.refresh(true)">查询</a-button>
                    <a-button style="margin: 0 8px" @click="reset">重置</a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                        {{ advanced ? '收起' : '展开' }}
                        <component :is="advanced ? 'up-outlined' : 'down-outlined'"/>
                    </a>
                </a-col>
            </a-row>
        </a-form>
        <s-table
            ref="table"
            :columns="columns"
            :data="loadData"
            :alert="options.alert.show"
            bordered
            :row-key="(record) => record.id"
            :tool-config="toolConfig"
            :row-selection="options.rowSelection"
        >
            <template #operator class="table-operator">
                <a-space>
                    <a-button type="primary" @click="formRef.onOpen()" v-if="hasPerm('clientUserAdd')">
                        <template #icon><plus-outlined /></template>
                        新增
                    </a-button>
                    <xn-batch-delete
                        v-if="hasPerm('clientUserBatchDelete')"
                        :selectedRowKeys="selectedRowKeys"
                        @batchDelete="deleteBatchClientUser()"
                    />
                </a-space>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                    <a-space>
                        <a @click="formRef.onOpen(record)" v-if="hasPerm('clientUserEdit')">编辑</a>
                        <a-divider type="vertical" v-if="hasPerm(['clientUserEdit', 'clientUserDelete'], 'and')" />
                        <a-popconfirm title="确定要删除吗？" @confirm="deleteClientUser(record)">
                            <a-button type="link" danger size="small" v-if="hasPerm('clientUserDelete')">删除</a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </s-table>
    </a-card>
    <Form ref="formRef" @successful="table.refresh(true)" />
</template>

<script setup name="clientUser">
    import Form from './form.vue'
    import clientUserApi from '@/api/biz/clientUserApi'
    let searchFormState = reactive({})
    const searchFormRef = ref()
    const table = ref()
    const formRef = ref()
    const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
    // 查询区域显示更多控制
    const advanced = ref(false)
    const toggleAdvanced = () => {
        advanced.value = !advanced.value
    }
    const columns = [
        {
            title: '账号',
            dataIndex: 'account'
        },
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '昵称',
            dataIndex: 'nickname'
        },
        {
            title: '手机',
            dataIndex: 'phone'
        },
        {
            title: '上次登录ip',
            dataIndex: 'lastLoginIp'
        },
        {
            title: '上次登录地点',
            dataIndex: 'lastLoginAddress'
        },
        {
            title: '上次登录时间',
            dataIndex: 'lastLoginTime'
        },
        {
            title: '上次登录设备',
            dataIndex: 'lastLoginDevice'
        },
        {
            title: '最新登录ip',
            dataIndex: 'latestLoginIp'
        },
        {
            title: '最新登录地点',
            dataIndex: 'latestLoginAddress'
        },
        {
            title: '最新登录时间',
            dataIndex: 'latestLoginTime'
        },
        {
            title: '最新登录设备',
            dataIndex: 'latestLoginDevice'
        },
        {
            title: '用户状态',
            dataIndex: 'userStatus'
        },
        {
            title: '排序码',
            dataIndex: 'sortCode'
        },
        {
            title: '扩展信息',
            dataIndex: 'extJson'
        },
    ]
    // 操作栏通过权限判断是否显示
    if (hasPerm(['clientUserEdit', 'clientUserDelete'])) {
        columns.push({
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: '150px'
        })
    }
    const selectedRowKeys = ref([])
    // 列表选择配置
    const options = {
        // columns数字类型字段加入 needTotal: true 可以勾选自动算账
        alert: {
            show: true,
            clear: () => {
                selectedRowKeys.value = ref([])
            }
        },
        rowSelection: {
            onChange: (selectedRowKey, selectedRows) => {
                selectedRowKeys.value = selectedRowKey
            }
        }
    }
    const loadData = (parameter) => {
        const searchFormParam = JSON.parse(JSON.stringify(searchFormState))
        return clientUserApi.clientUserPage(Object.assign(parameter, searchFormParam)).then((data) => {
            return data
        })
    }
    // 重置
    const reset = () => {
        searchFormRef.value.resetFields();
        table.value.refresh(true)
    }
    // 删除
    const deleteClientUser = (record) => {
        let params = [
            {
                id: record.id
            }
        ]
        clientUserApi.clientUserDelete(params).then(() => {
            table.value.refresh(true)
        })
    }
    // 批量删除
    const deleteBatchClientUser = (params) => {
        clientUserApi.clientUserDelete(params).then(() => {
            table.value.clearRefreshSelected()
        })
    }
</script>
