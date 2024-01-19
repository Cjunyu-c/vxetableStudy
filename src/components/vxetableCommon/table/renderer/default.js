import VXETable from "vxe-table";
import {
  moneyFormats,
} from '../../../../utils/index.js'
import Vue from 'vue'
import RenderIdentify from './components/RenderIdentify.vue'
import RenderCreateUser from './components/RenderCreateUser.vue'
Vue.component(RenderIdentify.name, RenderIdentify)
Vue.component(RenderCreateUser.name, RenderCreateUser)

// 创建一个简单的超链接渲染
VXETable.renderer.add('MyLink', {
  // 默认显示模板
  renderDefault(h, renderOpts, params) {
    const { row, column } = params
    const { events } = renderOpts
    return [
      <a class="link" onClick={() => events.click(params)}>{row[column.property]}</a>
    ]
  }
})


// 创建一个money格式化
VXETable.renderer.add('FormatMoney', {
  // 默认显示模板
  renderDefault(h, cellRender, params) {
    let { row, column } = params;
    let temppro = row[column.property];
    return [
      moneyFormats(temppro).replace('¥', '')
    ]
  }
})
// 创建一个删除格式化
VXETable.renderer.add('FormatDeleted', {
  // 默认显示模板
  renderDefault(h, cellRender, params) {
    let { row, column } = params;
    let temppro = row[column.property];
    return [
      row[column.property] ? "已删除申报" : "未删除申报"
    ]
  }
})
// 创建一个更新时间格式化
VXETable.renderer.add('FormatDate', {
  // 默认显示模板
  renderDefault(h, cellRender, params) {
    let { row, column } = params;
    let temppro1 = row[column.property];
    return [
      this.utc2beijing(temppro1)
    ]
  }
})

// 创建一个录入信息格式化
VXETable.renderer.add('FormatCreateUser', {
  // 默认显示模板
  renderDefault(h, cellRender, params) {
    return [
      <RenderCreateUser params={params}></RenderCreateUser>
    ]
  }
})
// 创建一个状态渲染器
VXETable.renderer.add('FormatContentStatus', {
  // 默认显示模板
  renderDefault(h, cellRender, params) {
    let { row, column } = params
    const statusList = [
      {
        label: "三单",
        status: 10,
      },
      {
        label: "清单",
        status: 20,
      },
      {
        label: "总分单",
        status: 30,
      },
      {
        label: "离境单",
        status: 40,
      },
    ];
    const changeColor = (type) => {
      let bgcolor = "";
      switch (type) {
        case "1":
          bgcolor = "#67c23a";
          break;

        case "0":
          bgcolor = "#ff4500";
          break;
        case "-1":
          bgcolor = "#ddd";
          break;
      }
      return {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        display: 'inline-block',
        backgroundColor: bgcolor
      };
    };
    function RenderContent() {
      return (
        <div>
          <div>{row[column.property]}</div>
          {statusList.map((item, index) => {
            let dynamicStyle = changeColor(row.status_list.split(',')[index]);
            return <el-tooltip class="item" effect="dark" content={item.label} placement="top-start">
              <div class="mr10 cp" style={dynamicStyle}>
              </div>
            </el-tooltip>

          })}

        </div>
      )
    }
    return RenderContent()
  }
})

// 创建一个进度渲染器
VXETable.renderer.add('FormatContentSchedule', {

  // 默认显示模板
  renderDefault(h, cellRender, params) {
    let { row, column } = params;

    function RenderSchedules() {

      return (
        <div>
          <div>
            <div
              onClick={() => resultQuery(row.id, row.status, row)}
              class={row.isDeleted ? 'c-red' : `${'inline-block'} ${'cp'} ${'c-blue'}`}
              style={row.isDeleted && row.status != 30 ? { textDecoration: 'line-through' } : null}>
              {row.appStatus_Name !== '清单' ?
                <div>{row.schedule_Name}</div>
                :
                <div>
                  <span style={{ color: '#67c23a' }}>{row.schedule_Name.split("/")[0]}</span>
                  {row.schedule_Name.split('/')[1] != 0 ? <span style={{ color: '#ff6600' }}>{row.schedule_Name.split("/")[1]}</span> : null}
                  {row.schedule_Name.split('/')[1] != 0 ? <span style={{ color: '#f56c6c' }}>{row.schedule_Name.split("/")[2]}</span> : null}
                </div>}
            </div>
            <div class="inline-block cp">
              <i onClick={() => Shortcut(row.id, row.trafName, row)} style={{ fontSize: '15px', color: '#67c23a' }} class="el-icon-s-promotion"></i>
            </div>
          </div>
          {row.progress >= 0 ? <el-progress percentage={row.progress}></el-progress> : null}

        </div >
      )

    }
    function Shortcut(id, title, row) {

      params.$grid.$parent.$parent.$refs.shortcut.isopen(id, title, row)
      // params.$grid.$parent.$parent.getData();
    }
    function resultQuery(id, status, orderid) {

      // params.$grid.$parent.$listeners.resultQuery(id, status, orderid)
      params.$grid.$parent.$parent.$refs.resultQuery.isopen(id, status, orderid)
      // params.$grid.$parent.$parent.getData();
    }
    return RenderSchedules()

  }
})

// 创建一个标识渲染器
VXETable.renderer.add('FormatContentIdentify', {
  // 默认显示模板
  renderDefault(h, cellRender, params) {
    return <RenderIdentify params={params}></RenderIdentify>
  }
})


// 创建一个公路内容渲染器
VXETable.renderer.add('FormatContentTrafMode', {
  // 默认显示模板
  renderDefault(h, cellRender, params) {
    let { row, column } = params;

    function RenderTrafMode() {

      return (
        <div>
          <div>
            {row.trafModeName == '公路运输' ?
              <div>{row.trafModeName}</div> : row.trafModeName == '水路运输'
                ? <div style={{ color: '#4d9bff' }}>{row.trafModeName}</div> : row.trafModeName == '航空运输'
                  ? <div style={{ color: '#f87503' }}>{row.trafModeName}</div> : <div>{row.trafModeName}</div>}

          </div>
          <div>{row.trafName}</div>

        </div >
      )

    }
    return RenderTrafMode()
  }
})