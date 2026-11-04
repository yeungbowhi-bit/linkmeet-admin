<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useOrganizationStore } from '../../stores/organization'
import { currentAccountId } from '../../mock/organization'
import EntityEditor from '../../components/organization/EntityEditor.vue'
import type { Entity, EntityKind } from '../../types/organization'
const props = defineProps<{ kind: EntityKind }>()
const store = useOrganizationStore()
const keyword = ref(''), filter = ref(''), status = ref(''), role = ref(''), page = ref(1)
const editing = ref(false), selected = ref<Entity>()
const labels = { enterprises: '企业管理', regions: '区域管理', members: '成员管理', roles: '角色权限' }
const hints = { enterprises: '维护企业信息与管理员，有序搭建组织空间。', regions: '明确区域责任，让团队协作各有归属。', members: '统一管理成员邀请、组织归属与多角色配置。', roles: '按职责配置功能权限与数据范围。' }
const filtered = computed(() => (store.data[props.kind] as Entity[]).filter(x => {
  const text = 'phone' in x ? `${x.name} ${x.phone}` : x.name
  return text.includes(keyword.value.trim()) && (!filter.value || ('enterpriseId' in x && x.enterpriseId === filter.value)) && (!status.value || ('status' in x && x.status === status.value)) && (!role.value || ('roleIds' in x && x.roleIds.includes(role.value)))
}))
const rows = computed(() => filtered.value.slice((page.value - 1) * 8, page.value * 8))
const atLimit = computed(() => props.kind === 'enterprises' && store.data.enterprises.filter(e => e.creatorId === currentAccountId).length >= 2)
watch([keyword, filter, status, role, () => props.kind], () => { page.value = 1 })
watch(() => props.kind, () => { keyword.value = ''; filter.value = ''; status.value = ''; role.value = ''; editing.value = false })
onMounted(() => store.load().catch(e => ElMessage.error(e.message)))
function edit(entity?: Entity) { selected.value = entity; editing.value = true }
</script>
<template>
  <div class="page-heading"><div><div class="eyebrow">组织管理</div><h1>{{ labels[kind] }}</h1><p>{{ hints[kind] }}</p></div><el-button type="primary" :icon="Plus" :disabled="atLimit || store.loading" @click="edit()">{{ kind === 'members' ? '邀请成员' : kind === 'roles' ? '新增角色' : kind === 'regions' ? '新增区域' : '新增企业' }}</el-button></div>
  <el-alert v-if="kind === 'enterprises'" :title="`当前账号已新增 ${store.data.enterprises.filter(e => e.creatorId === currentAccountId).length}/2 个企业${atLimit ? '，已达上限' : ''}`" :closable="false" class="org-notice" />
  <section v-loading="store.loading" class="panel">
    <div class="panel-heading"><h2>{{ labels[kind] }}<span class="count-badge">{{ store.data[kind].length }}</span></h2></div>
    <div class="filters"><el-input v-model="keyword" :prefix-icon="Search" :placeholder="kind === 'members' ? '搜索成员姓名或手机号' : '搜索名称'" clearable aria-label="搜索名称" /><el-select v-if="kind === 'members' || kind === 'regions'" v-model="filter" clearable placeholder="全部企业" aria-label="按企业筛选"><el-option v-for="e in store.data.enterprises" :key="e.id" :label="e.name" :value="e.id" /></el-select><el-select v-if="kind === 'members'" v-model="status" clearable placeholder="全部状态" aria-label="按状态筛选"><el-option v-for="s in ['正常', '待加入', '已停用']" :key="s" :label="s" :value="s" /></el-select><el-select v-if="kind === 'members'" v-model="role" clearable placeholder="全部角色" aria-label="按角色筛选"><el-option v-for="r in store.data.roles" :key="r.id" :label="r.name" :value="r.id" /></el-select><el-button @click="keyword = ''; filter = ''; status = ''; role = ''">重置</el-button></div>
    <el-table :data="rows" class="event-table" empty-text="暂无匹配数据，请调整筛选条件或新增">
      <el-table-column label="名称" min-width="220"><template #default="{ row }"><router-link :to="`/organization/${kind}/${row.id}`" class="event-name">{{ row.name }}</router-link><div class="table-secondary">{{ kind === 'members' ? row.phone : row.description || row.address }}</div></template></el-table-column>
      <el-table-column v-if="kind === 'regions' || kind === 'members'" label="所属企业" min-width="190"><template #default="{ row }">{{ store.data.enterprises.find(e => e.id === row.enterpriseId)?.name }}</template></el-table-column>
      <el-table-column v-if="kind === 'enterprises'" label="管理员" min-width="140"><template #default="{ row }">{{ row.adminIds.map((id: string) => store.data.members.find(m => m.id === id)?.name).join('、') }}</template></el-table-column>
      <el-table-column v-if="kind === 'regions'" label="区域负责人" min-width="120"><template #default="{ row }">{{ store.data.members.find(m => m.id === row.leaderId)?.name }}</template></el-table-column>
      <el-table-column v-if="kind === 'members'" label="区域 / 角色" min-width="180"><template #default="{ row }">{{ store.data.regions.find(r => r.id === row.regionId)?.name || '未分配区域' }}<div><el-tag v-for="id in row.roleIds" :key="id" class="org-tag">{{ store.data.roles.find(r => r.id === id)?.name }}</el-tag></div></template></el-table-column>
      <el-table-column v-if="kind === 'members'" label="状态 / 登录方式" min-width="130"><template #default="{ row }"><el-tag :type="row.status === '已停用' ? 'danger' : row.status === '待加入' ? 'warning' : 'success'">{{ row.status }}</el-tag><div class="table-secondary">{{ row.loginMethods.join(' / ') }}</div></template></el-table-column>
      <el-table-column v-if="kind === 'roles'" prop="scope" label="数据范围" min-width="120" />
      <el-table-column v-if="kind === 'roles'" label="关联成员" width="110"><template #default="{ row }">{{ store.data.members.filter(m => m.roleIds.includes(row.id)).length }} 人</template></el-table-column>
      <el-table-column label="操作" width="140" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="$router.push(`/organization/${kind}/${row.id}`)">详情</el-button><el-button link type="primary" @click="edit(row)">编辑</el-button></template></el-table-column>
    </el-table>
    <div class="pagination"><span>共 {{ filtered.length }} 条</span><el-pagination v-model:current-page="page" :page-size="8" :total="filtered.length" layout="prev, pager, next" background /></div>
  </section>
  <EntityEditor v-if="editing" :kind="kind" :entity="selected" @close="editing = false" @saved="editing = false" />
</template>
