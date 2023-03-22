<template>
	<!-- 搜索 -->
	<uni-search-bar v-model:value="searchFormState.searchKey" @confirm="searchConfirm"></uni-search-bar>
	<!-- 自定义面包屑 -->
	<view class="padding-sm" style="white-space: nowrap; overflow-x: scroll; background-color: white;">
		<text v-for="(item, index) in allSelOrg" class="text-center"
			:class="index === (allSelOrg.length-1) ? 'text-grey' : 'text-cyan'"
			style="display: inline-block; margin-left: 5px;" @click="clickOrgCru(item, index)">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>

	<uni-list style="background-color: #ededed;">
		<!-- 机构 -->
		<view style="margin-top: 5px;">
			<uni-list-item v-for="(item, index) in curSelOrg" :key="index" :title="item.name" :showArrow="true"
				:clickable="true" @click="clickOrg(item, index)"></uni-list-item>
		</view>

		<!-- 人员 -->
		<view style="margin-top: 5px;">
			<uni-list :border="false">
				<uni-list-chat v-for="(item, index) in userData" :key="index" :title="item.name" :avatar="item.avatar"
					:note="item.orgName + ' | '+ item.positionName +' | '+item.genderName" :time="item.entryDate"
					:clickable="true" @click="moreClick(item)">
				</uni-list-chat>
			</uni-list>
		</view>
	</uni-list>
	<uni-load-more status="noMore" />

	<!-- 新增悬浮按钮 -->
	<uni-fab v-if="hasPerm('mobileBizUserAdd')" :pattern="{
			color: '#7A7E83',
			backgroundColor: '#fff',
			selectedColor: '#007AFF',
			buttonColor: '#007AFF',
			iconColor: '#fff'
		}" horizontal="right" vertical="bottom" direction="horizontal" @fabClick="add"></uni-fab>

	<!-- 更多操作 -->
	<morePopup ref="morePopupRef" @handleOk="loadData(true)"></morePopup>
</template>

<script setup>
	import morePopup from '@/pages/biz/user/more-popup.vue'

	import {
		orgTree
	} from '@/api/biz/bizOrgApi'
	import {
		userPage
	} from '@/api/biz/bizUserApi'
	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue"
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"

	// 新增悬浮按钮
	const add = () => {
		uni.navigateTo({
			url: '/pages/biz/user/form'
		})
	}
	// 更多操作
	const morePopupRef = ref()
	const moreClick = (record) => {
		morePopupRef.value.open(record)
	}

	// 所有选择的机构
	let allSelOrg = ref([])
	// 当前选择的机构
	let curSelOrg = ref([])
	orgTree().then(res => {
		curSelOrg.value = res.data
		allSelOrg.value.push({
			id: '0',
			name: '顶级',
			children: res.data
		})
	})

	// 用户相关逻辑
	let searchFormState = reactive({})
	let parameter = reactive({
		current: 1,
		size: 10
	})
	let userData = ref([])

	// 查询
	const searchConfirm = ({
		value
	}) => {
		searchFormState.searchKey = value
		uni.startPullDownRefresh()
	}
	// 加载数据
	const loadData = (isReset = false) => {
		if (isReset) {
			// 重置分页
			parameter.current = 1
			// 重置数据
			userData.value = []
		}

		Object.assign(parameter, searchFormState)
		userPage(parameter).then(res => {
			if (res.data && res.data.records && res.data.records.length > 0) {
				userData.value = userData.value.concat(res.data.records)
				parameter.current++
			}
			uni.stopPullDownRefresh()
		})
	}
	loadData(true)

	// 点击机构面包屑
	const clickOrgCru = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.splice(index + 1, allSelOrg.value.length - (index + 1))

		searchFormState.orgId = (item.id === '0' ? null : item.id)
		// uni.startPullDownRefresh()
		loadData(true)
	}
	// 点击机构
	const clickOrg = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.push(item)

		searchFormState.orgId = item.id
		// uni.startPullDownRefresh()
		loadData(true)
	}

	// 展示
	onShow(() => {
		uni.$on('formBack', (data) => {
			loadData(true)
		})
	})

	// 下拉刷新
	onPullDownRefresh(() => {
		loadData(true)
	})
	// 上拉加载
	onReachBottom(() => {
		loadData()
	})
</script>
