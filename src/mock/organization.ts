import type { OrganizationData } from '../types/organization'
export const currentAccountId = 'm1'
export const permissionOptions = ['工作台查看', '活动查看', '活动新增编辑', '活动发布', '企业管理', '区域成员管理', '成员邀请编辑', '角色权限配置']
export const scopeOptions = ['全部数据', '所属企业', '所属区域', '仅本人']
export const initialOrganization: OrganizationData = {
  enterprises: [{ id: 'e1', name: '链荟会务科技有限公司', address: '上海市徐汇区漕溪北路 88 号', contact: '陈荟', phone: '13800000001', adminIds: ['m1'], creatorId: 'm1' }],
  regions: [{ id: 'a1', name: '华东区域', enterpriseId: 'e1', leaderId: 'm2', description: '负责上海、江苏、浙江的会务协作' }, { id: 'a2', name: '华南区域', enterpriseId: 'e1', leaderId: 'm3', description: '负责广东及周边地区的活动落地' }],
  members: [
    { id: 'm1', name: '陈荟', phone: '13800000001', enterpriseId: 'e1', regionId: '', roleIds: ['r1'], loginMethods: ['手机', '微信'], status: '正常', takeoverId: '' },
    { id: 'm2', name: '林悦', phone: '13800000002', enterpriseId: 'e1', regionId: 'a1', roleIds: ['r2', 'r3'], loginMethods: ['手机', '微信'], status: '正常', takeoverId: '' },
    { id: 'm3', name: '张远', phone: '13800000003', enterpriseId: 'e1', regionId: 'a2', roleIds: ['r2'], loginMethods: ['微信'], status: '正常', takeoverId: '' },
    { id: 'm4', name: '王宁', phone: '13800000004', enterpriseId: 'e1', regionId: 'a1', roleIds: ['r3'], loginMethods: ['手机'], status: '待加入', takeoverId: '' },
  ],
  roles: [
    { id: 'r1', name: '企业管理员', description: '统筹企业组织与会务配置', permissions: [...permissionOptions], scope: '所属企业' },
    { id: 'r2', name: '区域负责人', description: '管理所属区域成员及业务', permissions: ['工作台查看', '活动查看', '区域成员管理'], scope: '所属区域' },
    { id: 'r3', name: '活动运营', description: '筹备和执行活动', permissions: ['工作台查看', '活动查看', '活动新增编辑'], scope: '仅本人' },
  ],
  logs: [{ id: 'l1', memberId: 'm4', action: '发送成员邀请（演示）', time: '2026-11-04 10:00', operator: '陈荟' }],
}
