<template>
  <div class="relative" ref="dropdownRef">
    <button class="flex items-center text-gray-700 dark:text-gray-400" @click.prevent="toggleDropdown">
      <span class="mr-3 h-11 w-11 overflow-hidden rounded-full" v-if="session.data?.user?.image">
            <img :src="baseUrl+session.data.user.image" alt="User">
          </span>
      <span v-else class="mr-3 overflow-hidden rounded-full h-12 w-12">
        <UserCircleIcon class="h-full w-full text-gray-500  "/>
      </span>

      <span class="block mr-1 font-medium text-theme-sm" v-if="session.data?.user">{{ session.data.user.name }} </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }"/>
    </button>

    <!-- Dropdown Start -->
    <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ session.data.user.name }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ session.data.user.email }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
              :to="item.href"
              class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
                :is="item.icon"
                class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <a @click.prevent="signOut"
         class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        <LogoutIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"/>
        Sign out
      </a>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import {UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon} from '@/assets/admin-icons'
import {RouterLink, useRouter, useRoute} from 'vue-router'
import {ref, onMounted, onUnmounted, watch, computed} from 'vue'
import {useAuthStore} from '@/stores/auth';
import {authClient} from "@/lib/auth-client.ts";

const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const session = authClient.useSession();
const route = useRoute();
const router = useRouter();
const baseUrl = computed(() => import.meta.env.VITE_API_URL);

const menuItems = [
  {href: '/admin/profile', icon: UserCircleIcon, text: 'Edit profile'},
]


const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = async () => {
  await authClient.signOut();
  closeDropdown();
  await router.push('/');
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.path, () => {
  dropdownOpen.value = false
})
</script>
