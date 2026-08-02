<script setup lang="ts">
import PageBreadcrumb from "@/components/admin/common/PageBreadcrumb.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {Card, Column, DataTable} from "primevue";
import api from "@/api.ts";
import {useMessageStore} from "@/stores/messages.ts";
import {RoleType, type User} from "@/types/user.ts";
import Message from "primevue/message";
import {formatDate} from "@/utils/date.ts";
import {UserCircleIcon} from "@/assets/admin-icons";
import {authClient} from "@/lib/auth-client.ts";
import {capitalize} from "@/utils/string.ts";

const currentPageTitle = ref("USERS");
//const authStore = useAuthStore();
const messageStore = useMessageStore();
const users = reactive<User[]>([]);
const keywordFilter = ref(<string | null>null);
const roleFilter = ref(<string>'Staff');
const baseUrl = computed(() => import.meta.env.VITE_API_URL);

const filteredUsers = computed(() => {
  return users.filter(user => {
    const keyword = keywordFilter.value?.toLowerCase() || '';
    return (user.name.toLowerCase().includes(keyword) || user.nickname.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword)) && roleIncludedInGroup(roleFilter.value, user);
  });
});

onMounted(() => {
  loadUsers();
});

const loadUsers = async () => {
  try {
    const response = await api.get('/user', {});
    users.push(...response.data);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

const deleteUser = async (id: string) => {
  if (!confirm('Delete this user?'))
    return;
  try {
    await authClient.admin.removeUser({userId: id});
    const idx = users.findIndex(p => p.id == id);
    if (idx !== -1)
      users.splice(idx, 1);
    messageStore.success('The user was deleted successfully.');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

const roleIncludedInGroup = (role: string, user: User) => {
  switch (role) {
    case null:
      return true;
    case 'Staff':
      return (user.role == RoleType.ADMIN || user.role == RoleType.WRITER || user.role == RoleType.EDITOR);
    default:
      return role === user.role;
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
              <div class="w-full px-2.5 sm:w-1/3">
                <select v-model="roleFilter" placeholder="Keyword"
                        class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                  <option value="Staff">Staff</option>
                  <option :value="null">All</option>
                  <option v-for="role in Object.values(RoleType)" :key="role" :value="role">
                    {{ role }}
                  </option>
                </select>
              </div>

            </div>
            <div class="flex flex-wrap items-center gap-3 xl:justify-end order-first xl:order-last px-2.5">
              <router-link to="/admin/user/create"
                           class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                Add New User
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
            <Message :severity="msg.severity" class="mt-3" v-for="(msg, index) in messageStore.messages" :key="index"
                     :closable="msg.closable" @close="messageStore.removeMessage(index)">
              {{ msg.text }}
            </Message>
          </div>
          <DataTable :value="filteredUsers" tableStyle="min-width: 50rem" class="mt-5" paginator :rows="50">
            <template #empty>
              No users found
            </template>

            <Column field="image" header="" :sortable="false" header-class="montserrat">
              <template #body="{ data }">
                <img v-if="data.image" :src="baseUrl+data.image" :alt="data.name"
                     class="w-7 h-7 rounded-full object-cover">
                <UserCircleIcon v-else class=" text-gray-500 w-7 h-7 "/>
              </template>
            </Column>

            <Column field="name" header="Name" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                <span>{{ data.name }}</span> <i v-if="!data.emailVerified"
                                                class="pi pi-exclamation-triangle text-yellow-500"
                                                title="Email not verified"/>
              </template>
            </Column>

            <Column field="nickname" header="Nickname" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                <span>{{ data.nickname }}</span>
              </template>
            </Column>

            <Column field="role" header="Role" :sortable="true"
                    header-class="montserrat">
              <template #body="{ data }">
                {{ capitalize(data.role) }}
              </template>
            </Column>

            <Column field="createdAt" header="Created At" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                {{ formatDate(data.createdAt) }}
              </template>
            </Column>

            <!-- Actions -->
            <Column header="" :style="{ width: '15rem' }">
              <template #body="{ data }">
                <!-- View -->
                <router-link :to="`/admin/users/view`+data.id" target="_blank" rel="noopener" title="View"
                             class="action action-view"
                             aria-label="View">
                  <i class="pi pi-eye"></i>
                </router-link>

                <!-- Edit -->
                <router-link :to="`/admin/sale/${data.id}/edit`" title="Edit"
                             class="action action-edit "
                             aria-label="Edit">
                  <i class="pi pi-pencil"></i>
                </router-link>

                <!-- Delete -->
                <button @click.prevent="deleteUser(data.id)" title="Delete"
                        class="action action-delete"
                        aria-label="Delete">
                  <i class="pi pi-trash"></i>
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