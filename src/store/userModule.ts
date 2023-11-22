import {IDuplicate, IPost, IPostData, IUser, IUserMini} from "@/types/types";

interface errors {
  twoValues: boolean,
  nullValues: boolean,
  nullUsers: boolean,
  nullAccess: boolean,
}

interface IUserSearch {
  userName: string,
  userId: string | number,
  autocompleteUsers: IUser[],
  users: IUserMini[],
  friends: IUserMini[],
  duplicates: IDuplicate[],
  userFriends: IUserMini[],
  isFriendsLoading: boolean,
  isUserFriendsLoading: boolean,
  posts: IPost[]
  errors: errors;
}


export const userModule = {
  state: (): IUserSearch => ({
    userName: "",
    userId: "",
    autocompleteUsers: [],
    users: [],
    friends: [],
    duplicates: [],
    userFriends: [],
    isFriendsLoading: false,
    isUserFriendsLoading: false,
    posts: [],
    errors: {
      twoValues: false,
      nullValues: false,
      nullUsers: false,
      nullAccess: false,
    }
  }),
  getters: {
    getAutoNames: (state) => {
      return state.autocompleteUsers.map(e => {
        return ( {
            name: e.name,
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
        return 0;
      });
    }
  },
  mutations: {
    setAutoUsers(state, payload: IUser) {
      state.autocompleteUsers.push(payload);
    },
    setNewUser(state, payload: IUserMini) {
      const isAlreadyExistingUser: IUserMini = state.users.find(item => item.id === payload.id)
      if (isAlreadyExistingUser) {
        return
      } else if (payload.isFriend) {
          const isAlreadyExistingFriend: number = state.friends.find(item => item.id === payload.id);
          if (isAlreadyExistingFriend) {
            return
          } else {
            state.friends.push(payload);
          }
      } else {
        const {name, photo_50, id} = payload;
        state.users.unshift({name, photo_50, id});
      }
    },
    setFriends(state, payload: IUserMini) {
      const isAlreadyExistingFriend: number = state.friends.find(item => item.id === payload.id);
      if (isAlreadyExistingFriend) {
        return
      } else {
        state.friends.push(payload);
      }
    },
    setLoadedUser: (state, userName: string) => {
        const addedUser: IUserMini = state.autocompleteUsers.find((item) => {
          return item.name === userName;
        });
        const isAlreadyExisting = state.users.find(item => item.id === addedUser.id)
        if (isAlreadyExisting) {
          return
        } else {
          state.users.unshift({name: addedUser.name, id: addedUser.id, photo_50: addedUser.photo_50})
        }
    },
    setUserFriends(state, payload: IUserMini){
      state.userFriends.push(payload)
    },
    setUserName(state, payload: string) {
      state.userName = payload;
    },
    setUserId(state, payload: string) {
      state.userId = payload;
    },
    setPosts(state, payload: IPostData){
      state.posts.push({
        id: payload.id,
        name: payload.from_id,
        date: new Date(payload.date * 1000).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        text: payload.text,
        repost: payload.copy_history ? payload.copy_history[0]?.text : undefined,
      })
    },
    setFriendsLoading(state) {
      state.isFriendsLoading = !state.isFriendsLoading;
    },
    setUserFriendsLoading(state){
      state.isUserFriendsLoading = !state.isUserFriendsLoading;
    },
    setDuplicates(state, payload: IDuplicate[]){
      state.duplicates = payload;
    },
    setTwoValuesError(state) {
      state.errors.twoValues = true;
    },
    setNullValuesError(state) {
      state.errors.nullValues = true;
    },
    setNullUsersError(state) {
      state.errors.nullUsers = true;
    },
    setNullAccessError(state) {
      state.errors.nullAccess = true;
    },
    resetErrors(state) {
      state.errors = {
        twoValues: false,
        nullValues: false,
        nullUsers: false,
        nullAccess: false,
      }
    },
    resetPosts(state){
      state.posts = []
    },
    deleteUser(state, payload: IUserMini) {
      state.users = state.users.filter(user => user !== payload)
    },
    deleteFriends(state, payload: number[]){
      payload.forEach(friend => {
        state.users = state.users.filter(friend => friend.id !== payload)
      })
    },
    resetUserFriends(state) {
      state.userFriends = []
    }

  },
  actions: {
  },
  namespaced: true
}
