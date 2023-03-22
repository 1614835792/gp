<template>
	<!-- :mask-click="false" -->
	<uni-popup ref="popupRef" type="bottom" background-color="#fff" safeArea>
		<uni-list :border="false">
			<uni-list-item v-if="hasPerm('mobileBizUserEdit')" title="编辑" style="text-align:center; margin: 0 15px;" :clickable="true" @click="edit">
				<!-- <template v-slot:body>
					<text style="flex: 1;font-size: 14px; margin-right: 10px; color: #1cbbb4;" @click="edit">编辑</text>
				</template> -->
			</uni-list-item>
			<uni-list-item v-if="hasPerm('mobileBizUserDelete')" title="刪除" style="text-align:center; margin: 0 15px;" :clickable="true" @click="del">
			</uni-list-item>
			<uni-list-item title="取消" style="text-align:center; margin: 0 15px;" :clickable="true" @click="cancel">
			</uni-list-item>
		</uni-list>
	</uni-popup>
</template>

<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";

	import {
		userDelete
	} from '@/api/biz/bizUserApi'

	import {
		toast,
		showConfirm,
		tansParams
	} from '@/utils/common'

	const emits = defineEmits(['handleOk'])

	// 删除弹出ref
	const delPopRef = ref()
	// 弹出ref
	const popupRef = ref()
	// 打开
	let record = ref({})
	const open = (data) => {
		record.value = data
		popupRef.value.open("bottom")
	}
	// 编辑
	const edit = () => {
		uni.navigateTo({
			url: '/pages/biz/user/form?id=' + record.value.id
		})
		popupRef.value.close()
	}
	// 删除
	const del = () => {
		showConfirm(`是否确认删除【${ record.value.name }】用户？`).then(res => {
			if (res.confirm) {
				uni.showLoading()
				userDelete([{
					id: record.value.id
				}]).then(res => {
					uni.hideLoading()
					toast(`${ record.value.name }用户已删除`)
					emits('handleOk')
					popupRef.value.close()
				})
			}
		})
	}
	// 取消
	const cancel = () => {
		popupRef.value.close()
	}
	defineExpose({
		open
	})
</script>
