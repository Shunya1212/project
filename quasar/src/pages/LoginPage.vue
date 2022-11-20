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
              v-model="name" 
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
              <a href="/">Create an Account</a>
            </text-caption>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { userStore } from "../stores/user-store"
import { Notify } from "quasar"

export default defineComponent({
  name: 'LoginPage',
  data() {
    return {
      store: userStore(),
      name: null,
      password: null,
      isPwd: true,
    }
  },
  methods: {
    onSubmit() {
      const data = {
        name: this.name,
        password: this.password
      }
      this.$api.post('/users/login', data)
      .then((res) => {
        if(res.status == 200) {
          // console.log(res.data);
          console.log("Login successfully.");
          Notify.create({
            type: "positive",
            message: "Login successfully."
          })
          this.store.userid = res.data.id
          this.store.name = res.data.name
          this.store.login = true
        }
        this.$router.push("/request")
      })
      .catch((err) => {
        console.log(err)
        Notify.create({
          type: "negative",
          message: "Invalid Username or Password."
        })
      });
      this.$refs.myLoginForm.reset();
    }
  }
})
</script>