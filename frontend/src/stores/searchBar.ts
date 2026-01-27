import {defineStore} from 'pinia'
import {ref} from "vue";
import Router from "@/router";
import type {Tag} from "@/types/tag.ts";

export const useSearchBarStore = defineStore('searchBar', () => {
    const searchKeyValue = ref(null);
    const searchTagValue = ref<number | null>(null);

    const followTag = (tag: Tag, router: typeof Router) => {
        searchTagValue.value = tag.id;
        router.push({ path: `/tag/`+ tag.name});
    }

    return {searchKeyValue, searchTagValue}
})