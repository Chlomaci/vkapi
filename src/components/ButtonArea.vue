<template>
    <div class="search__btn">
      <div class="search__add">
        <v-btn variant="tonal" @click="onSubmit" width="100%" :disabled="store.state.user.isFriendsLoading">
          Добавить
        </v-btn>
        <div class="error" v-show="store.state.user.errors.twoValues">Введите что-то одно</div>
        <div class="error" v-show="store.state.user.errors.nullValues">Введите имя или id</div>
      </div>
      <div class="search__add">
        <v-btn variant="tonal" @click='onBuilding' width="100%" :disabled="store.state.user.isFriendsLoading">
          Построить
        </v-btn>
        <div class="error" v-show="store.state.user.errors.nullUsers">Выберите пользователей</div>
      </div>
      <div class="error" v-show="store.state.user.errors.nullAccess">Пожалуйста, сначала получите токен</div>
    </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import {useApi} from "@/hooks/useApi";
import {chunkArray, getDuplicates, promiseAllTimeout, removeDuplicates} from "@/hooks/utilities";

const store = useStore()
const {onSetNewUser, getFriends} = useApi()

const onBuilding = async () => {
  if (!store.state.token.access_token) {
    nullAccess();
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
    return await getFriends(e.id)
  }))
  const allFriends = allFriendsArrs.flat()
  const {duplicates, duplicateIds} = getDuplicates(allFriends);
  const friends = removeDuplicates(allFriends, duplicateIds);
  store.commit('user/setDuplicates', duplicates)

  const friendsChunked = chunkArray(friends, 5);
  const loadFriends = (chunk) => chunk.map((id) => onSetNewUser(id, { isFriend: true }));

  const loading = await new Promise((resolve, reject) => {
      friendsChunked.map((chunk, index) => {
        setTimeout(async function () {
          await Promise.all(loadFriends(chunk));
          resolve()
        }, 3000 * (index + 1));
      })
    }).then(() => {
      console.log('then');
      store.commit('user/setFriendsLoading') // <-- я честно пыталась, но оно не работает как надо. я долго пыталась. никак.
                                                  // (справедливости ради, во всех остальных местах статусы загрузки сменяются как надо)
    })
}

function resetError() {
  store.commit('user/resetErrors')
}

function isNullUsers(){
  store.commit('user/setNullUsersError');
}

function isNullValues() {
  store.commit('user/setNullValuesError');
}

function isTwoValues() {
  store.commit('user/setTwoValuesError');
}

function nullAccess() {
  store.commit('user/setNullAccessError');
}

const onSubmit = async () => {
  resetError();
  if (!store.state.token.access_token) {
    nullAccess();
  } else if (store.state.user.userName && store.state.user.userId) {
    isTwoValues();
  } else if (!store.state.user.userName && !store.state.user.userId) {
    isNullValues()
  } else if (store.state.user.userId) {
    store.commit('user/setUserLoading')
    await onSetNewUser(store.state.user.userId, {isAuto: false})
    store.commit('user/setUserLoading');
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
