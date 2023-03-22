<template>
	<view class="info-container">
		<uni-list>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'auth-filled'}" title="账户"
				:rightText="obj.user.account"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="姓名"
				:rightText="obj.user.name"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'phone-filled'}" title="手机"
				:rightText="obj.user.phone"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'vip-filled'}" title="昵称"
				:rightText="obj.user.nickname"></uni-list-item>
		
		</uni-list>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue"
	import store from '@/store/index.js'
	
	const obj = reactive({
		user: store.getters.userInfo
	})
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}
</style>
