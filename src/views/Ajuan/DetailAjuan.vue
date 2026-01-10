<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'

import DetailMhs from '@/components/business/ajuan/detail/DetailMhs.vue'
import DetailDosen from '@/components/business/ajuan/detail/DetailDosen.vue'
import DetailWD3 from '@/components/business/ajuan/detail/DetailWD3.vue'

const { isMahasiswa, isDosen, isWD3, isAdmin } = useAuth()
</script>

<template>
  <div>
    <Breadcrumb pageTitle="Detail Konseling" />

    <DetailMhs v-if="isMahasiswa" />
    <DetailDosen v-else-if="isDosen" />
    <DetailWD3 v-else-if="isWD3" />

    <div v-else-if="isAdmin">
        <div class="bg-blue-50 p-4 mb-4 text-blue-800 rounded border border-blue-200">
            <strong>Mode Admin:</strong> Anda melihat detail ini dalam mode baca-saja.
        </div>
        <DetailMhs />
    </div>

  </div>
</template>
