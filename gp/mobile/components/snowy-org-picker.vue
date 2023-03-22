<template>
	<view class="snowy-org-picker">
		<view class="snowy-data-tree-input" @click="handleInput">
			<view :class="{ 'input-value-border': props.border }"
				style="font-size: 14px; line-height: 20px; padding: 10px 10px; height: 40px;">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelOrgId && curSelOrgId !== ''">
					{{ curSelOrg.name }}
				</view>
				<!-- 多选 -->
				<view v-else-if="!!isMultiple && curSelOrgId && curSelOrgId.length > 0"
					v-for="(item, key, index) in curSelOrg" :key="index"
					style="display:inline-block; margin: 0px 5px 0px 0px">
					{{ item.name }}
				</view>
				<view v-else style="color: grey;">
					{{placeholder}}
				</view>
			</view>
		</view>
		<uni-popup ref="popupRef" type="bottom" background-color="#fff" @maskClick="cancel">
			<view style="display: flex; justify-content: space-between; margin: 15px 15px; font-size: 30upx;">
				<view style="color:#8799a3" @click="cancel">
					取消
				</view>
				<view style="color:#1cbbb4" @click="confirm">
					确定
				</view>
			</view>

			<!-- 面包屑 -->
			<view class="padding-sm" style="white-space: nowrap; overflow-x: scroll; background-color: white;">
				<text v-for="(item, index) in allClickSelOrg" class="text-center"
					:class="index === (allClickSelOrg.length-1) ? 'text-grey' : 'text-cyan'"
					style="display: inline-block; margin-left: 5px;" @click="clickOrgCru(item, index)">
					{{ item.name + (index === (allClickSelOrg.length-1) ? '' : ' | ') }}
				</text>
			</view>
			<!-- 已选择 -->
			<view v-show="!!curSelOrgId && (!isMultiple? true : curSelOrgId.length > 0)"
				:style="{maxHeight:!isMultiple?'5vh':'10vh', overflowY: 'scroll'}">
				<!-- 单选已选择 -->
				<view v-if="!isMultiple" style="margin: 5px 15px; display:inline-block;">
					<view @click="delOrg(curSelOrg)" style="display:inline-block; vertical-align:top; color: #1cbbb4;">
						{{ curSelOrg.name }}
					</view>
					<uni-icons type="trash-filled" @click="delOrg(curSelOrg)" color="#1cbbb4" size="20"></uni-icons>
				</view>
				<!-- 多选已选择 -->
				<view v-if="!!isMultiple" v-for="(item, index) in curSelOrg"
					style="margin: 5px 0 5px 15px; display:inline-block;">
					<view @click="delOrg(item)" style="display:inline-block; vertical-align:top; color: #1cbbb4;">
						{{ item.name }}
					</view>
					<uni-icons type="trash-filled" @click="delOrg(item)" color="#1cbbb4" size="20"></uni-icons>
				</view>
			</view>
			<!-- 部门 -->
			<view style="width:100vw; height:40vh; overflow-y: scroll">
				<uni-list style="background-color: #ededed;">
					<view style="margin-top: 5px;">
						<uni-list-item v-for="(item, index) in curClickSelOrg" :key="index">
							<!-- 选择icon -->
							<template v-slot:header>
								<view class="slot-box">
									<uni-icons
										v-show="!isMultiple ? item.id != curSelOrgId: curSelOrgId.indexOf(item.id) == -1"
										type="circle" :size="25" @click="selOrg(item, index)"></uni-icons>
									<!-- <uni-icons v-show="!isMultiple ? item.id == curSelOrgId: true" type="checkbox" :size="25" color="green"></uni-icons> -->
									<uni-icons
										v-show="!isMultiple ? item.id == curSelOrgId: curSelOrgId.indexOf(item.id) != -1"
										type="checkbox-filled" :size="25" color="#1cbbb4" @click="delOrg(item, index)">
									</uni-icons>
								</view>
							</template>
							<!-- 名称 -->
							<template v-slot:body>
								<!-- color: #1cbbb4; -->
								<text style="flex: 1;font-size: 15px;  margin:2px 10px;"
									@click="clickOrg(item, index)">{{item.name}}</text>
							</template>
							<!-- 右侧icon -->
							<template v-slot:footer>
								<uni-icons v-if="item.children? true : false" type="right"
									@click="clickOrg(item, index)"></uni-icons>
							</template>
						</uni-list-item>
					</view>
				</uni-list>
			</view>

		</uni-popup>
	</view>
</template>

