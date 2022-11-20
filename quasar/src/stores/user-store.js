import { defineStore } from 'pinia';
import { useStorage } from "@vueuse/core";

export const userStore = defineStore('user', {
  state: () => ({
    userid: useStorage("userid", ""),
    name: useStorage("name", ""),
    login: false,
  }),
  getters: {
    getUserId: (state) => {
      return state.userid;
    },
    getFullname: (state) => {
      return state.name;
    },
  },
  actions: {
    clearStore() {
      this.userid = ""
      this.name = ""
    },

  },
});