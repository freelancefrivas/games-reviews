<script setup lang="ts">
import PageBreadcrumb from "@/components/admin/common/PageBreadcrumb.vue";
import {onMounted, reactive, ref, watch, computed} from "vue";
import {Card, Column, DataTable, Dialog} from "primevue";
import {useAuthStore} from "@/stores/auth.ts";
import api from "@/api.ts";
import {useMessageStore} from "@/stores/messages.ts";
import type {User} from "@/types/user.ts";
import {PostType} from "@/types/post.ts";
import Message from "primevue/message";
import {formatDate} from "@/utils/date.ts";
import type {Comment} from "@/types/comment.ts";
import {truncate} from "@/utils/string.ts";

const currentPageTitle = ref("COMMENTS");
const authStore = useAuthStore();
const messageStore = useMessageStore();
const comments = reactive<Comment[]>([]);
const keywordFilter = ref(<string | null>null);
const selectedComment = ref(<Comment | null>null);
const showCommentDialog = ref(false);

const filteredComments = computed(() => {
  return comments.filter(comment => {
    const keyword = keywordFilter.value?.toLowerCase() || '';
    return comment.body.toLowerCase().includes(keyword);
  });
});

onMounted(() => {
  loadComments();
});

const loadComments = async () => {
  try {
    const response = await api.get('/comment', {params: {keyword: keywordFilter.value}});
    comments.push(...response.data);
  } catch (error) {
    console.error('Error loading comments:', error);
  }
}

const deleteComment = async (id: number) => {

  if (!confirm('Delete this comment?'))
    return;
  try {
    await api.delete(`/comment/${id}`);
    const idx = comments.findIndex(c => c.id === id);
    if (idx !== -1)
      comments.splice(idx, 1);
    messageStore.success('The comment was deleted successfully.');
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
}

function viewComment(comment: Comment) {
  selectedComment.value = comment
  showCommentDialog.value = true
}
</script>

<template>
  <Dialog
      v-model:visible="showCommentDialog"
      header="Comment"
      modal
      :style="{ width: '40rem' }"
  >
    <div v-if="selectedComment">
      <div class="mb-3">
        <strong>Author</strong>
        <div>{{ selectedComment.author.name }}</div>
      </div>

      <div class="mb-3">
        <strong>Post</strong>
        <div>{{ selectedComment.post.title }}</div>
      </div>

      <div class="mb-3">
        <strong>Comment</strong>
        <div class="comment-content">
          {{ selectedComment.body }}
        </div>
      </div>

      <div>
        <strong>Date</strong>
        <div>{{ formatDate(selectedComment.createdAt) }}</div>
      </div>
    </div>
  </Dialog>


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
          </div>
          <div class="messages">
            <Message :severity="msg.severity" class="mt-3" v-for="(msg, index) in messageStore.messages" :key="index"
                     :closable="msg.closable" @close="messageStore.removeMessage(index)">
              {{ msg.text }}
            </Message>
          </div>
          <DataTable :value="filteredComments" tableStyle="min-width: 50rem" class="mt-5 compacting-table" paginator
                     :rows="50">
            <template #empty>
              No comments found
            </template>

            <Column field="author.name" header="Name" :sortable="true" header-class="montserrat">
              <template #body="{ data }">
                <router-link :to="`/user/${data.author.id}`" target="_blank" rel="noopener" class="hover:underline">
                  {{ data.author.name }}
                </router-link>
              </template>
            </Column>

            <Column field="post.title" header="Post" :sortable="true"
                    header-class="montserrat">
              <template #body="{ data }">
                <router-link :to="`/post/${data.post.slugCode}`" target="_blank" rel="noopener"
                             class="text-truncate hover:underline">
                  {{ truncate(data.post.title, 60) }}
                </router-link>
              </template>
            </Column>

            <Column field="body" header="Comment" header-class="montserrat">
              <template #body="{ data }">
                <span :title="data.body" class="text-truncate">
                {{ truncate(data.body, 60) }}
                </span>
              </template>
            </Column>

            <Column field="createdAt" header="Date" :sortable="true" header-class="montserrat" class="whitespace-nowrap">
              <template #body="{ data }">
                {{ formatDate(data.createdAt) }}
              </template>
            </Column>

            <!-- Actions -->
            <Column header="" :style="{ width: '15rem' }" class="actions">
              <template #body="{ data }">
                <!-- View -->
                <a @click.prevent="viewComment(data)" title="View" class="action action-view" aria-label="View">
                  <i class="pi pi-eye"></i>
                </a>

                <!-- Delete -->
                <button @click.prevent="deleteComment(data.id)" title="Delete"
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
.comment-content {
  margin-top: 0.5rem;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>