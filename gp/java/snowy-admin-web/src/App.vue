<template>
	<a-config-provider :locale="locale">
		<router-view />
	</a-config-provider>
</template>

<script setup name="App">
	import i18n from '@/locales'
	import store from '@/store'

	store.commit('initTheme')
	const locale = i18n.global.messages[i18n.global.locale].lang
</script>