<script setup>
	import {
		orgTree
	} from '@/api/biz/bizOrgApi'

	import {
		reactive,
		ref,
		getCurrentInstance,
		watch,
		inject
	} from "vue";
	import XEUtils from 'xe-utils'

	const emits = defineEmits(['update:modelValue', 'cancel', 'confirm'])

	const props = defineProps({
		// value: [String, Array],
		modelValue: [String, Array],
		border: {
			type: Boolean,
			default: true,
			required: false
		},
		isMultiple: {
			type: Boolean,
			default: false,
			required: false
		},
		placeholder: {
			type: String,
			default: "请选择机构",
			required: false
		},
		isTopLevel: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	// 数据类型校验
	// if (props.value) {
	// 	if (!props.isMultiple && typeof props.value !== "string") {
	// 		console.error("单选所传value值应为字符串")
	// 	}
	// 	if (!!props.isMultiple && !Array.isArray(props.value)) {
	// 		console.error("多选所传value值应为数组")
	// 	}
	// }
	if (props.modelValue) {
		if (!props.isMultiple && typeof props.modelValue !== "string") {
			console.error("单选所传modelValue值应为字符串")
		}
		if (!!props.isMultiple && !Array.isArray(props.modelValue)) {
			console.error("多选所传modelValue值应为数组")
		}
	}

	// 弹出
	const popupRef = ref()

	// 当前选中的机构id及机构
	let curSelOrgId = !props.isMultiple ? ref("") : ref([])
	let curSelOrg = !props.isMultiple ? ref({}) : ref([])

	// 所有点击选中机构【页面数据】
	let allClickSelOrg = ref([])
	// 当前点击选中机构【页面数据】
	let curClickSelOrg = ref([])

	// 监听函数
	// watch(() => props.value, (newValue, oldValue) => {
	// 	curSelOrgId.value = newValue
	// }, {
	// 	deep: false,
	// 	immediate: false
	// })
	watch(() => props.modelValue, (newValue, oldValue) => {
		// curSelOrgId.value = XEUtils.clone(newValue, true)
		loadData()
	}, {
		deep: false,
		immediate: false
	})

	const loadData = () => {
		orgTree().then(res => {
			if (props.isTopLevel) {
				// 含有顶级
				curClickSelOrg.value = [{
					id: '0',
					parentId: '-1',
					name: '顶级',
					children: res.data
				}]
				allClickSelOrg.value = [{
					id: '-1',
					name: '全部',
					children: [{
						id: '0',
						parentId: '-1',
						name: '顶级',
						children: res.data
					}]
				}]
			} else {
				// 不含有顶级
				curClickSelOrg.value = res.data
				allClickSelOrg.value = [{
					id: '0',
					parentId: '-1',
					name: '全部',
					children: res.data
				}]
			}

			// 单选curSelOrg初始化值赋值
			if (!props.isMultiple) {

				if (props.modelValue) {
					curSelOrgId.value = XEUtils.clone(props.modelValue, true)
				} else {
					curSelOrgId.value = ""
				}

				if (curSelOrgId.value) {
					const curSelOrgArr = XEUtils.filterTree(allClickSelOrg.value, item => {
						return curSelOrgId.value === item.id
					})
					if (curSelOrgArr && curSelOrgArr.length === 1) {
						curSelOrg.value = curSelOrgArr[0]
					}
				} else {
					curSelOrg.value = {}
				}
			}
			// 多选curSelOrg初始化值赋值
			if (!!props.isMultiple) {

				if (props.modelValue && props.modelValue.length > 0) {
					curSelOrgId.value = XEUtils.clone(props.modelValue, true)
				} else {
					curSelOrgId.value = []
				}

				if (curSelOrgId.value && curSelOrgId.value.length > 0) {
					curSelOrg.value = XEUtils.filterTree(allClickSelOrg.value, item => {
						return curSelOrgId.value.includes(item.id)
					})
				} else {
					curSelOrg.value = []
				}
			}
		})
	}

	// 初始化数据
	loadData()


	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		loadData()
		popupRef.value.open('bottom')
	}

	// 点击面包屑
	const clickOrgCru = (item, index) => {
		curClickSelOrg.value = item.children
		allClickSelOrg.value.splice(index + 1, allClickSelOrg.value.length - (index + 1))
	}

	// 选择部门
	const selOrg = (item, index) => {
		if (!props.isMultiple) {
			curSelOrgId.value = item.id
			curSelOrg.value = item
		} else {
			curSelOrgId.value.push(item.id)
			curSelOrg.value.push(item)
		}
	}
	// 移除部门
	const delOrg = (item, index) => {
		if (!props.isMultiple) {
			curSelOrgId.value = ""
			curSelOrg.value = {}
		} else {
			curSelOrgId.value.splice(curSelOrgId.value.findIndex(curSelOrgIdItem => curSelOrgIdItem === item.id), 1);
			curSelOrg.value.splice(curSelOrg.value.findIndex(curSelOrgItem => curSelOrgItem.id === item.id), 1);
		}
	}
	// 点击部门
	const clickOrg = (item, index) => {
		if (item.children) {
			curClickSelOrg.value = item.children
			allClickSelOrg.value.push(item)
		}
	}

	// 取消
	const cancel = () => {
		// 重置数据
		loadData()
		popupRef.value.close()
	}

	const confirm = () => {
		// 更新数据
		emits('update:modelValue', curSelOrgId.value)
		// 调用父组件方法
		emits('confirm', {
			curSelOrgId: curSelOrgId.value,
			curSelOrg: curSelOrg.value
		})
		popupRef.value.close()
	}
</script>

<style lang="scss">
	.input-value-border {
		border: 1px solid #e5e5e5;
		border-radius: 5px;
	}
</style>
