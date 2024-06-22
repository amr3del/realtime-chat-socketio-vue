<template>
  <div class="container mx-auto px-4 w-3/4">
    <h2 class="text-6xl">Users</h2>
    <ul role="list" class="divide-y divide-gray-600">
      <li
        class="flex justify-between gap-x-6 py-5"
        v-for="user in users"
        :key="user.id"
      >
        <div class="flex min-w-0 gap-x-4">
          <img
            class="h-12 w-12 flex-none rounded-full bg-gray-50"
            :src="user.avatar"
            alt=""
          />
          <div class="min-w-0 flex-auto">
            <p class="text-sm font-semibold leading-6 text-gray-900">
              {{ user.name }}
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              {{ user.email }}
            </p>
          </div>
        </div>
        <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
          <a
            v-if="auth"
            :href="'/chat/' + user.id"
            class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >Start Chat</a
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
export default {
  props: {
    users: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { cookies } = useCookies();
    return {
      cookies,
    };
  },
  data() {
    return {
      auth: this.cookies.get("token") != null ? true : false,
    };
  },
};
</script>
