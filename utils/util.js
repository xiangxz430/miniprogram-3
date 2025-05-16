/**
 * 通用工具函数
 */

// 格式化时间为 YYYY-MM-DD HH:MM:SS
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 格式化日期为 YYYY年MM月DD日
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return `${year}年${formatNumber(month)}月${formatNumber(day)}日`
}

// 格式化数字，保证两位数
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 生成随机整数，范围为 [min, max]
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 获取当前日期的格式化字符串
const getTodayFormatted = () => {
  return formatDate(new Date())
}

// 判断两个日期是否是同一天
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

// 计算两个日期之间的天数差
const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  // 取整数部分
  return Math.floor(Math.abs((date1 - date2) / oneDay))
}

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// 节流函数
const throttle = (func, wait) => {
  let lastTime = 0
  return function() {
    const context = this
    const args = arguments
    const now = Date.now()
    if (now - lastTime >= wait) {
      func.apply(context, args)
      lastTime = now
    }
  }
}

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  randomInt,
  getTodayFormatted,
  isSameDay,
  daysBetween,
  debounce,
  throttle
} 