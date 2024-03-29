import { getOrderList } from "@/services";
import { defineStore } from "pinia";

const useOrderStore = defineStore('order', {
  state: () => ({
    //全部订单&未完成订单&最近订单
    orderList: [],
  }),

  actions: {
    async fetchOrderListData(type) {
      const res = await getOrderList(type)
      this.orderList = res.data.data.orders
    },
  }
})

export default useOrderStore;