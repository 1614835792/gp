<template>
	<view class="padding-sm" style="white-space: nowrap; overflow-x: scroll; background-color: white;">
		<text v-for="(item, index) in allSelOrg" class="text-center"
			:class="index === (allSelOrg.length-1) ? 'text-grey' : 'text-cyan'"
			style="display: inline-block; margin-left: 5px;" @click="clickOrgCru(item, index)">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>
	<uni-list style="background-color: #ededed;">
		<view style="margin-top: 5px;">
			<uni-list-item v-for="(item, index) in curSelOrg" :key="index">
				<!-- :title="item.name"
				:showArrow="item.children? true : false"
				:clickable="item.children? true : false"
				@click="clickOrg(item, index)" -->

				<!-- 名称 -->
				<template v-slot:body>
					<!-- color: #1cbbb4; @click="clickOrg(item, index)"-->
					<text style="flex: 1;font-size: 14px; margin-right: 10px;"
						@click="morePopupRef.open(item)">{{item.name}}</text>
				</template>
				<!-- 右侧icon -->
				<template v-slot:footer>
					<uni-icons v-if="item.children? true : false" type="right" @click="clickOrg(item, index)">
					</uni-icons>
				</template>
			</uni-list-item>
		</view>
	</uni-list>

	<!-- 新增悬浮按钮 -->
	<uni-fab v-if="hasPerm('mobileBizOrgAdd')" :pattern="{
			color: '#7A7E83',
			backgroundColor: '#fff',
			selectedColor: '#007AFF',
			buttonColor: '#007AFF',
			iconColor: '#fff'
		}" horizontal="right" vertical="bottom" direction="horizontal" @fabClick="add"></uni-fab>

	<!-- 更多操作 -->
	<morePopup ref="morePopupRef" @handleOk="loadData()"></morePopup>
</template>

<script setup>
	import {
		orgTree
	} from '@/api/biz/bizOrgApi'

	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"

	import morePopup from '@/pages/biz/org/more-popup.vue'

	const morePopupRef = ref()

	// 所有选择的机构
	let allSelOrg = ref([])
	// 当前选择的机构
	let curSelOrg = ref([])

	// 展示
	onShow(() => {
		uni.$on('formBack', (data) => {
			loadData()
		})
	})

	const loadData = () => {
		orgTree().then(res => {
			curSelOrg.value = res.data
			allSelOrg.value = [{
				id: '0',
				name: '全部',
				children: res.data
			}]
		})
	}
	loadData()

	const clickOrgCru = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.splice(index + 1, allSelOrg.value.length - (index + 1))
	}

	const clickOrg = (item, index) => {
		if (item.children) {
			curSelOrg.value = item.children
			allSelOrg.value.push(item)
		}
	}

	// 新增悬浮按钮
	const add = () => {
		uni.navigateTo({
			url: '/pages/biz/org/form'
		})
	}
</script>
