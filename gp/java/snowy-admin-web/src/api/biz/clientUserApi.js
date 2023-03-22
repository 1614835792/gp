import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/clientUser/` + url, ...arg)

/**
 * C端用户Api接口管理器
 *
 * @author gzj
 * @date  2023/03/20 11:17
 **/
export default {
	// 获取C端用户分页
	clientUserPage(data) {
		return request('page', data, 'get')
	},
	// 获取C端用户列表
	clientUserList(data) {
		return request('list', data, 'get')
	},
	// 提交C端用户表单 edit为true时为编辑，默认为新增
	clientUserSubmitForm(data, edit = false) {
		return request(edit ? 'add' : 'edit', data)
	},
	// 删除C端用户
	clientUserDelete(data) {
		return request('delete', data)
	},
	// 获取C端用户详情
	clientUserDetail(data) {
		return request('detail', data, 'get')
	}
}
