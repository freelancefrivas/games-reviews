<template>
  <aside
      :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:border-[var(--color-primary)] dark:bg-[var(--color-primary)]/50 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,        'lg:w-[90px]': !isExpanded && !isHovered,        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,        'lg:translate-x-0': true,      },
    ]"
      @mouseenter="!isExpanded && (isHovered = true)"
      @mouseleave="isHovered = false"
  >
    <div :class="[        'py-8 flex',        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',      ]"
    >
      <router-link to="/">
        <img v-if="isExpanded || isHovered || isMobileOpen" class=" hidden lg:block" src="@/assets/logo.png" alt="Logo"
             width="140"/>
        <img v-else src="/images/favicon/favicon-96x96.png" alt="Logo" width="32" height="32"/>
      </router-link>
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2 :class="['mb-4 text-xs uppercase flex leading-[20px] text-gray-400',!isExpanded && !isHovered? 'lg:justify-center': 'justify-start',]">
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else/>
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                    v-if="item.subItems"
                    @click="toggleSubmenu(groupIndex, index)"
                    :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                      :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon"/>
                  </span>
                  <span
                      v-if="isExpanded || isHovered || isMobileOpen"
                      class="menu-item-text"
                  >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                      v-if="isExpanded || isHovered || isMobileOpen"
                      :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link v-else-if="item.path"
                             :to="item.path"
                             :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                      :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon"/>
                  </span>
                  <span
                      v-if="isExpanded || isHovered || isMobileOpen"
                      class="menu-item-text"
                  >{{ item.name }}</span
                  >
                </router-link>
                <transition
                    @enter="startTransition"
                    @after-enter="endTransition"
                    @before-leave="startTransition"
                    @after-leave="endTransition"
                >
                  <div
                      v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                            :to="subItem.path"
                            :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                                v-if="subItem.new"
                                :class="[
                                'menu-dropdown-badge',
                                { 'menu-dropdown-badge-active': isActive( subItem.path),'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span v-if="subItem.pro" :class="['menu-dropdown-badge',{'menu-dropdown-badge-active': isActive(
                                    subItem.path                                  ),
                                  'menu-dropdown-badge-inactive': !isActive( subItem.path ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import {ref, computed} from "vue";
import {useRoute} from "vue-router";
import {RoleType} from "@/types/user.ts";
import {authClient} from "@/lib/auth-client.ts";

import {
  GridIcon, CalenderIcon, UserCircleIcon, ChatIcon, MailIcon, DocsIcon, PieChartIcon, ChevronDownIcon, HorizontalDots,
  PageIcon, TableIcon, ListIcon, PlugInIcon, UserGroupIcon, TagIcon
} from '@/assets/admin-icons';
import BoxCubeIcon from "@/assets/admin-icons/BoxCubeIcon.vue";
import {useSidebar} from "@/composables/useSidebar";

const route = useRoute();
const session = authClient.useSession();

const {isExpanded, isMobileOpen, isHovered, openSubmenu} = useSidebar();

let items = [
  {
    icon: GridIcon,
    name: "Dashboard",
    path: '/admin/dashboard'
    // subItems: [{name: "Ecommerce", path: "/", pro: false}],
  },
  {
    icon: DocsIcon,
    name: "Posts",
    path: "/admin/posts",
  },
  {
    icon: TagIcon,
    name: "Sales",
    path: "/admin/sales",
  }
];

if (session.value.data?.user?.role === RoleType.ADMIN)
  items.push({
    icon: UserGroupIcon,
    name: "Users",
    path: "/admin/users",
    hidden: (session.value.data.user.role !== RoleType.ADMIN),
  });

let menuGroups = [
  {
    //  title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: '/admin/dashboard'
        // subItems: [{name: "Ecommerce", path: "/", pro: false}],
      },
      {
        icon: DocsIcon,
        name: "Posts",
        path: "/admin/posts",
      },
      {
        icon: TagIcon,
        name: "Sales",
        path: "/admin/sales",
      },

      /*   {
           name: "Forms",
           icon: ListIcon,
           subItems: [
             {name: "Form Elements", path: "/form-elements", pro: false},
           ],
         },
         {
           name: "Tables",
           icon: TableIcon,
           subItems: [{name: "Basic Tables", path: "/basic-tables", pro: false}],
         },
         {
           name: "Pages",
           icon: PageIcon,
           subItems: [
             {name: "Black Page", path: "/blank", pro: false},
             {name: "404 Page", path: "/error-404", pro: false},
           ],
         },*/
    ],
  },
  /* {
     title: "Others",
     items: [
       {
         icon: PieChartIcon,
         name: "Charts",
         subItems: [
           {name: "Line Chart", path: "/line-chart", pro: false},
           {name: "Bar Chart", path: "/bar-chart", pro: false},
         ],
       },
       {
         icon: BoxCubeIcon,
         name: "Ui Elements",
         subItems: [
           {name: "Alerts", path: "/alerts", pro: false},
           {name: "Avatars", path: "/avatars", pro: false},
           {name: "Badge", path: "/badge", pro: false},
           {name: "Buttons", path: "/buttons", pro: false},
           {name: "Images", path: "/images", pro: false},
           {name: "Videos", path: "/videos", pro: false},
         ],
       },
       {
         icon: PlugInIcon,
         name: "Authentication",
         subItems: [
           {name: "Signin", path: "/signin", pro: false},
           {name: "Signup", path: "/signup", pro: false},
         ],
       },
       // ... Add other menu items here
     ],
   },*/
];

if (session.value.data?.user?.role === RoleType.ADMIN)
  menuGroups[0].items.push({
    icon: UserGroupIcon,
    name: "Users",
    path: "/admin/users"
  });

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
      group.items.some(
          (item) =>
              item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
      )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
      openSubmenu.value === key ||
      (isAnySubmenuRouteActive.value &&
          menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
              isActive(subItem.path)
          ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>

<style lang="scss" scoped>
@reference "tailwindcss";

.menu-item-text {
  @apply uppercase;
  font-family: "Exo 2", sans-serif;
  font-optical-sizing: auto;;
  font-style: normal;
}

</style>
