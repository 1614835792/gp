<template>
	<view class="snowy-org-picker">
		<view class="snowy-data-tree-input" @click="handleInput">
			<view :class="{ 'input-value-border': props.border }"
				style="font-size: 14px; line-height: 20px; padding: 10px 10px; height: 40px;">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelUserId && curSelUserId !== ''">
					{{ curSelUser.name }}
				</view>
				<!-- 多选 -->
				<view v-else-if="!!isMultiple && curSelUserId && curSelUserId.length > 0"
					v-for="(item, key, index) in curSelUser" :key="index"
					style="display:inline-block; margin: 0px 5px 0px 0px">
					{{ item.name }}
				</view>
				<view v-else style="color: grey;">
					{{ placeholder }}
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
			<view v-show="!!curSelUserId && (!isMultiple? true : curSelUserId.length > 0)"
				:style="{maxHeight:!isMultiple?'5vh':'10vh', overflowY: 'scroll'}">
				<!-- 单选已选择 -->
				<view v-if="!isMultiple" style="margin: 5px 15px; display:inline-block;">
					<view @click="delUser(curSelUser)"
						style="display:inline-block; vertical-align:top; color: #1cbbb4;">
						{{ curSelUser.name }}
					</view>
					<uni-icons type="trash-filled" @click="delUser(curSelUser)" color="#1cbbb4" size="20"></uni-icons>
				</view>
				<!-- 多选已选择 -->
				<view v-if="!!isMultiple" v-for="(item, index) in curSelUser"
					style="margin: 5px 0 5px 15px; display:inline-block;">
					<view @click="delUser(item)" style="display:inline-block; vertical-align:top; color: #1cbbb4;">
						{{ item.name }}
					</view>
					<uni-icons type="trash-filled" @click="delUser(item)" color="#1cbbb4" size="20"></uni-icons>
				</view>
			</view>
			<!-- 部门和人员 -->
			<view style="width:100vw; height:70vh; overflow-y: scroll">
				<!-- 部门 -->
				<view>
					<uni-list style="background-color: #ededed;">
						<view style="margin-top: 5px;">
							<uni-list-item v-for="(item, index) in curClickSelOrg" :key="index">
								<!-- 选择icon -->
								<!-- <template v-slot:header>
									<view class="slot-box">
										<uni-icons
											v-show="!isMultiple ? item.id != curSelUserId: curSelUserId.indexOf(item.id) == -1"
											type="circle" :size="25" @click="selOrg(item, index)"></uni-icons>
										<uni-icons
											v-show="!isMultiple ? item.id == curSelUserId: curSelUserId.indexOf(item.id) != -1"
											type="checkbox-filled" :size="25" color="#1cbbb4"
											@click="delOrg(item, index)">
										</uni-icons>
									</view>
								</template> -->
								<!-- 名称 -->
								<template v-slot:body>
									<!-- color: #1cbbb4; -->
									<text style="flex: 1;font-size: 15px; "
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
				<!-- 人员 -->
				<view style="margin-top: 15px;">
					<uni-list :border="false">
						<uni-list-chat v-for="(item, index) in userData" :key="index" :title="item.name"
							:avatar="item.avatar" :note="item.orgName + ' | '+ item.positionName +' | '+item.genderName"
							:time="item.entryDate" :clickable="true" @click="clickUser(item, index)">

							<view class="chat-custom-right">
								<view class="slot-box">
									<!-- @click="selUser(item, index)" -->
									<uni-icons
										v-show="!isMultiple ? item.id != curSelUserId: curSelUserId.indexOf(item.id) == -1"
										type="circle" :size="25"></uni-icons>
									<!-- @click="delUser(item, index)" -->
									<uni-icons
										v-show="!isMultiple ? item.id == curSelUserId: curSelUserId.indexOf(item.id) != -1"
										type="checkbox-filled" :size="25" color="#1cbbb4">
									</uni-icons>
								</view>
								<!-- <text class="chat-custom-text">刚刚</text>
							<uni-icons type="star-filled" color="#999" size="18"></uni-icons> -->
							</view>
						</uni-list-chat>
					</uni-list>
				</view>

			</view>



		</uni-popup>
	</view>
</template>

