export interface Enterprise { id: string; name: string; address: string; contact: string; phone: string; adminIds: string[]; creatorId: string }
export interface Region { id: string; name: string; enterpriseId: string; leaderId: string; description: string }
export type MemberStatus = '正常' | '待加入' | '已停用'
export interface Member { id: string; name: string; phone: string; enterpriseId: string; regionId: string; roleIds: string[]; loginMethods: string[]; status: MemberStatus; takeoverId: string }
export interface Role { id: string; name: string; description: string; permissions: string[]; scope: string }
export interface OperationLog { id: string; memberId: string; action: string; time: string; operator: string }
export interface OrganizationData { enterprises: Enterprise[]; regions: Region[]; members: Member[]; roles: Role[]; logs: OperationLog[] }
export type EntityKind = 'enterprises' | 'regions' | 'members' | 'roles'
export type Entity = Enterprise | Region | Member | Role
export interface OrganizationApi { load(): Promise<OrganizationData>; save(kind: EntityKind, input: Entity): Promise<OrganizationData>; updateRegionMembers(id: string, memberIds: string[]): Promise<OrganizationData>; setMemberStatus(id: string, disabled: boolean, takeoverId?: string): Promise<OrganizationData> }
