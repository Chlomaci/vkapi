import {IPostData, IPostResponse, IUser, IUserMini} from "@/types/types";
import {useStore} from "vuex";
import {checkDuplicate, getAge} from "@/hooks/utilities";
import URL_REDIRECT from '@/config'


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

   function onGetAutoUsers() {
    const friends: string = getFriends();
    onSetNewUser(friends, {isAuto: true});
  }

  // async function onSetNewUser(id: string | number | number[], params: {isAuto?: boolean,  isFriend?: boolean, isUserFriend?: boolean},) {
  //   return await fetch(`https://api.vk.com/method/users.get?user_ids=${id}&access_token=${store.state.token.access_token}&fields=${fields}&v=5.131`)
  //     .then(resp => resp.json())
  //     .then((data: data) => {
  //       const userData: IUser[] = data.response;
  //       userData.map(user => {
  //         const commonFriends = checkDuplicate(store.state.user.duplicates, user.id.toString())
  //         const name: string = user.first_name + ' ' + user.last_name;
  //         const props: IUserMini = {
  //           name: name,
  //           photo_50: user.photo_50,
  //           id: user.id,
  //           sex:user.sex,
  //           bdate:  user.bdate ? getAge(user.bdate.split(".")) : null,
  //           friends: user.counters?.friends,
  //           commonFriends: commonFriends,
  //         }
  //         if (params.isAuto) {
  //           store.commit('user/setAutoUsers', props)
  //         } else if (params.isFriend){
  //           store.commit('user/setFriends', props)
  //         } else if (params.isUserFriend){
  //           store.commit('user/setUserFriends', props)
  //         } else {
  //           store.commit('user/setNewUser', props)
  //         }
  //
  //       })
  //
  //     }).catch(e => {
  //         console.log(e)
  //     })
  // }

  async function onSetNewUser(id: string | number | number[], params: {isAuto?: boolean,  isFriend?: boolean, isUserFriend?: boolean},) {
    return await VK.Api.call('users.get', {
      access_token: store.state.token.access_token,
      fields: fields,
      user_ids: id,
      v: 5.131,
    }, function (r) {
      if (r.response) {
        const userData: IUser[] = r.response;
        console.log(userData)
        userData.map(user => {
          const commonFriends = checkDuplicate(store.state.user.duplicates, user.id.toString())
          const name: string = user.first_name + ' ' + user.last_name;
          const props: IUserMini = {
            name: name,
            photo_50: user.photo_50,
            id: user.id,
            sex: user.sex,
            bdate: user.bdate ? getAge(user.bdate.split(".")) : null,
            friends: user.counters?.friends,
            commonFriends: commonFriends,
          }
          if (params.isAuto) {
            store.commit('user/setAutoUsers', props)
          } else if (params.isFriend) {
            store.commit('user/setFriends', props)
          } else if (params.isUserFriend) {
            store.commit('user/setUserFriends', props)
          } else {
            store.commit('user/setNewUser', props)
          }

          console.log(store.state.user.autocompleteUsers)
        })
      }
    })
  }

  // async function getFriends(id: number | string = '') {
  //   return await fetch(`https://api.vk.com/method/friends.get?user_id=${id}&order=name&access_token=${store.state.token.access_token}&fields=${fields}&v=5.131`)
  //     .then(resp => resp.json())
  //     .then((data) => {
  //       const friendsData = data.response.items;
  //       const friendsId: number[] = friendsData.map(e => (e.id));
  //       return friendsId
  //     }).catch(e => console.log(e))
  // }

  async function getFriends(id: number | string = '') {
    let friendsId = await VK.Api.call('friends.get', {
      access_token: store.state.token.access_token,
      fields: fields,
      user_id: id,
      order: 'name',
      v: 5.131,
    }, function (r) {
      if (r.response) {
        const friendsData = r.response.items;
        const friendsId: string = friendsData.map(e => (e.id)).join();
        console.log(friendsId)
        return friendsId
      }
    })
    return friendsId;
  }


  async function getPosts(id: number | string) {
    return await fetch(`https://api.vk.com/method/wall.get?owner_id=${id}&count=50&access_token=${store.state.token.access_token}&fields=${fields}&v=5.131`)
      .then(resp => resp.json())
      .then((data: IPostResponse) => {
        const posts: IPostData[] = data.response.items;
        posts.map(e => {
          store.commit('user/setPosts', {
            date: e.date,
            name: e.from_id,
            id: e.id,
            text: e.text,
            copy_history: e.copy_history,
          })
        })
      }).catch(e => console.log(e))
  }

  return {getAccess, onSetNewUser, getFriends, getPosts}
}
