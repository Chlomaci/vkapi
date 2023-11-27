<template>
    <div class="search__btn">
      <div class="search__add">
        <v-btn variant="tonal" @click="onSubmit" width="100%" :disabled="store.state.user.isFriendsLoading">
          Добавить
        </v-btn>
        <div class="error" v-show="twoValues">Введите что-то одно</div>
        <div class="error" v-show="nullValues">Введите имя или id</div>
        <div class="error" v-show="store.state.user.errors.userNotFound">Пользователь не найден</div>
      </div>
      <div class="search__add">
        <v-btn variant="tonal" @click='onBuilding' width="100%" :disabled="store.state.user.isFriendsLoading">
          Построить
        </v-btn>
        <div class="error" v-show="nullUsers">Выберите пользователей</div>
      </div>
      <div class="error" v-show="nullAccess">Пожалуйста, сначала получите токен</div>
      <div class="error" v-show="privateFriends">Друзья скрыты</div>
    </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import {useApi} from "@/hooks/useApi";
import {chunkArray, getDuplicates, removeDuplicates} from "@/hooks/utilities";
import {ref} from "vue";

const store = useStore()
const {onSetNewUser, getFriends} = useApi()

const privateFriends = ref(false)
const nullValues = ref(false)
const twoValues = ref(false)
const nullUsers = ref (false)
const nullAccess = ref(false)

const onBuilding = async () => {
  if (!store.state.token.access_token) {
    isNullAccess();
    return
  } else if (!store.state.user.users.length > 0) {
    isNullUsers();
    return
  }
  resetError()
  store.commit('user/setFriendsLoading');
  await onGettingFriends();
}

const onGettingFriends = async () => {
  const allFriendsArrs = await Promise.all(store.state.user.users.map(async e => {
    return await getFriends(e.id).then(friends => friends.split(","))
  }))
  console.log(allFriendsArrs)
  if (allFriendsArrs.length !== 1 && allFriendsArrs[0] !== ''){
    const allFriends = allFriendsArrs.flat()
    const {duplicates, duplicateIds} = getDuplicates(allFriends);
    const friends = removeDuplicates(allFriends, duplicateIds);
    store.commit('user/setDuplicates', duplicates)
    const friendsChunked = chunkArray(friends, 5);
    const loadFriends = (chunk) => chunk.map((id) => onSetNewUser(id, { isFriend: true }));

    const loading = await new Promise((resolve, reject) => {
      const friendPromises = friendsChunked.map((chunk, index) => {
        return new Promise(async function (resolve) {
          setTimeout(async function () {
            await Promise.all(loadFriends(chunk));
            resolve();
          }, 3000 * (index + 1));
        });
      });

      Promise.all(friendPromises)
        .then(() => {
          store.commit('user/setFriendsLoading');
          resolve();
        })
        .catch(reject);
    });
  } else {
    console.log('durov')
    privateFriends.value = true;
    store.commit('user/setFriendsLoading');
    return
  }
}

function resetError() {
  store.commit('user/resetErrors')
  nullAccess.value = false
  nullUsers.value = false
  nullValues.value = false
  twoValues.value = false
  privateFriends.value = false
}

function isNullUsers(){
  nullUsers.value = true
}

function isNullValues() {
  nullValues.value = true
}

function isTwoValues() {
  twoValues.value = true
}

function isNullAccess() {
  nullAccess.value = true
}


const onSubmit = async () => {
  resetError();
  if (!store.state.token.access_token) {
    isNullAccess();
  } else if (store.state.user.userName && store.state.user.userId) {
    isTwoValues();
  } else if (!store.state.user.userName && !store.state.user.userId) {
    isNullValues()
  } else if (store.state.user.userId) {
    store.commit('user/setUserLoading')
    await onSetNewUser(store.state.user.userId, {isNewUser: true})
    store.commit('user/setUserId', '')
  } else if (store.state.user.userName){
    await store.commit('user/setLoadedUser', store.state.user.userName);
    store.commit('user/setUserName', '')
  }
}
</script>

<style lang="scss">
.search{
  &__btn{
    display: flex;
    flex-direction: column;
    width: 7vw;
  }
  &__add{
    margin-bottom: 10px;
  }
}

.error{
  color: red;
  margin-top: 5px;
  font-size: 83%;
  text-align: center;
}
</style>
