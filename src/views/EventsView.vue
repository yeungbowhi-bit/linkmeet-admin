<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search } from '@element-plus/icons-vue'
import { useEventsStore } from '../stores/events'
import StatusTag from '../components/StatusTag.vue'
import CreateEventDialog from '../components/CreateEventDialog.vue'
const store = useEventsStore()
const router = useRouter()
const keyword = ref('')
const status = ref('全部状态')
const page = ref(1)
const creating = ref(false)
const filtered = computed(() => store.events.filter(event => event.name.includes(keyword.value.trim()) && (status.value === '全部状态' || event.status === status.value)))
const paginated = computed(() => filtered.value.slice((page.value - 1) * 6, page.value * 6))
watch([keyword, status], () => { page.value = 1 })
</script>
<template>
  <div class="page-heading"><div><div class="eyebrow">EVENT MANAGEMENT</div><h1>活动管理</h1><p>把创意变成相聚，一站式管理你的所有活动。</p></div><el-button type="primary" :icon="Plus" @click="creating = true">创建活动</el-button></div>
  <section class="panel"><div class="panel-heading"><h2>全部活动 <span class="count-badge">{{ store.events.length }}</span></h2></div><div class="filters"><el-input v-model="keyword" :prefix-icon="Search" placeholder="搜索活动名称" clearable aria-label="搜索活动名称"/><el-select v-model="status" aria-label="按活动状态筛选"><el-option v-for="item in ['全部状态', '筹备中', '报名中', '已结束']" :key="item" :label="item" :value="item"/></el-select><el-button @click="keyword = ''; status = '全部状态'">重置</el-button></div>
    <el-table :data="paginated" class="event-table" empty-text="未找到匹配的活动，请调整搜索条件"><el-table-column label="活动名称" min-width="260"><template #default="{ row }"><router-link class="event-name" :to="`/events/${row.id}`">{{ row.name }}</router-link><div class="table-secondary">{{ row.category }}</div></template></el-table-column><el-table-column prop="date" label="活动时间" min-width="160"/><el-table-column prop="location" label="地点" min-width="190"/><el-table-column label="报名人数" width="140"><template #default="{ row }"><span>{{ row.registered }} <span class="muted">/ {{ row.capacity }}</span></span><el-progress :percentage="Math.round(row.registered / row.capacity * 100)" :show-text="false" :stroke-width="4" color="#8958e8"/></template></el-table-column><el-table-column label="状态" width="110"><template #default="{ row }"><StatusTag :status="row.status" /></template></el-table-column><el-table-column label="操作" width="90" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="router.push(`/events/${row.id}`)">详情</el-button></template></el-table-column></el-table>
    <div class="pagination"><span>共 {{ filtered.length }} 场活动</span><el-pagination v-model:current-page="page" :page-size="6" :total="filtered.length" layout="prev, pager, next" background /></div>
  </section>
  <CreateEventDialog v-model="creating" @created="id => router.push(`/events/${id}`)" />
</template>
