export const moneyFormats = (value) => {
    let a = Number(value) //转为数字格式
    let b = a.toLocaleString('zh', { style: 'currency', currency: 'CNY' })
    return b
}