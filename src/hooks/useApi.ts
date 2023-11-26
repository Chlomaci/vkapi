import {IPostData, IUser, IUserMini} from "@/types/types";
import {useStore} from "vuex";
import {checkDuplicate, getAge} from "@/hooks/utilities";
import URL_REDIRECT from '@/config'
import {callVKAPI} from "@/api";


export function useApi() {

  const store = useStore()
  const fields = "photo_50, sex, counters, bdate"

  interface data {
    response: IUser[]
  }


  function getAccess() {
    const url: URL = new URL(document.location)
    if (url.toString().length > URL_REDIRECT.length) {
      const token: string = url.hash
        .split('&')
        .filter(function(el: string) { if(el.match('access_token') !== null) return true; })[0]
        .split('=')[1];

      store.commit('token/setToken', token)
      onGetAutoUsers()
    } else {
      return
    }
  }

  async function onGetAutoUsers() {
    const friends = await getFriends()
    onSetNewUser(friends, {isAuto: true})
  }

  // async function getFriends(id: number | string = '') {
  //   return new Promise(resolve => {
  //     VK.Api.call('friends.get', {
  //       access_token: store.state.token.access_token,
  //       fields: fields,
  //       user_id: id,
  //       order: 'name',
  //       v: 5.131,
  //     }, function (r) {
  //       if (r.response) {
  //         const friendsData = r.response.items;
  //         const friendsId: string = friendsData.map(e => (e.id)).join();
  //         resolve(friendsId)
  //       }
  //     })
  //   })
  // }
  //
  async function getFriends(id: number | string = ''){
    return callVKAPI('friends.get', {
      access_token: store.state.token.access_token,
      fields: fields,
      user_id: id,
      order: 'name',
      v: 5.131,
    }, function (r) {
      if (r.response) {
        const friendsData = r.response.items;
        const friendsId: string = friendsData.map(e => (e.id)).join();
        return friendsId
      }
    })
  }

  async function onSetNewUser(id: string | number | number[], params: {isAuto?: boolean,  isFriend?: boolean, isUserFriend?: boolean, isNewUser?: boolean},) {
    return await VK.Api.call('users.get', {
      access_token: store.state.token.access_token,
      fields: fields,
      user_ids: id,
      v: 5.131,
    }, function (r) {
      if (r.response.length > 0) {
        const userData: IUser[] = r.response;
        userData.map(user => {
          const commonFriends = checkDuplicate(store.state.user.duplicates, user.id.toString())
          const name: string = user.first_name + ' ' + user.last_name;
          const props: IUserMini = {
            name: name,
            photo_50: user.photo_50,
            id: user.id.toString(),
            sex: user.sex,
            bdate: user.bdate ? getAge(user.bdate.split(".")) : null,
            friends: user.counters?.friends,
            commonFriends: commonFriends,
          }
          if (params.isAuto) {
            store.commit('user/setAutoUsers', props)
          } else if (params.isFriend && store.state.user.users.length > 0) {
            store.commit('user/setFriends', props)
          } else if (params.isUserFriend) {
            store.commit('user/setUserFriends', props)
            store.commit('user/setUserFriendsLoading');
          } else if (params.isNewUser) {
            store.commit('user/setNewUser', props)
            store.commit('user/setUserLoading');
          }
        })
      } else {
        store.commit('user/setUserNotFoundError')
        if (store.state.user.isUserLoading) {
          store.commit('user/setUserLoading');
        }
      }
    })
  }

  async function getPosts(id: number | string) {
    return await VK.Api.call('wall.get', {
      access_token: store.state.token.access_token,
      owner_id: id,
      count: 50,
      fields: fields,
      v: 5.131,
    }, function (r) {
      if (r.response){
        const posts: IPostData[] = r.response.items;
              posts.map(e => {
                store.commit('user/setPosts', {
                  date: e.date,
                  name: e.from_id,
                  id: e.id,
                  text: e.text,
                  copy_history: e.copy_history,
                })
      })
        store.commit('user/setPostsLoading');
      }
    })
  }

  return {getAccess, onSetNewUser, getFriends, getPosts}
}
