<template>
  <div class="list__content">
    <div v-if="users.length > 0"
         class="list__users">
      <div class="loader__mini" v-show="isLoading">
        <img :src="spinner" alt="">
      </div>
      <div class="list__item"
          :style="[canDelete ? {justifyContent: 'space-between'} : null]"
           v-for="user in props.users"
           :key="user.id"
      >
        <div class="list__avatar">
          <img :src="user.photo_50" alt="avatar">
        </div>
        <div class="list__name">{{user.name}}</div>
        <button v-show="canDelete" class="list__delete" :disabled="store.state.user.isFriendsLoading" @click="onUserDelete(user)"></button>
      </div>
    </div>
    <div class="list__empty" v-else-if="props.users.length == 0 && isLoading">
      <img :src="spinner" alt="">
    </div>
    <div class="list__empty" v-else-if="!isLoading">
        <div class="list__text">{{text}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IUserMini} from "@/types/types";
import {useStore} from "vuex";
import {useApi} from "@/hooks/useApi";
import spinner from '@/assets/spinner.svg'

interface Props {
  users: IUserMini[],
  text: string,
  canDelete: boolean,
  isLoading: boolean,
}

const props = defineProps<Props>();
const store = useStore();
const {getFriends} = useApi();

const onUserDelete = async (user) => {
  store.commit('user/deleteUser', user);
  const deletedUserFriends = await getFriends(user.id);
  await store.commit('user/deleteFriends', deletedUserFriends);
}

</script>

<style lang="scss">
.list{
  &__content{
    position: relative;
    padding: 5px 0px;
    border-radius: 5px;
    border: 1px solid rgb(0, 0, 0, 0.5);
    height: 20vw;
    width: 19vw;
    overflow: auto;
  }
  &__empty{
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2vw;
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
    align-items: center;
    font-size: 18px;
  }
  &__avatar{
    img{
      border-radius: 50%;
    }
    margin-right: 15px;
  }
  &__delete{
    width: 25px;
    height: 25px;
    background-image: url('@/assets/close.svg');
    background-size: contain;
    background-repeat: no-repeat;
  }
}

.loader__mini{
  margin: 0 auto;
  img{
    width: 50px;
    height: 50px;
  }
}
</style>
