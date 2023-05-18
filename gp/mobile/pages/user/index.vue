<template>
	<view>
			<web-view :webview-styles="webviewStyles" src="/static/html/html/user/home.html"></web-view>
		</view>
</template>

<script>
		export default {
			data() {
				return {
					webviewStyles: {
						progress: {
							color: '#FF3333'
						}
					}
				}
			}
		}
</script>

<style>
</style>