// MBTI 完整的类型定义数据 - 合并文件

const mbtiFullTypes1 = require('./mbtiFullData');
const mbtiFullTypes2 = require('./mbtiFullData2');
const mbtiFullTypes3 = require('./mbtiFullData3');
const mbtiQuestions = require('./mbtiQuestions');

// 合并所有类型数据
const allTypes = {
  ...mbtiFullTypes1,
  ...mbtiFullTypes2,
  ...mbtiFullTypes3
};

module.exports = {
  questions: mbtiQuestions,
  types: allTypes
}; 