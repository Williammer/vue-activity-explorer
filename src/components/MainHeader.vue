<template>
  <div class="main-header">
    <div v-if="canSearch" class="toggle-search" @click="toggleSearch"></div>
    <router-link v-else to="/">
      <div class="to-home"></div>
    </router-link>
    <div class="cat-logo-small"></div>
    <router-link to="/profile">
      <div class="avatar-logo" :style="{
        background: `url(${avatar}) center center no-repeat`,
        backgroundSize: 'cover'
      }" />
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.main-header {
  display: flex;
  width: 320px;
  height: 40px;
  background: #8560a9;
  justify-content: space-between;
  align-items: center;

  .to-home {
    background: transparent url("../assets/img/home.svg");
    width: 24px;
    height: 24px;
    margin-left: 16px;
  }
  .toggle-search {
    cursor: pointer;
    background: transparent url("../assets/img/search.svg");
    width: 24px;
    height: 24px;
    margin-left: 16px;
  }
  .cat-logo-small {
    background: transparent url("../assets/img/logo-cat.svg");
    width: 20.9px;
    height: 24px;
  }
  .avatar-logo {
    width: 24px;
    height: 24px;
    border-radius: 24px;
    margin-right: 14px;
  }
}
</style>

<script>
export default {
  name: "MainHeader",
  props: {
    avatar: String,
    canSearch: Boolean
  },
  methods: {
    toggleSearch() {
      this.$store.commit("event/toggleSearch");
    }
  }
};
</script>
