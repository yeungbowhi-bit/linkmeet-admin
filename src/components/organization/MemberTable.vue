<script setup lang="ts">
import type { Member } from '../../types/organization'
import { useOrganizationStore } from '../../stores/organization'
defineProps<{ members: Member[] }>()
const store = useOrganizationStore()
</script>
<template>
  <el-table :data="members" class="event-table" empty-text="暂无成员">
    <el-table-column label="成员" min-width="150"><template #default="{ row }"><router-link class="event-name" :to="`/organization/members/${row.id}`">{{ row.name }}</router-link><div class="table-secondary">{{ row.phone }}</div></template></el-table-column>
    <el-table-column label="角色" min-width="170"><template #default="{ row }"><el-tag v-for="id in row.roleIds" :key="id" class="org-tag">{{ store.data.roles.find(r => r.id === id)?.name }}</el-tag></template></el-table-column>
    <el-table-column prop="status" label="状态" width="100" />
    <el-table-column label="操作" width="90"><template #default="{ row }"><el-button link type="primary" @click="$router.push(`/organization/members/${row.id}`)">详情</el-button></template></el-table-column>
  </el-table>
</template>
