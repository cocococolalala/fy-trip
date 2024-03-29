import { getFavorHistory, getFavorList } from "@/services";
import { defineStore } from "pinia";

const useFavorStore = defineStore("favor", {
  state: () => ({
    favorList: [],

    favorHistory: []
  }),

  actions: {
    async fetchFavorListData() {
      const res = await getFavorList()
      this.favorList = res.data.data.items
    },

    async fetchFavorHistoryData() {
      const res = await getFavorHistory()
        this.favorHistory = res.data.data.items
      
    },
    
   

  }
})

export default useFavorStore;

