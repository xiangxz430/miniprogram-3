/**
 * 农历日期转换工具
 */

// 农历1900-2100的闰大小信息表
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520 // 2100
];

// 天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 月份
const LUNAR_MONTH = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
// 日
const LUNAR_DAY = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

/**
 * 计算该年是否为闰年
 * @param {Number} year 
 */
function isLeapYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

/**
 * 获取该年的天数
 * @param {Number} year 
 */
function getDaysOfYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * 获取该月的天数
 * @param {Number} year 
 * @param {Number} month 
 */
function getDaysOfMonth(year, month) {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1];
}

/**
 * 计算从1900年1月31日到指定日期的天数
 * @param {Number} year - 公历年
 * @param {Number} month - 公历月
 * @param {Number} day - 公历日
 */
function daysSince1900(year, month, day) {
  // 基准日期：1900年1月31日
  let baseDate = new Date(1900, 0, 31); // 注意：JavaScript中月份从0开始
  let targetDate = new Date(year, month - 1, day); // 目标日期
  
  // 计算两个日期之间的毫秒差，然后转换为天数
  let diffTime = targetDate.getTime() - baseDate.getTime();
  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * 公历转农历
 * @param {Number} year - 公历年
 * @param {Number} month - 公历月
 * @param {Number} day - 公历日
 * @returns {Object} 农历日期对象
 */
function solarToLunar(year, month, day) {
  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);

  if (year < 1900 || year > 2100) {
    return { error: '超出可转换范围（1900-2100）' };
  }

  // 计算距离1900年1月31日的天数
  let offset = daysSince1900(year, month, day);
  let temp = 0;
  let lunarYear = 1900;
  let tempOffset = offset; // 用于递减的临时变量

  // 确定农历年份
  for (let i = 1900; i < 2101 && tempOffset > 0; i++) {
    temp = getLunarYearDays(i);
    if (tempOffset < temp) {
      lunarYear = i;
      break;
    } else {
      tempOffset -= temp;
    }
  }

  // 确定农历月份
  let lunarMonth = 1;
  let leap = getLeapMonth(lunarYear); // 闰月
  let isLeap = false;

  for (let i = 1; i < 13 && tempOffset > 0; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = getLeapDays(lunarYear);
    } else {
      temp = getLunarMonthDays(lunarYear, i);
    }
    if (isLeap && i === leap + 1) {
      isLeap = false;
    }
    if (tempOffset < temp) {
      lunarMonth = i;
      break;
    } else {
      tempOffset -= temp;
    }
  }

  let lunarDay = tempOffset + 1;

  // 计算天干地支年
  const cyclicalYear = ((lunarYear - 1900 + 36) % 60);
  const lunarYearText = HEAVENLY_STEMS[cyclicalYear % 10] + EARTHLY_BRANCHES[cyclicalYear % 12] + '年';

  // 确保月和日索引在有效范围内
  const monthIndex = Math.max(0, Math.min(lunarMonth - 1, LUNAR_MONTH.length - 1));
  const dayIndex = Math.max(0, Math.min(lunarDay - 1, LUNAR_DAY.length - 1));

  return {
    lunarYear: lunarYear,
    lunarMonth: lunarMonth,
    lunarDay: lunarDay,
    isLeap: isLeap,
    lunarYearText: lunarYearText,
    lunarMonthText: (isLeap ? '闰' : '') + LUNAR_MONTH[monthIndex] + '月',
    lunarDayText: LUNAR_DAY[dayIndex],
    monthStr: LUNAR_MONTH[monthIndex],
    dayStr: LUNAR_DAY[dayIndex]
  };
}

/**
 * 获取农历年的天数
 * @param {Number} year 
 */
function getLunarYearDays(year) {
  let sum = 348;
  
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
  }
  
  return sum + getLeapDays(year);
}

/**
 * 获取农历年闰月的天数
 * @param {Number} year 
 */
function getLeapDays(year) {
  if (getLeapMonth(year)) {
    return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

/**
 * 获取农历年闰月月份，如果没有返回0
 * @param {Number} year 
 */
function getLeapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf;
}

/**
 * 获取农历年某月的天数
 * @param {Number} year 
 * @param {Number} month 
 */
function getLunarMonthDays(year, month) {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

module.exports = {
  solarToLunar
}; 