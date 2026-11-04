<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { eventCategories } from '../data/events'
import { useEventsStore } from '../stores/events'
import type { NewEvent } from '../types/event'
const visible = defineModel<boolean>({ required: true })
const emit = defineEmits<{ created: [id: string] }>()
const store = useEventsStore()
const formRef = ref<FormInstance>()
const defaults = (): NewEvent => ({ name: '', category: '行业峰会', date: '', location: '', capacity: 100, description: '' })
const form = reactive(defaults())
const rules: FormRules = {
  name: [{ required: true, whitespace: true, message: '请输入活动名称', trigger: 'blur' }],
  date: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  location: [{ required: true, whitespace: true, message: '请输入活动地点', trigger: 'blur' }],
  capacity: [{ required: true, type: 'number', min: 1, message: '人数至少为 1', trigger: 'change' }],
}
watch(visible, value => { if (value) { Object.assign(form, defaults()); formRef.value?.clearValidate() } })
async function submit() {
  if (!await formRef.value?.validate().catch(() => false)) return
  const event = store.createEvent({ ...form, name: form.name.trim(), location: form.location.trim() })
  visible.value = false
  ElMessage.success('活动创建成功，已保存为筹备中')
  emit('created', event.id)
}
</script>
<template>
  <el-dialog v-model="visible" title="创建新活动" width="560px" style="max-width: calc(100vw - 32px)" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="活动名称" prop="name"><el-input v-model="form.name" maxlength="80" show-word-limit placeholder="为这次相聚起个名字" /></el-form-item>
      <el-form-item label="活动类型" prop="category"><el-select v-model="form.category"><el-option v-for="category in eventCategories" :key="category" :value="category" :label="category" /></el-select></el-form-item>
      <el-form-item label="活动时间" prop="date"><el-date-picker v-model="form.date" type="datetime" value-format="YYYY-MM-DD HH:mm" placeholder="选择日期与时间" style="width: 100%" /></el-form-item>
      <el-form-item label="活动地点" prop="location"><el-input v-model="form.location" maxlength="120" placeholder="例如：上海 · 国际会议中心" /></el-form-item>
      <el-form-item label="人数上限" prop="capacity"><el-input-number v-model="form.capacity" :min="1" :max="100000" /></el-form-item>
      <el-form-item label="活动介绍"><el-input v-model="form.description" type="textarea" :rows="3" maxlength="1000" show-word-limit placeholder="介绍活动主题与亮点（选填）" /></el-form-item>
    </el-form>
    <template #footer><el-button @click="visible = false">取消</el-button><el-button type="primary" @click="submit">创建活动</el-button></template>
  </el-dialog>
</template>
