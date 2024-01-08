<template>
  <div>
    <vxe-table
      ref="xGrid"
      border
      stripe
      height="400"
      :loading="loading"
      :column-config="{ resizable: true, useKey: true, minWidth: 200 }"
      :row-config="{ isHover: true }"
      :data="tableList2"
      :showHeaderOverflow="true"
      :showOverflow="true"
      :keepSource="true"
      rowId="id"
      :keyboard-config="{ isArrow: true }"
      :menu-config="menuConfig"
      @menu-click="contextMenuClickEvent"
    >
      <vxe-column type="seq" width="60"></vxe-column>

      <vxe-column
        v-for="config in data"
        :key="config.key"
        :type="config.type"
        :field="config.field"
        :title="config.title"
        :fixed="config.fixed"
        :width="config.width"
        :visible="config.visible"
        :filters="config.filters"
        :filter-render="config?.filterRender"
      >
        <template #default="{ row }">
          1
          <!-- <slot :name="config?.slots?.default" v-bind="row"></slot>
                 -->
          <span>11{{ row.booking_date }}</span>
        </template>
      </vxe-column>
    </vxe-table>
    <i class="el-icon-setting" style="font-size: 16px; cursor: pointer; position: absolute; right: 0; top: 0" @click="tableSetting"></i>

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
          <el-input class="pageSizeBorder" v-model.number="formDatas.pageSize" @blur="handleSizeChange(formDatas.pageSize)"></el-input>
          条/页
        </span>
      </el-pagination>
      <tabelSetting ref="tabelSetting" :tableTitle="tableColumn" @getData="getData"></tabelSetting>
    </div>
  </div>
</template>

<script>
import VXETable from "vxe-table";
import Sortable from "sortablejs";
import tabelSetting from "@/components/common/XtableSetting.vue";
export default {
  components: {
    tabelSetting,
  },
  props: {
    menuConfig: {
      type: Object,
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
    summarymethod: {
      type: Function,
      default: () => null,
    },
    tableList: {
      type: Array,
      default: () => [],
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
    /**
     * 数据变化后 高度自适应
     */
    tableList: {
      deep: true,
      immediate: true,
      handler(newValue) {
        this.$nextTick(() => {
          console.log(33455, newValue);
          this.tableList2 = newValue;
          this.$nextTick(() => {
            this.$refs.xGrid.reloadData(this.tableList2);
          });
        });
      },
    },
    tableColumn: {
      immediate: true,
      deep: true,
      handler(value) {
        value.forEach((item) => {
          if (Object.keys(item).indexOf("visible") == -1) {
            item.visible = true;
          }
        });
        this.data = value;
        this.$nextTick(() => {
          this.$refs.xGrid.reloadColumn(this.data);
        });
        this.columnDrop();
      },
    },
    formData: {
      immediate: true,
      deep: true,
      handler(value) {
        this.formDatas = value;
      },
    },
  },
  computed: {
    slots() {
      const columns = this.tableColumn;
      // 获取定义在columns上的插槽
      const extendSlot = [];
      columns.forEach((col) => {
        if (col.slots) {
          const slots = Object.values(col.slots);
          extendSlot.push(...slots);
        }
      });
      console.log(4566, extendSlot);
      return [...extendSlot];
    },
  },
  data() {
    return {
      tableList2: [],
      data: [],
      formDatas: {
        pageIndex: 1,
        pageSize: 10,
      },
      loading: false,
    };
  },

  created() {
    this.columnDrop();
  },
  methods: {
    tableSetting() {
      this.$refs["tabelSetting"].isopen(this.Storage);
    },
    getData(value) {
      value.forEach((item, index) => {
        this.$set(this.data[index], "visible", item.visible);
      });
      console.log(1233, this.tableProps.columns);
      this.$nextTick(() => {
        this.$refs.xGrid.refreshColumn();
        this.$refs.xGrid.reloadColumn(this.tableProps.columns);
      });
      this.$forceUpdate();
      this.saveStorage(this.Storage, value);
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

    cellDblclick({ row }) {},

    async saveStorage() {
      let versions = undefined;
      versions = this.tableData.Versions + 1;
      const res = await Serviceface.post(`/api/lwms/v1/OA_ClientDIYColumn/save`, {
        ClientId: sessionStorage.getItem("user_id"),
        ColumnDetails: JSON.string(this.data),
        TableName: this.tableData.Storage,
        Versions: versions,
      });
      this.$nextTick(() => {
        this.$refs.xGrid.reloadColumn(this.data);
        this.$refs.xGrid.refreshColumn();
      });
      console.log(3455, JSON.stringify(this.data));
    },
    columnDrop() {
      this.$nextTick(() => {
        const $table = this.$refs.xGrid;
        this.sortable2 = Sortable.create($table.$el.querySelector(".body--wrapper>.vxe-table--header .vxe-header--row"), {
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
                wrapperElem.insertBefore(targetThElem, oldThElem ? oldThElem.nextElementSibling : oldThElem);
              }
              VXETable.modal.message({
                content: "固定列不允许拖动，即将还原操作！",
                status: "error",
              });
              return;
            }
            // 获取列索引 columnIndex > fullColumn
            const oldColumnIndex = $table.getColumnIndex(tableColumn[oldIndex]);
            const newColumnIndex = $table.getColumnIndex(tableColumn[newIndex]);
            // 移动到目标列
            const currRow = this.data.splice(oldColumnIndex, 1)[0];
            this.data.splice(newColumnIndex, 0, currRow);
            $table.loadColumn(fullColumn); //列重载
            console.log(11111, this.data);
            this.saveStorage();
          },
        });
      });
    },
  },
};
</script>

<style scoped></style>
