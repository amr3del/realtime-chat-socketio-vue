import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ChatView from "@/views/ChatView.vue";
import LoginView from "@/views/LoginView.vue";
import About from "@/views/AboutView.vue";
import { useCookies } from "vue3-cookies";

const routes = [
  {
    name: "home",
    path: "/",
    component: HomeView,
    meta: {
      title: "Home",
    },
  },
  {
    name: "about",
    path: "/about",
    component: About,
    meta: {
      title: "About",
    },
  },
  {
    name: "chat",
    path: "/chat/:id",
    component: ChatView,
    meta: {
      title: "Chat",
    },
  },
  {
    name: "login",
    path: "/login",
    component: LoginView,
    meta: {
      title: "Login",
    },
  },
];

const { cookies } = useCookies();

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Chat App";
  if (to.name === "chat" && !cookies.get("token")) {
    return next({ name: "login" });
  }
  next();
});

export default router;
