// import { setStore } from '@/util/store'
import { allFetchList, preFetchList, ectFetchList } from "@/api/icu/articleSummary/personalSummary";


const allArticle = {
   state: {
      all_article: [],
      per_article: [],
      ect_article: []
   },
   actions: {
      // 存储获取到的所有文章
      getAllArt({ commit }, row) {
         return new Promise((resolve, reject) => {
            allFetchList(row).then(response => {
               const data = response.data.data.records
               commit('SET_ALL_ARTICLE', data)
               resolve(data)
            }).catch(error => {
               reject(error)
            })
         })
      },
      // 获取个人文章
      getPerArticle({ commit }, row) {
         return new Promise((resolve, reject) => {
            preFetchList(row).then(response => {
               const data = response.data.data.records
               commit('SET_PRE_ARTICLE', data)
               resolve(data)
            }).catch(error => {
               reject(error)
            })
         })
      },
      // 获取收藏文章
      getEctArticle({ commit }, row) {
         return new Promise((resolve, reject) => {
            ectFetchList(row).then(response => {
               const data = response.data.data.records
               commit('SET_ECT_ARTICLE', data)
               resolve(data)
            }).catch(error => {
               reject(error)
            })
         })
      },
   },
   mutations: {
      SET_ALL_ARTICLE: (state, all_article) => {
         all_article.forEach(i => {
            state.all_article.push(i)
         })
      },
      SET_PRE_ARTICLE: (state, per_article) => {
         per_article.forEach(i => {
            state.per_article.push(i)
         })
      },
      SET_ECT_ARTICLE: (state, ect_article) => {
         ect_article.forEach(i => {
            state.ect_article.push(i)
         })
      },
      SET_CLEAR_ARTICLE: (state) => {
         state.all_article = []
         state.per_article = []
         state.ect_article = []
      }
   }

}
export default allArticle
