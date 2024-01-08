<template>
	<div>
		<div style="min-width:300px;max-width: 300px;padding: 10px;">
			<div v-show="currentFilterType=='文本筛选'">
				<div style="max-height: 170px;min-height: 170px;">
					<vxe-checkbox size="mini" v-model="checks.isAll" @change="changeAllEvent" content="全选"></vxe-checkbox>
					<div style="display: flex;flex-direction: column;color: #606266;overflow:auto;max-height: 150px;min-height: 150px;">
						<div v-for="(item, sIndex) in checks.valList" :key="sIndex" style="margin-top:3px;">
							<vxe-checkbox size="mini" v-model="item.checked" :content="item.value"></vxe-checkbox>
						</div>
					</div>
				</div>
			</div>
			<div v-show="currentFilterType=='数值筛选'">
				<div style="max-height: 170px;min-height: 170px;">
					<div style="display: flex;">
						<vxe-select size="small" v-model="checks.operator1" placeholder="请选择">
							<vxe-option v-for="(item) in filterOperator" :key="item.key" :value="item.value" :label="item.label"></vxe-option>
						</vxe-select>
						<div style="width: 10px;"></div>
						<vxe-input :disabled="checks.operator1=='空白'" size="small" v-model="checks.value1" type="text"></vxe-input>
					</div>
					<div style="margin: 10px 0px;">
						<vxe-radio size="small" name="n2" v-model="checks.concat" label="与" content="与"></vxe-radio>
						<vxe-radio size="small" name="n2" v-model="checks.concat" label="或" content="或"></vxe-radio>
					</div>
					<div style="display: flex;">
						<vxe-select size="small" v-model="checks.operator2" placeholder="请选择">
							<vxe-option v-for="(item) in filterOperator" :key="item.key" :value="item.value" :label="item.label"></vxe-option>
						</vxe-select>
						<div style="width: 10px;"></div>
						<vxe-input :disabled="checks.operator2=='空白'" size="small" v-model="checks.value2" type="text"></vxe-input>
					</div>
				</div>
			</div>
		</div>
		<div style="display: flex;justify-content: space-between;">
			<div>
				<vxe-button icon="vxe-icon-ellipsis-v" @click="currentFilterType='数值筛选'" v-if="currentFilterType=='文本筛选'" size="mini" type="text" content="按文本筛选"></vxe-button>
				<vxe-button icon="vxe-icon-information" @click="currentFilterType='文本筛选'" v-if="currentFilterType=='数值筛选'" size="mini" type="text" content="按数值筛选"></vxe-button>
			</div>
			<div>
				<vxe-button size="mini" icon="vxe-icon-funnel" type="text" content="应用" @click="confirmFilterEvent"></vxe-button>
				<vxe-button size="mini" icon="vxe-icon-funnel-clear" type="text" content="清除" @click="resetFilterEvent"></vxe-button>
			</div>
		</div>
	</div>
</template>
 
