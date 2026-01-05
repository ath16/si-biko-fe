<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden" src="/images/logo/sibiko.svg" alt="Logo" />
    <img class="hidden dark:block" src="/images/logo/sibiko-dark.svg" alt="Logo" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
