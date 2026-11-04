import type { MeetingEvent } from '../types/event'

export const initialEvents: MeetingEvent[] = [
  { id: 'LM-1001', name: '2026 数字未来 · 行业创新峰会', category: '行业峰会', date: '2026-11-20 09:00', location: '上海 · 国际会议中心', capacity: 500, registered: 328, status: '报名中', description: '汇聚行业领袖与创新实践者，探讨数字化转型的机遇。通过主题演讲、圆桌讨论与交流，连接更多合作可能。' },
  { id: 'LM-1002', name: '品牌增长与用户体验沙龙', category: '主题沙龙', date: '2026-11-26 14:00', location: '杭州 · 创意设计中心', capacity: 120, registered: 86, status: '报名中', description: '从真实案例出发，与品牌及产品负责人一起探索可持续增长的方法。' },
  { id: 'LM-1003', name: 'LinkMeet 年度合作伙伴大会', category: '合作伙伴', date: '2026-12-12 09:30', location: '深圳 · 湾区会展中心', capacity: 300, registered: 0, status: '筹备中', description: '回顾年度合作成果，共同开启下一年的合作规划。' },
  { id: 'LM-1004', name: '秋日设计师交流工作坊', category: '工作坊', date: '2026-10-23 13:30', location: '北京 · 设计之都', capacity: 80, registered: 76, status: '已结束', description: '面向设计从业者的线下工作坊，分享设计思考与协作经验。' },
  { id: 'LM-1005', name: '企业 AI 应用实践公开课', category: '行业峰会', date: '2026-12-05 10:00', location: '上海 · 张江科学会堂', capacity: 200, registered: 142, status: '报名中', description: '聚焦企业场景，分享人工智能应用落地的方法和实践经验。' },
]
export const eventCategories = ['行业峰会', '主题沙龙', '合作伙伴', '工作坊']
