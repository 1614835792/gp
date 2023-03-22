<template>
	<view class="work-container">
		<!-- 轮播图 -->
		<uni-swiper-dot class="uni-swiper-dot-box" :info="data" :current="current" field="content">
			<swiper class="swiper-box" :current="swiperDotIndex" :autoplay="true" :interval="3000" :duration="1000"
				@change="changeSwiper">
				<swiper-item v-for="(item, index) in data" :key="index">
					<view class="swiper-item" @click="clickBannerItem(item)">
						<image class="swiper-item-img" :src="item.image" mode="aspectFill" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>

	<!-- 宫格组件 -->
	<view v-for="(userMenu, i) in userMobileMenus" :index="i" :key="userMenu.id">
		<uni-section :title="userMenu.name">
			<template v-slot:decoration>
				<view style="margin-right: 5px;">
					<uni-icons custom-prefix="snowy" :type="userMenu.icon" size="16" :color="userMenu.color">
					</uni-icons>
				</view>
			</template>
			<template v-slot:right>
				<!-- 伪面包屑 -->
				<text v-for="(item,index) in allSelData[userMenu.id]" :key="index"
					:style=" { marginLeft: '5px', color: index === (allSelData[userMenu.id].length-1) ?'#8799a3':'#1890FF'}"
					@click="clickText(item,index, userMenu.id)">
					{{item.name + (index === (allSelData[userMenu.id].length-1) ? '' : ' | ') }}
				</text>
			</template>
		</uni-section>

		<view class="grid-body">
			<uni-grid :column="4" :showBorder="false">
				<uni-grid-item v-for="(item, j) in handleData(userMenu.id, userMenu.children)" :index="j"
					:key="handleKey(item,j)" @click="gridItemClick(userMenu.id, item, j)">
					<view class="grid-item-box">
						<snowy-icon :style="{backgroundColor: item.color}" custom-prefix="snowy" :type="item.icon" size="30" color="#FFFFFF"></snowy-icon>
						<text class="text">{{item.title}}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>

	</view>

</template>

<script setup>
	import store from '@/store'
	import XEUtils from 'xe-utils'
	import config from '@/config'
	import SnowyIcon from '@/components/snowy-icon.vue'

	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";
	const {
		proxy
	} = getCurrentInstance()

	const current = ref(0)
	const swiperDotIndex = ref(0)
	const data = reactive([{
			image: '/static/images/swiper/swiper1.jpg'
		},
		{
			image: '/static/images/swiper/swiper2.jpg'
		}
	])
	const changeSwiper = (e) => {
		current.value = e.detail.current
	}

	const clickBannerItem = (item) => {
		console.log(item)
	}

	const userMobileMenus = store.getters.userMobileMenus
	// 当前选中的数据
	let selData = reactive({})
	// 所有选中的数据
	let allSelData = reactive({})
	if (userMobileMenus && userMobileMenus.length > 0) {
		userMobileMenus.forEach(item => {
			allSelData[item.id] = []
			allSelData[item.id].push(item)
			selData[item.id] = []
		})
	}
	const clickText = (item, index, userMenuId) => {
		// 菜单进行更新
		handleData(item.id, item.children).forEach(itemData => {
			itemData.key = itemData.key + 1
		})
		selData[userMenuId] = item.children
		// 已选中的部分数据进行删除
		allSelData[userMenuId].splice(index + 1, allSelData[userMenuId].length - index);
	}
	const handleData = (userMenuId, userMenuChildren) => {
		return selData[userMenuId] && selData[userMenuId].length > 0 ? selData[userMenuId] : userMenuChildren
	}
	const handleKey = (item, j) => {
		item.key = j
		return item.key
	}
	const gridItemClick = (userMenuId, item, j) => {
		if (item.children && item.children.length > 0) {
			// 菜单进行更新
			item.key = item.key + 1
			selData[userMenuId] = item.children
			// 向已选中的数据中添加新的数据
			allSelData[userMenuId].push(item)
		} else if (item.menuType == 'MENU') {
			uni.navigateTo({
				url: item.path,
				fail(error) {
					proxy.$modal.alert('请将【' + item.title + '】的移动端路由地址(' + item.path +
						')与uniapp的page.json的path路径对应！')
					console.log(error)
				}
			})
		}
	}
</script>
<style lang="scss">
	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	/* #endif */

	.text {
		text-align: center;
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
		;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-box {
		height: 150px;
	}

	.swiper-item {
		padding: 8px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		height: 300rpx;
		line-height: 300rpx;
	}
  .swiper-item-img {
    border-radius: 5px;
  }

	@media screen and (min-width: 500px) {
		.uni-swiper-dot-box {
			width: 400px;
			/* #ifndef APP-NVUE */
			margin: 0 auto;
			/* #endif */
			margin-top: 8px;
		}

		.image {
			width: 100%;
		}
	}
</style>
