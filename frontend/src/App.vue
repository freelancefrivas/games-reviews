<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {ref} from 'vue';
import {useSearchBarStore} from '@/stores/searchBar.ts'
import router from "@/router";
import {useAuthStore} from "@/stores/auth.ts";

const isMenuOpen = ref(false);
const searchBarStore = useSearchBarStore();
const auth = useAuthStore();

const redirectToSearchPage = () => {
  router.push({path: 'search'})
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <div class="container mx-auto p-4">
        <div class="header flex items-center justify-between">
          <div class="flex items-center space-x-3 lg:space-x-6">
            <RouterLink to="/" class=" mr-1 lg:mr-6">
              <img alt="Outer Games" class="flex-shrink-0 my-3 lg:my-5  ml-3 lg:ml-7 mr-3 lg:mr-5 w-32"
                   src="@/assets/logo.png"/>
            </RouterLink>

            <!-- Desktop Navigation -->
            <div class="wrapper ml-2 md:ml-2 lg:ml-2 hidden md:block">
              <nav class="md:space-x-2 lg:space-x-3 xl:space-x-4 text-sm! lg:text-base! ml-0!" id="main_nav_bar">
                <RouterLink to="/news" class=" ">News</RouterLink>
                <RouterLink to="/reviews" class="">Reviews</RouterLink>
                <RouterLink to="/deals" class=" ">Deals</RouterLink>
                <RouterLink to="/admin/dashboard" v-if="auth.isAuthenticated" class=" ">Admin</RouterLink>
              </nav>
            </div>
          </div>

          <!-- search input -->
          <div class="mr-5 lg:mr-7 relative max-w-[30%] hidden md:block">
            <input type="search" placeholder="Search..." class="text-sm! lg:text-base! padding-1 lg:padding-2"
                   v-model="searchBarStore.searchKeyValue"
                   id="search_box" @keydown.enter="redirectToSearchPage()"/>
            <span @click.prevent="redirectToSearchPage()"
                  class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"></span>
          </div>

          <button @click="isMenuOpen = !isMenuOpen" class="md:hidden mr-5 p-2 text-white focus:outline-none"
                  aria-label="Toggle menu">
            <svg class="w-8 h-8 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>


        </div>
      </div>
    </header>
    <!-- Mobile Menu -->
    <div class=" px-4">
      <transition enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
        <div v-if="isMenuOpen" class="md:hidden mt-0 pb-4">
          <!-- Mobile Navigation -->
          <nav class="flex flex-col space-y-3 mb-4 !text-base !rounded-md !px-4">
            <RouterLink to="/news" class="px-4 py-2 hover:bg-gray-800 rounded flex items-center"
                        @click="isMenuOpen = false">
              News
            </RouterLink>
            <RouterLink to="/reviews" class="px-4 py-2 hover:bg-gray-800 rounded flex items-center"
                        @click="isMenuOpen = false">
              Reviews
            </RouterLink>
            <RouterLink to="/deals" class="px-4 py-2 hover:bg-gray-800 rounded flex items-center"
                        @click="isMenuOpen = false">
              Current Deals
            </RouterLink>
            <RouterLink to="/admin/dashboard" v-if="auth.isAuthenticated" class=" ">Admin</RouterLink>
            <!-- Mobile Search -->
            <div class="relative group mb-2">
              <input type="text" placeholder="Search..."
                     class="w-full px-4 py-2 pr-10  bg-gray-900/50 hover:bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                     id="mobile_search_box"/>
              <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white"></i>
            </div>
          </nav>
        </div>
      </transition>
    </div>


    <div class="container mx-auto p-4 flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>

    <footer>
      <div class="container mx-auto p-4">
        <div class="footer ">

          <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-8 mb-4">

            <div>
              <h3 class="text-lg font-bold mb-3 exo-2 uppercase">Useful Links</h3>
              <ul class="text-gray-400 space-y-2">
                <li>
                  <router-link to="/contact" class="hover:text-white">Contact</router-link>
                </li>
                <li>
                  <router-link to="/rss-feeds" class="hover:text-white">RSS Feeds</router-link>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold mb-3 exo-2 uppercase">Legals</h3>
              <ul class="text-gray-400 space-y-2">
                <li>
                  <router-link to="legals/privacy-policy" class="hover:text-white">Privacy Policy</router-link>
                </li>
                <li>
                  <router-link to="legals/terms-and-conditions" class="hover:text-white">Terms & Conditions
                  </router-link>
                </li>
                <li>
                  <router-link to="legals/cookie-policy" class="hover:text-white">Cookie Policy</router-link>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold mb-3 exo-2 uppercase">Social Media</h3>
              <ul class="text-gray-400 space-y-2">
                <li>
                  <a href="" class="hover:text-white">X</a>
                </li>
                <li>
                  <a href="" class="hover:text-white">Blue Sky</a>
                </li>
                <li>
                  <a href="" class="hover:text-white">Youtube</a>
                </li>
              </ul>
            </div>

          </div>
          <p>© 2026 Outer Games. All rights reserved.</p>
        </div>

      </div>
    </footer>
  </div>
</template>

<style scoped lang="postcss">
@reference "tailwindcss";
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  @apply uppercase flex space-x-4 px-6 py-2 mt-0 rounded-3xl /*bg-black/30*/
  ;
  width: 100%;
  font-size: 12px;
  text-align: center;

  background-color: rgba(100, 93, 199, 0.4); /* Using rgba with 70% opacity */
}

nav a {
  @apply whitespace-nowrap font-bold /*bg-black/30*/
  ;
  display: inline-block;
  padding: 0 1rem;
  color: var(--color-text);
  transition: color 0.3s ease-in-out;
  /* text-shadow: 2px 2px 6px rgba(0,0,0,0.6);*/
  font-family: "Exo 2", sans-serif;
  @media (max-width: 1023px) {
    padding: 0 0.5rem;
  }
}

nav a:hover {
  color: white;
}

#search_box {
  @apply px-4 py-2 border-0 focus:outline-none rounded-lg focus:ring-1 focus:ring-white w-48 lg:w-64 bg-black/30 leading-6;
  color: white;

  &::-webkit-search-cancel-button { /*white cross*/
    position: relative;
    right: 20px;
    -webkit-appearance: none;
    appearance: none;
    height: 18px;
    width: 18px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
    background-size: 18px 18px;
    cursor: pointer;
  }
}

#mobile_search_box {
  @apply px-4 py-2 border-0 focus:outline-none rounded-lg focus:ring-1 focus:ring-white bg-black/30 leading-6;
}


@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  /*.logo {
    margin: 0 2rem 0 2rem;
  }*/
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    a {
      @apply whitespace-nowrap;
    }
  }
}


</style>
