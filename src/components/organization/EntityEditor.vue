<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useOrganizationStore } from '../../stores/organization'
import { currentAccountId, permissionOptions, scopeOptions } from '../../mock/organization'
import type { Entity, EntityKind, Enterprise, Region, Member, Role } from '../../types/organization'
const props = defineProps<{ kind: EntityKind; entity?: Entity }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const store = useOrganizationStore()
const formRef = ref<FormInstance>()
const saving = ref(false)
type EditorForm = Enterprise & Region & Member & Role
const initial: Partial<EditorForm> = props.entity ? JSON.parse(JSON.stringify(props.entity)) : {}
const form = reactive<EditorForm>({ id: '', name: '', address: '', contact: '', phone: '', adminIds: [currentAccountId], creatorId: currentAccountId, enterpriseId: '', leaderId: '', description: '', regionId: '', roleIds: [] as string[], loginMethods: ['手机'], status: '待加入', takeoverId: '', permissions: [] as string[], scope: '仅本人', ...initial })
const title = computed(() => ({ enterprises: '企业', regions: '区域', members: '成员', roles: '角色' })[props.kind])
const normalMembers = computed(() => store.data.members.filter(m => m.status === '正常' && (m.enterpriseId === form.enterpriseId || m.enterpriseId === form.id || (props.kind === 'enterprises' && m.id === currentAccountId))))
const regions = computed(() => store.data.regions.filter(r => r.enterpriseId === form.enterpriseId))
const rules: FormRules = { name: [{ required: true, whitespace: true, message: '请输入名称', trigger: 'blur' }, { max: 60, message: '名称不超过 60 字', trigger: 'blur' }], phone: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }] }
for (const key of ['address', 'contact', 'enterpriseId', 'leaderId', 'adminIds', 'roleIds', 'loginMethods', 'scope']) rules[key] = [{ required: true, message: '请填写或选择此项', trigger: 'change' }]
async function submit() {
  if (!await formRef.value?.validate().catch(() => false)) return
  saving.value = true
  try { await store.save(props.kind, JSON.parse(JSON.stringify(form)) as Entity); ElMessage.success(props.kind === 'members' && !props.entity ? '邀请已生成（演示），未发送真实消息' : '保存成功'); emit('saved') } catch (e) { ElMessage.error((e as Error).message) } finally { saving.value = false }
}
</script>
<template>
  <el-dialog :model-value="true" :title="`${entity ? '编辑' : kind === 'members' ? '邀请' : '新增'}${title}`" width="600px" style="max-width:calc(100vw - 32px)" @close="emit('close')">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item :label="`${title}名称`" prop="name"><el-input v-model="form.name" maxlength="60" show-word-limit /></el-form-item>
      <template v-if="kind === 'enterprises'">
        <el-form-item label="企业地址" prop="address"><el-input v-model="form.address" maxlength="150" /></el-form-item>
        <el-form-item label="联系人" prop="contact"><el-input v-model="form.contact" maxlength="30" /></el-form-item>
        <el-form-item label="联系电话" prop="phone"><el-input v-model="form.phone" maxlength="11" /></el-form-item>
        <el-form-item label="企业管理员" prop="adminIds"><el-select v-model="form.adminIds" multiple><el-option v-for="m in normalMembers" :key="m.id" :label="m.name" :value="m.id" /></el-select></el-form-item>
        <el-alert title="每个账号最多新增两个企业；新企业默认由当前账号管理。" :closable="false" />
      </template>
      <template v-if="kind === 'regions' || kind === 'members'">
        <el-form-item label="所属企业" prop="enterpriseId"><el-select v-model="form.enterpriseId" @change="form.regionId = ''; form.leaderId = ''"><el-option v-for="e in store.data.enterprises" :key="e.id" :label="e.name" :value="e.id" /></el-select></el-form-item>
      </template>
      <template v-if="kind === 'regions'">
        <el-form-item label="区域负责人" prop="leaderId"><el-select v-model="form.leaderId" placeholder="选择本企业正常成员"><el-option v-for="m in normalMembers" :key="m.id" :label="m.name" :value="m.id" /></el-select></el-form-item>
        <el-form-item label="区域说明"><el-input v-model="form.description" type="textarea" maxlength="300" /></el-form-item>
        <el-alert title="区域成员由对应区域负责人管理；区域负责人可在本区域详情维护成员。" :closable="false" />
      </template>
      <template v-if="kind === 'members'">
        <el-form-item label="手机号码" prop="phone"><el-input v-model="form.phone" maxlength="11" /></el-form-item>
        <el-form-item label="所属区域"><el-select v-model="form.regionId" clearable placeholder="不分配区域"><el-option v-for="r in regions" :key="r.id" :label="r.name" :value="r.id" /></el-select></el-form-item>
        <el-form-item label="角色（可多选）" prop="roleIds"><el-select v-model="form.roleIds" multiple><el-option v-for="r in store.data.roles" :key="r.id" :label="r.name" :value="r.id" /></el-select></el-form-item>
        <el-form-item label="允许的登录方式" prop="loginMethods"><el-checkbox-group v-model="form.loginMethods"><el-checkbox label="手机" value="手机" /><el-checkbox label="微信" value="微信" /></el-checkbox-group></el-form-item>
        <el-alert title="邀请后显示待加入。本阶段仅演示邀请和登录方式，不发送真实邀请、不接入认证。" :closable="false" />
      </template>
      <template v-if="kind === 'roles'">
        <el-form-item label="角色说明"><el-input v-model="form.description" type="textarea" maxlength="300" /></el-form-item>
        <el-form-item label="功能权限"><el-checkbox-group v-model="form.permissions" class="permission-grid"><el-checkbox v-for="p in permissionOptions" :key="p" :label="p" :value="p" /></el-checkbox-group></el-form-item>
        <el-form-item label="数据范围" prop="scope"><el-select v-model="form.scope"><el-option v-for="s in scopeOptions" :key="s" :label="s" :value="s" /></el-select></el-form-item>
        <el-alert title="多角色权限由管理员配置；此处保存配置，真实访问鉴权需后端接入。" :closable="false" />
      </template>
    </el-form>
    <template #footer><el-button @click="emit('close')">取消</el-button><el-button type="primary" :loading="saving" @click="submit">{{ kind === 'members' && !entity ? '生成邀请' : '保存' }}</el-button></template>
  </el-dialog>
</template>
