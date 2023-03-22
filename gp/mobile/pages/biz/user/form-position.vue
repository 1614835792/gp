<template>
	<button type="primary" @click="add" :plain="true">增加任职</button>
	<view v-for="(item, index) in dataList" style="margin: 30px 0;">
		<uni-forms :key="index" :ref="`formRef${ index }`" :model="item" label-position="left" validate-trigger="submit"
			labelWidth="50px">
			<uni-forms-item label="机构" name="orgId" required :rules="[{ required: true, errorMessage: '请选择机构' }]">
				<!-- 多选属性:isMultiple="true" -->
				<snowy-org-picker v-model="item.orgId" placeholder="请选择机构" @confirm="(data)=>{orgChange(data,index)}">
				</snowy-org-picker>
			</uni-forms-item>
			<uni-forms-item label="职位" name="positionId" required :rules="[{ required: true, errorMessage: '请选择职位' }]">
				<snowy-sel-picker :map="{key: 'id', label: 'name'}" v-model="item.positionId"
					:rangeData="positionDataList[index]" placeholder="请选择选择职位"></snowy-sel-picker>
			</uni-forms-item>
			<uni-forms-item label="主管" name="directorId">
				<!-- 多选属性:isMultiple="true" -->
				<snowy-user-picker v-model="item.directorId" placeholder="请选择主管">
				</snowy-user-picker>
			</uni-forms-item>
		</uni-forms>
		<button type="warn" style="margin-bottom: 10px;" @click="del(index)" :plain="true">删除任职</button>

	</view>
</template>

<script setup>
	import SnowyOrgPicker from '@/components/snowy-org-picker.vue'
	import SnowyUserPicker from '@/components/snowy-user-picker.vue'
	import SnowySelPicker from '@/components/snowy-sel-picker.vue'
	import {
		userPositionSelector
	} from '@/api/biz/bizUserApi'
	import XEUtils from 'xe-utils'
	import {
		nextTick,
		reactive,
		ref,
		watch,
		getCurrentInstance
	} from "vue"
	const {
		proxy
	} = getCurrentInstance()
	const emits = defineEmits(['update:modelValue'])
	const props = defineProps({
		modelValue: {
			type: String,
			default: '',
			requre: false
		},
	})

	// 数据列表
	let dataList = ref([])
	// 职位
	let positionDataList = ref([])

	watch(() => props.modelValue, (newValue, oldValue) => {
		loadData()
	}, {
		deep: false,
		immediate: false
	})

	const loadData = ()=>{
		if(props.modelValue){
			dataList.value = XEUtils.clone(JSON.parse(props.modelValue), true)
		}else{
			dataList.value = []
		}
		dataList.value.forEach((item, index) => {
			const param = {
				orgId: item.orgId
			}
			userPositionSelector(param).then(res => {
				positionDataList.value[index] = res.data
			})
		})
	}

	loadData()

	// 新增
	const add = () => {
		// console.log(JSON.parse(JSON.stringify(props.modelValue)))
		dataList.value.unshift({
			orgId: "",
			positionId: "",
			directorId: ""
		})
		positionDataList.value.unshift([])
	}
	// 组织变换
	const orgChange = ({
		curSelOrgId,
		curSelOrg
	}, index) => {
		dataList.value[index].positionId = null
		const param = {
			orgId: curSelOrgId
		}
		userPositionSelector(param).then(res => {
			positionDataList.value[index] = res.data
		})
	}
	// 删除
	const del = (index) => {
		dataList.value.splice(index, 1);
		positionDataList.value.splice(index, 1);
	}
	// 表单校验
	const formListEmitAndValidate = () => {
		// 更新数据
		if(dataList.value && dataList.value.length > 0){
			emits('update:modelValue', JSON.stringify(dataList.value))
		}
		// 校验逻辑
		const promiseList = []
		dataList.value.forEach((item, index) => {
			promiseList.push(new Promise((resolve, reject) => {
				proxy.$refs[`formRef${ index }`][0].validate().then(result => {
					resolve(result)
				}).catch(err => {
					reject(err)
				})
			}))
		})
		return new Promise((resolve, reject) => {
			Promise.all(promiseList).then((result) => {
				resolve(result)
			}).catch(err=>{
				reject(err)
			})
		})
	}
	defineExpose({
		formListEmitAndValidate
	})
</script>
