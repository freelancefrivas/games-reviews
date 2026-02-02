// stores/auth.ts
import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useMessageStore} from './messages';
import type { User } from '../types/user';
import api from '@/api';


export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const messageStore = useMessageStore();

    // State
    const token = ref<string | null>(localStorage.getItem('token'));
    const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    const loading = ref<boolean>(false);

    // Getters
    const isAuthenticated = computed(() => !!token.value);

    // Actions
    const login = async (credentials: LoginCredentials): Promise<void> => {
        loading.value = true;
        try {
            const {data} = await api.post<AuthResponse>('/auth/login', credentials);

            token.value = data.token;
            user.value = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            router.push('/admin/dashboard');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login Error';
            messageStore.error(message);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const logout = (): void => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const checkAuth = (): boolean => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            token.value = storedToken;
            user.value = JSON.parse(storedUser);
            return true;
        }
        return false;
    };

    return {token, user, loading, isAuthenticated, login, logout, checkAuth,};
});