<template>
  <div class="main">
    <a href="https://oauth.vk.com/authorize?client_id=51795832&display=page&redirect_uri=http://localhost:3000/&scope=friends&response_type=token&v=5.131&state=123456">
      Клик для получения токена
    </a>
    <div class="main__content">
      <Form/>
      <Friends/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useApi} from "@/hooks/useApi";

import Friends from './Friends'
import Form from './Form'

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


</style>
