<template>
  <div class="friends">
    <h3 class="subtitle">
      Друзья пользователей
    </h3>
    <div class="list__content">
        <div v-if="store.state.user.users.length > 0"
             class="list__users">
          <div class="list__item friend"
               v-for="user in store.state.user.friends"
               :key="user.id"
               :style="{ 'background-color': getCommonFriends(user)}"
               @click="() => {$router.push(`/user/${user.id}`)}"
          >
            <div class="list__avatar">
              <img :src="user.photo_50" alt="avatar">
            </div>
            <div class="list__data">
              <div class="list__name">{{user.name}}</div>
              <div class="list__sex"><b>Пол: </b> {{ (user.sex === 2) ? 'Мужской' : 'Женский' }}</div>
              <div class="list__age" v-show="user.bdate"><b>Возраст: </b>{{user.bdate}}</div>
              <div class="list__friends"><b>Друзья: </b>{{user.friends}}</div>
            </div>
          </div>
      </div>
      <div class="list__empty" v-else>
        <div class="list__text">Выберите пользователей слева</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";

const store = useStore()
const friends = store.getters['user/getSortedFriends'];

enum СommonCount {
  TWO = 2,
  THREE = 3,
  FOUR = 4,
}

function getCommonFriends(user) {
  switch (user.commonFriends) {
    case СommonCount.TWO:
      return "rgba(18,255,0,0.16)"
      break;
    case СommonCount.THREE:
      return"rgba(252,255,0,0.23)"
      break;
    case СommonCount.FOUR:
      return "rgba(255,119,0,0.29)"
      break;
    default:
      break;
  }
 if (user.commonFriends >= 5) {
   return"rgba(255,16,0,0.51)"
 }
}

</script>

<style lang="scss">
.list{
  .friends  &__content{
    width: 20vw;
    height: 28vw;
  }
  &__item.friend{
    display: grid;
    grid-template-columns: 20% 80%;
    cursor: pointer;
  }

  &__data{
    display: grid;
    grid-template-areas:
    "name name"
    "sex age"
    "friends .";
  }

  &__name{
    grid-area: name;
  }
  &__sex{
    grid-area: sex;
  }
  &__age{
    grid-area: age;
  }
  &__friends{
    grid-area: friends;
   }
}


</style>
