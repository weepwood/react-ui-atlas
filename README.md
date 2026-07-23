# React UI Atlas

一个用于整理、检索和比较 React 组件库与设计系统的网站。

## 已包含的内容

- 17 个 React UI 方案：成品型组件库、Headless 原语、源码分发方案、企业设计系统实现、专业应用组件库
- 8 套设计体系：Material Design 3、Ant Design、Fluent 2、Carbon、Spectrum 2、Primer、Polaris、Atlassian Design System
- 搜索、分类筛选、样式约束筛选与排序
- 组件详情抽屉与最多 4 项横向对比
- 根据产品类型、控制权与 Tailwind 约束生成候选建议
- 暗色/亮色主题与响应式布局
- 兼容 Chrome 109 的 CSS 实现，不使用 TailwindCSS

## 启动

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 数据维护

主要资料位于 `src/data.js`：

- `libraries`：组件库与选型维度
- `designSystems`：设计系统资料
- `selectionQuestions`：选型工作台问题
- `principles`：设计治理方法

横向评分属于本站编辑性判断，用来发现方案差异，不是官方评分。更新资料时应优先核对官方文档、官方仓库、迁移指南与许可证。

## 主要官方资料

- Material UI: https://mui.com/material-ui/
- Ant Design: https://ant.design/docs/react/introduce/
- Chakra UI: https://www.chakra-ui.com/docs/get-started/installation
- Mantine: https://mantine.dev/
- Radix Primitives: https://www.radix-ui.com/primitives
- React Aria: https://react-aria.adobe.com/
- Base UI: https://base-ui.com/
- Ark UI: https://ark-ui.com/
- Headless UI: https://headlessui.com/
- shadcn/ui: https://ui.shadcn.com/docs
- Fluent 2: https://fluent2.microsoft.design/
- Carbon: https://carbondesignsystem.com/
- React Spectrum: https://react-spectrum.adobe.com/
- Primer: https://primer.style/

## 部署

项目已包含 `netlify.toml`，可直接导入 Netlify。其他静态托管平台只需将构建命令设置为 `npm run build`，发布目录设置为 `dist`。
