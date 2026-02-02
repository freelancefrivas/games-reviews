// stores/messages.js
import {defineStore} from 'pinia';
import {ref} from 'vue';

export type MessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

export interface Message {
    text: string;
    severity: MessageSeverity;
    icon?: string;
}

export const useMessageStore = defineStore('messages', () => {
    // State
    const messages =  ref<Message[]>([]);

    // Actions
    const addMessage = (text: string, severity: MessageSeverity = 'info', icon?: string) => {
        messages.value.push({text, severity});
    };

    /*9  const removeMessage = (id) => {
          const index = messages.value.findIndex(msg => msg.id === id);
          if (index !== -1) {
              messages.value.splice(index, 1);
          }
      };*/

    const clearMessages = () => {
        messages.value = [];
    };

    //Claude made these optional "convenience methods"
    const success = (text: string): void => addMessage(text, 'success');
    const info = (text: string): void => addMessage(text, 'info');
    const warn = (text: string): void => addMessage(text, 'warn');
    const error = (text: string): void => addMessage(text, 'error');
    const secondary = (text: string): void => addMessage(text, 'secondary');
    const contrast = (text: string): void => addMessage(text, 'contrast');

    return {
        messages, addMessage, clearMessages, success, info, warn, error, secondary, contrast
    };
});