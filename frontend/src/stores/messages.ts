// stores/messages.js
import {defineStore} from 'pinia';
import {ref} from 'vue';

export type MessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

export interface Message {
    text: string;
    severity: MessageSeverity;
    icon?: string;
    closable?: boolean;
}

export const useMessageStore = defineStore('messages', () => {
    // State
    const messages = ref<Message[]>([]);

    // Actions
    const addMessage = (text: string, severity: MessageSeverity = 'info', icon?: string, closable = true) => {
        messages.value.push({text, severity, closable, icon});
    };

    const removeMessage = (index: number) => {
        messages.value.splice(index, 1);
    };

    const clearMessages = () => {
        messages.value = [];
    };

    //Claude made these optional "convenience methods"
    const success = (text: string, closable = true, icon?: string) => addMessage(text, 'success', icon, closable);
    const info = (text: string, closable = true, icon?: string) => addMessage(text, 'info', icon, closable);
    const warn = (text: string, closable = true, icon?: string) => addMessage(text, 'warn', icon, closable);
    const error = (text: string, closable = true, icon?: string) => addMessage(text, 'error', icon, closable);
    const secondary = (text: string, closable = true, icon?: string) => addMessage(text, 'secondary', icon, closable);
    const contrast = (text: string, closable = true, icon?: string) => addMessage(text, 'contrast', icon, closable);

    return {
        messages, addMessage, clearMessages, success, info, warn, error, secondary, contrast, removeMessage
    };
});