<script setup lang="ts">
import PageBreadcrumb from "@/components/admin/common/PageBreadcrumb.vue";
import {onMounted, reactive, ref, watch} from "vue";
import {Card, Column, DataTable} from "primevue";
import {useAuthStore} from "@/stores/auth.ts";
import api from "@/api.ts";
import {useMessageStore} from "@/stores/messages.ts";
import type {User} from "@/types/user.ts";
import {PostType} from "@/types/post.ts";
import Message from "primevue/message";
import {formatDate} from "@/utils/date.ts";

const currentPageTitle = ref("SALES");
const authStore = useAuthStore();
const messageStore = useMessageStore();
const sales = reactive<User[]>([]);
const keywordFilter = ref(null);

onMounted(() => {
  loadSales();
});

const loadSales = async () => {
  try {
    const response = await api.get('/sale', {});
    sales.push(...response.data);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

const deleteSale = async (id: number) => {

  if (!confirm('Delete this post?'))
    return;
  try {
    await api.delete(`/sale/${id}`);
    const idx = sales.findIndex(p => p.id === id);
    if (idx !== -1)
      sales.splice(idx, 1);
    messageStore.success('The sale was deleted successfully.');
  } catch (error) {
    console.error('Error deleting sale:', error);
  }
}
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle"/>
  <div class="grid grid-cols-12 gap-4 md:gap-6">
    <div class=" col-span-12 ">
      <Card>
        <template #content>
          <div class="flex flex-col w-full gap-x-60 gap-y-4 sm:justify-between xl:flex-row xl:items-center">
            <div class=" flex flex-wrap gap-y-5 xl:flex-1">

              <div class="w-full px-2.5 sm:w-1/3">
                <input v-model="keywordFilter" placeholder="Keyword"
                       class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"/>
              </div>

            </div>
            <div class="flex flex-wrap items-center gap-3 xl:justify-end order-first xl:order-last px-2.5">
              <router-link to="/admin/sales/create"
                           class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                Add New Sale
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M9.2502 4.99951C9.2502 4.5853 9.58599 4.24951 10.0002 4.24951C10.4144 4.24951 10.7502 4.5853 10.7502 4.99951V9.24971H15.0006C15.4148 9.24971 15.7506 9.5855 15.7506 9.99971C15.7506 10.4139 15.4148 10.7497 15.0006 10.7497H10.7502V15.0001C10.7502 15.4143 10.4144 15.7501 10.0002 15.7501C9.58599 15.7501 9.2502 15.4143 9.2502 15.0001V10.7497H5C4.58579 10.7497 4.25 10.4139 4.25 9.99971C4.25 9.5855 4.58579 9.24971 5 9.24971H9.2502V4.99951Z"
                        fill=""></path>
                </svg>
              </router-link>
            </div>
          </div>
          <div class="messages">
            <Message :severity="msg.severity" class="mt-3" v-for="(msg, index) in messageStore.messages" :key="index" :closable="msg.closable" @close="messageStore.removeMessage(index)">
              {{ msg.text }}
            </Message>
          </div>
          <DataTable :value="sales" tableStyle="min-width: 50rem" class="mt-5" paginator :rows="50">
            <template #empty>
              No sales found
            </template>

            <Column field="title" header="Name" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                <span>{{ data.name }}</span><span v-if="data.saleType === 'Bundle'"> (bundle)</span>
              </template>
            </Column>

            <Column field="shop" header="Shop" :sortable="true"
                    header-class="montserrat">
              <template #body="{ data }">
                {{ data.shop }}
              </template>
            </Column>

            <Column field="expiresAt" header="Expires At" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                {{ formatDate(data.expiresAt) }}
              </template>
            </Column>

            <!-- Actions -->
            <Column header="" :style="{ width: '15rem' }">
              <template #body="{ data }">
                <!-- View -->
                <router-link :to="`/sales`" target="_blank" rel="noopener" title="View"
                             class="action action-view"
                             aria-label="View">
                  <i class="pi pi-eye" ></i>
                </router-link>

                <!-- Edit -->
                <router-link :to="`/admin/sale/${data.id}/edit`" title="Edit"
                             class="action action-edit "
                             aria-label="Edit">
                  <i class="pi pi-pencil" ></i>
                </router-link>

                <!-- Delete -->
                <button @click.prevent="deleteSale(data.id)" title="Delete"
                        class="action action-delete"
                        aria-label="Delete">
                  <i class="pi pi-trash" ></i>
                </button>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

    </div>
  </div>
</template>

<style scoped>

</style>