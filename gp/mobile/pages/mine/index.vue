<template>
	<view class="mine-container" :style="{height: `${windowHeight}px`}">
		<!-- 顶部个人信息 -->
		<view class="header-section">
			<view class="flex padding justify-between">
				<view class="flex align-center">
					<view class="cu-avatar xl round bg-white" v-if="!avatar">
						<view class="iconfont icon-people text-gray icon"></view>
					</view>
					<image
					  v-if="avatar"
					  @click="handleToAvatar"
					  :src="avatar"
					  class="cu-avatar xl round"
					  mode="widthFix"
					></image>
					<view v-if="!name" @click="handleToLogin" class="login-tip">
						点击登录
					</view>
					<view class="user-info" @click="handleToInfo" v-if="name">
						<view class="u_title">
							{{name}}
						</view>
					</view>
				</view>
				<view class="flex align-center" @click="handleToInfo">
					<text>个人信息</text>
					<view class="iconfont icon-right"></view>
				</view>
			</view>
		</view>

<!-- 		<view class="content-section">
		  <view class="mine-actions grid col-4 text-center">
		    <view class="action-item" @click="handleJiaoLiuQun">
		      <view class="iconfont icon-friendfill text-pink icon"></view>
		      <text class="text">交流群</text>
		    </view>
		    <view class="action-item" @click="handleBuilding">
		      <view class="iconfont icon-service text-blue icon"></view>
		      <text class="text">在线客服</text>
		    </view>
		    <view class="action-item" @click="handleBuilding">
		      <view class="iconfont icon-community text-mauve icon"></view>
		      <text class="text">反馈社区</text>
		    </view>
		    <view class="action-item" @click="handleBuilding">
		      <view class="iconfont icon-dianzan text-green icon"></view>
		      <text class="text">点赞我们</text>
		    </view>
		  </view>
		</view> -->

		<view class="menu-list">
		  <view class="list-cell list-cell-arrow" @click="handleToEditInfo">
		    <view class="menu-item-box">
		      <view class="iconfont icon-user menu-icon"></view>
		      <view>编辑资料</view>
		    </view>
		  </view>
		  <view class="list-cell list-cell-arrow" @click="handleHelp">
		    <view class="menu-item-box">
		      <view class="iconfont icon-help menu-icon"></view>
		      <view>常见问题</view>
		    </view>
		  </view>
		  <view class="list-cell list-cell-arrow" @click="handleAbout">
		    <view class="menu-item-box">
		      <view class="iconfont icon-aixin menu-icon"></view>
		      <view>关于我们</view>
		    </view>
		  </view>
		  <view class="list-cell list-cell-arrow" @click="handleToSetting">
		    <view class="menu-item-box">
		      <view class="iconfont icon-setting menu-icon"></view>
		      <view>应用设置</view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script setup>
	import store from '@/store/index.js'
	import storage from '@/utils/storage'
	import { computed } from "vue"
	import modal from '../../plugins/modal';
	const name = store.getters.userInfo.name
	const version = store.getters.sysBaseConfig.SNOWY_SYS_VERSION

	const avatar = computed(() => {
		return store.getters.userInfo.avatar
	})
	const windowHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight - 50
	})
	const handleToInfo = () => {
		uni.navigateTo({
			url:'/pages/mine/info/index'
		})
	}
	const handleToEditInfo = () => {
		uni.navigateTo({
			url:'/pages/mine/info/edit'
		})
	}
	const handleToSetting = () => {
		uni.navigateTo({
			url:'/pages/mine/setting/index'
		})
	}
	const handleToAvatar = () => {
		uni.showToast({
			title:'模块建设中'
		})
		// uni.navigateTo({
		// 	url:'/pages/mine/avatar/avatar'
		// })
	}
	const handleToLogin = () => {
		uni.reLaunch({
			url:'/pages/login'
		})
	}
	const handleHelp = () => {
		uni.showToast({
			title:'模块建设中'
		})
		// uni.navigateTo({
		// 	url: '/pages/mine/help/help'
		// })
	}
	const handleAbout = () => {
		uni.showToast({
			title:'模块建设中'
		})
		// uni.navigateTo({
		// 	url: '/pages/mine/about/about'
		// })
	}
	const handleJiaoLiuQun = () => {
		uni.showToast({
			title:'QQ'
		})
	}
	const handleBuilding = () => {
		uni.showToast({
			title:'模块建设中'
		})
	}
</script>

<style lang="scss">
  page {
    background-color: #f5f6f7;
  }

  .mine-container {
    width: 100%;
    height: 100%;

    .header-section {
      padding: 15px;
      background-color: #1890ff;
      color: white;

      .login-tip {
        font-size: 18px;
        margin-left: 10px;
      }

      .cu-avatar {
        border: 2px solid #eaeaea;

        .icon {
          font-size: 40px;
        }
      }

      .user-info {
        margin-left: 15px;

        .u_title {
          font-size: 18px;
          line-height: 30px;
        }
      }
    }

    .content-section {
      position: relative;
      top: 0px;

      .mine-actions {
        margin: 10px;
        padding: 20px 0px;
        border-radius: 8px;
        background-color: white;

        .action-item {
          .icon {
            font-size: 28px;
          }

          .text {
            display: block;
            font-size: 13px;
            margin: 8px 0px;
          }
        }
      }
    }
  }
</style>
