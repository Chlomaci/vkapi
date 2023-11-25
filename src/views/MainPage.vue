<template>
  <div class="main">
    <a :href="link">
      Клик для получения токена
    </a>
    <div class="main__content">
      <div class="search__form">
        <Form/>
        <ButtonArea/>
        <Friends/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useApi} from "@/hooks/useApi";

import Friends from '@/components/Friends.vue'
import Form from '@/components/Form.vue'
import ButtonArea from "@/components/ButtonArea.vue";
import URL_REDIRECT from '@/config'

const link = `https://oauth.vk.com/authorize?client_id=51795832&display=page&redirect_uri=${URL_REDIRECT}&scope=friends&response_type=token&v=5.131&state=123456`

onMounted( async () => {
  const {getAccess} = useApi()
  await getAccess();
})

</script>

<style lang="scss">
.main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  a{
    color: black;
    text-decoration: none;
    text-align: center;
    &:hover{
      color: darkblue;
    }
  }
  &__content{
    display: flex;
    justify-content: space-between;
    width: 51vw;
  }
}

.search{
  &__form{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 55vw;
  }
}



</style>
