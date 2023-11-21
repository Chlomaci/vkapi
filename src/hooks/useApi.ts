import {IUser, IUserMini} from "@/types/types";
import {useStore} from "vuex";
import {checkDuplicate, getAge} from "@/hooks/utilities";


export function useApi() {

  const store = useStore()
  const fields = "photo_50, sex, counters, bdate"



  function getAccess() {
    const url: URL = new URL(document.location)
    console.log(`url is ${url}`)
    if (url.toString().length > 'http://localhost:3000/'.length) {
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

  async function onGetAutoUsers(offset: number = 0){
    return await fetch(`https://api.vk.com/method/users.search?access_token=${store.state.token.access_token}&offset=${offset}&count=100&fields=${fields}&v=5.131`)
      .then(resp => resp.json())
      .then(data => {
        let userData: IUser;
        data.response.items.map((e: IUser) => {
          userData = {
            first_name: e.first_name,
            last_name: e.last_name,
            id: e.id,
            photo_50: e.photo_50,
            sex: e.sex,
          }
          store.commit('user/setAutoUsers', userData);
        })
      })
      .catch(e => console.log(e))
  }

  async function onSetNewUser(id: string | number, isFriend = false) {
    return await fetch(`https://api.vk.com/method/users.get?user_ids=${id}&access_token=${store.state.token.access_token}&fields=${fields}&v=5.131`)
      .then(resp => resp.json())
      .then(data => {
          const userData: IUser = data.response[0];
          const commonFriends = checkDuplicate(store.state.user.duplicates, userData.id.toString())
          const name: string = userData.first_name + ' ' + userData.last_name;
          const props: IUserMini = {
            name: name,
            photo_50: userData.photo_50,
            id: userData.id,
            sex:userData.sex,
            bdate:  userData.bdate ? getAge(userData.bdate.split(".")) : null,
            isFriend: isFriend,
            friends: userData.counters?.friends,
            commonFriends: commonFriends,
          }
          store.commit('user/setNewUser', props)

      }).catch(e => {
          console.log(e)
      })
  }

  async function getFriends(id: number) {
    return await fetch(`https://api.vk.com/method/friends.get?user_id=${id}&order=name&access_token=${store.state.token.access_token}&fields=${fields}&v=5.131`)
      .then(resp => resp.json())
      .then(data => {
        const friendsData = data.response.items;
        const friendsId = friendsData.map(e => (e.id));

        return friendsId
      }).catch(e => console.log(e))
  }

  return {getAccess, onSetNewUser, getFriends}
}
