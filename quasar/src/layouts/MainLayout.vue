<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="compost" size="lg"/>
          SS Recycle
        </q-toolbar-title>
        <div v-if="store.getUserId">
          Hello {{ store.getFullname }}
          <h7 class="q-pa-sm">Logout</h7>
          <q-icon name="logout" size="md" class="cursor-pointer" @click="onLogout()"/>
        </div>
        <div v-else>
          <h7 class="q-pa-sm">Login</h7>
          <q-icon name="login" size="md" class="cursor-pointer" @click="onLogin()"/>
        </div>
      </q-toolbar>
      
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { userStore } from "../stores/user-store"
import { Notify } from "quasar"

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',
  // components: {
  //   EssentialLink
  // },
  data() {
    return {
      store: userStore(),
    }
  },
  methods: {
    onLogin() {
      this.$router.push("/login");
    },
    onLogout() {
      this.store.clearStore()
      Notify.create({
        type: "info",
        message: "Logout successfully."
      });
      this.$router.push("/login");
    }
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>