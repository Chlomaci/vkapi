<template>
  <div class="user__page">
    <router-link to="/">
      <v-btn class="exit__btn" variant="tonal">Назад</v-btn>
    </router-link>

    <div class="user__card">
      <div class="user__avatar"><img :src="user.photo_50" alt=""></div>
      <div class="user__name">{{user.name}}</div>
    </div>

    <div class="user">
      <div class="user__friends">
        <h3 class="subtitle">
          Друзья пользователя
        </h3>

        <UserList :users="store.state.user.userFriends" :text="'У пользователя нет друзей'" :canDelete="false" :isLoading="store.state.user.isUserFriendsLoading"/>
      </div>

      <div class="user__posts">
        <h3 class="subtitle">
          Посты на стене пользователя
        </h3>

        <div class="post">
          <div v-if="posts.length > 0"
               class="post__users">
            <div class="list__item"
                 v-for="post in posts"
                 :key="post.id"
                 v-show="post.text || post.repost"
            >
              <div class="post__title">
                <div class="list__avatar">
                  <img :src="user.photo_50" alt="avatar">
                </div>
                <div class="post__info">
                  <div class="post__name">{{user.name}}</div>
                  <div class="post__date">{{post.date}}</div>
                </div>
              </div>

              <div class="post__content" v-show="post.text">
                {{ post.text }}
              </div>
              <div class="post__content repost" v-show="post.repost">
                {{ post.repost }}
              </div>
            </div>
          </div>
          <div class="list__empty" v-else>
            <div v-if="store.state.user.isPostsLoading">
              <img  :src="spinner" alt="">
            </div>
            <div class="list__text" v-else>У пользователя нет постов</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserList from '@/components/UserList'
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {IUserMini} from "@/types/types";
import {useApi} from "@/hooks/useApi";
import {onMounted, onUnmounted} from "vue";
import spinner from '@/assets/spinner.svg'

const store = useStore()
const route = useRoute()

const user = store.state.user.friends.find((friend: IUserMini) => friend.id == `${route.params.id}`)
const posts = store.state.user.posts;
const {getFriends, onSetNewUser, getPosts} = useApi()

function checkFriends(id: string, users: IUserMini[]) {
  getFriends(id)
    .then((friends) => {
      const friendsArr = friends.split(",");
      const usersIds: string[] = users.map((e) => e.id);
      const friendsFromUsers = friendsArr.filter((id: string) =>
        usersIds.includes(id)
      );
      return onSetNewUser(friendsFromUsers, {isUserFriend: true});
    })
    .then(() => {
      store.commit('user/setUserFriendsLoading');
    })
    .catch((error) => {
      console.log(error)
    });
}
const loadUserData = async (id: string) => {
  await getPosts(id)
  await checkFriends(id, store.state.user.users);
}
loadUserData(user.id)

onMounted(() => {
  console.log('mounted')
  store.commit('user/setPostsLoading');
  store.commit('user/setUserFriendsLoading');
})

onUnmounted( () => {
  store.commit('user/resetUserFriends');
  store.commit('user/resetPosts')

  if (store.state.user.isUserFriendsLoading) {
    console.log('loading')
    store.commit('user/setUserFriendsLoading');
  }
})


</script>

<style lang="scss">
.exit__btn{
  margin-bottom: 10px;
}
.user{
  display: flex;
  width: 60vw;
  justify-content: space-between;
  &__page{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
  }
  &__card{
    display: flex;
    width: 100%;
    align-items: center;
    font-size: 1.5vw;
    padding: 5px 0px;
  }
  &__friends{
    position: relative;
  }
  &__avatar {
    margin-right: 10px;
    img{
      border-radius: 50%;
    }
  }
}

.post{
  height: 20vw;
  width: 30vw;
  overflow: auto;
  border: 1px rgb(0, 0, 0, 0.5) solid;
  position: relative;
  &__title {
    display: flex;
  }
  &__users .list__item{
    flex-direction: column;
    align-items: normal;
  }
  .repost{
    background-color: rgb(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 5px 10px;
  }
  .attachments{
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
