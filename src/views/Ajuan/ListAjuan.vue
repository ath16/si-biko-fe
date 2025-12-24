<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'

// Import Komponen Bisnis yang baru dibuat
import TabelAjuanMhs from '@/components/business/ajuan/TabelAjuanMhs.vue'
import TabelAjuanDosen from '@/components/business/ajuan/TabelAjuanDosen.vue'
import TabelAjuanAdmin from '@/components/business/ajuan/TabelAjuanAdmin.vue'

const { isMahasiswa, isDosen, isWD3, isAdmin } = useAuth()
</script>

<template>
  <div>
    <Breadcrumb :pageTitle="isMahasiswa ? 'Riwayat Konseling' : 'Daftar Ajuan Masuk'" />

    <div class="flex flex-col gap-10">

      <TabelAjuanMhs v-if="isMahasiswa" />

      <TabelAjuanDosen v-else-if="isDosen || isWD3" />

      <TabelAjuanAdmin v-else-if="isAdmin" />

    </div>
  </div>
</template>
