<template>
  <form class="search__form" @submit.prevent="onSubmit">
    <div class="form__inputs">
      <div class="form__input">
        <h3 class="subtitle">
          Введите имя пользователя
        </h3>
        <v-autocomplete
          :items="store.getters['user/getAutoNames']"
          v-model="userName"
          :value="store.state.user.userName"
          class="search_name"
          base-color="#fff"
          item-title="name"
          item-value="name"
        >
          <template v-slot:item="{ props , item}">
            <v-list-item
              v-bind="props"
              :prepend-avatar="item?.raw?.photo_50"
              :title="item?.raw?.name"
            ></v-list-item>
          </template>
        </v-autocomplete>
      </div>

      <div class="form__input">
        <h3 class="subtitle">
          Введите user id или логин пользователя
        </h3>
        <v-text-field
          v-model="userId"
          :value="store.state.user.userId"
          clearable
          hide-details="auto"
        ></v-text-field>
      </div>

      <div class="list" >
        <h3 class="subtitle">
          Исходный
        </h3>
        <div class="list__content">
          <div v-if="store.state.user.users.length > 0"
                class="list__users">
            <div class="list__item"
              v-for="user in store.state.user.users"
              :key="user.id"
            >
              <div class="list__avatar">
                <img :src="user.photo_50" alt="avatar">
              </div>
              <div class="list__name">{{user.name}}</div>
              <button class="list__delete" :disabled="store.state.user.isFriendsLoading" @click="onUserDelete(user)"></button>
            </div>
          </div>
          <div class="list__empty" v-else>
            Добавьте пользователей
          </div>
        </div>

      </div>
    </div>


    <div class="search__btn">
      <div class="search__add">
        <v-btn variant="tonal" type="submit" width="100%" :disabled="store.state.user.isFriendsLoading">
          Добавить
        </v-btn>
        <div class="error" v-show="error.twoValues">Введите что-то одно</div>
        <div class="error" v-show="error.nullValues">Введите имя или id</div>
      </div>
      <v-btn variant="tonal" @click='onBuilding' :disabled="store.state.user.isFriendsLoading">
        Построить
      </v-btn>
    </div>
  </form>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {useApi} from "@/hooks/useApi";
import {chunkArray, getDuplicates, removeDuplicates} from "@/hooks/utilities";

const store = useStore();
const {onSetNewUser, getFriends} = useApi()

const onBuilding = async () => {
  store.commit('user/setFriendsLoading');
  await onGettingFriends();
  console.log('сделано');

}

const onGettingFriends = async () => {
  const allFriendsArrs = await Promise.all(store.state.user.users.map(async e => {
    return await getFriends(e.id)
  }))
  const allFriends = allFriendsArrs.flat()
  const {duplicates, duplicateIds} = getDuplicates(allFriends);
  const friends = removeDuplicates(allFriends, duplicateIds);
  console.log(friends)
  store.commit('user/setDuplicates', duplicates)

  const friendsChunked = chunkArray(friends, 5);
  Promise.all(friendsChunked.map(async (chunk, index) => {
    setTimeout(  async function () {
        await chunk.forEach(id => onSetNewUser(id, true))
      }, 3000 * (index + 1));
  })).then(() => console.log('bla'))

}

const onUserDelete = async (user) => {
  store.commit('user/deleteUser', user);
  const deletedUserFriends = await getFriends(user.id);
  await store.commit('user/deleteFriends', deletedUserFriends);
}

const error = ref({
  twoValues: false,
  nullValues: false,
})

const userName = computed({
  get: () => store.state["user/userName"],
  set: (value) => store.commit('user/setUserName', value)
})
const userId = computed({
  get: () => store.state["user/userId"],
  set: (value) => store.commit('user/setUserId', value)
})

function resetError() {
  error.value.twoValues = false;
  error.value.nullValues = false;
}

function isNullValues() {
  error.value.nullValues = true;
}

function isTwoValues() {
  error.value.twoValues = true;
}

const onSubmit = () => {
  resetError();
  if (store.state.user.userName && store.state.user.userId) {
    isTwoValues();
  } else if (!store.state.user.userName && !store.state.user.userId) {
    isNullValues();
  } else if (store.state.user.userId) {
    onSetNewUser(store.state.user.userId, false)
    store.commit('user/setUserId', '')
  } else if (store.state.user.userName){
    store.commit('user/setLoadedUser', store.state.user.userName);
    store.commit('user/setUserName', '')
  }
}
</script>

<style lang="scss">
.list{
  margin-top: 10px;
  height: 20vw;
  position: relative;
  &__content{
    border-radius: 5px;
    border: 1px solid rgb(0, 0, 0, 0.5);
    height: 90%;
    overflow: auto;
  }
  &__empty{
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: rgb(0, 0, 0, 0.5)
  }
  &__users{
    display: flex;
    flex-direction: column;
  }
  &__item{
    display: flex;
    width: 100%;
    padding: 5px 10px;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
  }
  &__avatar{
    img{
      border-radius: 50%;
    }
  }
  &__delete{
    width: 25px;
    height: 25px;
    background-image: url('@/assets/close.svg');
    background-size: contain;
    background-repeat: no-repeat;
  }
}
.search{
  &__form{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 29vw;
  }
  &__btn{
    display: flex;
    flex-direction: column;
  }
  &__add{
    margin-bottom: 10px;
  }
}

.error{
  color: red;
  margin-top: 5px;
  font-size: 83%;
}




</style>
