import hyRequest from '../request'

export function getFavorList(){
  return hyRequest.get({
    url: "/favor/list"
  })
}

