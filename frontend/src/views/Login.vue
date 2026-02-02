<script setup lang="ts">
import {reactive, ref} from "vue";
import {useMessageStore} from '@/stores/messages';
import {useAuthStore} from '@/stores/auth';
import Message from 'primevue/message';


const messageStore = useMessageStore();
const authStore = useAuthStore();
const input = reactive({email: '', password: ''});
const loginForm = ref(null);

const submitForm = async (): Promise<void> => {
  messageStore.clearMessages();
  if (!input.email || !input.password) {
    messageStore.warn('Please enter email and password');
    return;
  }

  try {
    await authStore.login({email: input.email, password: input.password,});
  } catch (error) {
    console.error('Login error:', error);
  }
};
</script>

<template>
  <div>
    <div class="bg-secondary  p-4 mx-auto w-full md:w-180 my-0 sm:my-6">
      <h2 class="">LOGIN</h2>
      <form action="#" method="POST" class="space-y-6" id="login_form" ref="loginForm" @submit.prevent="submitForm">
        <div class="messages">
          <Message :severity="msg.severity" class="mt-3" v-for="(msg, index) in messageStore.messages" :key="index">
            {{ msg.text }}
          </Message>
        </div>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-brand! text-white! uppercase">Email address</label>
          <div class="mt-2">
            <input id="email" v-model="input.email" type="email" name="email" required autocomplete="email"
                   class="block w-full rounded-md bg-text/40 px-3 py-1.5 text-base text-brand outline-1 -outline-offset-1 outline-brand/40  focus:outline-2 focus:-outline-offset-2 focus:outline-text sm:text-sm/6">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-brand text-white! uppercase">Password</label>
            <!-- <div class="text-sm">
               <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
             </div> -->
          </div>
          <div class="mt-2">
            <input id="password" v-model="input.password" type="password" name="password" required
                   autocomplete="current-password"
                   class="block w-full rounded-md bg-text/40 px-3 py-1.5 text-base text-brand outline-1 -outline-offset-1 outline-brand/40  focus:outline-2 focus:-outline-offset-2 focus:outline-text sm:text-sm/6">
          </div>
        </div>

        <div>
          <button type="submit"
                  class="uppercase cursor-pointer flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
::v-deep input:-webkit-autofill,
::v-deep input:-webkit-autofill:hover,
::v-deep input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0) inset !important;
  box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0) inset !important;
  background-color: transparent !important;
  transition: background-color 5000s ease-in-out 0s !important;
}
</style>