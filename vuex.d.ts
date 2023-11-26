import { Store } from 'vuex'
import {IUserSearch} from "@/store/userModule";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<IUserSearch>
  }
}
