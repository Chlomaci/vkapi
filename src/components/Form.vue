<template>
    <div class="form__inputs">
      <div class="form__input">
        <h3 class="subtitle">
          Введите имя пользователя
        </h3>
        <v-autocomplete
          :items="store.getters['user/getAutoNames']"
          v-model="store.state.user.userName"
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
        <UserList :users="store.state.user.users" :text="'Добавьте пользователей'" :canDelete="true" :isLoading="store.state.user.isUserLoading"
                  :userNotFound="store.state.user.errors.userNotFound"/>
      </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useStore} from "vuex";
import UserList from '@/components/UserList';

const store = useStore();

const userId = computed({
  get: () => store.state["user/userId"],
  set: (value) => store.commit('user/setUserId', value)
})

</script>

<style lang="scss">

.subtitle{
  margin-bottom: 5px;
}
</style>
