<template>
  <nav-bar />
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <users-component-vue :users="users" />
  </div>
</template>

<script>
import UsersComponentVue from "@/components/UsersComponent.vue";
import { useCookies } from "vue3-cookies";
import NavBar from "@/components/NavBar.vue";
export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      users: [],
    };
  },
  created() {
    fetch("http://chat-socketio.test/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.cookies.get("token"),
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.users = response.data;
      });
  },
  components: {
    UsersComponentVue,
    NavBar,
  },
};
</script>
