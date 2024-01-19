<template>
  <div class="content-inter-box">
    <div class="white-box table-outer-box">
    

      <div class="table-box-tpp">
        <TableCom
           :table-list="tableList"
           :tableColumn="tableColumns"
           :menuConfig="menuConfig"
          :formDatas="formData"
          :pagination="true"
          :tableData="tableData"
          @contextMenuClickEvent="contextMenuClickEvent"
          :summarymethod="summarymethod"
           @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        >
            <!-- <template #booking_date_default="{ row }">
              111
            <span>￥{{row.booking_date}}</span>

            </template> -->
            <template #booking_date_default="{ row }">
    <span>￥1{{row}}</span>
  </template>
          <!-- <template #booking_date_default="prop">
              <span>￥{{prop.col.booking_date}}</span>
          </template> -->
        </TableCom>
      </div>
    </div>
  </div>
</template>

<script>
import TableCom from "./TableCom.vue";
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

       tableColumns: [
        {
          key: 2,
          slots: { default: "booking_date_default" },
          field: "booking_date",
          title: "订舱日期",
          visible: true,
          width: 200,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
        {
          key: 3,
          // slots: { default: "booking_no_default" },
          field: "booking_no",
          title: "订舱流水号",
          visible: true,
          width: 300,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
        {
          key: 4,
          // slots: { default: "type_default" },
          field: "type",
          title: "订舱类型",
          visible: true,
          width: 200,
          filterRender: { name: "MLFilterRender" },
          filters: [
            {
              data: {
                vals: [],
                sVal: "",
                operator1: "空白",
                value1: "",
                operator2: "空白",
                value2: "",
                concat: "与",
              },
            },
          ],
        },
        {
          key: 5,
          // slots: { default: "booking_status_default" },
          field: "booking_status",
          title: "订舱状态",
          visible: true,
          width: 200,
          filters: [
            {
              data: {
                vals: [],
                sVal: "",
                fMenu: "",
                f1Type: "",
                f1Val: "",
                fMode: "and",
                f2Type: "",
                f2Val: "",
              },
            },
          ],
          filterRender: { name: "FilterExtend" },
        },
        {
          key: 6,
          // slots: { default: "booking_agent_name_default" },
          field: "booking_agent_name",
          title: "订舱代理",
          visible: true,
          width: 300,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
        {
          key: 7,
          // slots: { default: "agent_name_default" },
          field: "agent_name",
          title: "联系人",
          visible: true,
          width: 300,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
        {
          key: 8,
          // slots: { default: "agent_phone_default" },
          field: "agent_phone",
          title: "联系电话",
          visible: true,
          width: 300,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
        {
          key: 9,
          // slots: { default: "start_port_default" },
          field: "start_port",
          title: "始发港",
          visible: true,
          width: 300,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
        {
          key: 10,
          // slots: { default: "dest_port_default" },
          field: "dest_port",
          title: "目的港",
          visible: true,
          width: 300,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
        {
          key: 11,
          // slots: { default: "transfer_port_default" },
          field: "transfer_port",
          title: "中转港",
          visible: true,
          width: 300,
          filters: [{ data: null }],
          filterRender: { name: "FilterInput" },
        },
      ],
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
      tableList:[
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
      checkBoxList: [],
      cheboxList: [],
      tableLoading: false,
      selection: {},
    };
  },
  async mounted() {
   
  },
  
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
      // this.getData();
    },
    handleCurrentChange(val) {
      this.formData.pageIndex = val;
      this.tableData.pageIndex = val;
      // this.getData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("formData");
      // this.getData();
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
