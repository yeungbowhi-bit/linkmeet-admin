import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { initialEvents } from '../data/events'
import type { NewEvent, MeetingEvent } from '../types/event'

export const useEventsStore = defineStore('events', () => {
  // Mock 数据仅驻留内存，刷新页面后恢复初始状态。
  const events = ref<MeetingEvent[]>(structuredClone(initialEvents))
  const totalRegistered = computed(() => events.value.reduce((sum, event) => sum + event.registered, 0))
  const activeEvents = computed(() => events.value.filter(event => event.status === '报名中'))
  function createEvent(input: NewEvent) {
    const event: MeetingEvent = { ...input, id: `LM-${crypto.randomUUID()}`, registered: 0, status: '筹备中' }
    events.value.unshift(event)
    return event
  }
  function publishEvent(id: string) {
    const event = events.value.find(item => item.id === id)
    if (event?.status === '筹备中') event.status = '报名中'
  }
  return { events, totalRegistered, activeEvents, createEvent, publishEvent }
})
