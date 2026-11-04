export type EventStatus = '筹备中' | '报名中' | '已结束'
export interface MeetingEvent {
  id: string
  name: string
  category: string
  date: string
  location: string
  capacity: number
  registered: number
  status: EventStatus
  description: string
}
export type NewEvent = Pick<MeetingEvent, 'name' | 'category' | 'date' | 'location' | 'capacity' | 'description'>
