<template>
  <div class="content-inter-box">
    <div class="white-box table-outer-box">
      <div class="table-box-tpp">
        <TableCom
          :gridOptions="gridOptions"
          :formData="formData"
          :pagination="true"
          :tableData="tableData"
          @contextMenuClickEvent="contextMenuClickEvent"
          @handleSizeChange="handleSizeChange"
          :summarymethod="summarymethod"
          @handleCurrentChange="handleCurrentChange"
        >
          <template slot="toolbar_buttons">
            <vxe-button status="operation" icon="vxe-icon-search">搜索</vxe-button>
            <vxe-button icon="vxe-icon-refresh">刷新</vxe-button>
            <vxe-button status="operation" icon="vxe-icon-add">海运订舱</vxe-button>
            <vxe-button status="operation" icon="vxe-icon-add">空运订舱</vxe-button>
            <vxe-button status="operation" icon="vxe-icon-edit">编辑</vxe-button>
            <vxe-button status="operation" icon="vxe-icon-check">确认订舱</vxe-button>
            <vxe-button status="operation" icon="vxe-icon-close">取消订舱</vxe-button>
            <vxe-button status="operation" icon="vxe-icon-delete">删除</vxe-button>
          </template>
          <template #booking_date_default="{ row }">
            <span>{{ row.booking_date }}</span>
          </template>
        </TableCom>
      </div>
    </div>
  </div>
</template>

<script>
import TableCom from "./TableComXGrid.vue";
import XEClipboard from "xe-clipboard";
import XEUtils from "xe-utils";
import VXETable from "vxe-table";
export default {
  name: "TestBooking",
  components: {
    TableCom,
  },
  data() {
    return {
      gridOptions: {
        size: "mini",
        border: true,
        showHeaderOverflow: true,
        showOverflow: true,
        keepSource: true,
        showFooter: true,
        height: "600",
        class: "sortable-column-demo",
        rowId: "id",
        rowConfig: {
          isHover: true,
        },
        columnConfig: {
          resizable: true,
          useKey: true,
          minWidth: 200,
        },
        scrollX: {
          enabled: false,
        },
        scrollY: {
          enabled: true,
        },
        mouseConfig: {
          selected: true,
        },
        keyboardConfig: {
          isArrow: true,
        },
        customConfig: { storage: true },
        toolbarConfig: {
          slots: {
            buttons: "toolbar_buttons",
          },
          zoom: true,
        },
        menuConfig: {
          className: "my-menus",
          body: {
            options: [
              [
                {
                  code: "copy",
                  name: "复制",
                  prefixIcon: "vxe-icon-copy",
                  className: "my-copy-item",
                },
                {
                  code: "edit",
                  name: "编辑",
                  prefixIcon: "vxe-icon-edit",
                },
                {
                  code: "delete",
                  name: "删除",
                  prefixIcon: "vxe-icon-delete color-red",
                },
              ],
            ],
          },
        },

        columns: [
          // { type: "checkbox", width: "50", fixed: "left" },
          {
            field: "booking_date",
            title: "订舱日期",
            visible: true,
            sortable: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            slots: {
              default: "booking_date_default",
            },
          },
          {
            field: "booking_no",
            title: "订舱流水号",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "booking_no_filter" },
          },
          {
            field: "type",
            title: "订舱类型",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "type_filter" },
          },
          {
            field: "booking_status",
            title: "订舱状态",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "booking_status_filter" },
          },
          {
            field: "booking_agent_name",
            title: "订舱代理",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "booking_agent_filter" },
          },
          {
            field: "agent_name",
            title: "联系人",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "agent_name_filter" },
          },
          {
            field: "agent_phone",
            title: "联系电话",
            visible: true,
            sortable: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            // slots: { filter: "agent_phone_filter" },
          },
          {
            field: "start_port",
            title: "始发港",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "start_port_filter" },
          },
          {
            field: "dest_port",
            title: "目的港",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "dest_port_filter" },
          },
          {
            field: "transfer_port",
            title: "中转港",
            visible: true,
            filters: [{ data: null }],
            filterRender: { name: "FilterInput" },
            sortable: true,
            // slots: { filter: "transfer_port_filter" },
          },
        ],
        data: [
          {
            id: 10001,
            booking_date: "Test1",
            booking_no: "T1",
            type: "Develop",
            booking_status: "1",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
          {
            id: 10002,
            booking_date: "Test2",
            booking_no: "T2",
            type: "Develop",
            booking_status: "2",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
          {
            id: 10003,
            booking_date: "Test3",
            booking_no: "T3",
            type: "Develop",
            booking_status: "3",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
          {
            id: 10004,
            booking_date: "Test4",
            booking_no: "T4",
            type: "Develop",
            booking_status: "4",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
          {
            id: 10005,
            booking_date: "Test5",
            booking_no: "T5",
            type: "Develop",
            booking_status: "5",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
          {
            id: 10006,
            booking_date: "Test6",
            booking_no: "T6",
            type: "Develop",
            booking_status: "6",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
          {
            id: 10007,
            booking_date: "Test7",
            booking_no: "T7",
            type: "Develop",
            booking_status: "7",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
          {
            id: 10008,
            booking_date: "Test8",
            booking_no: "T8",
            type: "Develop",
            booking_status: "8",
            booking_agent_name: 28,
            agent_name: "test abc",
            agent_phone: 28,
            start_port: "test abc",
            dest_port: 28,
            transfer_port: "test abc",
          },
        ],
        footerData: [],
      },

      totleColumn: ["Count", "fee_Trans", "fee_Zhuangxie", "fee_All", "Quantity", "Volume", "Weight"],
      formData: {
        pageSize: 20,
        pageIndex: 1,
        booking_no: "",
        booking_agent: "",
        type: "",
        start_port: "",
        trans_port: "",
        dest_port: "",
        EndTime: "",
        startTime: "",
        KeyOfTime: "",
      },
      select: {},
      tableData: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        Versions: 0,
        Storage: "TestBooking",
      },

      checkBoxList: [],
      cheboxList: [],
      tableLoading: false,
      selection: {},
    };
  },
  async mounted() {},

  methods: {
    selectionChange(v) {
      this.checkBoxList = v;
    },
    handleSizeChange(val) {
      this.tableData.pageIndex = 1;
      this.tableData.pageSize = val;
      this.formData.pageIndex = 1;
      this.formData.pageSize = val;
      if (typeof val != "number") {
        this.MessageTips(4, "请输入正确的页数");
        return;
      }
      // TODO重新获取表格数据;
    },
    handleCurrentChange(val) {
      this.formData.pageIndex = val;
      this.tableData.pageIndex = val;
      // TODO重新获取表格数据;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("formData");
      // TODO重新获取表格数据;
    },

    contextMenuClickEvent({ menu, row, column }) {
      switch (menu.code) {
        case "copy":
          if (row && column) {
            if (XEClipboard.copy(row[column.property])) {
              VXETable.modal.message({
                content: "已复制到剪贴板！",
                status: "success",
              });
            }
          }
          break;
        case "edit":
          console.log("点击edit");

          break;
        case "delete":
          console.log("点击delete");
          break;
      }
    },
    summarymethod({ columns, data }) {
      return [this.Tabletotals({ columns, data }, ``)];
    },
  },
};
</script>

<style></style>
