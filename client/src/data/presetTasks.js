// 预设的任务数据
export const presetTasks = [
  {
    id: 1,
    title: "紧急项目截止日期",
    description: "完成季度重点项目的最后交付",
    importance: 9,
    urgency: 9,
    priority: 9.0,
    dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 明天
  },
  {
    id: 2,
    title: "团队战略规划",
    description: "制定下一季度的团队发展战略和目标",
    importance: 8,
    urgency: 3,
    priority: 5.0,
    dueDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 两周后
  },
  {
    id: 3,
    title: "系统维护",
    description: "执行例行系统维护和更新",
    importance: 3,
    urgency: 7,
    priority: 5.4,
    dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 两天后
  },
  {
    id: 4,
    title: "回复非关键邮件",
    description: "处理积压的非紧急邮件",
    importance: 2,
    urgency: 2,
    priority: 2.0,
    dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 一周后
  },
  {
    id: 5,
    title: "客户投诉处理",
    description: "解决高级客户的紧急投诉",
    importance: 7,
    urgency: 8,
    priority: 7.6,
    dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 一天后
  },
  {
    id: 6,
    title: "技能培训",
    description: "参加新技术培训课程",
    importance: 6,
    urgency: 4,
    priority: 4.8,
    dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 十天后
  },
  {
    id: 7,
    title: "办公用品采购",
    description: "补充团队办公用品",
    importance: 2,
    urgency: 5,
    priority: 3.8,
    dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 五天后
  },
  {
    id: 8,
    title: "年度绩效评估",
    description: "完成团队成员的年度绩效评估",
    importance: 8,
    urgency: 6,
    priority: 6.8,
    dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 三天后
  },
  {
    id: 9,
    title: "产品创新会议",
    description: "参加产品创新头脑风暴会议",
    importance: 7,
    urgency: 2,
    priority: 4.0,
    dueDate: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 八天后
  },
  {
    id: 10,
    title: "系统故障修复",
    description: "修复客户报告的系统关键故障",
    importance: 6,
    urgency: 9,
    priority: 7.8,
    dueDate: new Date().toISOString().split('T')[0] // 今天
  }
];