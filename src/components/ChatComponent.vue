<template>
  <div class="container mx-auto px-4 w-3/4 my-3">
    <div class="border-solid border-2 rounded-md">
      <!-- Chat messages -->
      <div class="px-4 py-6 space-y-4">
        <div
          :class="message.class"
          v-for="message in messages"
          :key="message.id"
        >
          <div class="flex flex-col items-end">
            <span class="text-sm text-gray-600">{{ message.sender.name }}</span>
            <div class="flex items-center mt-1">
              <img
                :src="message.sender.avatar"
                alt="John's Avatar"
                class="h-8 w-8 rounded-full"
              />
              <div class="bg-blue-500 text-white max-w-xs rounded-lg p-3 ml-2">
                <p class="text-sm">{{ message.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Chat input -->
      <form @submit.prevent>
        <div class="px-4 py-3 flex items-center border-t border-gray-300">
          <input
            type="text"
            placeholder="Type your message..."
            class="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
            v-model="msg"
          />
          <button
            class="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full focus:outline-none"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import io from "socket.io-client";
import { useCookies } from "vue3-cookies";
export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  props: {
    reciver_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      socket: null,
      sender_id: this.cookies.get("user_id"),
      messages: [],
      msg: "",
    };
  },
  created() {
    // Fetch messages
    fetch(
      "http://chat-socketio.test/api/messages?reciver_id=" + this.reciver_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.cookies.get("token"),
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        this.messages = response.data.map((message) => ({
          ...message,
          class: message.is_sender
            ? "flex justify-start items-start"
            : "flex justify-end items-start",
        }));
      });
    this.socket = io("http://localhost:3000", {
      transports: ["websocket"],
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      },
    });
    this.socket.on("connect", () => {
      console.log("connected");
    });
    this.socket.on(
      `chat:sendMessage:${this.sender_id}:${this.reciver_id}`,
      (data) => {
        this.messages.push({
          message: data.message,
          sender: data.sender,
          class: "flex justify-start items-start",
        });
      }
    );
    this.socket.on(
      `chat:sendMessage:${this.reciver_id}:${this.sender_id}`,
      (data) => {
        this.messages.push({
          message: data.message,
          sender: data.sender,
          class: "flex justify-end items-start",
        });
      }
    );
  },
  methods: {
    sendMessage() {
      // Send message to the server
      fetch("http://chat-socketio.test/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.cookies.get("token"),
        },
        body: JSON.stringify({
          reciver_id: this.reciver_id,
          message: this.msg,
        }),
      }).then((response) => {
        response.json();
      });
      // Clear the input field
      this.msg = "";
    },
  },
  unmounted() {
    this.socket.disconnect();
  },
};
</script>
