import Vue from "vue";
import Vuex from "vuex";

import { user } from "./user";
import { event } from "./event";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    event
  }
});

export default store;