<script setup>
	import {
		orgTree
	} from '@/api/biz/bizOrgApi'
	import {
		userPage
	} from '@/api/biz/bizUserApi'
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

	let searchFormState = reactive({})
	let parameter = reactive({
		current: 1,
		size: -1
	})
	let userData = ref([])

	// 当前选中的机构id及机构
	let curSelUserId = !props.isMultiple ? ref("") : ref([])
	let curSelUser = !props.isMultiple ? ref({}) : ref([])

	// 所有点击选中机构【页面数据】
	let allClickSelOrg = ref([])
	// 当前点击选中机构【页面数据】
	let curClickSelOrg = ref([])
	orgTree().then(res => {
		curClickSelOrg.value = res.data
		allClickSelOrg.value = [{
			id: '0',
			name: '全部',
			children: res.data
		}]
	})
	// 监听函数
	// watch(() => props.value, (newValue, oldValue) => {
	// 	curSelUserId.value = newValue
	// }, {
	// 	deep: false,
	// 	immediate: false
	// })
	watch(() => props.modelValue, (newValue, oldValue) => {
		// curSelUserId.value = XEUtils.clone(newValue, true)
		loadUserData()
	}, {
		deep: false,
		immediate: false
	})

	const loadUserData = () => {
		Object.assign(parameter, searchFormState)
		userPage(parameter).then(res => {
			if (res.data && res.data.records) {
				userData.value = res.data.records
				// 单选curSelUser初始化值赋值
				if (!props.isMultiple) {
					if (props.modelValue) {
						curSelUserId.value = XEUtils.clone(props.modelValue, true)
					} else {
						curSelUserId.value = ""
					}

					if (curSelUserId.value) {
						const curSelOrgArr = XEUtils.filterTree(userData.value, item => {
							return curSelUserId.value === item.id
						})
						if (curSelOrgArr && curSelOrgArr.length === 1) {
							curSelUser.value = curSelOrgArr[0]
						} else {
							// id存在数据，但是没有找到对应的数据
							// curSelUser.value = {
							// 	id: curSelUserId.value,
							// 	name: curSelUserId.value
							// }
						}
					} else {
						curSelUser.value = {}
					}
				}
				// 多选curSelUser初始化值赋值
				if (!!props.isMultiple) {

					if (props.modelValue && props.modelValue.length > 0) {
						curSelUserId.value = XEUtils.clone(props.modelValue, true)
					} else {
						curSelUserId.value = []
					}

					if (curSelUserId.value && curSelUserId.value.length > 0) {
						curSelUser.value = XEUtils.filterTree(userData.value, item => {
							return curSelUserId.value.includes(item.id)
						})
					} else {
						curSelUser.value = []
					}
				}
			}
		})
	}

	// 初始化数据
	loadUserData()


	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		loadUserData()
		popupRef.value.open('bottom')
	}

	// 点击面包屑
	const clickOrgCru = (item, index) => {
		curClickSelOrg.value = item.children
		allClickSelOrg.value.splice(index + 1, allClickSelOrg.value.length - (index + 1))

		searchFormState.orgId = (item.id === '0' ? null : item.id)
		loadUserData()
	}

	// 点击用户
	const clickUser = (item, index) => {
		if (!props.isMultiple) {
			if (item.id != curSelUserId.value) {
				selUser(item, index)
			} else {
				delUser(item, index)
			}
		} else {
			if (!curSelUserId.value.includes(item.id)) {
				selUser(item, index)
			} else {
				delUser(item, index)
			}
		}
	}

	// 选择用户
	const selUser = (item, index) => {
		if (!props.isMultiple) {
			curSelUserId.value = item.id
			curSelUser.value = item
		} else {
			curSelUserId.value.push(item.id)
			curSelUser.value.push(item)
		}
	}
	// 移除用户
	const delUser = (item, index) => {
		if (!props.isMultiple) {
			curSelUserId.value = ""
			curSelUser.value = {}
		} else {
			curSelUserId.value.splice(curSelUserId.value.findIndex(curSelOrgIdItem => curSelOrgIdItem === item.id), 1);
			curSelUser.value.splice(curSelUser.value.findIndex(curSelOrgItem => curSelOrgItem.id === item.id), 1);
		}
	}
	// 点击部门
	const clickOrg = (item, index) => {
		curClickSelOrg.value = item.children
		allClickSelOrg.value.push(item)

		searchFormState.orgId = (item.id === '0' ? null : item.id)
		loadUserData()
	}


	// 取消
	const cancel = () => {
		// 重置数据
		loadUserData()
		popupRef.value.close()
	}

	const confirm = () => {
		// 更新数据
		emits('update:modelValue', curSelUserId.value)
		// 调用父组件方法
		emits('confirm', {
			curSelUserId: curSelUserId.value,
			curSelUser: curSelUser.value
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
