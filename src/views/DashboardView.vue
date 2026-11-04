<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, User, Tickets, TrendCharts, Plus, ArrowRight } from '@element-plus/icons-vue'
import { useEventsStore } from '../stores/events'
import StatusTag from '../components/StatusTag.vue'
import CreateEventDialog from '../components/CreateEventDialog.vue'
const store = useEventsStore()
const router = useRouter()
const creating = ref(false)
const cards = computed(() => [
  { label: '全部活动', value: store.events.length, unit: '场', icon: Calendar, note: '连接每一次精彩相聚', color: 'purple' },
  { label: '累计报名', value: store.totalRegistered.toLocaleString(), unit: '人', icon: User, note: '来自所有活动的报名人数', color: 'blue' },
  { label: '报名中活动', value: store.activeEvents.length, unit: '场', icon: Tickets, note: '正在迎接新的参与者', color: 'green' },
  { label: '已完成活动', value: store.events.filter(item => item.status === '已结束').length, unit: '场', icon: TrendCharts, note: '每一次相聚，都有收获', color: 'orange' },
])
const upcoming = computed(() => store.events.filter(item => item.status !== '已结束').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4))
</script>
<template>
  <div class="page-heading"><div><div class="eyebrow">WORKSPACE OVERVIEW</div><h1>工作台</h1><p>欢迎回来，让下一场精彩活动从这里开始。</p></div><el-button type="primary" :icon="Plus" @click="creating = true">创建活动</el-button></div>
  <section class="welcome-banner"><div><span class="banner-label">连接人与人，让价值发生</span><h2>每一次相聚，都有无限可能。</h2><p>从活动筹备到报名管理，LinkMeet 陪你从容掌握每个环节。</p><router-link to="/events">管理我的活动 <el-icon><ArrowRight /></el-icon></router-link></div><div class="banner-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span>荟</span></div></section>
  <section class="stats-grid"><article v-for="card in cards" :key="card.label" class="stat-card"><div class="stat-top"><span>{{ card.label }}</span><span :class="['stat-icon', card.color]"><el-icon><component :is="card.icon" /></el-icon></span></div><div class="stat-number">{{ card.value }}<small>{{ card.unit }}</small></div><div class="stat-note">{{ card.note }}</div></article></section>
  <section class="panel"><div class="panel-heading"><div><h2>即将开展的活动</h2><p>关注筹备进度，让每一场活动有序发生</p></div><el-button text type="primary" @click="router.push('/events')">查看全部 <el-icon><ArrowRight /></el-icon></el-button></div>
    <el-table :data="upcoming" class="event-table"><el-table-column label="活动名称" min-width="250"><template #default="{ row }"><router-link class="event-name" :to="`/events/${row.id}`">{{ row.name }}</router-link><div class="table-secondary">{{ row.category }}</div></template></el-table-column><el-table-column prop="date" label="活动时间" min-width="160"/><el-table-column prop="location" label="活动地点" min-width="190"/><el-table-column label="状态" width="110"><template #default="{ row }"><StatusTag :status="row.status" /></template></el-table-column><el-table-column label="操作" width="90"><template #default="{ row }"><el-button link type="primary" @click="router.push(`/events/${row.id}`)">查看详情</el-button></template></el-table-column></el-table>
  </section>
  <CreateEventDialog v-model="creating" @created="id => router.push(`/events/${id}`)" />
</template>
