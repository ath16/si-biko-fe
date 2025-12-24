<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'submit'])

const form = ref({
  tanggal: '',
  waktu: '',
  alasan: ''
})

const handleSubmit = () => {
  if (!form.value.tanggal || !form.value.waktu || !form.value.alasan) {
    return alert("Mohon lengkapi semua data reschedule.")
  }
  emit('submit', { ...form.value })
  // Reset form setelah submit
  form.value = { tanggal: '', waktu: '', alasan: '' }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl dark:bg-boxdark transform transition-all scale-100">
        <h3 class="mb-4 text-xl font-bold text-black dark:text-white">Ajukan Jadwal Pengganti</h3>
        <p class="mb-5 text-sm text-slate-500">
          Pilih waktu baru yang tersedia. Mahasiswa akan menerima notifikasi tawaran jadwal ini.
        </p>

        <div class="flex flex-col gap-4 mb-5">
          <div>
            <label class="mb-2 block font-medium text-black dark:text-white">Tanggal Baru</label>
            <input
              v-model="form.tanggal"
              type="date"
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-red-300 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
          <div>
            <label class="mb-2 block font-medium text-black dark:text-white">Jam Baru</label>
            <input
              v-model="form.waktu"
              type="time"
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-red-300 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
          <div>
            <label class="mb-2 block font-medium text-black dark:text-white">Catatan / Pesan</label>
            <input
              v-model="form.alasan"
              type="text"
              placeholder="Alasan reschedule..."
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-red-300 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
        </div>

        <div class="flex gap-4 justify-end">
          <button
            @click="$emit('close')"
            class="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Batal
          </button>
          <button
            @click="handleSubmit"
            class="rounded bg-red-600 py-2 px-6 font-medium text-white hover:bg-red-600/90"
          >
            Kirim Jadwal
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
