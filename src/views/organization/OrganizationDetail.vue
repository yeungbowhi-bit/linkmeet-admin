<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useOrganizationStore } from '../../stores/organization'
import { currentAccountId } from '../../mock/organization'
import EntityEditor from '../../components/organization/EntityEditor.vue'
import MemberTable from '../../components/organization/MemberTable.vue'
import type { Enterprise, EntityKind, Member, Region, Role } from '../../types/organization'
const props = defineProps<{ kind: EntityKind }>()
const route = useRoute()
const store = useOrganizationStore()
const entity = computed(() => store.data[props.kind].find(x => x.id === route.params.id))
const enterprise = computed(() => props.kind === 'enterprises' ? entity.value as Enterprise : undefined)
const region = computed(() => props.kind === 'regions' ? entity.value as Region : undefined)
const member = computed(() => props.kind === 'members' ? entity.value as Member : undefined)
const role = computed(() => props.kind === 'roles' ? entity.value as Role : undefined)
const editing = ref(false), statusDialog = ref(false), busy = ref(false), managing = ref(false)
const takeover = ref(''), regionMemberIds = ref<string[]>([])
const associated = computed(() => store.data.members.filter(m => enterprise.value ? enterprise.value.adminIds.includes(m.id) : region.value ? m.regionId === region.value.id : role.value ? m.roleIds.includes(role.value.id) : false))
const takeoverOptions = computed(() => store.data.members.filter(m => m.id !== member.value?.id && m.enterpriseId === member.value?.enterpriseId && m.status === '正常'))
const regionCandidates = computed(() => store.data.members.filter(m => m.enterpriseId === region.value?.enterpriseId))
const canManageRegion = computed(() => region.value?.leaderId === currentAccountId)
const logs = computed(() => store.data.logs.filter(l => l.memberId === member.value?.id))
const nameOf = (id: string) => store.data.members.find(m => m.id === id)?.name || '未指定'
watch(() => route.fullPath, () => { editing.value = false; managing.value = false; statusDialog.value = false })
onMounted(() => store.load().catch(e => ElMessage.error(e.message)))
async function changeStatus() {
  if (!member.value) return
  busy.value = true
  try { await store.setStatus(member.value.id, member.value.status !== '已停用', takeover.value); ElMessage.success('成员状态已更新，原业务数据保持不变'); statusDialog.value = false } catch (e) { ElMessage.error((e as Error).message) } finally { busy.value = false }
}
function openManage() { regionMemberIds.value = associated.value.map(m => m.id); managing.value = true }
async function saveRegionMembers() {
  if (!region.value || !canManageRegion.value) return
  busy.value = true
  try {
    await store.updateRegionMembers(region.value.id, regionMemberIds.value)
    ElMessage.success('区域成员已更新'); managing.value = false
  } catch (e) { ElMessage.error((e as Error).message) } finally { busy.value = false }
}
</script>
<template>
  <el-button text :icon="ArrowLeft" class="back-button" @click="$router.push(`/organization/${kind}`)">返回列表</el-button>
  <div v-loading="store.loading">
    <template v-if="entity">
      <div class="page-heading"><div><div class="eyebrow">组织管理 · 详情</div><h1>{{ entity.name }}</h1><p>{{ member ? '成员档案与操作记录' : region ? '区域信息与成员协作' : role ? '角色配置与关联成员' : '企业基本信息与管理员' }}</p></div><el-button type="primary" @click="editing = true">编辑{{ role ? '配置' : '信息' }}</el-button></div>
      <section class="panel org-detail">
        <h2>{{ role ? '角色配置' : '基本信息' }}</h2>
        <el-descriptions :column="1" border>
          <template v-if="enterprise"><el-descriptions-item label="企业名称">{{ enterprise.name }}</el-descriptions-item><el-descriptions-item label="企业地址">{{ enterprise.address }}</el-descriptions-item><el-descriptions-item label="联系人">{{ enterprise.contact }}</el-descriptions-item><el-descriptions-item label="联系电话">{{ enterprise.phone }}</el-descriptions-item></template>
          <template v-if="region"><el-descriptions-item label="所属企业">{{ store.data.enterprises.find(e => e.id === region?.enterpriseId)?.name }}</el-descriptions-item><el-descriptions-item label="区域负责人">{{ nameOf(region.leaderId) }}</el-descriptions-item><el-descriptions-item label="区域说明">{{ region.description || '暂无说明' }}</el-descriptions-item></template>
          <template v-if="member"><el-descriptions-item label="手机号码">{{ member.phone }}</el-descriptions-item><el-descriptions-item label="组织归属">{{ store.data.enterprises.find(e => e.id === member?.enterpriseId)?.name }} / {{ store.data.regions.find(r => r.id === member?.regionId)?.name || '未分配区域' }}</el-descriptions-item><el-descriptions-item label="角色"><el-tag v-for="id in member.roleIds" :key="id" class="org-tag">{{ store.data.roles.find(r => r.id === id)?.name }}</el-tag></el-descriptions-item><el-descriptions-item label="登录方式">{{ member.loginMethods.join(' / ') }}（展示，未接入认证）</el-descriptions-item><el-descriptions-item label="状态">{{ member.status }}{{ member.status === '已停用' ? ' · 禁止登录管理后台' : '' }}</el-descriptions-item><el-descriptions-item v-if="member.status === '已停用'" label="临时接管人">{{ nameOf(member.takeoverId) }}</el-descriptions-item></template>
          <template v-if="role"><el-descriptions-item label="角色说明">{{ role.description || '暂无说明' }}</el-descriptions-item><el-descriptions-item label="功能权限"><el-tag v-for="p in role.permissions" :key="p" class="org-tag">{{ p }}</el-tag><span v-if="!role.permissions.length">未配置功能权限</span></el-descriptions-item><el-descriptions-item label="数据范围">{{ role.scope }}</el-descriptions-item></template>
        </el-descriptions>
        <div v-if="member" class="org-actions"><el-button v-if="member.status !== '待加入'" :type="member.status === '已停用' ? 'primary' : 'danger'" plain :disabled="member.id === currentAccountId" @click="takeover = ''; statusDialog = true">{{ member.status === '已停用' ? '启用成员' : '停用成员' }}</el-button><span class="muted">{{ member.status === '待加入' ? '邀请待加入；本阶段不模拟真实登录。' : member.id === currentAccountId ? '当前账号不可停用自身' : '状态变更不会修改原业务数据' }}</span></div>
      </section>
      <section v-if="!member" class="panel org-section"><div class="panel-heading"><h2>{{ enterprise ? '企业管理员' : region ? '区域成员' : '关联成员' }}<span class="count-badge">{{ associated.length }}</span></h2><el-button v-if="region" type="primary" plain :disabled="!canManageRegion" @click="openManage">管理区域成员</el-button></div><el-alert v-if="region" :title="`本区域成员由负责人 ${nameOf(region.leaderId)} 管理${canManageRegion ? '' : '；当前账号不是该区域负责人'}`" :closable="false" /><MemberTable :members="associated" /></section>
      <section v-else class="panel org-section"><div class="panel-heading"><h2>操作记录</h2></div><el-table :data="logs" class="event-table" empty-text="暂无操作记录"><el-table-column prop="time" label="时间" min-width="170" /><el-table-column prop="operator" label="操作人" width="100" /><el-table-column prop="action" label="操作内容" min-width="300" /></el-table></section>
      <EntityEditor v-if="editing" :kind="kind" :entity="entity" @close="editing = false" @saved="editing = false" />
    </template>
    <el-empty v-else-if="!store.loading" description="记录不存在，或演示数据已在刷新后重置"><el-button @click="$router.push(`/organization/${kind}`)">返回列表</el-button></el-empty>
  </div>
  <el-dialog v-model="statusDialog" :title="member?.status === '已停用' ? '启用成员' : '停用成员'" width="500px" style="max-width:calc(100vw - 32px)">
    <el-alert :title="member?.status === '已停用' ? '启用后恢复后台访问资格，清除临时接管人。' : '停用后不得登录管理后台，原业务数据保持不变。真实登录拦截需后端接入。'" :closable="false" type="warning" />
    <el-form v-if="member?.status !== '已停用'" label-position="top" class="org-section"><el-form-item label="临时接管人（可选）"><el-select v-model="takeover" clearable placeholder="选择同企业的正常成员"><el-option v-for="m in takeoverOptions" :key="m.id" :label="m.name" :value="m.id" /></el-select></el-form-item></el-form>
    <template #footer><el-button @click="statusDialog = false">取消</el-button><el-button type="primary" :loading="busy" @click="changeStatus">确认{{ member?.status === '已停用' ? '启用' : '停用' }}</el-button></template>
  </el-dialog>
  <el-dialog v-model="managing" title="管理区域成员" width="540px" style="max-width:calc(100vw - 32px)"><el-alert title="选择本区域成员；跨区域调入需先由原负责人移出。取消勾选将移出本区域。" :closable="false" /><el-checkbox-group v-model="regionMemberIds" class="org-member-picker"><el-checkbox v-for="m in regionCandidates" :key="m.id" :label="`${m.name}（${m.status}）`" :value="m.id" /></el-checkbox-group><template #footer><el-button @click="managing = false">取消</el-button><el-button type="primary" :loading="busy" @click="saveRegionMembers">保存成员</el-button></template></el-dialog>
</template>
