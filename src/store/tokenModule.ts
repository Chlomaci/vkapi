// import {defineStore} from "pinia";
//
// interface IToken {
//   access_token: string,
// }
//
// export const useTokenStore = defineStore('token', {
//   state: (): IToken => ({
//     access_token: ''
//   }),
//   getters: {
//   },
//   actions: {
//     setToken(token: string) {
//       this.access_token = token;
//     },
//   }
// })


interface IToken {
  access_token: string,
}

export const tokenModule = {
  state: (): IToken => ({
    access_token: ''
  }),
  getters: {
  },
  mutations: {
    setToken(state, token: string) {
      state.access_token = token;
    },
  },
  actions: {

  },
  namespaced: true
}