<script>
	import XEUtils from 'xe-utils';
	export default{
		props:{
			params:{type:Object,default:()=>{
				return {}
			}},
		},
		data(){
			return{
				column:{params:{}},
				table:{},
				panel:{},
				checks:{
					isAll:false,
					option:{},
					colValList:[],
					valList:[],
					operator1:"空白",
					value1:"",
					operator2:"空白",
					value2:"",
					concat:"与"
				},
				currentFilterType:"文本筛选",
				filterOperator:[
					{key:"空白",value:"空白",label:"空白"},
					{key:"等于",value:"texteq",label:"等于"},
					{key:"不等于",value:"textNeq",label:"不等于"},
					{key:"大于",value:"textMt",label:"大于"},
					{key:"小于",value:"textLt",label:"小于"},
					{key:"大于等于",value:"textMeq",label:"大于等于"},
					{key:"小于等于",value:"textLeq",label:"小于等于"},
					{key:"包含",value:"textContain",label:"包含"},
					{key:"不包含",value:"textNContain",label:"不包含"},
					{key:"开头是",value:"textStartWith",label:"开头是"},
					{key:"结尾是",value:"textEndWith",label:"结尾是"},
				]
			}
		},
		mounted(){
			if(this.params){
				this.column=this.params.column;
				this.table=this.params.$table;
				this.panel=this.params.$panel;
				const { visibleData } = this.table.getTableData();
				const {vals,operator1,value1,operator2,value2,concat} = this.column.filters[0].data;
				let colValList=Object.keys(XEUtils.groupBy(visibleData,this.column.field)).map((val)=>{
					return {
						checked: vals.includes(val),
						value: val
					} 
				})
				let obj={operator1,value1,operator2,value2,concat};
				this.checks.option=this.column.filters[0];
				colValList=colValList.sort((a,b)=>{
					// if(this.column.filters[0].data["type"]=="number"){
					// 	return Number(a.value)>Number(b.value)?1:-1;
					// }else{
					// 	return a.value>b.value?1:-1;
					// }
					return Number(a.value)>Number(b.value)?1:-1;
				})
				this.checks.colValList=colValList;
				this.checks.valList=colValList;
				Object.assign(this.checks,obj);
			}
		},
		methods:{
			//全选
			changeAllEvent(){
				const {isAll}=this.checks;
				this.checks.valList.forEach((item) => {
					item.checked = isAll
				})
			},
			//清除筛选
			resetFilterEvent(){
				this.panel.resetFilter();
			},
			//确认筛选
			confirmFilterEvent(){
				const { option, valList } = this.checks;
				if (this.params && option) {
					const { data } = option;
					if(this.currentFilterType=="文本筛选"){
						data.vals = valList.filter((item) => item.checked).map((item) => item.value);
					}else{
						data.vals = this.getNumberFilterResult(valList).map((item) => item.value);
						const {operator1,value1,operator2,value2,concat} = this.checks;
						let obj={operator1,value1,operator2,value2,concat};
						Object.assign(data,obj);
					}
					this.panel.changeOption(null, true, option)
					this.panel.confirmFilter();
				}
			},
			//数值筛选获取结果
			getNumberFilterResult(data){
				let data1=data;
				if(this.checks.operator1!="空白"&&this.checks.value1){
					data1=this.textFilterData(this.checks.operator1,"value",this.checks.value1,data1);
				}
				var data2=[];
				if(this.checks.concat=="与"){
					data2=data1;
					if(this.checks.operator2!="空白"&&this.checks.value2){
						data2=this.textFilterData(this.checks.operator2,"value",this.checks.value2,data2);
					}
				}else if(this.checks.concat=="或"){
					data2=data;
					if(this.checks.operator2!="空白"&&this.checks.value2){
						data2=this.textFilterData(this.checks.operator2,"value",this.checks.value2,data2);
					}
					data2=[...data2,...data1];
				}
				return data2;
			},
			textFilterData(code,field,searchvalue,sourcedata){
				let data=[];
				switch(code){
					case "texteq":
						data=sourcedata.filter((value)=>{
							return value[field]==searchvalue;
						})
						break;
					case "textContain":
						data=sourcedata.filter((value)=>{
							return (value[field]||'').indexOf(searchvalue)>=0;
						})
						break;
					case "textStartWith":
						data=sourcedata.filter((value)=>{
							return (value[field]||'').startsWith(searchvalue);
						})
						break;
					case "textEndWith":
						data=sourcedata.filter((value)=>{
							return (value[field]||'').endsWith(searchvalue);
						})
						break;
					case "textNeq":
						data=sourcedata.filter((value)=>{
							return value[field]!=searchvalue;
						})
						break;
					case "textNContain":
						data=sourcedata.filter((value)=>{
							return (value[field]||'').indexOf(searchvalue)<0;
						})
						break;
					case "textNStartWith":
						data=sourcedata.filter((value)=>{
							return !(value[field]||'').startsWith(searchvalue);
						})
						break;
					case "textNEndWith":
						data=sourcedata.filter((value)=>{
							return !(value[field]||'').endsWith(searchvalue);
						})
						break;
					//大于
					case "textMt":
						data=sourcedata.filter((value)=>{
							return value[field]>searchvalue;
						})
						break;
					//小于
					case "textLt":
						data=sourcedata.filter((value)=>{
							return value[field]<searchvalue;
						})
						break;
					//大于等于
					case "textMeq":
						data=sourcedata.filter((value)=>{
							return value[field]>=searchvalue;
						})
						break;
					//小于等于
					case "textLeq":
						data=sourcedata.filter((value)=>{
							return value[field]<=searchvalue;
						})
						break;
				}
				return data;
			},
		}
	}
</script>
 
<style>
</style>