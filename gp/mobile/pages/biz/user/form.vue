<template>
	<view class="container">
		<uni-forms ref="formRef" :model="formData" label-position="left" :rules="rules" validate-trigger="blur"
			labelWidth="75px">
			<uni-segmented-control style="margin-bottom: 20px;" :current="curView" :values="['基础信息', '更多信息']"
				styleType="text" activeColor="#007aff" @clickItem="(e) => {
					if (curView != e.currentIndex) {
						curView = e.currentIndex
					}
				}">
			</uni-segmented-control>
			<view v-show="curView === 0">
				<uni-forms-item label="账号" name="account" required :rules="[{ required: true, errorMessage: '请输入账号' }]">
					<uni-easyinput v-model="formData.account" placeholder="请输入账号"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="姓名" name="name" required :rules="[{ required: true, errorMessage: '请输入姓名' }]">
					<uni-easyinput v-model="formData.name" placeholder="请输入姓名"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="性别" name="gender">
					<uni-data-checkbox v-model="formData.gender" :localdata="genderOptions" />
				</uni-forms-item>
				<uni-forms-item label="昵称" name="nickname">
					<uni-easyinput v-model="formData.nickname" placeholder="请输入昵称"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="手机号" name="phone">
					<uni-easyinput v-model="formData.phone" placeholder="请输入手机"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="邮箱" name="email">
					<uni-easyinput v-model="formData.email" placeholder="请输入邮箱"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="出生日期" name="email">
					<uni-datetime-picker type="date" return-type="string" format="YYYY-MM-DD"
						v-model="formData.birthday" />
				</uni-forms-item>
				<uni-forms-item label="选择组织" name="orgId" required :rules="[{ required: true, errorMessage: '请选择组织' }]">
					<!-- 多选属性:isMultiple="true" -->
					<snowy-org-picker v-model="formData.orgId" placeholder="请选择组织" @confirm="orgChange">
					</snowy-org-picker>
				</uni-forms-item>
				<uni-forms-item label="选择职位" name="positionId" required
					:rules="[{ required: true, errorMessage: '请选择职位' }]">
					<snowy-sel-picker :map="{key: 'id', label: 'name'}" v-model="formData.positionId"
						:rangeData="positionData" placeholder="请选择选择职位"></snowy-sel-picker>
				</uni-forms-item>

				<uni-forms-item label="选择主管" name="directorId">
					<!-- 多选属性:isMultiple="true" -->
					<snowy-user-picker v-model="formData.directorId" placeholder="请选择主管">
					</snowy-user-picker>
				</uni-forms-item>
				<uni-forms-item label="员工编号" name="empNo">
					<uni-easyinput v-model="formData.empNo" placeholder="请输入员工编号"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="职位级别" name="positionLevel">
					<uni-easyinput v-model="formData.positionLevel" placeholder="请输入职位级别"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="入职日期" name="entryDate">
					<uni-datetime-picker type="date" return-type="string" format="YYYY-MM-DD"
						v-model="formData.entryDate" />
				</uni-forms-item>

				<!-- required :rules="[{ required: true, errorMessage: '请添加任职信息' }]" -->
				<uni-forms-item label="任职信息" name="positionJson">
					<formPosition v-model="formData.positionJson" ref="positionJsonRef"></formPosition>
				</uni-forms-item>
			</view>

			<view v-show="curView === 1">
				<uni-forms-item label="民族" name="nation">
					<!-- :isMultiple="true" -->
					<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.nation"
						:rangeData="nationOptions" placeholder="请选择民族"></snowy-sel-picker>
				</uni-forms-item>

				<uni-forms-item label="籍贯" name="nativePlace">
					<uni-easyinput v-model="formData.nativePlace" placeholder="请输入籍贯"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="家庭住址" name="homeAddress">
					<uni-easyinput type="textarea" v-model="formData.homeAddress" placeholder="请输入家庭住址"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="通信地址" name="mailingAddress">
					<uni-easyinput type="textarea" v-model="formData.mailingAddress" placeholder="请输入通信地址">
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="证件类型" name="idCardType">
					<!-- :isMultiple="true" -->
					<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.idCardType"
						:rangeData="idcardTypeOptions" placeholder="请选择证件类型"></snowy-sel-picker>
				</uni-forms-item>
				<uni-forms-item label="证件号码" name="idCardNumber">
					<uni-easyinput v-model="formData.idCardNumber" placeholder="请输入证件号码"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="文化程度" name="cultureLevel">
					<!-- :isMultiple="true" -->
					<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.cultureLevel"
						:rangeData="cultureLevelOptions" placeholder="请选择文化程度"></snowy-sel-picker>
				</uni-forms-item>
				<uni-forms-item label="政治面貌" name="politicalOutlook">
					<uni-easyinput v-model="formData.politicalOutlook" placeholder="请输入政治面貌"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="毕业学校" name="college">
					<uni-easyinput v-model="formData.college" placeholder="请输入毕业学校"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="学历" name="education">
					<uni-easyinput v-model="formData.education" placeholder="请输入学历"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="学制" name="eduLength">
					<uni-easyinput v-model="formData.eduLength" placeholder="请输入学制"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="学位" name="degree">
					<uni-easyinput v-model="formData.degree" placeholder="请输入学位"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="家庭电话" name="homeTel">
					<uni-easyinput v-model="formData.homeTel" placeholder="请输入家庭电话"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="办公电话" name="officeTel">
					<uni-easyinput v-model="formData.officeTel" placeholder="请输入办公电话"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="紧急联系人" name="emergencyContact">
					<uni-easyinput v-model="formData.emergencyContact" placeholder="请输入紧急联系人"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="紧急联系电话" name="emergencyPhone">
					<uni-easyinput v-model="formData.emergencyPhone" placeholder="请输入紧急联系电话"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="紧急联系人地址" name="emergencyAddress">
					<uni-easyinput type="textarea" v-model="formData.emergencyAddress" placeholder="请输入紧急联系人地址">
					</uni-easyinput>
				</uni-forms-item>
			</view>
		</uni-forms>

		<button type="primary" @click="submit">提交</button>
	</view>
