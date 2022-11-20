<template>
  <q-page class="flex flex-center">
    <q-card class="my-card bg-grey-1 q-px-md q-py-md">
      <div class="flex flex-center">
        <q-icon name="account_circle"
        color="grey-6" size="4rem"/>
      </div>
      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="myRegisterForm"
        >
          <div>
            <q-input v-model="name" 
              type="text" 
              label="Your username"
              lazy-rules
              :rules="[ requiredValidate ]"
            />
            <text-caption style="font-size:0.9em"
            v-if="usernameCaption.show"
            :class="[usernameCaption.showClass ? 'text-positive' : 'text-negative']"
            ><q-icon :name="usernameCaption.icon" size="1.5em" />
            {{ usernameCaption.msg }}
            </text-caption>
          </div>
          <div>
            <q-input v-model="email"
              type="text" 
              label="Your Email"
              lazy-rules
              :rules="[ emailValidate, requiredValidate ]"
            />
          </div>
          <div>
            <q-input v-model="address"
              type="text" 
              label="Your Address"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Field is required']"
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
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { emailValidate, requiredValidate } from "../utils/validations"
import { userStore } from "../stores/user-store"
import { Notify } from "quasar"


export default defineComponent({
  name: 'SignUpPage',
  data() {
    return {
      store: userStore(),
      name: '',
      email: '',
      address: '',
      password: '',
      isPwd: false,
      usernameCaption: {
        show: false,
        showClass: false,
        icon: null,
        msg: null
      },
    }
  },
  methods: {
    emailValidate,
    requiredValidate,
    onSubmit() {
      const data = {
        name: this.name,
        email: this.email,
        address: this.address,
        visible: false,
        password: this.password,
      }
      
      this.$api.post("/users/signup", data)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "SignUp successfully."
          })
          this.store.userid = res.data.id
          this.store.name = res.data.name
          console.log("created successfully");
          this.$router.push("/login");
        }
      });
      this.$refs.myRegisterForm.reset();
    },
    onReset() {
      this.name = null
      this.email = null
      this.address = null
      this.password = null
      this.isPwd = true
    },
    usernameValidate(){
      if(this.name) {
        this.$api.get("/users/" + this.name)
        .then((response)=>{
          // console.log(response.data)
          if(response.data.valid) {
            this.usernameCaption.show = true
            this.usernameCaption.showClass = true
            this.usernameCaption.icon = 'check_circle_outline'
            this.usernameCaption.msg = 'This username is Available'
          }else{
            this.usernameCaption.show = true
            this.usernameCaption.showClass = false
            this.usernameCaption.icon = 'highlight_off'
            this.usernameCaption.msg = 'This username is NOT Available'
          }
        })
        .catch((err)=>{
          console.log(err)
        })
      }
      else {
        this.resetUserCaption();
      }
    },
    resetUserCaption() {
      this.usernameCaption.show = false
      this.usernameCaption.showClass = false
      this.usernameCaption.icon = null
      this.usernameCaption.msg = null
    },
  },
  watch: {
    name() {
      this.usernameValidate();
    }
  }
})
</script>