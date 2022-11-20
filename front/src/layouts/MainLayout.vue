<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="compost" size="lg"/>
          SS Recycle
        </q-toolbar-title>
        <div v-if="store.login">
          Hello {{ store.getUsername }}
          <h7 class="q-pa-sm">Logout</h7>
          <q-icon name="logout" size="md" class="cursor-pointer" @click="onLogout()"/>
        </div>
        <div v-else>
          <h7 class="q-pa-sm">Login</h7>
          <q-icon name="login" size="md" class="cursor-pointer" @click="onLogin()"/>
        </div>
      </q-toolbar>

      <q-tabs align="left" v-if="store.adminBar">
        <q-route-tab to="/dashb" label="Dash Board" />
        <q-route-tab to="/item" label="Items" />
        <q-route-tab to="/trans" label="Transaction" />
      </q-tabs>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { useItemStore } from "../stores/example-store"

export default defineComponent({
  name: 'MainLayout',
  data() {
    return {
      store: useItemStore(),
    }
  },
  methods: {
    onLogin() {
      this.$router.push("/login")
    },
    onLogout() {
      this.store.login = false
      this.store.address = ''
      this.store.email = ''
      this.store.adminBar = false
      this.$router.push("/")
    }
  }
})
</script>