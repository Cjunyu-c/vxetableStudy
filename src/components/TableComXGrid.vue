<template>
  <div>
      <i
      class="el-icon-setting"
      style="
        font-size: 16px;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
      "
      @click="tableSetting"
    ></i>
    <vxe-grid
      ref="xGrid"
      v-bind="tableProps"
      @custom="customEvent"
      @menu-click="contextMenuClickEvent"
      @cell-dblclick="cellDblclick"
      @checkbox-change="checkboxChange"
    >
      <template v-for="slot in slots" #[slot]="data">
        <slot :name="slot" v-bind="data"></slot>
      </template>
    </vxe-grid>
    
    <div class="table-b-f-b mb0" v-if="pagination">
      <el-pagination
        class="fr"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pageIndex"
        :page-sizes="[]"
        :page-size="tableData.pageSize"
        :layout="layout"
        :total="tableData.totalCount"
      >
        <span class="pageSizeInput">
          <el-input
            class="pageSizeBorder"
            v-model.number="formDatas.pageSize"
            @blur="handleSizeChange(formDatas.pageSize)"
          ></el-input>
          条/页
        </span>
      </el-pagination>
    </div>
     <tabelSetting
        ref="tabelSetting"
        :tableTitle="tableProps.columns"
        @getData="getData"
      ></tabelSetting>
  </div>
</template>

<script>
import VXETable from "vxe-table";
import Sortable from "sortablejs";
import tabelSetting from "./TableSetting";
import _ from "lodash"
export default {
   components: {
    tabelSetting,
  },
  props: {
    gridOptions: {
      type: Object,
    },
    summarymethod: {
      type: Function,
      default: () => null,
    },
    tableData: {
      type: Object,
      default: () => {
        return { pageIndex: 1, pageSize: 10, totalCount: 0, Versions: 0 };
      },
    },
    formData: {
      type: Object,
      default: () => {
        return { pageSize: 50, pageIndex: 1 };
      },
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: () => "total,slot, prev, pager, next, jumper",
    },
  },
  watch: {
    gridOptions: {
      immediate: true,
      handler(newVal, oldVal) {
        this.tableProps.data = [];
        this.tableProps.columns = [];
        this.tableProps = _.merge({},newVal);
        this.$nextTick(() => {
          this.$refs.xGrid.reloadData(this.tableProps.data);
          this.$refs.xGrid.reloadColumn(this.tableProps.columns);
        });
      },
    },
    formData: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.formDatas = newVal;
      },
    },
  },
  computed: {
    slots() {
      const columns = this.tableProps.columns;

      // 获取定义在columns上的插槽
      const extendSlot = [];
      columns.forEach((col) => {
        if (col.slots) {
          const slots = Object.values(col.slots);
          extendSlot.push(...slots);
        }
      });
      return [...this.staticSlots, ...extendSlot];
    },
  },
  data() {
    return {
      staticSlots: ["toolbar_buttons"],
      formDatas: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableProps: {},
    };
  },

  created() {
    this.columnDrop();
  },
  methods: {
       tableSetting() {
      this.$refs["tabelSetting"].isopen('testBooking');
    },
    getData(value) {
      value.forEach((item, index) => {
        this.$set(this.tableProps.columns[index], "visible", item.visible);
      });
      console.log(1233,this.tableProps.columns)
       this.$nextTick(() => {
          this.$refs.xGrid.refreshColumn();
          this.$refs.xGrid.reloadColumn(this.tableProps.columns);
        });
      this.$forceUpdate();
    },
    footerMethod({ columns, data }) {
      // 接收二维数组
      return this.summarymethod({ columns, data });
    },
    contextMenuClickEvent({ menu, row, column }) {
      this.$emit("contextMenuClickEvent", { menu, row, column });
    },
    checkboxChange(data) {
      this.$emit("selectionChange", data.records);
    },
   
    // 改变当前页数
    handleCurrentChange(value) {
      this.$emit("handleCurrentChange", value);
    },
    // 改变页数大小
    handleSizeChange(value) {
      this.$emit("handleSizeChange", value);
    },
    customEvent() {
      let customDataList = [];
      this.$refs.xGrid.getColumns().forEach((item) => {
        if (item.type != "seq") {
          let tempObj = this.tableProps.columns.find(
            (i) => i.field == item.field
          );
          tempObj && customDataList.push(tempObj);
        }
      });
      this.tableProps.columns = customDataList;
      // this.saveStorage();
      console.log(customDataList);
    },
    cellDblclick({ row }) {},

    columnDrop() {
      this.$nextTick(() => {
        const $table = this.$refs.xGrid;
        this.sortable2 = Sortable.create(
          $table.$el.querySelector(
            ".body--wrapper>.vxe-table--header .vxe-header--row"
          ),
          {
            handle: ".vxe-header--column",
            onEnd: async ({ item, newIndex, oldIndex }) => {
              const { fullColumn, tableColumn } = $table.getTableColumn();
              const targetThElem = item;
              const wrapperElem = targetThElem.parentNode;
              const newColumn = fullColumn[newIndex];
              if (newColumn.fixed) {
                const oldThElem = wrapperElem.children[oldIndex];
                // 错误的移动
                if (newIndex > oldIndex) {
                  wrapperElem.insertBefore(targetThElem, oldThElem);
                } else {
                  wrapperElem.insertBefore(
                    targetThElem,
                    oldThElem ? oldThElem.nextElementSibling : oldThElem
                  );
                }
                VXETable.modal.message({
                  content: "固定列不允许拖动，即将还原操作！",
                  status: "error",
                });
                return;
              }
              // 获取列索引 columnIndex > fullColumn
              const oldColumnIndex = $table.getColumnIndex(
                tableColumn[oldIndex]
              );
              const newColumnIndex = $table.getColumnIndex(
                tableColumn[newIndex]
              );
              // 移动到目标列
              const currRow = this.tableProps.columns.splice(
                oldColumnIndex,
                1
              )[0];
              this.tableProps.columns.splice(newColumnIndex, 0, currRow);
              $table.loadColumn(fullColumn); //列重载
              console.log(11111, this.tableProps.columns);
            },
          }
        );
      });
    },
  },
};
</script>

<style scoped></style>
