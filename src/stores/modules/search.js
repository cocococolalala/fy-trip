import { getSearchResult, getSearchTop } from "@/services";
import { defineStore } from "pinia";

const searchStore = defineStore('search', {
  state: () => ({
    searchList: [],
    searchResult: [],
  }),

  actions: {
    async fetchSearchTopData() {
      const res = await getSearchTop()
      this.searchList = res.data.data.allConditions
    },

    async fetchSearchResultData() {
      const res = await getSearchResult()
      this.searchResult = res.data.data.items
    }
  },
})

export default searchStore;