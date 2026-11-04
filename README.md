# LinkMeet 链荟会务管理工作台

基于 Vue 3 的 B 端会务管理平台。

## 技术栈

Vue 3、TypeScript、Vite、Element Plus、Pinia、Vue Router。

## 本地开发

使用 Node.js 22.12+（推荐 Node.js 24）：

```bash
npm ci
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

构建包含 TypeScript 类型检查，输出至 `dist/`。部署时需配置 SPA fallback，将非静态资源请求回退至 `index.html`。

## V1.0 第一阶段

- 紫色管理后台布局，包含侧栏、顶部导航和内容区，适配小屏幕。
- 工作台动态统计和即将开展的活动。
- 活动列表支持名称搜索、状态筛选和分页。
- 创建活动支持必填校验；活动详情支持将筹备中的活动发布为报名中。
- 未找到的活动显示空状态。

## 代码组织与数据

- `src/components`：共享组件与创建活动表单。
- `src/views`：工作台、活动列表与活动详情。
- `src/data`：独立 Mock 数据及活动类型选项。
- `src/stores`：Pinia 状态与创建、发布操作。
- `src/types`：业务类型。

当前无后端、认证或真实报名服务，不需要环境密钥。Mock 状态仅保存在内存中，刷新页面后恢复；新创建活动的详情链接在刷新后失效。

`node_modules/`、`dist/`、`.env*`、证书与私钥、日志及临时文件已加入 `.gitignore`，请勿提交真实业务凭据。

## V1.0 组织管理

保留工作台与活动模块，新增 `/organization` 菜单：

- 企业管理：列表、搜索、详情、基本信息、管理员配置；当前账号最多新增两个企业，新企业默认由当前账号管理。
- 区域管理：所属企业、负责人、说明、成员列表；仅对应区域负责人可维护区域成员。跨区域调入前需要原区域负责人先移出。
- 成员管理：姓名或手机号查询、企业/状态/角色筛选、分页、邀请、编辑、组织归属、多角色、登录方式展示、操作记录。
- 角色权限：列表、详情、角色说明、功能权限、数据范围、关联成员；通过成员编辑配置多角色关联。
- 停用成员：禁止后台访问的状态展示、可选同企业正常成员临时接管、恢复启用、操作日志；保持原业务数据和归属不变。当前账号不可停用自身；管理员、区域负责人或临时接管人需先移交职责。

数据与页面分层：`src/types/organization.ts` 定义模型及 `OrganizationApi` 契约，`src/mock/organization.ts` 提供演示数据，`src/services/organization.ts` 实现内存 Mock 服务与业务规则，`src/stores/organization.ts` 管理异步状态。页面位于 `src/views/organization`，通用编辑表单及成员表格位于 `src/components/organization`。

当前固定演示管理员为陈荟（`m1`）；可先将区域负责人改为陈荟，再体验区域成员维护。所有变更仅驻留内存，刷新恢复初始数据。邀请生成后为“待加入”，不发送短信或微信，也不伪造真实入驻。角色权限及停用标记仅用于前端配置与展示；没有实现登录入口、真实访问鉴权、数据库或业务转移。

### 后端接口预留

接入时替换 `organizationApi` 为 `OrganizationApi` 的 HTTP 实现，Pinia 和页面无需更改。建议接口：

| 方法 | 接口 | 用途 |
| --- | --- | --- |
| GET | `/api/organization` | 返回企业、区域、成员、角色与操作记录 |
| POST / PATCH | `/api/organization/{enterprises,regions,members,roles}[/:id]` | 新增/编辑；成员新增对应邀请 |
| PUT | `/api/organization/regions/:id/members` | 原子更新区域成员，校验对应负责人 |
| PATCH | `/api/organization/members/:id/status` | 停用/恢复与可选临时接管人 |

后端必须从认证会话获取操作账号，并执行账号企业数量上限、组织引用完整性、区域负责人权限、角色功能和数据范围鉴权；每次登录及后台请求均检查成员是否停用。日志应由后端生成并持久化。当前 Mock 的账号标识和权限展示不能用作安全边界。

### 验证

```bash
npm ci
npm run test:organization
npm run build
```

离线环境可使用已预热的 npm 缓存运行 `npm ci --offline --cache /workspace/.npm-cache --ignore-scripts`。规则测试覆盖企业数量上限、区域成员管理权、原子变更、跨区域限制、手机号重复、多角色、邀请状态、无效引用、停用/接管/恢复、日志及 Mock 数据隔离。
