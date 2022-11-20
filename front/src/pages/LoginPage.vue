<template>
  <q-page class="flex flex-center">
    <q-card class="my-card bg-grey-1 q-px-md q-py-md">
      <div class="flex flex-center">
        <q-icon name="account_circle" color="grey-6" size="4rem"/>
      </div>
      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="myLoginForm"
        >
          <div>
            <q-input 
              v-model="username" 
              type="text" 
              label="Your Username"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Must be at least 1 character!'
              ]"
            />
          </div>
          <div>
            <q-input v-model="password" 
              :type="isPwd ? 'password' : 'text'" 
              label="Your Password"
              lazy-rules
              :rules="[(val) => (val && val.length >= 6) || 'Must be at least 6 characters']"
            >
              <template #append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" 
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-btn label="Submit" type="submit" color="primary" style="width:100%"/>
          </div>
          <div>
            <text-caption class="text-cyan-8">
              Not registerd?
              <a href="/register">Create an Account</a>
            </text-caption>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useItemStore } from "../stores/example-store"

export default defineComponent({
  name: 'LoginPage',
  data() {
    return {
      store: useItemStore(),
      username: null,
      password: null,
      isPwd: true,
    }
  },
  methods: {
    onReset() {
      this.username = null
      this.password = null
      this.isPwd = true
    },
    onSubmit() {
      const data = {
        username: this.username,
        password: this.password
      }
      for(let i = 0; i < this.store.user.length; i++){
        if(data.username == this.store.user[i].username && data.password == this.store.user[i].password) {
          this.$router.push("/")
          this.store.address = this.store.user[i].address
          this.store.email = this.store.user[i].email
          this.store.login = true
          this.store.getUsername = this.store.user[i].username
          this.store.loginUser = this.store.user[i]
          this.store.history = this.store.histories[i]
        }else if (data.username == "admin" && data.password == '123456') {
          this.$router.push("/dashb")
          this.store.adminBar = true
          this.store.login = true
        }
      }
      for(let i = 0; i < this.store.staffs.length; i++){
        if(data.username == this.store.staffs[i].name && data.password == this.store.staffs[i].password) {
          this.$router.push("/staff")
          this.store.login = true
        }
      }
      this.$refs.myLoginForm.reset(); 
    }
  }
})
</script>
