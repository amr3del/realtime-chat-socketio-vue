<template>
  <nav-bar />
  <div>
    <h1 class="text-6xl">Chat</h1>
    <p>Chat with your friends {{ user.name }}</p>
  </div>
  <chat :reciver_id="reciver" />
</template>
<script>
import { useCookies } from "vue3-cookies";
import NavBar from "@/components/NavBar.vue";
import Chat from "@/components/ChatComponent.vue";
export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      user: {},
      reciver: parseInt(this.$route.params.id),
    };
  },
  beforeCreate() {
    if (this.cookies.get("user_id") == this.reciver) {
      this.$router.push({ name: "home" });
    }
  },
  created() {
    // Fetch user data
    fetch("http://chat-socketio.test/api/users/" + this.reciver)
      .then((response) => response.json())
      .then((response) => {
        this.user = response.data;
      });
  },
  unmounted() {
    this.socket.disconnect();
  },
  components: {
    Chat,
    NavBar,
  },
};
</script>
