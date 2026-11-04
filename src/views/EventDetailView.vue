<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Calendar, Location, User } from '@element-plus/icons-vue'
import { useEventsStore } from '../stores/events'
import StatusTag from '../components/StatusTag.vue'
const route = useRoute()
const router = useRouter()
const store = useEventsStore()
const event = computed(() => store.events.find(item => item.id === route.params.id))
function publish() { if (event.value) { store.publishEvent(event.value.id); ElMessage.success('活动已发布，开放报名（Mock）') } }
</script>
<template>
  <el-button text :icon="ArrowLeft" class="back-button" @click="router.push('/events')">返回活动列表</el-button>
  <template v-if="event"><div class="page-heading"><div><div class="eyebrow">EVENT DETAILS</div><h1>{{ event.name }}</h1><p>{{ event.category }} <span class="detail-divider">/</span> 活动详情</p></div><el-button v-if="event.status === '筹备中'" type="primary" @click="publish">发布活动</el-button><StatusTag v-else :status="event.status"/></div>
    <div class="detail-grid"><section class="panel detail-panel"><div class="panel-heading"><h2>活动概览</h2><StatusTag :status="event.status"/></div><div class="detail-facts"><div><el-icon><Calendar /></el-icon><span>活动时间<strong>{{ event.date }}</strong></span></div><div><el-icon><Location /></el-icon><span>活动地点<strong>{{ event.location }}</strong></span></div><div><el-icon><User /></el-icon><span>人数上限<strong>{{ event.capacity }} 人</strong></span></div></div><div class="description"><h3>活动介绍</h3><p>{{ event.description || '暂无活动介绍' }}</p></div></section>
    <section class="panel registration-panel"><h2>报名概况</h2><div class="registration-number">{{ event.registered }}<small> / {{ event.capacity }} 人</small></div><el-progress :percentage="Math.round(event.registered / event.capacity * 100)" color="#8958e8"/><p>剩余名额 <strong>{{ event.capacity - event.registered }}</strong> 人</p><el-alert title="当前为 Mock 演示，暂未接入真实报名服务。" type="info" :closable="false"/></section></div>
  </template>
  <el-empty v-else description="活动不存在，或演示数据已在刷新后重置"><el-button type="primary" @click="router.push('/events')">返回活动列表</el-button></el-empty>
</template>
