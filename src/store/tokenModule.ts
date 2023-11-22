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

