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
