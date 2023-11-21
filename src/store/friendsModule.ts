import {IUser, IUserMini} from "@/types/types";
import {useStore} from "vuex";

interface IFriends {
  friends: IUser[],
  isLoading: boolean,
}
const store = useStore()

export const friendsModule = {
  state: (): IFriends => ({
    friends: [],
    isLoading: false
  }),
  getters: {
  },
  mutations: {
    setFriend(state, props: IUserMini) {
      const isAlreadyExisting = store.state.user.users.find(item => item.id === props.id)
      if (isAlreadyExisting) {
        return
      } else {
        state.friends.push(props)
      }
    },
  },
  actions: {
  },
  namespaced: true
}
