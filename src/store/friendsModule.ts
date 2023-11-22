import {IDuplicate, IUser, IUserMini} from "@/types/types";
import {useStore} from "vuex";

export interface IUserSearch{
  userName: string,
    userId: string | number,
    autocompleteUsers: IUser[],
    users: IUserMini[],
    friends: IUserMini[],
    duplicates: IDuplicate[],
    isFriendsLoading: boolean,
}
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
