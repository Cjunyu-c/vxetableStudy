<template>
  <!-- style="min-width: 300px; max-width: 300px; padding: 10px" -->
  <div class="my-filter-excel" style="min-width: 300px; max-width: 300px; padding: 10px">
    <div class="my-fe-top">
      <ul class="my-fe-menu-group">
        <li class="my-fe-menu-link">
          <span @click="handleSx">升序</span>
        </li>
        <li class="my-fe-menu-link">
          <span @click="handleDx">倒序</span>
        </li>
      </ul>
      <ul class="my-fe-menu-group">
        <li class="my-fe-menu-link" @click="resetFilterEvent">
          <span>清除筛选</span>
        </li>
      </ul>
      <div style="padding-top: 5px; padding-bottom: 5px; margin-bottom: 5px" class="my-filter-buttonHover" @click="handleSelect">
        <!-- @click="currentFilterType = '数值筛选'" -->
        <vxe-button
          icon="vxe-icon-ellipsis-v"
          v-if="currentFilterType == '文本筛选'"
          size="mini"
          type="text"
          content="按文本筛选"
          class="wbClass"
        ></vxe-button>
        <!-- @click="currentFilterType = '文本筛选'" -->
        <vxe-button
          icon="vxe-icon-information"
          v-if="currentFilterType == '数值筛选'"
          size="mini"
          type="text"
          content="按数值筛选"
          class="wbClass"
        ></vxe-button>
      </div>
    </div>
    <div v-show="currentFilterType == '文本筛选'">
      <div style="max-height: 210px; min-height: 210px">
        <div class="my-fc-search-top" style="padding-bottom: 5px">
          <vxe-input v-model="checks.option.data.sVal" @input="searchEvent" placeholder="搜索" suffix-icon="fa fa-search"></vxe-input>
        </div>
        <div style="border: 1px solid #e2e4e7; padding: 2px 10px; overflow: auto">
          <vxe-checkbox size="mini" v-model="checks.isAll" @change="changeAllEvent" content="全选"></vxe-checkbox>
          <div style="display: flex; flex-direction: column; color: #606266; overflow: auto; max-height: 150px; min-height: 150px">
            <div v-for="(item, sIndex) in checks.valList" :key="sIndex" style="margin-top: 3px">
              <vxe-checkbox size="mini" v-model="item.checked" :content="item.value"></vxe-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="currentFilterType == '数值筛选'">
      <div style="max-height: 210px; min-height: 210px">
        <div style="display: flex">
          <vxe-select size="small" v-model="checks.operator1" placeholder="请选择">
            <vxe-option v-for="item in filterOperator" :key="item.key" :value="item.value" :label="item.label"></vxe-option>
          </vxe-select>
          <div style="width: 10px"></div>
          <vxe-input :disabled="checks.operator1 == '空白'" size="small" v-model="checks.value1" type="text"></vxe-input>
        </div>
        <div style="margin: 10px 0px">
          <vxe-radio size="small" name="n2" v-model="checks.concat" label="与" content="与"></vxe-radio>
          <vxe-radio size="small" name="n2" v-model="checks.concat" label="或" content="或"></vxe-radio>
        </div>
        <div style="display: flex">
          <vxe-select size="small" v-model="checks.operator2" placeholder="请选择">
            <vxe-option v-for="item in filterOperator" :key="item.key" :value="item.value" :label="item.label"></vxe-option>
          </vxe-select>
          <div style="width: 10px"></div>
          <vxe-input :disabled="checks.operator2 == '空白'" size="small" v-model="checks.value2" type="text"></vxe-input>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; padding-top: 5px">
      <div>
        <vxe-button size="mini" icon="vxe-icon-funnel" type="text" content="应用" @click="confirmFilterEvent"></vxe-button>
        <vxe-button size="mini" icon="vxe-icon-funnel-clear" type="text" content="清除" @click="resetFilterEvent"></vxe-button>
      </div>
    </div>
  </div>
