<script setup lang="ts">
import PageBreadcrumb from "@/components/admin/common/PageBreadcrumb.vue";
import {useAuthStore} from '@/stores/auth';
import {UserCircleIcon} from "@/assets/admin-icons";
import {ref} from 'vue'
import Modal from '../../components/admin/profile/Modal.vue'
import type {User} from "@/types/user.ts";
import Alert from '../../components/admin/ui/Alert.vue'
import api from "@/api.ts";

const isProfileInfoModal = ref(false);
const authStore = useAuthStore();
const user = ref<User | null>(authStore.user);
const firstName = ref(user.value?.firstName);
const lastName = ref(user.value?.lastName);
const nickname = ref(user.value?.nickname);
const email = ref(user.value?.email);
const newPassword = ref<string | null>(null);
const showPassword = ref<boolean>(false);
const profileForm = ref<HTMLFormElement | null>(null);


const errors = ref([]);

const submitProfile = async () => {
  // Implement save profile logic here
  errors.value = [];

  const formData = new FormData();
  if (firstName.value) formData.append('firstName', firstName.value);
  if (lastName.value) formData.append('lastName', lastName.value);
  if (nickname.value) formData.append('nickname', nickname.value);
  if (email.value) formData.append('email', email.value);
  if (newPassword.value) formData.append('newPassword', newPassword.value);

  const fileInput = profileForm.value?.querySelector<HTMLInputElement>('input[type="file"]');
  if (fileInput?.files?.[0]) formData.append('newPicture', fileInput.files[0]);

  try {
    console.log(user.value?.id);
    await api.put(`/user/${user.value?.id}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
  } catch (error: any) {
    console.log(error);
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else if (error.response?.data?.error) {
      errors.value = {general: [error.response.data.error]};
    }
  }

}

</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
         v-if="user">
      <!-- <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3> -->
      <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img :src="`data:image/jpeg;base64,${user.picture}`" :alt="user.firstName+' '+user.lastName"
                   v-if="user.picture"/>
              <UserCircleIcon v-else class="h-full w-full text-gray-500  "/>
            </div>
            <div class="order-3 xl:order-2">
              <h4 class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {{ user.firstName }} {{ user.lastName }}
              </h4>
              <div class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.role }}</p>
                <!-- <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                 <p class="text-sm text-gray-500 dark:text-gray-400">Arizona, United States</p> -->
              </div>
            </div>
            <!-- <div class="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
               <a href="https://www.facebook.com/PimjoHQ" target="_blank" rel="noopener" class="social-button">
                 <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                   <path
                       d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                       fill=""
                   />
                 </svg>
               </a>
               <a href="https://x.com/PimjoHQ" target="_blank" rel="noopener" class="social-button">
                 <svg
                     class="fill-current"
                     width="20"
                     height="20"
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                 >
                   <path
                       d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                       fill=""
                   />
                 </svg>
               </a>
               <a
                   href="https://www.linkedin.com/company/pimjo/"
                   target="_blank"
                   rel="noopener"
                   class="social-button"
               >
                 <svg
                     class="fill-current"
                     width="20"
                     height="20"
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                 >
                   <path
                       d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                       fill=""
                   />
                 </svg>
               </a>
               <a
                   href="https://www.instagram.com/PimjoHQ"
                   target="_blank"
                   rel="noopener"
                   class="social-button"
               >
                 <svg
                     class="fill-current"
                     width="20"
                     height="20"
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                 >
                   <path
                       d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                       fill=""
                   />
                 </svg>
               </a>
             </div>-->
          </div>
          <button @click="isProfileInfoModal = true" class="edit-button">
            <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""/>
            </svg>
            Edit
          </button>
        </div>
      </div>


      <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h4>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ user.firstName }}</p>
              </div>

              <div>
                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ user.lastName }}</p>
              </div>

              <div>
                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Nickname
                </p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ user.nickname }}
                </p>
              </div>

              <div>
                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Email address
                </p>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ user.email }}
                </p>
              </div>

              <!-- <div>
                 <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                 <p class="text-sm font-medium text-gray-800 dark:text-white/90">+09 363 398 46</p>
               </div>

               <div>
                 <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
                 <p class="text-sm font-medium text-gray-800 dark:text-white/90">Team Manager</p>
               </div> -->
            </div>
          </div>

          <button class="edit-button" @click="isProfileInfoModal = true">
            <svg
                class="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
        <!-- @vue-ignore -->
        <template #body>
          <div
              class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <!-- close btn -->
            <button @click="isProfileInfoModal = false"
                    class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
            >
              <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                      fill=""/>
              </svg>
            </button>
            <div class="px-2 pr-14">
              <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Personal Information
              </h4>
              <!-- <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                 Update your details to keep your profile up-to-date.
               </p> -->
            </div>
            <form class="flex flex-col" enctype="multipart/form-data" ref="profileForm" @submit.prevent="submitProfile">
              <Alert v-if="errors.length > 0" v-for="error in errors"
                     variant="error"
                     title="Validation Error"
                     message=error
                     :showLink="false"
              />
              <div class="custom-scrollbar h-[458px] overflow-y-auto p-2">
                <div>
                  <!--   <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                       Social Links
                     </h5>

                     <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                       <div>
                         <label
                             class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                         >
                           Facebook
                         </label>
                         <input
                             type="text"
                             value="https://www.facebook.com/PimjoHQ"
                             class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                         />
                       </div>

                       <div>
                         <label
                             class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                         >
                           X.com
                         </label>
                         <input
                             type="text"
                             value="https://x.com/PimjoHQ"
                             class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                         />
                       </div>

                       <div>
                         <label
                             class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                         >
                           Linkedin
                         </label>
                         <input
                             type="text"
                             value="https://www.linkedin.com/company/pimjo/posts/?feedView=all"
                             class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                         />
                       </div>

                       <div>
                         <label
                             class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                         >
                           Instagram
                         </label>
                         <input
                             type="text"
                             value="https://instagram.com/PimjoHQ"
                             class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                         />
                       </div>
                     </div>-->
                </div>
                <div class="mt-7">
                  <!--  <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Personal Information
                    </h5> -->

                  <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div class="col-span-2 lg:col-span-1">
                      <label
                          class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        First Name
                      </label>
                      <input required type="text" v-model="firstName"
                             class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>

                    <div class="col-span-2 lg:col-span-1">
                      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Last Name
                      </label>
                      <input type="text" v-model="lastName" required
                             class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"/>
                    </div>

                    <div class="col-span-2 lg:col-span-1">
                      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Nickname
                      </label>
                      <input type="text" v-model="nickname" required
                             class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"/>
                    </div>

                    <div class="col-span-2 lg:col-span-1">
                      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Email Address
                      </label>
                      <input required type="email" v-model="email"
                             class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"/>
                    </div>


                    <div class="col-span-2">
                      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        <span v-if="!user.picture">New </span>Picture (optional)
                      </label>
                      <input type="file"
                             class="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
                      />
                    </div>
                    <div class="col-span-2 lg:col-span-1">
                      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        New Password (optional)
                      </label>
                      <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" v-model="newPassword"
                               placeholder="Enter your password"
                               class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                        <span @click="showPassword = !showPassword"
                              class="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
          <svg v-if="!showPassword" class="fill-gray-500 dark:fill-gray-400" width="20"
               height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
            />
          </svg>
          <svg v-else class="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20"
               fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
            />
          </svg>
        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <button
                    @click="isProfileInfoModal = false"
                    type="button"
                    class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Close
                </button>
                <button
                    type="submit"
                    class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

    </div>
  </transition>
</template>

<style scoped>

</style>