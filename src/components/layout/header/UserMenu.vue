<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon, LogoutIcon } from '@/icons'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

const { user, logout } = useAuth()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value
const closeDropdown = () => dropdownOpen.value = false

const signOut = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
        await axios.post('http://localhost:8000/api/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
    }
  } catch (error) {
    console.error("Gagal logout:", error)
  } finally {
    logout()
    closeDropdown()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <button class="flex items-center text-gray-700 dark:text-gray-400" @click.prevent="toggleDropdown">
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11 border border-gray-200 dark:border-gray-800">
        <img :src="user.photo" alt="User" class="h-full w-full object-cover" />
      </span>
      <span class="block mr-1 font-medium text-theme-sm">{{ user.name || 'User' }}</span>
      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="transition-transform" />
    </button>

    <div v-if="dropdownOpen" class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
      <div class="px-3 py-2">
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">{{ user.name }}</span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</span>
        <span class="mt-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400 capitalize">{{ user.role }}</span>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-800 my-2"></div>
      <button @click="signOut" class="flex w-full items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        <LogoutIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
        Sign out
      </button>
    </div>
  </div>
</template>
