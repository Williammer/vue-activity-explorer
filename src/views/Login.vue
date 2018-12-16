<template>
    <div class="container">
        <form @submit.prevent="handleSubmit">
            <div class="upper-area">
              <p class="title-sub">FIND THE MOST LOVED ACTIVITIES</p>
              <p class="title-main">BLACK CAT</p>
              <div class="logo">
                <svg width="100%" height="100%" version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                  <circle cx="32" cy="32" r="32" stroke="#D5EF7F" stroke-width="1" fill="transparent" />
                  <image class="logo-cat" x="6" y="6" width="46" height="46" xlink:href="../assets/img/logo-cat.svg" />
                </svg>
              </div>
              <div class="inputs-area">
                <div class="form-group">
                    <div class="login-icons username"></div>
                    <input type="text" v-model="username" name="username" class="form-control" autocomplete="off" placeholder="Username" />
                </div>
                <div class="form-group">
                    <div class="login-icons password"></div>
                    <input type="password" v-model="password" name="password" class="form-control" autocomplete="off" placeholder="Password" />
                </div>
              </div>
            </div>
            <div class="form-group">
                <button class="submit-btn" :disabled="status.loggingIn">SIGN IN</button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.container {
  width: 320px;
  height: 572px;
  font-size: 16px;

  .upper-area {
    height: 506px;
    background: -moz-linear-gradient(
        0,
        rgba(133, 96, 169, 0.8),
        rgba(133, 96, 169, 0.7)
      ),
      url("../assets/img/login-bg.jpg") center center no-repeat;
    background: -webkit-gradient(
        0,
        rgba(133, 96, 169, 0.8),
        rgba(133, 96, 169, 0.7)
      ),
      url("../assets/img/login-bg.jpg") center center no-repeat;
    background: -webkit-linear-gradient(
        0,
        rgba(133, 96, 169, 0.8),
        rgba(133, 96, 169, 0.7)
      ),
      url("../assets/img/login-bg.jpg") center center no-repeat;
    background: linear-gradient(
        0,
        rgba(133, 96, 169, 0.8),
        rgba(133, 96, 169, 0.7)
      ),
      url("../assets/img/login-bg.jpg") center center no-repeat;
    background-size: cover;

    .title-sub {
      position: absolute;
      left: 43px;
      top: 69px;
      color: #d5ef7f;
      text-align: center;
    }
    .title-main {
      position: absolute;
      top: 105px;
      left: 103px;
      font-size: 24px;
      font-weight: bold;
      color: #d5ef7f;
      text-align: center;
    }
    .logo {
      position: absolute;
      left: 128px;
      top: 183px;
      width: 64px;
      height: 64px;
      .logo-cat {
      }
    }
    .inputs-area {
      position: absolute;
      top: 355px;
      left: 40px;

      .form-group {
        width: 240px;
        height: 40px;
        margin-bottom: 16px;
        position: relative;

        .form-control {
          position: absolute;
          width: 206px;
          height: 100%;
          font-size: 16px;
          font-weight: lighter;
          color: #ac8ec9 !important;
          border: none;
          background: transparent;
          border: 1px solid #d3c1e5;
          border-radius: 20px;
          padding-left: 34px;
          &:focus {
            color: #453257 !important;
            background: rgba(255, 255, 255, 0.2);
          }
          &::placeholder {
            color: #ac8ec9;
          }
        }
        .login-icons {
          position: absolute;
          left: 10px;
          top: 16px;
          &.username {
            width: 14px;
            height: 15px;
            background: transparent url("../assets/img/user.svg");
          }
          &.password {
            position: absolute;
            width: 16px;
            height: 16px;
            background: transparent url("../assets/img/password.svg");
          }
        }
      }
    }
  }
  .submit-btn {
    height: 64px;
    width: 320px;
    background-color: #d5ef7f;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    color: #453257;
  }
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import { resetLoginSession } from "../utils";

export default {
  data() {
    return {
      username: "aaaaa",
      // password: "",
      password: "123456",
      submitted: false
    };
  },
  computed: {
    ...mapState("user", ["status"])
  },
  created() {
    resetLoginSession();
  },
  methods: {
    ...mapActions("user", ["signIn"]),
    handleSubmit() {
      this.submitted = true;
      const { username, password } = this;
      if (username && password) {
        this.signIn({ username, password });
      }
    }
  }
};
</script>
