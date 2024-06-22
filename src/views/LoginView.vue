<template>
  <nav-bar />
  <div class="flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Log In</h2>
      <form @submit.prevent>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            type="text"
            id="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600 focus:outline-none focus:bg-slate-600"
          @click="login"
        >
          Log In
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import { useToast } from "vue-toast-notification";
import { useCookies } from "vue3-cookies";
import "vue-toast-notification/dist/theme-default.css";
export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      email: "",
      password: "",
      responseStatus: "",
      toast: useToast(),
    };
  },
  created() {
    if (this.cookies.get("token")) {
      this.$router.push("/");
    }
  },
  methods: {
    login() {
      //  send credentials to the server
      fetch("http://chat-socketio.test/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      })
        .then((res) => {
          this.responseStatus = res.status;
          return res.json();
        })
        .then((data) => {
          switch (this.responseStatus) {
            case 200:
              this.cookies.set("token", data.token);
              this.cookies.set("user_id", data.user.id);
              this.toast.open({
                message: data.message,
                type: "success",
              });
              this.$router.push("/");
              break;
            case 401:
            case 422:
              this.toast.open({
                message: data.message,
                type: "error",
              });
              break;
            default:
              this.toast.open({
                message: data.message,
                type: "error",
              });
              break;
          }
        });
    },
  },
  components: {
    NavBar,
  },
};
</script>
