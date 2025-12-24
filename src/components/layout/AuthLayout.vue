<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-boxdark-2 py-10 px-4">
    <div class="w-full max-w-[1200px]">
      <RouterView />
    </div>
  </div>
</template>