</template>

<script setup>
	import {
		nextTick,
		reactive,
		ref
	} from "vue"
	import tool from '@/plugins/tool'

	import {
		userDetail,
		userPositionSelector,
		submitForm
	} from '@/api/biz/bizUserApi'

	import SnowyOrgPicker from '@/components/snowy-org-picker.vue'
	import SnowyUserPicker from '@/components/snowy-user-picker.vue'
	import SnowySelPicker from '@/components/snowy-sel-picker.vue'
	import formPosition from '@/pages/biz/user/form-position.vue'

	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"

	const curView = ref(0)
	const formRef = ref()
	// 表单数据
	let formData = ref({})
	// 常用正则规则大全：https://any86.github.io/any-rule/
	const rules = reactive({
		phone: {
			rules: [{
					pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
					errorMessage: '请填写符合要求的11位手机号',
				},
				// {
				// 	minLength: 3,
				// 	maxLength: 5,
				// 	errorMessage: '账户长度在 {minLength} 到 {maxLength} 个字符',
				// }
			]
		},
		email: {
			rules: [{
				pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
				errorMessage: '请填写正确的邮箱号',
			}, ]
		},
	})
	// 性别
	const genderOptions = tool.dictList('GENDER')
	// 职位
	let positionData = ref([])
	// 民族
	const nationOptions = tool.dictList('NATION')
	// 身份证件
	const idcardTypeOptions = tool.dictList('IDCARD_TYPE')
	// 文化程度
	const cultureLevelOptions = tool.dictList('CULTURE_LEVEL')
	// 职位
	const positionJsonRef = ref()

	// 加載
	onLoad((option) => {
		if(!option.id){
			return
		}
		userDetail({
			id: option.id
		}).then(res => {
			formData.value = res.data
			// 職位
			if(!formData.value.orgId){
				return
			}
			const param = {
				orgId: formData.value.orgId
			}
			userPositionSelector(param).then(res => {
				positionData.value = res.data
			})
		})
	})
	// 机构
	const orgChange = ({
		curSelOrgId,
		curSelOrg
	}) => {
		formData.value.positionId = null
		const param = {
			orgId: curSelOrgId
		}
		userPositionSelector(param).then(res => {
			positionData.value = res.data
		})

	}
	const submit = () => {
		//获取所有页面栈实例列表(警告)
		// const pages = getCurrentPages();
		// console.log("form表单：获取所有页面栈实例列表", pages)
		// 子表单数据给父表单数据赋值，并校验子表单数据
		positionJsonRef.value.formListEmitAndValidate().then(result => {
			// 父表单校验
			formRef.value.validate().then(res => {
				uni.showLoading()
				submitForm(formData.value, !formData.value.id).then(respond => {
					uni.hideLoading()
					uni.$emit('formBack', {
						data: respond.data
					})
					uni.navigateBack({
						delta: 1
					})
				})
			}).catch(err => {
				console.error('父表单错误信息：', err);
			})
		}).catch(err => {
			console.error('子表单错误信息：', err);
		})
	}
</script>

<style>
	.container {
		padding: 15px;
		background-color: #fff;
	}
</style>
