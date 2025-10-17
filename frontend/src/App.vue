<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <header>
    <div class="container mx-auto p-4">
      <div class="header flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <RouterLink to="/" class="">
            <img alt="Outer Games" class="flex-shrink-0 mt-5 mb-5 ml-7 mr-5 w-32" src="@/assets/logo.png"/>
          </RouterLink>

          <div class="wrapper ml-4">
            <nav class="pr-8!" id="main_nav_bar">
              <RouterLink to="/news" class="px-0.5! lg:px-1! 2xl:px-2!">News</RouterLink>
              <RouterLink to="/reviews" class="px-0.5 lg:px-1! 2xl:px-2!">Reviews</RouterLink>
              <RouterLink to="/deals" class="px-0.5 lg:px-1! 2xl:px-2!">Current Deals</RouterLink>
            </nav>
          </div>
        </div>

        <!-- search input -->
        <div class="mr-7 relative">
          <input type="text" placeholder="Search..." id="search_box"/>
          <span
              class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"></span>
        </div>
      </div>
    </div>
  </header>

  <RouterView/>
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
}

nav a:hover {
  color: white;
}

#search_box {
  @apply px-4 py-2 border-0 focus:outline-none rounded-lg focus:ring-1 focus:ring-white w-64 bg-black/30 leading-6;
  color: white;
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
