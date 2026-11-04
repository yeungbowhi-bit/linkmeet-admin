import { ref } from 'vue'
import { defineStore } from 'pinia'
import { organizationApi } from '../services/organization'
import type { Entity, EntityKind, OrganizationData } from '../types/organization'
export const useOrganizationStore = defineStore('organization', () => {
  const data = ref<OrganizationData>({ enterprises: [], regions: [], members: [], roles: [], logs: [] })
  const loading = ref(false)
  const loaded = ref(false)
  async function load() { if (loaded.value) return; loading.value = true; try { data.value = await organizationApi.load(); loaded.value = true } finally { loading.value = false } }
  async function save(kind: EntityKind, entity: Entity) { data.value = await organizationApi.save(kind, entity) }
  async function setStatus(id: string, disabled: boolean, takeoverId = '') { data.value = await organizationApi.setMemberStatus(id, disabled, takeoverId) }
  async function updateRegionMembers(id: string, memberIds: string[]) { data.value = await organizationApi.updateRegionMembers(id, memberIds) }
  return { data, loading, load, save, setStatus, updateRegionMembers }
})
