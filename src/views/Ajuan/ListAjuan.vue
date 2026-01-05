<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'

import TabelAjuanMhs from '@/components/business/ajuan/TabelAjuanMhs.vue'
import TabelAjuanDosen from '@/components/business/ajuan/TabelAjuanDosen.vue'
import TabelAjuanAdmin from '@/components/business/ajuan/TabelAjuanAdmin.vue'
import TabelAjuanWD3 from '@/components/business/ajuan/TabelAjuanWD3.vue' // Import baru

const { isMahasiswa, isDosen, isWD3, isAdmin } = useAuth()
</script>

<template>
  <div>
    <Breadcrumb :pageTitle="isMahasiswa ? 'Riwayat Konseling' : 'Daftar Ajuan Masuk'" />

    <div class="flex flex-col gap-10">
      <TabelAjuanMhs v-if="isMahasiswa" />

      <TabelAjuanDosen v-else-if="isDosen" />

      <TabelAjuanWD3 v-else-if="isWD3" /> <TabelAjuanAdmin v-else-if="isAdmin" />
    </div>
  </div>
</template>
