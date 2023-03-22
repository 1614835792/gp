<template>
	<view class="setting-container" :style="{height: `${windowHeight}px`}">
		<view class="menu-list">
			<view class="list-cell list-cell-arrow" @click="handleToPwd">
				<view class="menu-item-box">
					<view class="iconfont icon-password menu-icon"></view>
					<view>修改密码</view>
				</view>
			</view>
			<view class="list-cell list-cell-arrow" @click="handleToUpgrade">
				<view class="menu-item-box">
					<view class="iconfont icon-refresh menu-icon"></view>
					<view>检查更新</view>
				</view>
			</view>
			<view class="list-cell list-cell-arrow" @click="handleCleanTmp">
				<view class="menu-item-box">
					<view class="iconfont icon-refresh menu-icon"></view>
					<view>清理缓存</view>
				</view>
			</view>
		</view>
		<view class="cu-list menu">
		  <view class="cu-item item-box">
		    <view class="content text-center" @click="handleLogout">
		      <text class="text-black">退出登录</text>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script setup>
	import store from '@/store'
	import modal from '../../../plugins/modal'
	const windowHeight = uni.getSystemInfoSync().windowHeight
	const handleToPwd = () => {
		uni.navigateTo({
			url:'/pages/mine/pwd/index'
		})
	}
	const handleToUpgrade = () => {
		modal.showToast('模块建设中')
	}
	const handleCleanTmp = () => {
		modal.showToast('模块建设中')
	}
	const handleLogout = () => {
		modal.confirm('确定注销并退出系统吗？').then(() => {
			// 退出
			store.dispatch('LogOut').then(() => {
				// 跳转登录页面
				uni.reLaunch({
					url:'/pages/login'
				})
			})
			
		})
	}
</script>

<style lang="scss" scoped>
.page {
    background-color: #f8f8f8;
  }

  .item-box {
    background-color: #FFFFFF;
    margin: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10rpx;
    border-radius: 8rpx;
    color: #303133;
    font-size: 32rpx;
  }
</style>
