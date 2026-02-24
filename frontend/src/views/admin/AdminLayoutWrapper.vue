<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar/>
    <Backdrop/>
    <div class="flex-1 transition-all duration-300 ease-in-out"
         :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']">
      <app-header/>
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import {useSidebar} from '@/composables/useSidebar.ts'
import AppSidebar from '@/components/admin/layout/AppSidebar.vue'
import AppHeader from '@/components/admin/layout/AppHeader.vue'
import Backdrop from '@/components/admin/layout/Backdrop.vue'

const {isExpanded, isHovered} = useSidebar();
let styleElement: HTMLStyleElement | null = null

//add remove admin styles on mount/unmount
onMounted(async () => {
  const styles = await import('@/assets/styles/admin.css?inline')
  styleElement = document.createElement('style')
  styleElement.id = 'admin-styles'
  styleElement.textContent = styles.default
  document.head.appendChild(styleElement)
})

onUnmounted(() => {
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement)
  }
})
</script>
<style lang="scss">
</style>