<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  DocsIcon,
  CheckIcon,
  UserGroupIcon,
  WarningIcon,
  DraftIcon
} from '@/icons'

const { user, isMahasiswa, isDosen, isAdmin, isWD3 } = useAuth()

// State Data
const stats = ref<any[]>([])
const recentActivities = ref<any[]>([]) // Untuk Mahasiswa (History)
const todaySchedule = ref<any[]>([])    // Untuk Dosen (Jadwal Hari Ini)
const adminSummary = ref<any>(null)     // Untuk Admin

// Helper Format Tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const getStatusColor = (status: string) => {
    switch(status) {
        case 'pending': return 'text-yellow-600'
        case 'disetujui': return 'text-green-600'
        case 'ditolak': return 'text-red-600'
        case 'selesai': return 'text-blue-600'
        default: return 'text-slate-500'
    }
}

// FETCH DASHBOARD DATA
const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    let endpoint = ''
    if (isMahasiswa.value) endpoint = 'http://localhost:8000/api/mahasiswa/dashboard'
    else if (isAdmin.value) endpoint = 'http://localhost:8000/api/admin/dashboard'
    else endpoint = 'http://localhost:8000/api/staff/dashboard' // Dosen, WD3, Konselor

    const response = await axios.get(endpoint, config)
    const data = response.data

    // --- MAPPING DATA SESUAI ROLE ---

    if (isMahasiswa.value) {
        const s = data.stats
        stats.value = [
            { title: 'Total Ajuan', value: s.total, color: 'text-blue-600', icon: DocsIcon },
            { title: 'Menunggu Respon', value: s.pending, color: 'text-yellow-600', icon: DraftIcon },
            { title: 'Jadwal Disetujui', value: s.approved, color: 'text-green-600', icon: CheckIcon },
            { title: 'Selesai', value: s.completed, color: 'text-slate-500', icon: CheckIcon },
        ]
        recentActivities.value = data.recent_activities
    }
    else if (isDosen.value || isWD3.value) {
        const s = data.stats
        stats.value = [
            { title: 'Ajuan Masuk', value: s.total_masuk, color: 'text-blue-600', icon: DocsIcon },
            { title: 'Perlu Tindakan', value: s.perlu_tindakan, color: 'text-yellow-600', icon: WarningIcon },
            { title: 'Jadwal Hari Ini', value: s.jadwal_hari_ini, color: 'text-green-600', icon: DraftIcon },
            { title: 'Total Mahasiswa', value: s.total_mhs, color: 'text-slate-500', icon: UserGroupIcon },
        ]
        todaySchedule.value = data.today_schedule
    }
    else if (isAdmin.value) {
        const s = data.summary
        stats.value = [
            { title: 'Total Mahasiswa', value: s.total_mahasiswa, color: 'text-blue-600', icon: UserGroupIcon },
            { title: 'Total Staff/Dosen', value: s.total_staff, color: 'text-green-600', icon: UserGroupIcon },
            { title: 'Total Ajuan Masuk', value: s.total_ajuan, color: 'text-yellow-600', icon: DocsIcon },
            // Placeholder: Admin bisa tambah statistik lain
            { title: 'Laporan Bulanan', value: 'Lihat', color: 'text-slate-500', icon: DraftIcon },
        ]
        // Admin biasanya punya chart, disini kita simpan data raw-nya dulu
        adminSummary.value = data
    }

  } catch (error) {
    console.error("Gagal load dashboard:", error)
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Dashboard {{ user.role.toUpperCase() }}
        </h2>
        <p class="text-sm font-medium">
          Selamat Datang, <span class="text-blue-600 font-bold">{{ user.name }}</span>
        </p>
      </div>

      <div v-if="isMahasiswa">
        <router-link
          to="/app/ajuan/tambah"
          class="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-3 px-6 text-center font-medium text-white hover:bg-blue-600/90 lg:px-8 xl:px-10"
        >
          <span>+</span> Buat Ajuan Baru
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <div
        v-for="(item, index) in stats"
        :key="index"
        class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <component :is="item.icon" :class="`fill-current w-6 h-6 ${item.color}`" />
        </div>

        <div class="mt-4 flex items-end justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">
              {{ item.value }}
            </h4>
            <span class="text-sm font-medium text-slate-500">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">

      <div v-if="isMahasiswa" class="col-span-12 xl:col-span-8">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 class="mb-6 text-xl font-bold text-black dark:text-white">Aktivitas Terakhir</h4>
          <div class="flex flex-col">

            <div v-if="recentActivities.length === 0" class="text-center py-4 text-slate-500">
                Belum ada aktivitas.
            </div>

            <div v-else v-for="act in recentActivities" :key="act.id_ajuan" class="grid grid-cols-3 sm:grid-cols-5 py-3 border-b border-stroke dark:border-strokedark">
              <div class="col-span-3">
                  <p class="text-black dark:text-white font-medium truncate">{{ act.judul_konseling }}</p>
                  <p class="text-xs text-slate-500">{{ act.jenis_layanan }}</p>
              </div>
              <div class="col-span-1">
                  <p class="text-sm capitalize font-medium" :class="getStatusColor(act.status)">{{ act.status }}</p>
              </div>
              <div class="col-span-1 text-right">
                  <p class="text-sm text-slate-500">{{ formatDate(act.tanggal_pengajuan) }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-if="isDosen || isWD3" class="col-span-12 xl:col-span-8">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 class="mb-6 text-xl font-bold text-black dark:text-white">Jadwal Konseling Hari Ini</h4>

          <div v-if="todaySchedule.length === 0" class="bg-gray-50 dark:bg-meta-4 p-4 rounded text-center text-slate-500">
            Tidak ada jadwal konseling hari ini.
          </div>

          <div v-else class="flex flex-col gap-3">
             <div v-for="sch in todaySchedule" :key="sch.id_ajuan" class="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                 <div>
                     <p class="font-bold text-black">{{ sch.mahasiswa?.nama_lengkap }}</p>
                     <p class="text-sm text-slate-500">{{ sch.judul_konseling }}</p>
                 </div>
                 <div class="text-right">
                     <p class="font-bold text-blue-600">{{ sch.tanggal_jadwal.split(' ')[1].substring(0,5) }}</p>
                     <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Confirmed</span>
                 </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
