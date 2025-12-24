<script setup lang="ts">
import { RouterView } from 'vue-router' // <--- INI KUNCINYA
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-boxdark-2 text-bodydark">

    <AppSidebar />

    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

      <AppHeader />

      <main>
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">

          <RouterView />

        </div>
      </main>

    </div>
  </div>
</template>
