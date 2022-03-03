// 日期格式化
export const formaTime = (date, isShowTime) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  // 字符串方法 padStart ES8  'abc'.padStart(4, '0) // '0abc'
  let timeStr = `${year}-${formatNumber(month)}-${formatNumber(day)}`
  if (isShowTime) {
    timeStr = `${year}-${formatNumber(month)}-${day.toString().padStart(2, 0)} ${formatNumber(
      hour
    )}:${formatNumber(minute)}:${formatNumber(second)}`
  }
  return timeStr
}
// 日期补零
const formatNumber = function(n: number | string) {
  return n.toString().padStart(2, '0')
}

// 错误日志
export const logError = (name: string, action: string, info?: string | object) => {
  if (!info) {
    info = 'empty'
  }
  let time = formaTime(new Date(), true)
  console.error(time, name, action, info)
  if (typeof info === 'object') {
    info = JSON.stringify(info)
  }
}
