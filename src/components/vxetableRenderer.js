import VXETable from 'vxe-table';
import filterModal from '../components/render/filterModal.vue';

VXETable.renderer.add('MLFilterRender', {
	renderFilter(h, renderOpts, params) {
		return <filterModal params={params}></filterModal>
	},
	//是否显示底部按钮，使用自定义的按钮
	showFilterFooter: false,

	// 筛选数据方法
	filterMethod(params) {
		const { option, row, column } = params
		const { vals } = option.data
		const cellValue = row[column.field];
		return vals.includes(String(cellValue));
	},

	// 重置数据方法
	filterResetMethod(params) {
		const { options } = params
		options.forEach((option) => {
			option.data = { vals: [], sVal: '', operator1: "空白", value1: "", operator2: "空白", value2: "", concat: "与" }
		})
	},
})