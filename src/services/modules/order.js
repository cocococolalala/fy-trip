import hyRequest from '../request'

//查询订单列表
export function getOrderList(type = 0) {
  if(type === 0) {
    type = 'all'
  }else if(type === 1) {
    type = 'recent'
  }else if(type === 2) {
    type = 'pend'
  }

  return hyRequest.get({
    url: 'order/list',
    params : {
      type,
    }
  })
}