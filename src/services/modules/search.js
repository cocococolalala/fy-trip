import hyRequest from '../request'

//顶部搜索
export function getSearchTop() {
  return hyRequest.get({
    url : 'search/top'
  })
}

//搜索内容
export function getSearchResult() {
  return hyRequest.get({
    url : "search/result"
  })
}