</template>

<script>
import XEUtils from "xe-utils";
export default {
  name: "FilterExtend",
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      column: { params: {} },
      table: {},
      panel: {},
      checks: {
        isAll: false,
        option: {},
        colValList: [],
        valList: [],
        operator1: "空白",
        value1: "",
        operator2: "空白",
        value2: "",
        concat: "与",
      },
      currentFilterType: "文本筛选",
      filterOperator: [
        { key: "空白", value: "空白", label: "空白" },
        { key: "等于", value: "texteq", label: "等于" },
        { key: "不等于", value: "textNeq", label: "不等于" },
        { key: "大于", value: "textMt", label: "大于" },
        { key: "小于", value: "textLt", label: "小于" },
        { key: "大于等于", value: "textMeq", label: "大于等于" },
        { key: "小于等于", value: "textLeq", label: "小于等于" },
        { key: "包含", value: "textContain", label: "包含" },
        { key: "不包含", value: "textNContain", label: "不包含" },
        { key: "开头是", value: "textStartWith", label: "开头是" },
        { key: "结尾是", value: "textEndWith", label: "结尾是" },
      ],
    };
  },
  created() {
    this.load();
  },

  methods: {
    load() {
      if (this.params) {
        this.column = this.params.column;
        this.table = this.params.$table;
        this.panel = this.params.$panel;
        const { visibleData } = this.table.getTableData();
        const { vals, operator1, value1, operator2, value2, concat } = this.column.filters[0].data;
        let colValList = Object.keys(XEUtils.groupBy(visibleData, this.column.field)).map((val) => {
          return {
            checked: vals.includes(val),
            value: val,
          };
        });
        let obj = { operator1, value1, operator2, value2, concat };
        this.checks.option = this.column.filters[0];
        colValList = colValList.sort((a, b) => {
          return Number(a.value) > Number(b.value) ? 1 : -1;
        });
        this.checks.colValList = colValList;
        this.checks.valList = colValList;
        Object.assign(this.checks, obj);
      }
    },
    searchEvent() {
      let {
        option: {
          data: { sVal },
        },
      } = this.checks;
      this.checks.valList = sVal ? this.checks.colValList.filter((item) => item.value.indexOf(sVal) > -1) : this.checks.colValList;
    },
    //全选
    changeAllEvent() {
      const { isAll } = this.checks;
      this.checks.valList.forEach((item) => {
        item.checked = isAll;
      });
    },
    //清除筛选
    resetFilterEvent() {
      this.panel.resetFilter();
    },
    //确认筛选
    confirmFilterEvent() {
      const { option, valList } = this.checks;
      if (this.params && option) {
        const { data } = option;
        if (this.currentFilterType == "文本筛选") {
          data.vals = valList.filter((item) => item.checked).map((item) => item.value);
        } else {
          data.vals = this.getNumberFilterResult(valList).map((item) => item.value);
          const { operator1, value1, operator2, value2, concat } = this.checks;
          let obj = { operator1, value1, operator2, value2, concat };
          Object.assign(data, obj);
        }
        this.panel.changeOption(null, true, option);
        this.panel.confirmFilter();
      }
    },
    //数值筛选获取结果
    getNumberFilterResult(data) {
      let data1 = data;
      if (this.checks.operator1 != "空白" && this.checks.value1) {
        data1 = this.textFilterData(this.checks.operator1, "value", this.checks.value1, data1);
      }
      var data2 = [];
      if (this.checks.concat == "与") {
        data2 = data1;
        if (this.checks.operator2 != "空白" && this.checks.value2) {
          data2 = this.textFilterData(this.checks.operator2, "value", this.checks.value2, data2);
        }
        console.log("与", data1, data2);
      } else if (this.checks.concat == "或") {
        data2 = data;
        if (this.checks.operator2 != "空白" && this.checks.value2) {
          data2 = this.textFilterData(this.checks.operator2, "value", this.checks.value2, data2);
        }
        data2 = [...data2, ...data1];
        console.log("或", data2);
      }
      return data2;
    },
    textFilterData(code, field, searchvalue, sourcedata) {
      console.log("textFilterData", code, field, searchvalue, sourcedata);
      let data = [];
      switch (code) {
        case "texteq":
          data = sourcedata.filter((value) => {
            if (!this.containsChineseCharacters(searchvalue)) {
              return Number(value[field]) == Number(searchvalue);
            } else {
              return value[field] == searchvalue;
            }
          });

          console.log("等于", data);
          break;
        case "textContain":
          data = sourcedata.filter((value) => {
            return (value[field] || "").indexOf(searchvalue) >= 0;
          });

          console.log("包含", data);
          break;
        case "textStartWith":
          data = sourcedata.filter((value) => {
            return (value[field] || "").startsWith(searchvalue);
          });
          console.log("开头是", data);
          break;
        case "textEndWith":
          data = sourcedata.filter((value) => {
            return (value[field] || "").endsWith(searchvalue);
          });
          console.log("结尾是", data);
          break;
        case "textNeq":
          data = sourcedata.filter((value) => {
            if (!this.containsChineseCharacters(searchvalue)) {
              return Number(value[field]) != Number(searchvalue);
            } else {
              return value[field] == searchvalue;
            }
          });

          console.log("不等于", data);
          break;
        case "textNContain":
          data = sourcedata.filter((value) => {
            return (value[field] || "").indexOf(searchvalue) < 0;
          });
          console.log("不包含", data);
          break;
        case "textNStartWith":
          data = sourcedata.filter((value) => {
            return !(value[field] || "").startsWith(searchvalue);
          });
          console.log("文本开头不是", data);
          break;
        case "textNEndWith":
          data = sourcedata.filter((value) => {
            return !(value[field] || "").endsWith(searchvalue);
          });
          console.log("文本结尾不是", data);
          break;
        //大于
        case "textMt":
          data = sourcedata.filter((value) => {
            if (!this.containsChineseCharacters(searchvalue)) {
              return Number(value[field]) > Number(searchvalue);
            } else {
              return value[field] == searchvalue;
            }
          });
          console.log("大于", data);
          break;
        //小于
        case "textLt":
          data = sourcedata.filter((value) => {
            if (!this.containsChineseCharacters(searchvalue)) {
              return Number(value[field]) < Number(searchvalue);
            } else {
              return value[field] == searchvalue;
            }
          });
          console.log("小于", data);
          break;
        //大于等于
        case "textMeq":
          data = sourcedata.filter((value) => {
            if (!this.containsChineseCharacters(searchvalue)) {
              return Number(value[field]) >= Number(searchvalue);
            } else {
              return value[field] == searchvalue;
            }
          });
          console.log("大于等于", data);
          break;
        //小于等于
        case "textLeq":
          data = sourcedata.filter((value) => {
            if (!this.containsChineseCharacters(searchvalue)) {
              return Number(value[field]) <= Number(searchvalue);
            } else {
              return value[field] == searchvalue;
            }
          });
          console.log("小于等于", data);
          break;
      }
      return data;
    },
    containsChineseCharacters(str) {
      // 正则匹配常见的汉字Unicode范围
      var chineseRegex = /[\u4e00-\u9fff]/;
      // 或者匹配更广泛的汉字范围（包括CJK扩展区等）
      // var chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u30000-\u3134f]/u;

      return chineseRegex.test(str);
    },
    handleSx() {
      // eslint-disable-next-line
      console.log(111, this.params.$table.$parent.$parent.$refs.xGrid);
      // eslint-disable-next-line
      this.params.$table.$parent.$parent.$refs.xGrid.sort(this.column.property, "asc");
    },
    handleDx() {
      // eslint-disable-next-line
      this.params.$table.$parent.$parent.$refs.xGrid.sort(this.column.property, "desc");
    },
    handleSelect() {
      if (this.currentFilterType == "文本筛选") {
        this.currentFilterType = "数值筛选";
      } else {
        this.currentFilterType = "文本筛选";
      }
    },
  },
};
</script>
<style>
.my-filter-excel {
  user-select: none;
}
.my-filter-excel .my-fe-top .my-fe-menu-group {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
.my-filter-excel .my-fe-top .my-fe-menu-group:after {
  /* content: "";
  position: absolute;
  width: 190px;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #e2e4e7; */
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link {
  position: relative;
  padding: 4px 4px 4px 4px;
  cursor: pointer;
}
.my-filter-buttonHover:hover {
  background-color: #4d9bff;
  color: #ffffff;
}
.my-filter-buttonHover .vxe-button.type--text:not(.is--disabled):hover {
  color: #ffffff !important;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link:hover {
  background-color: #4d9bff;
  color: #ffffff !important;
}
.my-filter-buttonHover .vxe-button.type--text {
  padding: 0 !important;
}
.my-filter-buttonHover:hover .wbClass {
  background-color: #4d9bff;
  color: #ffffff !important;
  /* color: #4d9bff; */
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link-left-icon {
  position: absolute;
  left: 10px;
  top: 6px;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link-right-icon {
  position: absolute;
  right: 10px;
  top: 6px;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link:hover .my-fe-menu-child-list {
  display: block;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link .my-fe-menu-child-list {
  display: none;
  position: absolute;
  top: 0;
  right: -120px;
  width: 120px;
  background-color: #fff;
  border: 1px solid #dadce0;
  box-shadow: 3px 3px 4px -2px rgba(0, 0, 0, 0.6);
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link .my-fe-child-menu-group-list {
  position: relative;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link .my-fe-child-menu-group-list:after {
  /* content: "";
  position: absolute;
  width: 90px;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #e2e4e7; */
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link .my-fe-child-menu-group-list > .my-fe-child-menu-item {
  position: relative;
  padding: 4px 4px 4px 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link .my-fe-child-menu-group-list > .my-fe-child-menu-item:hover {
  background-color: #c5c5c5;
}
.my-filter-excel .my-fe-search {
  padding: 0 10px 0 30px;
}
.my-filter-excel .my-fe-search .my-fe-search-top {
  position: relative;
  padding: 5px 0;
}
.my-filter-excel .my-fe-search .my-fe-search-top > input {
  border: 1px solid #ababab;
  padding: 0 20px 0 2px;
  width: 200px;
  height: 22px;
  line-height: 22px;
}
.my-filter-excel .my-fe-search .my-fe-search-top > .my-fe-search-icon {
  position: absolute;
  right: 5px;
  top: 10px;
}
.my-filter-excel .my-fe-search .my-fe-search-list {
  margin: 0;
  border: 1px solid #e2e4e7;
  padding: 2px 10px;
  overflow: auto;
  height: 140px;
}
.my-filter-excel .my-fe-search .my-fe-search-list .my-fe-search-item {
  cursor: pointer;
  padding: 2px 0;
}
.my-filter-excel .my-fe-search .my-fe-search-list .my-fe-search-item .my-fe-search-item-icon {
  width: 16px;
}
.my-filter-excel .my-fe-footer {
  text-align: right;
  padding: 10px 10px 10px 0;
}
.my-fe-popup .my-fe-popup-filter {
  padding-left: 30px;
}
.my-fe-popup .my-fe-popup-filter > .my-fe-popup-filter-select {
  width: 120px;
}
.my-fe-popup .my-fe-popup-filter > .my-fe-popup-filter-input {
  margin-left: 15px;
  width: 380px;
}
.my-fe-popup .my-fe-popup-describe {
  padding: 20px 0 10px 0;
}
.my-fe-popup .my-fe-popup-concat {
  padding-left: 50px;
}
.my-fe-popup .my-fe-popup-footer {
  text-align: right;
}
</style>
