<script setup lang="ts">

import PageBreadcrumb from "@/components/admin/common/PageBreadcrumb.vue";
import {onMounted, reactive, ref, watch} from "vue";
// Chart not used here
import {Card} from "primevue";
import {useAuthStore} from "@/stores/auth.ts";
import api from "@/api.ts";
import type {User} from "@/types/user.ts";
import type {Post} from "@/types/post.ts";
import {DataTable} from "primevue";
import {Column} from "primevue";
import {PostType} from "@/types/post.ts";
import {useMessageStore} from '@/stores/messages';
import Message from "primevue/message";

const currentPageTitle = ref("POSTS");
const authStore = useAuthStore();
const messageStore = useMessageStore();
const users = reactive<User[]>([]);
const userFilter = ref(null);
const typeFilter = ref(null);
const keywordFilter = ref(null);
const sortBy = ref('');
const posts = reactive<Post[]>([]);

onMounted(() => {
  loadUsers();
  reloadPosts();
  messageStore.success('The post was deleted successfully.');
});

const loadUsers = async () => {
  try {
    const response = await api.get('/user');
    users.push(...response.data);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

const reloadPosts = async () => {
  try {
    const response = await api.get('/post', {
      params: {
        type: typeFilter.value,
        keyword: keywordFilter.value,
        author: userFilter.value,
      }
    });
    posts.splice(0, posts.length, ...response.data);
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

const deletePost = async (id: number) => {

  if (!confirm('Delete this post?'))
    return;
  try {
    await api.delete(`/post/${id}`);
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) posts.splice(idx, 1);
    messageStore.success('The post was deleted successfully.');
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

const formatDate = (value: string | number | Date | null | undefined) => {
  if (!value && value !== 0) return '';
  const d = new Date(value as any);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

watch([userFilter, typeFilter, keywordFilter], () => {
  reloadPosts();
});

</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle"/>
  <div class="grid grid-cols-12 gap-4 md:gap-6">
    <div class=" col-span-12 ">
      <Card>
        <template #content>
          <div class="flex flex-col w-full gap-x-60 gap-y-4 sm:justify-between xl:flex-row xl:items-center">
            <div class=" flex flex-wrap gap-y-5 xl:flex-1">
              <div class="w-4/7 px-2.5 sm:w-1/3" v-if="authStore.user?.role === 'Admin'">
                <select
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                  <option :value="null">Any writer</option>
                  <option v-for="user in users" :value="user.id">{{ user.firstName }} {{ user.lastName }}</option>
                </select>
              </div>

              <div class="w-3/7 px-2.5 sm:w-1/3">
                <select v-model="typeFilter"
                        class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                  <option :value="null">Any type</option>
                  <option v-for="(value, key) in PostType"
                          :key="key"
                          :value="value">{{ value }}
                  </option>
                </select>
              </div>
              <div class="w-full px-2.5 sm:w-1/3">
                <input v-model="keywordFilter" placeholder="Keyword"
                       class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"/>
              </div>
              <!-- <div class="w-full px-2.5 xl:w-1/4">
                 <select v-model="sortBy"
                     class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30">
                   <option value="null">Date (desc)</option>
                   <option value="null">Date (desc)</option>

                 </select>
               </div> -->
            </div>
            <div class="flex flex-wrap items-center gap-3 xl:justify-end order-first xl:order-last px-2.5">
              <router-link to="/admin/posts/create"
                           class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                Write New Post
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
          <DataTable :value="posts" tableStyle="min-width: 50rem" class="mt-5" paginator :rows="50">
            <template #empty>
              No posts found
            </template>
            <Column field="createdAt" header="Date" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                {{ formatDate(data.createdAt) }}
              </template>
            </Column>
            <Column header="" :style="{ width: '5rem' }" header-class="montserrat">
              <template #body="{ data }">
                <img v-if="data.image" :src="data.image || data.thumbnail || '/images/placeholder.png'" alt="thumb"
                     class="w-12 h-8 object-cover rounded"/>
              </template>
            </Column>


            <Column field="title" header="Title" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                <span>{{ data.title }}</span> &nbsp;
                <span title="not published" class="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium capitalize text-sm bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500" v-if="!data.published">
                  Draft</span>
              </template>
            </Column>

            <Column field="author" header="Author" :sortable="true" v-if="authStore.user?.role === 'Admin'"
                    header-class="montserrat">
              <template #body="{ data }">
                {{ data.author.firstName }} {{ data.author.lastName }}
              </template>
            </Column>

            <!-- Actions -->
            <Column header="" :style="{ width: '15rem' }">
              <template #body="{ data }">
                <!-- View -->
                <router-link :to="`/post/${data.id}`" target="_blank" rel="noopener" title="View"
                             class="action action-view"
                             aria-label="View">
                  <i class="pi pi-eye" ></i>
                </router-link>

                <!-- Edit -->
                <router-link :to="`/admin/posts/${data.id}/edit`" title="Edit"
                             class="action action-edit "
                             aria-label="Edit">
                  <i class="pi pi-pencil" ></i>
                </router-link>

                <!-- Delete -->
                <button @click.prevent="deletePost(data.id)" title="Delete"
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
@reference "tailwindcss";

.action {
  @apply inline-flex items-center rounded px-2 py-1 text-black transition-colors;
}

.action-view:hover {
  @apply text-gray-500;
}

.action-edit:hover {
  @apply text-blue-600;
}

.action-delete:hover {
  @apply text-red-600;
}

.p-datatable-column-title,
.p-datatable-tbody td {
  font-size: 14px !important;
}


</style>