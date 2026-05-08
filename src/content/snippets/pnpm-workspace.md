---
title: "pnpm 工作区配置"
description: "使用 pnpm 工作区管理 monorepo 项目，可以方便地管理多个包和应用的依赖关系。"
filenames: "pnpm-workspace.yaml"
order: 2
---

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```
