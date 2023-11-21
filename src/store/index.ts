import {createStore} from "vuex";
import {tokenModule} from "@/store/tokenModule";
import {userModule} from "@/store/userModule";
import {friendsModule} from "@/store/friendsModule";

export default createStore ({
    state: {
    },
    modules: {
      token: tokenModule,
      user: userModule,
      // friends: friendsModule,
    },
  }
)

