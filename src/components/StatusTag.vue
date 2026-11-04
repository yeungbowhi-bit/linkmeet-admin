<script setup lang="ts">
import type { EventStatus } from '../types/event'
defineProps<{ status: EventStatus }>()
</script>
<template><el-tag :type="status === '报名中' ? 'success' : status === '已结束' ? 'info' : 'warning'" effect="light" round>{{ status }}</el-tag></template>
