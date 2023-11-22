import { InjectionKey } from 'vue'
import {createStore, useStore as baseUseStore, Store} from "vuex";
import {tokenModule} from "@/store/tokenModule";
import {userModule} from "@/store/userModule";
import {friendsModule, IUserSearch} from "@/store/friendsModule";

export const key: InjectionKey<Store<IUserSearch>> = Symbol()

export default createStore({
    state: {
    } ,
    modules: {
      token: tokenModule,
      user: userModule,
      // friends: friendsModule,
    },
  }
)

// export function useStore () {
//   return baseUseStore(key)
// }
