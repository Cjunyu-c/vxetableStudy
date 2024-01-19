
const plugins = {}
plugins.install = function (Vue) {
  Vue.prototype.utc2beijing = (utc_datetime) => {

    // 转为正常的时间格式 年-月-日 时:分:秒
    const zoneDate = new Date(utc_datetime).toJSON()
    const date = new Date(+new Date(zoneDate) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, ' ')
      .replace(/\.[\d]{3}Z/, '')
    return date
  }
  // 底部合计
  Vue.prototype.Tabletotal = (param, indexArr, pasInt = [], txt) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
      if (index === 1) {
        sums[index] = '合计'
        return
      }
      if (index === 2) {
        sums[index] = txt
      }
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => isNaN(value))) {
        if (indexArr.indexOf(index) != -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      } else {
        sums[index] = ' '
      }
    })
    sums.forEach((item, index) => {
      if (typeof item == 'number') {
        sums[index] = item.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    })
    if (pasInt.length != 0 && sums.length != 0) {
      pasInt.forEach((item) => {
        if (sums[item] != ' ') {
          sums[item] = sums[item].split('.')[0]
        }
      })
    }
    return sums
  }
}
export default plugins
