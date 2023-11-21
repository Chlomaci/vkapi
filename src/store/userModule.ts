import {IDuplicate, IUser, IUserMini} from "@/types/types";


interface IUserSearch {
  userName: string,
  userId: string | number,
  autocompleteUsers: IUser[],
  users: IUserMini[],
  friends: IUserMini[],
  duplicates: IDuplicate[],
  isFriendsLoading: boolean,
}

export const userModule = {
  state: (): IUserSearch => ({
    userName: "",
    userId: "",
    autocompleteUsers: [],
    users: [],
    friends: [],
    duplicates: [],
    isFriendsLoading: false,
  }),
  getters: {
    getAutoNames: (state) => {
      return state.autocompleteUsers.map(e => {
        return ( {
            name: e.first_name + ' ' + e.last_name,
            photo_50: e.photo_50,
          }
        )
      })
    },
    getSortedFriends: (state) => {
       return state.friends.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        // если имена равны
        return 0;
      });
    }
  },
  mutations: {
    setAutoUsers(state, props: IUser) {
      state.autocompleteUsers.push(props);
    },
    setNewUser(state, props: IUserMini) {
      const isAlreadyExistingUser: IUserMini = state.users.find(item => item.id === props.id)
      if (isAlreadyExistingUser) {
        return
      } else if (props.isFriend) {
          const isAlreadyExistingFriend: number = state.friends.find(item => item.id === props.id);
          if (isAlreadyExistingFriend) {
            return
          } else {
            state.friends.push(props);
          }
      } else {
        const {name, photo_50, id} = props;
        state.users.unshift({name, photo_50, id});
      }
    },
    setLoadedUser: (state, userName: string) => {
        const addedUser: IUser = state.autocompleteUsers.find((item) => {
          const name = item.first_name + " " + item.last_name;
          return name === userName;
        });
        const isAlreadyExisting = state.users.find(item => item.id === addedUser.id)
        if (isAlreadyExisting) {
          return
        } else {
          const addedUserName = addedUser.first_name + ' ' + addedUser.last_name;
          state.users.unshift({name: addedUserName, id: addedUser.id, photo_50: addedUser.photo_50})
        }
    },
    setUserName(state, payload: string) {
      state.userName = payload;
    },
    setUserId(state, payload: string) {
      state.userId = payload;
    },
    setFriendsLoading(state) {
      state.isFriendsLoading = !state.isFriendsLoading;
    },
    setDuplicates(state, payload: IDuplicate[]){
      state.duplicates = payload;
    },
    deleteUser(state, payload: IUserMini) {
      state.users = state.users.filter(user => user !== payload)
    },
    deleteFriends(state, payload: number[]){
      payload.forEach(friend => {
        state.users = state.users.filter(friend => friend.id !== payload)
      })
    }

  },
  actions: {
  },
  namespaced: true
}
