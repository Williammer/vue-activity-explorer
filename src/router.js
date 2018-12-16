import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "home" */ "./views/Home.vue")
    },
    {
      path: "/search",
      name: "search",
      component: () => import(/* webpackChunkName: "home" */ "./views/Home.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/profile",
      component: () =>
        import(/* webpackChunkName: "profile" */ "./views/UserProfile.vue"),
      children: [
        {
          path: ""
        },
        {
          path: "going"
        },
        {
          path: "past"
        }
      ]
    },
    {
      path: "/detail/:id",
      component: () =>
        import(/* webpackChunkName: "detail" */ "./views/EventDetails.vue"),
      children: [
        {
          path: "",
          components: {
            baseInfo: () =>
              import(/* webpackChunkName: "baseInfo" */ "./components/EventBrief.vue"),
            default: () =>
              import(/* webpackChunkName: "detailbody" */ "./components/EventDetailBody.vue")
          }
        },
        {
          path: "participants",
          components: {
            default: () =>
              import(/* webpackChunkName: "involvements" */ "./components/EventInvolvements.vue")
          }
        },
        {
          path: "comments",
          component: () =>
            import(/* webpackChunkName: "comments" */ "./components/EventComments.vue")
        }
      ]
    },
    // otherwise redirect to home
    {
      path: "*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");

  if (authRequired && !loggedIn) {
    return next("/login");
  }
  next();
});

export default router;
