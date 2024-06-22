<template>
  <!-- Navbar -->
  <nav class="bg-slate-400 p-4 mb-5">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <!-- Navigation links -->
      <ul class="flex space-x-4">
        <!-- <li v-for="route in router" :key="route.name">
          <a
            :href="route.path"
            class="text-white hover:text-gray-600"
            v-if="checkAuth(route.name)"
            >{{ route.meta.title }}</a
          >
        </li> -->
        <li>
          <a href="/" class="text-white hover:text-gray-600">Home</a>
        </li>
        <li>
          <a href="/about" class="text-white hover:text-gray-600">About</a>
        </li>
        <li>
          <a
            href="/login"
            class="text-white hover:text-gray-600"
            v-if="checkAuth('login')"
            >Login</a
          >
        </li>
      </ul>
      <div class="flex items-center" v-if="auth">
        <img
          :src="user.avatar"
          alt="Profile Icon"
          class="w-8 h-8 rounded-full"
        />
        <span class="ml-2 font-semibold">{{ user.name }}</span>
      </div>
    </div>
  </nav>
</template>
<script>
import { useCookies } from "vue3-cookies";
export default {
  name: "NavBar",
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      router: this.$router.options.routes,
      auth: this.cookies.get("token") != null ? true : false,
      user: {},
    };
  },
  created() {
    if (this.auth) {
      // Fetch user data
      fetch(
        "http://chat-socketio.test/api/users/" + this.cookies.get("user_id")
      )
        .then((response) => response.json())
        .then((response) => {
          this.user = response.data;
        });
    }
  },
  methods: {
    checkAuth(routeName) {
      return this.cookies.get("token") && routeName === "login" ? false : true;
    },

    logout() {
      this.cookies.remove("token");
      this.$router.push({ name: "login" });
    },
  },
};
</script>
