import { currentAccountId, initialOrganization, permissionOptions, scopeOptions } from '../mock/organization'
import type { Entity, EntityKind, Enterprise, Member, OrganizationApi, OrganizationData, Region, Role } from '../types/organization'
const data = structuredClone(initialOrganization)
const copy = () => structuredClone(data)
function requireValue(value: string, label: string) { if (!value?.trim()) throw new Error(`请填写${label}`) }
function member(id: string) { return data.members.find(m => m.id === id) }
function log(memberId: string, action: string) { data.logs.unshift({ id: crypto.randomUUID(), memberId, action, time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }), operator: member(currentAccountId)?.name ?? '管理员' }) }
function activeIn(id: string, enterpriseId: string) { const m = member(id); return m?.status === '正常' && m.enterpriseId === enterpriseId }
// 替换为 HTTP 实现即可接入后端；所有业务校验也必须由服务端再次执行。
export const organizationApi: OrganizationApi = {
  async load() { return copy() },
  async save(kind: EntityKind, input: Entity) {
    const fields: Record<EntityKind, string[]> = {
      enterprises: ['id', 'name', 'address', 'contact', 'phone', 'adminIds', 'creatorId'],
      regions: ['id', 'name', 'enterpriseId', 'leaderId', 'description'],
      members: ['id', 'name', 'phone', 'enterpriseId', 'regionId', 'roleIds', 'loginMethods', 'status', 'takeoverId'],
      roles: ['id', 'name', 'description', 'permissions', 'scope'],
    }
    const item = Object.fromEntries(Object.entries(structuredClone(input)).filter(([key]) => fields[kind].includes(key))) as unknown as Entity
    requireValue(item.name, '名称'); item.name = item.name.trim()
    const existing = (data[kind] as Entity[]).find(x => x.id === item.id)
    if (kind !== 'members' && (data[kind] as Entity[]).some(x => x.id !== item.id && x.name === item.name && (kind === 'roles' || !('enterpriseId' in item) || ('enterpriseId' in x && x.enterpriseId === item.enterpriseId)))) throw new Error('名称已存在')
    if (kind === 'enterprises') {
      const e = item as Enterprise
      if (!existing && data.enterprises.filter(x => x.creatorId === currentAccountId).length >= 2) throw new Error('一个账号最多新增两个企业')
      requireValue(e.address, '企业地址'); requireValue(e.contact, '联系人')
      if (!/^1[3-9]\d{9}$/.test(e.phone)) throw new Error('请输入有效的手机号码')
      if (!e.adminIds.length || e.adminIds.some(id => !(activeIn(id, e.id) || (id === currentAccountId && member(id)?.status === '正常')))) throw new Error('请选择至少一位本企业正常状态的管理员')
      e.creatorId = existing ? (existing as Enterprise).creatorId : currentAccountId
    }
    if (kind === 'regions') {
      const r = item as Region
      if (!data.enterprises.some(e => e.id === r.enterpriseId)) throw new Error('请选择企业')
      if (existing && (existing as Region).enterpriseId !== r.enterpriseId && data.members.some(m => m.regionId === r.id)) throw new Error('区域已有成员，不能变更企业')
      if (!activeIn(r.leaderId, r.enterpriseId)) throw new Error('区域负责人须为本企业正常成员')
    }
    if (kind === 'members') {
      const m = item as Member
      if (!/^1[3-9]\d{9}$/.test(m.phone)) throw new Error('请输入有效的手机号码')
      if (data.members.some(x => x.id !== m.id && x.phone === m.phone)) throw new Error('该手机号已被邀请')
      if (!data.enterprises.some(e => e.id === m.enterpriseId)) throw new Error('请选择企业')
      if (m.regionId && !data.regions.some(r => r.id === m.regionId && r.enterpriseId === m.enterpriseId)) throw new Error('区域与企业不匹配')
      if (!m.roleIds.length || m.roleIds.some(id => !data.roles.some(r => r.id === id))) throw new Error('请配置有效角色')
      if (!m.loginMethods.length || m.loginMethods.some(x => !['手机', '微信'].includes(x))) throw new Error('请选择登录方式')
      if (existing) {
        const old = existing as Member
        m.status = old.status; m.takeoverId = old.takeoverId
        if (m.regionId !== old.regionId && [old.regionId, m.regionId].filter(Boolean).some(id => data.regions.find(r => r.id === id)?.leaderId !== currentAccountId)) throw new Error('区域成员归属变更须由对应区域负责人管理')
        if (m.enterpriseId !== old.enterpriseId && (data.enterprises.some(e => e.adminIds.includes(m.id)) || data.regions.some(r => r.leaderId === m.id) || data.members.some(x => x.takeoverId === m.id))) throw new Error('请先移交管理员、区域负责人或接管职责，再变更企业')
      } else { m.status = '待加入'; m.takeoverId = '' }
    }
    if (kind === 'roles') {
      const r = item as Role
      if (!scopeOptions.includes(r.scope) || r.permissions.some(p => !permissionOptions.includes(p))) throw new Error('权限配置无效')
    }
    if (!item.id) item.id = crypto.randomUUID()
    const list = data[kind] as Entity[]
    const index = list.findIndex(x => x.id === item.id)
    if (index < 0) list.unshift(item); else list[index] = item
    if (kind === 'members') log(item.id, existing ? '编辑成员信息、组织与角色' : '发送成员邀请（演示，未发送真实短信或微信）')
    if (kind === 'roles') data.members.filter(m => m.roleIds.includes(item.id)).forEach(m => log(m.id, `更新关联角色：${item.name}`))
    return copy()
  },
  async updateRegionMembers(id, memberIds) {
    const r = data.regions.find(x => x.id === id)
    if (!r || r.leaderId !== currentAccountId) throw new Error('仅对应区域负责人可管理区域成员')
    if (memberIds.some(memberId => member(memberId)?.enterpriseId !== r.enterpriseId)) throw new Error('只能选择本企业成员')
    const changed = data.members.filter(m => memberIds.includes(m.id) || m.regionId === id)
    if (changed.some(m => m.regionId && m.regionId !== id && data.regions.find(x => x.id === m.regionId)?.leaderId !== currentAccountId)) throw new Error('请先由原区域负责人将成员移出原区域')
    changed.forEach(m => { const target = memberIds.includes(m.id) ? id : ''; if (m.regionId !== target) { m.regionId = target; log(m.id, `区域负责人更新归属：${target ? r.name : '未分配区域'}`) } })
    return copy()
  },
  async setMemberStatus(id, disabled, takeoverId = '') {
    const m = member(id); if (!m) throw new Error('成员不存在')
    if (id === currentAccountId) throw new Error('不能停用当前账号')
    if (disabled) {
      if (m.status !== '正常') throw new Error('仅正常成员可以停用')
      if (takeoverId && (takeoverId === id || !activeIn(takeoverId, m.enterpriseId))) throw new Error('接管人须为同企业的其他正常成员')
      if (data.enterprises.some(e => e.adminIds.includes(id)) || data.regions.some(r => r.leaderId === id) || data.members.some(x => x.takeoverId === id)) throw new Error('请先移交管理员、区域负责人或接管职责再停用')
      m.status = '已停用'; m.takeoverId = takeoverId
    } else { if (m.status !== '已停用') throw new Error('仅已停用成员可以启用'); m.status = '正常'; m.takeoverId = '' }
    log(id, disabled ? `停用后台访问；临时接管人：${member(takeoverId)?.name ?? '未指定'}；原业务数据保持不变` : '恢复后台访问')
    return copy()
  },
}
