import * as eventApi from "../services/event";

const state = {
  isRequesting: false,
  searchOpened: false,
  hasMore: true,
  isSearchEvents: false,
  channels: [],
  eventList: [],
  eventParticipants: [],
  eventLikes: [],
  hasMoreLikes: true,
  eventComments: [],
  hasMoreComment: true,
  eventDetail: {}
};

const mutations = {
  isRequesting(state, isRequesting) {
    state.isRequesting = isRequesting;
  },
  setHasMore(state, hasMore) {
    state.hasMore = hasMore;
  },
  setEvents(state, events = []) {
    state.eventList = events;
  },
  addEvents(state, events = []) {
    state.eventList = [...state.eventList, ...events];
  },
  setIsSearchEvents(state, isSearchEvents) {
    state.isSearchEvents = isSearchEvents;
  },
  toggleSearch(state) {
    state.searchOpened = !state.searchOpened;
  },
  setChannels(state, channels = []) {
    state.channels = channels;
  },
  setEventDetail(state, detail = {}) {
    state.eventDetail = detail;
  },
  toggleLike(state) {
    state.eventDetail.me_likes = !state.eventDetail.me_likes;
  },
  toggleGoing(state) {
    state.eventDetail.me_going = !state.eventDetail.me_going;
  },
  addLikes(state, likes = []) {
    state.eventLikes = [...state.eventLikes, ...likes];
  },
  setLikes(state, likes = []) {
    state.eventLikes = likes;
  },
  setParticipants(state, participants = []) {
    state.eventParticipants = participants;
  },
  setDetailGoing(state, going_count) {
    state.eventDetail = { ...state.eventDetail, going_count };
  },
  setDetailLikes(state, likes_count) {
    state.eventDetail = { ...state.eventDetail, likes_count };
  },
  setComments(state, comments = []) {
    state.eventComments = comments;
  },
  addComments(state, comments = []) {
    state.eventComments = [...state.eventComments, ...comments];
  },
  setHasMoreComment(state, hasMoreComment) {
    state.hasMoreComment = hasMoreComment;
  },
  setHasMoreLikes(state, hasMoreLikes) {
    state.hasMoreLikes = hasMoreLikes;
  }
};

const actions = {
  async fetchEventList({ commit }, { lazy = false, ...options }) {
    commit("isRequesting", true);
    try {
      const { events, hasMore } = await eventApi.getEvents(options);
      if (lazy) {
        commit("addEvents", events);
      } else {
        commit("setEvents", events);
      }
      commit("setHasMore", hasMore && events.length);
    } catch (error) {
      console.error("[fetchEventList] fetchEventList failed. ", error);
    } finally {
      commit("setIsSearchEvents", false);
      commit("isRequesting", false);
    }
  },
  async searchEvents({ commit }, { lazy = false, ...options }) {
    commit("isRequesting", true);
    try {
      const { events, hasMore } = await eventApi.getEvents(options);
      if (lazy) {
        commit("addEvents", events);
      } else {
        commit("setEvents", events);
      }
      commit("setHasMore", hasMore && events.length);
    } catch (error) {
      console.error("[searchEvents] searchEvents failed. ", error);
    } finally {
      commit("setIsSearchEvents", true);
      commit("isRequesting", false);
    }
  },
  async fetchChannels({ commit }) {
    commit("isRequesting", true);
    try {
      const { channels } = await eventApi.getChannels();

      commit("setChannels", channels);
    } catch (error) {
      console.error("[fetchChannels] fetchChannels failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async fetchEventDetail({ commit }, eventId) {
    commit("isRequesting", true);
    try {
      const { event } = await eventApi.getEventById(eventId);
      commit("setEventDetail", event);
    } catch (error) {
      console.error("[fetchEventDetail] fetchEventDetail failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async toggleLike({ commit }, eventId) {
    if (!state.eventDetail) {
      return;
    }
    commit("isRequesting", true);
    try {
      let action = "postLike";
      let likesChange = 1;
      if (state.eventDetail.me_likes) {
        action = "removeLike";
        likesChange = -1;
      }
      await eventApi[action](eventId);
      commit("toggleLike");
      commit("setDetailLikes", state.eventDetail.likes_count + likesChange);
    } catch (error) {
      console.error("[toggleLike] toggleLike failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async toggleGoing({ commit }, eventId) {
    if (!state.eventDetail) {
      return;
    }
    commit("isRequesting", true);
    try {
      let action = "participate";
      let goingChange = 1;
      if (state.eventDetail.me_going) {
        action = "cancelParticipation";
        goingChange = -1;
      }

      await eventApi[action](eventId);
      commit("toggleGoing");
      commit("setDetailGoing", state.eventDetail.going_count + goingChange);
    } catch (error) {
      console.error("[toggleGoing] toggleGoing failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async fetchEventParticipants({ commit }, eventId = state.eventDetail.id) {
    commit("isRequesting", true);
    try {
      const { users } = await eventApi.getEventParticipantsById(eventId);
      commit("setParticipants", users);
      commit("setDetailGoing", users.length);
    } catch (error) {
      console.error("[fetchParticipants] fetchParticipants failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async fetchEventLikes(
    { commit },
    { eventId = state.eventDetail.id, lazy = false, ...options }
  ) {
    commit("isRequesting", true);
    try {
      const { users, hasMore } = await eventApi.getEventLikesById(
        eventId,
        options
      );
      if (lazy && state.eventLikes.length) {
        commit("addLikes", users);
        commit("setDetailLikes", users.length + state.eventLikes.length);
      } else {
        commit("setLikes", users);
        commit("setDetailLikes", users.length);
      }
      commit("setHasMoreLikes", hasMore && users.length);
    } catch (error) {
      console.error("[fetchEventLikes] fetchEventLikes failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async fetchEventComments(
    { commit },
    { eventId = state.eventDetail.id, lazy = false, ...options }
  ) {
    commit("isRequesting", true);
    try {
      const { comments, hasMore } = await eventApi.getEventCommentsById(
        eventId,
        options
      );
      if (lazy) {
        commit("addComments", comments);
      } else {
        commit("setComments", comments);
      }
      commit("setHasMore", hasMore && comments.length);
    } catch (error) {
      console.error("[fetchEventComments] fetchEventComments failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  },
  async postComment({ commit }, { eventId, comment }) {
    commit("isRequesting", true);
    try {
      const commentObj = await eventApi.postComment(eventId, comment);
      commit("addComments", [commentObj]);
    } catch (error) {
      console.error("[postComment] postComment failed. ", error);
    } finally {
      commit("isRequesting", false);
    }
  }
};

export const event = {
  namespaced: true,
  state,
  actions,
  mutations
};
