<template>
  <div class="my-filter-excel">
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
        <li class="my-fe-menu-link">
          <i class="fa fa-filter my-fe-menu-link-left-icon"></i>
          <span>筛选条件</span>
          <i class="fa fa-caret-right my-fe-menu-link-right-icon"></i>
          <div class="my-fe-menu-child-list">
            <ul class="my-fe-child-menu-group-list" v-for="(cList, gIndex) in caseGroups" :key="gIndex">
              <li v-for="(cItem, cIndex) in cList" :key="cIndex" class="my-fe-child-menu-item" @click="childMenuClickEvent(cItem, $event)">
                <span>{{ cItem.label }}</span>
                <!-- <vxe-checkbox v-model="cItem.checked">{{ cItem.value }}</vxe-checkbox> -->
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="my-fe-search">
      <div class="my-fe-search-top">
        <input v-model="option.data.sVal" placeholder="搜索" />
        <i class="fa fa-search my-fe-search-icon"></i>
      </div>
      <ul class="my-fe-search-list">
        <li class="my-fe-search-item" @click="sAllEvent">
          <i class="fa fa-square-o my-fe-search-item-icon"></i>
          <!-- <i :class="[!isAll ? 'fa fa-square-o my-fe-search-item-icon' : 'fa fa-check-square-o my-fe-search-item-icon']"></i> -->
          <span>(全选)</span>
        </li>
        <li class="my-fe-search-item" v-for="(val, sIndex) in searchList" :key="sIndex" @click="sItemEvent(val, sIndex)">
          <i
            :class="[option.data.vals.indexOf(val) === -1 ? 'fa fa-square-o my-fe-search-item-icon' : 'fa fa-check-square-o my-fe-search-item-icon']"
          ></i>
          <!-- :style="{color:tempIndex==sIndex&&isChexked?'red':'#333'}" -->
          <span>{{ val }}</span>
        </li>
      </ul>
    </div>
    <div class="my-fe-footer">
      <vxe-button status="primary" @click="confirmFilterEvent">确认</vxe-button>
      <vxe-button @click="resetFilterEvent">重置</vxe-button>
    </div>
  </div>
</template>

<script>
import XEUtils from "xe-utils";

export default {
  name: "FilterExtend",
  props: {
    params: Object,
  },
  data() {
    return {
      tempIndex: undefined,
      isChexked: false,
      column: null,
      option: null,
      colValList: [],
      isAll: false,
      caseGroups: [
        [
          { value: "equal", label: "等于" },
          { value: "ne", label: "不等于" },
        ],
        [
          { value: "greater", label: "大于" },
          { value: "ge", label: "大于或等于" },
          { value: "less", label: "小于" },
          { value: "le", label: "小于或等于" },
        ],
      ],
    };
  },
  computed: {
    searchList() {
      const { option, colValList } = this;
      // console.log(345, colValList.filter(val => val.indexOf(option.data.sVal) > -1),colValList)

      return option.data.sVal ? colValList.filter((val) => val.indexOf(option.data.sVal) > -1) : colValList;
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      const { $table, column } = this.params;
      const { fullData } = $table.getTableData();
      const option = column.filters[0];
      const colValList = Object.keys(XEUtils.groupBy(fullData, column.property));
      this.column = column;
      this.option = option;
      this.colValList = colValList;
      console.log("load", this.option.data);
    },
    sAllEvent() {
      this.isAll = !this.isAll;
      const { data } = this.option;
      if (data.vals.length > 0) {
        data.vals = [];
      } else {
        data.vals = this.colValList;
      }
    },
    sItemEvent(val, index) {
      this.tempIndex = index;
      this.isChexked = !this.isChexked;
      const { data } = this.option;
      console.log(555, data.vals);
      const vIndex = data.vals.indexOf(val);
      if (vIndex === -1) {
        data.vals.push(val);
      } else {
        data.vals.splice(vIndex, 1);
      }
      console.log(444, data.vals);
    },
    confirmFilterEvent(evnt) {
      const { params, option } = this;
      const { data } = option;
      const { $panel } = params;
      data.f1 = "";
      data.f2 = "";
      console.log(123, option);
      $panel.changeOption(evnt, true, option);
      $panel.confirmFilter();
    },
    resetFilterEvent() {
      const { $panel } = this.params;
      $panel.resetFilter();
    },
    childMenuClickEvent(cItem, evnt) {
      // this.$XModal.alert({ content: cItem.label })
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
  content: "";
  position: absolute;
  width: 190px;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #e2e4e7;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link {
  position: relative;
  padding: 4px 20px 4px 30px;
  cursor: pointer;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link:hover {
  /* background-color: #c5c5c5;
   */
  color: #73b8ff;
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
  content: "";
  position: absolute;
  width: 90px;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #e2e4e7;
}
.my-filter-excel .my-fe-top .my-fe-menu-group .my-fe-menu-link .my-fe-child-menu-group-list > .my-fe-child-menu-item {
  position: relative;
  padding: 4px 20px 4px 30px;
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
