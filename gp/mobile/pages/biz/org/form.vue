<template>
	<view class="container">
		<uni-forms ref="formRef" :model="formData" label-position="left" labelWidth="75px">
			<uni-forms-item label="上级机构" name="parentId" required :rules="[{ required: true, errorMessage: '请选择上级机构' }]">
				<snowy-org-picker v-model="formData.parentId" :isTopLevel="true" placeholder="请选择上级机构">
				</snowy-org-picker>
			</uni-forms-item>
			<uni-forms-item label="机构名称" name="name" required :rules="[{ required: true, errorMessage: '请输入机构名称' }]">
				<uni-easyinput v-model="formData.name" placeholder="请输入机构名称"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="机构分类" name="category" required
				:rules="[{ required: true, errorMessage: '请选择机构分类' }]">
				<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.category"
					:rangeData="orgCategoryOptions" placeholder="请选择机构分类"></snowy-sel-picker>
			</uni-forms-item>
			<uni-forms-item label="排序" name="sortCode" required :rules="[{ required: true, errorMessage: '请选择排序' }]">
				<uni-number-box v-model="formData.sortCode" background="#2979FF" color="#fff" :step="1" :max="100"></uni-number-box>
			</uni-forms-item>
			
			<uni-forms-item label="指定主管" name="directorId" >
				<snowy-user-picker v-model="formData.directorId" placeholder="请选择主管">
				</snowy-user-picker>
			</uni-forms-item>
			
			
		</uni-forms>
		<button type="primary" @click="submit">提交</button>
	</view>
</template>

<script setup>
	import {
		nextTick,
		reactive,
		ref
	} from "vue"
	import SnowyOrgPicker from '@/components/snowy-org-picker.vue'
	import SnowySelPicker from '@/components/snowy-sel-picker.vue'
	import SnowyUserPicker from '@/components/snowy-user-picker.vue'
	import tool from '@/plugins/tool'
	import { orgDetail, submitForm } from '@/api/biz/bizOrgApi.js'
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"
	
	const formRef = ref()
	let formData = ref({
		sortCode: 99
	})
	const orgCategoryOptions = tool.dictList('ORG_CATEGORY')
	// 加載
	onLoad((option) => {
		if(!option.id){
			return
		}
		orgDetail({
			id: option.id
		}).then(res => {
			formData.value = res.data
		})
	})
	
	const submit = () => {
		formRef.value.validate().then(res => {
			uni.showLoading()
			submitForm(formData.value, !formData.value.id).then(respond => {
				uni.hideLoading()
				uni.$emit('formBack', {
					data: respond.data
				})
				uni.navigateBack({
					delta: 1
				})
			})
		}).catch(err => {
			console.error('父表单错误信息：', err);
		})
	}
</script>

<style>
	.container {
		padding: 15px;
		background-color: #fff;
	}
</style>
