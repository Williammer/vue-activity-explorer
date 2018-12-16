import * as userApi from "../services/user";
import router from "../router";

const initBaseState = {
  isRequesting: false,
  profile: {},
  userEvents: [],
  eventType: "",
  hasMore: true
};
const userInfo = JSON.parse(localStorage.getItem("user"));
const state = userInfo
  ? { ...initBaseState, status: { loggedIn: true }, user: userInfo }
  : { ...initBaseState, status: {}, user: null };

const mutations = {
  isRequesting(state, isRequesting) {
    state.isRequesting = isRequesting;
  },
  loginRequest(state, user) {
    state.status = { loggingIn: true };
    state.user = user;
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true };
    state.user = user;
  },
  loginFailure(state) {
    state.status = {};
    state.user = null;
  },
  logout(state) {
    state.status = {};
    state.user = null;
  },
  setProfile(state, profile = {}) {
    state.profile = profile;
  },
  setHasMore(state, hasMore) {
    state.hasMore = hasMore;
  },
  addUserEvents(state, events = []) {
    state.userEvents = [...state.userEvents, ...events];
  },
  setUserEvents(state, events = []) {
    state.userEvents = events;
  },
  setEventType(state, type = "") {
    state.eventType = type;
  }
};

const actions = {
  async signIn({ commit }, { username, password }) {
    commit("loginRequest", { username });

    try {
      const user = await userApi.signIn(username, password);
      commit("loginSuccess", user);
      router.push("/");
    } catch (error) {
      commit("loginFailure", error);
    }
  },
  async logout({ commit }) {
    await userApi.logout();
    commit("logout");
  },
  async fetchMyDetails({ commit }) {
    commit("isRequesting", true);
    try {
      const profile = await userApi.getMyDetails();
      commit("setProfile", profile);
    } catch (error) {
      console.error("[fetchMyDetails] fetchMyDetails failed: ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async fetchMyEvents({ commit }, { type, lazy = false, ...options }) {
    commit("isRequesting", true);
    try {
      const { events, hasMore } = await userApi.getMyEvents(type, options);
      if (lazy) {
        commit("addUserEvents", events);
      } else {
        commit("setUserEvents", events);
      }
      commit("setEventType", type);
      commit("setHasMore", hasMore && events.length > 0);
    } catch (error) {
      console.error("[fetchMyEvents] fetchMyEvents failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async fetchUserDetails({ commit }, userId) {
    commit("isRequesting", true);
    try {
      const profile = await userApi.getUserDetails(userId);
      commit("setProfile", profile);
    } catch (error) {
      console.error("[fetchUserDetails] fetchUserDetails failed: ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async fetchUserEvents(
    { commit },
    { userId, type, lazy = false, ...options }
  ) {
    commit("isRequesting", true);
    try {
      const { events, hasMore } = await userApi.getUserEvents(
        userId,
        type,
        options
      );
      if (lazy) {
        commit("addUserEvents", events);
      } else {
        commit("setUserEvents", events);
      }
      commit("setHasMore", hasMore && events.length > 0);
      commit("setEventType", type);
    } catch (error) {
      console.error("[fetchUserEvents] fetchUserEvents failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  }
};

export const user = {
  namespaced: true,
  state,
  actions,
  mutations
};
