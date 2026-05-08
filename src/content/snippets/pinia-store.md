---
title: "pinia 常用仓库配置"
description: "Pinia 是 Vue 的官方状态管理库，提供了类型安全、模块化、可测试的状态管理方案。"
filenames: "app.store.ts app.vue"
order: 3
---

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('appStore', () => {
  const user = ref(null)

  return {
    user,
  }
})
```

## 使用

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app.store'

const appStore = useAppStore()
const { user } = storeToRefs(appStore)
</script>
```
