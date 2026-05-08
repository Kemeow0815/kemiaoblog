---
title: "该项目部署使用的 GitHub Actions"
description: "这里的 `secrets` 是在 GitHub 仓库的设置中配置的环境变量，确保你已经在仓库的 Secrets 中添加了 `WXW_HOST`、`WXW_USERNAME`、`WXW_PASSWORD` 和 `WXW_TARGET`。这样配置后，每次你向 `main` 分支推送代码时，GitHub Actions 会自动触发部署流程，构建你的 Nuxt 应用并将其部署到指定的服务器上。你可以根据自己的需求调整 `node-version` 和其他配置项。"
filenames: ".github/workflows/deploy.yml"
order: 1
---

```yaml
name: deploy nuxt app
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          version: 10.24.0
          run_install: false

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build Nuxt app
        run: pnpm run build

      - name: Deploy to server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.WXW_HOST }}
          username: ${{ secrets.WXW_USERNAME }}
          password: ${{ secrets.WXW_PASSWORD }}
          source: ".output/public/*"
          target: ${{ secrets.WXW_TARGET }}
          strip_components: 2
```
