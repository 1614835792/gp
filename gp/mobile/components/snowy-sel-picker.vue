<template>
	<view @click="handleInput">
		<view :class="{ 'input-value-border': props.border }"
			style="font-size: 14px; line-height: 20px; padding: 10px 10px; height: 40px;">
			<!-- 单选 -->
			<view v-if="!isMultiple && curSelDataKey && curSelDataKey !== ''">
				{{ curSelData[map.label] }}
			</view>
			<!-- 多选 -->
			<view v-else-if="!!isMultiple && curSelDataKey && curSelDataKey.length > 0"
				v-for="(item, key, index) in curSelData" :key="index"
				style="display:inline-block; margin: 0px 5px 0px 0px">
				{{ item[map.label] }}
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
		<!-- 已选择 -->
		<view v-show="!!curSelDataKey && (!isMultiple? true : curSelDataKey.length > 0)"
			:style="{maxHeight:!isMultiple?'5vh':'10vh', overflowY: 'scroll'}">
			<!-- 单选已选择 -->
			<view v-if="!isMultiple" style="margin: 5px 15px; display:inline-block;">
				<view @click="delData(curSelData)" style="display:inline-block; vertical-align:top; color: #1cbbb4;">
					{{ curSelData[map.label] }}
				</view>
				<uni-icons type="trash-filled" @click="delData(curSelData)" color="#1cbbb4" size="20"></uni-icons>
			</view>
			<!-- 多选已选择 -->
			<view v-if="!!isMultiple" v-for="(item, index) in curSelData"
				style="margin: 5px 0 5px 15px; display:inline-block;">
				<view @click="delData(item)" style="display:inline-block; vertical-align:top; color: #1cbbb4;">
					{{ item[map.label] }}
				</view>
				<uni-icons type="trash-filled" @click="delData(item)" color="#1cbbb4" size="20"></uni-icons>
			</view>
		</view>
		<!-- 面板数据 -->
		<view style="width:100vw; height:40vh; overflow-y: scroll">
			<uni-list style="background-color: #ededed;">
				<view style="margin-top: 5px;">
					<uni-list-item v-for="(item, index) in rangeData" :key="index">
						<!-- 选择icon -->
						<template v-slot:header>
							<view class="slot-box">
								<uni-icons
									v-show="!isMultiple ? item[map.key] != curSelDataKey: curSelDataKey.indexOf(item[map.key]) == -1"
									type="circle" :size="25" @click="selData(item, index)"></uni-icons>
								<uni-icons
									v-show="!isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1"
									type="checkbox-filled" :size="25" color="#1cbbb4" @click="delData(item, index)">
								</uni-icons>
							</view>
						</template>
						<!-- 名称 -->
						<template v-slot:body>
							<!-- color: #1cbbb4; -->
							<text style="flex: 1;font-size: 15px; margin:2px 10px;"
								@click="selOrDelData(item, index)">{{item[map.label]}}</text>
						</template>
					</uni-list-item>
				</view>
			</uni-list>
		</view>
	</uni-popup>
</template>

<script setup>
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
			default: "请选择",
			required: false
		},
		map: {
			type: Object,
			default: {
				key: "key",
				label: "label"
			},
			required: false
		},
		rangeData: {
			type: Array,
			default: [],
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

	// 当前选中的数据key及数据
	let curSelDataKey = !props.isMultiple ? ref("") : ref([])
	let curSelData = !props.isMultiple ? ref({}) : ref([])


	// 下拉数据
	let rangeData = ref([])

	// 监听函数
	// watch(() => props.value, (newValue, oldValue) => {
	// 	curSelDataKey.value = newValue
	// }, {
	// 	deep: false,
	// 	immediate: false
	// })
	watch(() => props.modelValue, (newValue, oldValue) => {
		// curSelDataKey.value = XEUtils.clone(newValue, true)
		loadData()
	}, {
		deep: false,
		immediate: false
	})

	watch(() => props.rangeData, (newValue, oldValue) => {
		rangeData.value = props.rangeData;
		loadData()
	}, {
		deep: false,
		immediate: false
	})

	const loadData = () => {
		// 下拉数据
		if (props.rangeData && props.rangeData.length > 0) {
			rangeData.value = props.rangeData;
		} else {
			rangeData.value = []
		}

		// 单选curSelData初始化值赋值
		if (!props.isMultiple) {
			if (props.modelValue) {
				curSelDataKey.value = XEUtils.clone(props.modelValue, true)
			} else {
				curSelDataKey.value = ""
			}
			if (curSelDataKey.value) {
				const curSelDataArr = XEUtils.filterTree(rangeData.value, item => {
					return curSelDataKey.value === item[props.map.key]
				})
				if (curSelDataArr && curSelDataArr.length === 1) {
					curSelData.value = curSelDataArr[0]
				}
			} else {
				curSelData.value = {}
			}
		}
		// 多选curSelData初始化值赋值
		if (!!props.isMultiple) {

			if (props.modelValue && props.modelValue.length > 0) {
				curSelDataKey.value = XEUtils.clone(props.modelValue, true)
			} else {
				curSelDataKey.value = []
			}

			if (curSelDataKey.value && curSelDataKey.value.length > 0) {
				curSelData.value = XEUtils.filterTree(rangeData.value, item => {
					return curSelDataKey.value.includes(item[props.map.key])
				})
			} else {
				curSelData.value = []
			}
		}

	}

	// 初始化数据
	loadData()


	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		loadData()
		popupRef.value.open('bottom')
	}
	// 选择或删除数据
	const selOrDelData = (item, index) => {
		if (!props.isMultiple) {
			if (item[props.map.key] != curSelDataKey.value) {
				selData(item, index)
			} else {
				delData(item, index)
			}
		} else {
			if (!curSelDataKey.value.includes(item[props.map.key])) {
				selData(item, index)
			} else {
				delData(item, index)
			}
		}
	}

	// 选择数据
	const selData = (item, index) => {
		if (!props.isMultiple) {
			curSelDataKey.value = item[props.map.key]
			curSelData.value = item
		} else {
			curSelDataKey.value.push(item[props.map.key])
			curSelData.value.push(item)
		}
	}
	// 移除数据
	const delData = (item, index) => {
		if (!props.isMultiple) {
			curSelDataKey.value = ""
			curSelData.value = {}
		} else {
			curSelDataKey.value.splice(curSelDataKey.value.findIndex(curSelDataKeyItem => curSelDataKeyItem === item[
				props.map.key]), 1);
			curSelData.value.splice(curSelData.value.findIndex(curSelDataItem => curSelDataItem[props.map.key] ===
				item[props.map.key]), 1);
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
		emits('update:modelValue', curSelDataKey.value)
		// 调用父组件方法
		emits('confirm', {
			curSelDataKey: curSelDataKey.value,
			curSelData: curSelData.value
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
