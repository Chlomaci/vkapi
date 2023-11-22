import { Store } from 'vuex'
import {IUserSearch} from "@/store/friendsModule";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<IUserSearch>
  }
}
