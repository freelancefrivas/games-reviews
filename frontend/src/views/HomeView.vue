<script setup lang="ts">
import axios from 'axios';
import {reactive, onMounted} from "vue";
import api from '@/api';
import {useSearchBarStore} from '@/stores/searchBar.ts'
import type {Tag} from "@/types/tag.ts";
import type {Post} from "@/types/post.ts";
import type {Review} from "@/types/review.ts";
import {RouterLink} from "vue-router";

const tags = reactive<Tag[]>([]);
const searchBarStore = useSearchBarStore();
const newsItems = reactive<Post[]>([]);
const reviews = reactive<Review[]>([]);

onMounted(() => {
  loadTags();
  loadNews();
  loadReviews();
});

const loadTags = async () => {
  try {
    const response = await api.get('/tag');
    tags.push(...response.data);
  } catch (error) {
    console.error('Error loading tags:', error);
  }
}

const loadNews = async () => {
  try {
    const response = await api.get('/post/news', {
      params: {max: 10}
    });
    newsItems.push(...response.data);
  } catch (error) {
    console.error('Error loading news articles:', error);
  }
}

const loadReviews = async () => {
  try {
    const response = await api.get('/post/reviews', {
      params: {max: 10}
    });
    reviews.push(...response.data);
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

/*const followTag = (tagId: number) => {
  searchBarStore.searchTagValue = tagId;
}*/
</script>

<template>
  <main>
    <div id="tags" class="highlight-box text-text p-4 mb-4 nunito-sans">
      <p class=" mb-4">There's a new breed of indie games...</p>
      <div class="inline-flex items-center gap-2">
        <div v-for="tag in tags" :key="tag.id" class="tag-arrow ">
          {{ tag.name }}
        </div>
      </div>

    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div id="news">
        <h1 >NEWS</h1>
        <div v-for="newsItem in newsItems">
          <RouterLink :to="'/post/'+newsItem.slugCode"><h2 class="exo-2 uppercase">{{ newsItem.title }}</h2></RouterLink>
          <RouterLink v-if="newsItem.mainImage" :to="'/post/'+newsItem.slugCode"><img class="w-100"
                                                                                     :src="newsItem.mainImage"/>
          </RouterLink>
          <div class="post-block">

            <p v-html="newsItem.excerpt"></p>
          </div>
        </div>
      </div>
      <div id="news">
        <h1>REVIEWS</h1>
        <p v-if="reviews.length === 0" class="text-text text-center text-lg mt-2">No reviews yet!</p>
        <div v-for="review in reviews">
          <RouterLink to="'/post/'+review.post.slugCode"><h2 class="exo-2 uppercase">{{ review.post.title }}</h2></RouterLink>
          <RouterLink v-if="review.post.mainImage" to="'/post/'+newsItem.slugCode"><img class="w-100"
                                                                                        :src="review.post.mainImage"/>
          </RouterLink>
          <div class="post-block">

            <p v-html="review.post.excerpt"></p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="postcss">

</style>
