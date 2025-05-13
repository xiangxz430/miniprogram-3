const app = getApp();
const lunar = require('../../utils/lunar.js');
const { getHexagramInterpretation } = require('../../utils/deepseekApi.js');

// 五行与天干地支映射
const STEM_ELEMENT = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
const BRANCH_ELEMENT = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const BRANCH_TIME = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const BRANCH_TIME_LABEL = ['23:00-00:59','01:00-02:59','03:00-04:59','05:00-06:59','07:00-08:59','09:00-10:59','11:00-12:59','13:00-14:59','15:00-16:59','17:00-18:59','19:00-20:59','21:00-22:59'];
const ELEMENTS = [
  { name: '木', class: 'wood', color: '#16a34a' },
  { name: '火', class: 'fire', color: '#ef4444' },
  { name: '土', class: 'earth', color: '#eab308' },
  { name: '金', class: 'metal', color: '#a3a3a3' },
  { name: '水', class: 'water', color: '#0ea5e9' }
];

Page({
  data: {
    form: {
      name: '',
      genderIndex: 0,
      birthDate: '',
      birthTime: '',
    },
    genderOptions: ['男', '女'],
    baziResult: null,
    loading: false
  },

  onLoad() {
    this.syncUserData();
  },
  onShow() {
    this.syncUserData();
  },
  syncUserData() {
    // 优先本地缓存，其次全局
    let userSettings = wx.getStorageSync('userSettings') || {};
    let globalUser = (app.globalData && app.globalData.userInfo) || {};
    const name = userSettings.nickname || globalUser.nickname || '王小明';
    const gender = userSettings.gender || globalUser.gender || '男';
    const genderIndex = this.data.genderOptions.indexOf(gender) >= 0 ? this.data.genderOptions.indexOf(gender) : 0;
    const birthDate = userSettings.birthdate || globalUser.birthdate || '1990-08-15';
    const birthTime = userSettings.birthtime || globalUser.birthtime || '23:30';
    this.setData({
      form: {
        name,
        genderIndex,
        birthDate,
        birthTime
      }
    });
  },
  onInputName(e) {
    this.setData({ 'form.name': e.detail.value });
  },
  onGenderChange(e) {
    this.setData({ 'form.genderIndex': e.detail.value });
  },
  onDateChange(e) {
    this.setData({ 'form.birthDate': e.detail.value });
  },
  onTimeChange(e) {
    this.setData({ 'form.birthTime': e.detail.value });
  },

  async onCalc() {
    const { name, genderIndex, birthDate, birthTime } = this.data.form;
    if (!name || !birthDate || !birthTime) {
      wx.showToast({ title: '请完善信息', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    const localBazi = this.calcBazi(birthDate, birthTime, genderIndex);
    const userInfo = {
      name,
      gender: this.data.genderOptions[genderIndex],
      birthdate: birthDate,
      birthtime: birthTime,
      lunarText: localBazi.lunarText,
      timeZhi: localBazi.timeZhi,
      bazi: localBazi.bazi,
      elementDist: localBazi.elementDist,
      dayMaster: localBazi.dayMaster
    };
    const aiPrompt = {
      ...userInfo,
      require: `请基于上述用户信息和八字命盘，严格以JSON格式返回如下结构：\n{\n  bazi: [...],\n  lunarText: "...",\n  timeZhi: "...",\n  elementDist: [...],\n  dayMaster: "...",\n  strength: "...",\n  pattern: "...",\n  favorable: "...",\n  unfavorable: "...",\n  character: "...",\n  career: "...",\n  health: "...",\n  lifeStages: [...],\n  luckyColors: [...],\n  luckyItems: "...",\n  luckyDirections: "...",\n  luckyActions: [...],\n  unluckyActions: [...]\n}\n每个字段都要有内容，lifeStages/luckyActions/unluckyActions等为数组，内容要详细丰富，适合直接渲染到命盘信息、运势分析、大运流年、开运建议等模块。不要输出多余解释。`
    };
    try {
      const aiResult = await new Promise((resolve) => {
        getHexagramInterpretation(localBazi, aiPrompt).then(resolve).catch(() => resolve(localBazi));
      });
      // 字段判空，保证页面展示健壮
      this.setData({
        baziResult: {
          ...localBazi,
          ...aiResult,
          bazi: aiResult.bazi || localBazi.bazi,
          elementDist: aiResult.elementDist || localBazi.elementDist,
          dayMaster: aiResult.dayMaster || localBazi.dayMaster,
          lunarText: aiResult.lunarText || localBazi.lunarText,
          timeZhi: aiResult.timeZhi || localBazi.timeZhi,
          strength: aiResult.strength || '',
          pattern: aiResult.pattern || '',
          favorable: aiResult.favorable || '',
          unfavorable: aiResult.unfavorable || '',
          character: aiResult.character || '',
          career: aiResult.career || '',
          health: aiResult.health || '',
          lifeStages: aiResult.lifeStages || [],
          luckyColors: aiResult.luckyColors || [],
          luckyItems: aiResult.luckyItems || '',
          luckyDirections: aiResult.luckyDirections || '',
          luckyActions: aiResult.luckyActions || [],
          unluckyActions: aiResult.unluckyActions || []
        },
        loading: false
      });
    } catch (e) {
      wx.showToast({ title: 'AI解析失败，已降级本地', icon: 'none' });
      this.setData({ baziResult: localBazi, loading: false });
    }
  },

  // 八字排盘主逻辑（本地基础数据，AI会用到）
  calcBazi(birthDate, birthTime, genderIndex) {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    const lunarObj = lunar.solarToLunar(year, month, day);
    const yearIndex = (year - 1864) % 60;
    const yearStem = STEMS[yearIndex % 10];
    const yearBranch = BRANCHES[yearIndex % 12];
    const monthIndex = ((year - 1900) * 12 + month + 1) % 60;
    const monthStem = STEMS[monthIndex % 10];
    const monthBranch = BRANCHES[monthIndex % 12];
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    const days = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    const dayIndex = (days + 40) % 60;
    const dayStem = STEMS[dayIndex % 10];
    const dayBranch = BRANCHES[dayIndex % 12];
    const timeIndex = Math.floor((hour + 1) / 2) % 12;
    const timeBranch = BRANCH_TIME[timeIndex];
    const timeStemIndex = (dayIndex * 2 + timeIndex) % 10;
    const timeStem = STEMS[timeStemIndex];
    const stems = [yearStem, monthStem, dayStem, timeStem];
    const branches = [yearBranch, monthBranch, dayBranch, timeBranch];
    const bazi = [
      { label: '年柱', stem: yearStem, branch: yearBranch, stemElementClass: 'element-' + STEM_ELEMENT[STEMS.indexOf(yearStem)], branchElementClass: 'element-' + BRANCH_ELEMENT[BRANCHES.indexOf(yearBranch)] },
      { label: '月柱', stem: monthStem, branch: monthBranch, stemElementClass: 'element-' + STEM_ELEMENT[STEMS.indexOf(monthStem)], branchElementClass: 'element-' + BRANCH_ELEMENT[BRANCHES.indexOf(monthBranch)] },
      { label: '日柱', stem: dayStem, branch: dayBranch, stemElementClass: 'element-' + STEM_ELEMENT[STEMS.indexOf(dayStem)], branchElementClass: 'element-' + BRANCH_ELEMENT[BRANCHES.indexOf(dayBranch)] },
      { label: '时柱', stem: timeStem, branch: timeBranch, stemElementClass: 'element-' + STEM_ELEMENT[STEMS.indexOf(timeStem)], branchElementClass: 'element-' + BRANCH_ELEMENT[BRANCHES.indexOf(timeBranch)] },
    ];
    const elementCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    stems.forEach((s) => { elementCount[STEM_ELEMENT[STEMS.indexOf(s)]]++; });
    branches.forEach((b) => { elementCount[BRANCH_ELEMENT[BRANCHES.indexOf(b)]]++; });
    const total = Object.values(elementCount).reduce((a, b) => a + b, 0);
    const elementDist = ELEMENTS.map(e => ({
      name: e.name,
      class: e.class,
      count: elementCount[e.class],
      percent: total ? Math.round(elementCount[e.class] / total * 100) : 0
    }));
    const dayMaster = dayStem + '日主';
    return {
      lunarText: lunarObj.lunarYearText + lunarObj.lunarMonthText + lunarObj.lunarDayText,
      timeZhi: timeBranch,
      bazi,
      dayMaster,
      elementDist
    };
  }
});
