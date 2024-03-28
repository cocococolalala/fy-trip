import { getFavorList } from "@/services";
import { defineStore } from "pinia";

const useFavorStore = defineStore("favor", {
  state: () => ({
    favorList: {},
  }),
  actions: {
    async fetchFavorListData() {
      const res = await getFavorList()
      this.favorList = res.data.data.items
    },
    
   

  }
})

export default useFavorStore;

