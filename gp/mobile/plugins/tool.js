import store from '@/store'

const tool = {}


// 字典翻译方法，界面插槽使用方法 {{ $TOOL.dictType('sex', record.sex) }}
tool.dictTypeData = (dictValue, value) => {
	// const dictTypeTree = tool.dictDataAll()
	const dictTypeTree = store.getters.dictTypeTreeData
	if (!dictTypeTree) {
		return '需重新登录'
	}
	const tree = dictTypeTree.find((item) => item.dictValue === dictValue)
	if (!tree) {
		return '无此字典'
	}
	const children = tree.children
	const dict = children.find((item) => item.dictValue === value)
	return dict?.name || '无此字典'
}

// 获取某个code下字典的列表，基于dictTypeList 改进，保留老的，逐步替换
tool.dictList = (dictValue) => {
	// const dictTypeTree = tool.dictDataAll()
	const dictTypeTree = store.getters.dictTypeTreeData
	if (!dictTypeTree) {
		return []
	}
	const tree = dictTypeTree.find((item) => item.dictValue === dictValue)
	if (tree) {
		return tree.children.map((item) => {
			return {
				value: item['dictValue'],
				text: item['name']
			}
		})
	}
	return []
}

//////////////////////////////////////////////////////////////////////////////////
// const dictTypeTreeData = store.getters.dictTypeTreeData

// // localStorage
// tool.data = {
// 	set(table, settings) {
// 		const _set = JSON.stringify(settings)
// 		return localStorage.setItem(table, _set)
// 	},
// 	get(table) {
// 		let data = localStorage.getItem(table)
// 		try {
// 			data = JSON.parse(data)
// 		} catch (err) {
// 			return null
// 		}
// 		return data
// 	},
// 	remove(table) {
// 		return localStorage.removeItem(table)
// 	},

// 	clear() {
// 		return localStorage.clear()
// 	}
// }

// // sessionStorage
// tool.session = {
// 	set(table, settings) {
// 		const _set = JSON.stringify(settings)
// 		return sessionStorage.setItem(table, _set)
// 	},
// 	get(table) {
// 		let data = sessionStorage.getItem(table)
// 		try {
// 			data = JSON.parse(data)
// 		} catch (err) {
// 			return null
// 		}
// 		return data
// 	},
// 	remove(table) {
// 		return sessionStorage.removeItem(table)
// 	},
// 	clear() {
// 		return sessionStorage.clear()
// 	}
// }

// // 千分符
// tool.groupSeparator = (num) => {
// 	num = `${num}`
// 	if (!num.includes('.')) num += '.'

// 	return num
// 		.replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
// 			return `${$1},`
// 		})
// 		.replace(/\.$/, '')
// }

// // 获取所有字典数组
// tool.dictDataAll = () => {
// 	return tool.data.get('DICT_TYPE_TREE_DATA')
// }

// // 字典翻译方法，界面插槽使用方法 {{ $TOOL.dictType('sex', record.sex) }}
// tool.dictTypeData = (dictValue, value) => {
// 	const dictTypeTree = tool.dictDataAll()
// 	if (!dictTypeTree) {
// 		return '需重新登录'
// 	}
// 	const tree = dictTypeTree.find((item) => item.dictValue === dictValue)
// 	if (!tree) {
// 		return '无此字典'
// 	}
// 	const children = tree.children
// 	const dict = children.find((item) => item.dictValue === value)
// 	return dict?.name || '无此字典'
// }

// // 获取某个code下字典的列表，多用于字典下拉框
// tool.dictTypeList = (dictValue) => {
// 	// const dictTypeTree = tool.dictDataAll()
// 	const dictTypeTree = dictTypeTreeData
	
// 	if (!dictTypeTree) {
// 		return []
// 	}
// 	const tree = dictTypeTree.find((item) => item.dictValue === dictValue)
// 	if (tree && tree.children) {
// 		return tree.children
// 	}
// 	return []
// }

// // 生成UUID
// tool.snowyUuid = () => {
// 	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
// 		let r = (Math.random() * 16) | 0,
// 			v = c === 'x' ? r : (r & 0x3) | 0x8
// 		return v.toString(16)
// 	})
// 	// 首字符转换成字母
// 	return 'xn' + uuid.slice(2)
// }

export default tool
