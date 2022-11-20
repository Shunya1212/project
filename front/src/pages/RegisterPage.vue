<template>
  <q-page class="flex flex-center">
    <q-card class="my-card bg-grey-1 q-px-md q-py-md">
      <div class="flex flex-center" v-if="isShowIcon">
        <q-icon name="account_circle"
        color="grey-6" size="4rem"/>
      </div>
      <div class="flex flex-center" v-else>
        <q-img
          :src="imageUrl"
          :ratio="4/3"
          spinner-color="primary"
          spinner-size="82px"
        />
      </div>
      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="myRegisterForm"
        >
          <div>
            <q-input v-model="username" 
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
    <DialogComponent 
      v-model="showDialog"
      :propDialog="dialog"
    >
    
    </DialogComponent>
  </q-page>
</template>

<script>
import { emailValidate, requiredValidate } from "../utils/validations"
import { Notify } from "quasar"
import DialogComponent from "../components/DialogComponent.vue"
//import { useLoginUserStore } from "../stores/loginUserStore.js"

export default {
  name: "RegisterPage",
  components: { DialogComponent },
  data() {
    return {
      imageUrl: "",
      fullname: "",
      email: "",
      username: "",
      password: "",
      isPwd: true,
      usernameCaption: {
        show: false,
        showClass: false,
        icon: null,
        msg: null
      },
      isShowIcon: true,
      upload_avatar: null,
      dialog: {
        icon: "",
        msg: "",
        btnType: "",
        iconColor: ""
      },
      showDialog: false,
      //storeLogUser: useLoginUserStore()
    }
  },
  methods: {
    emailValidate,
    requiredValidate,
    submitData(filename){
      const data = {
        fullname: this.fullname,
        email: this.email,
        username: this.username,
        password: this.password,
        img: filename
      }
      this.$api.post("/auth/signup", data)
      .then((res)=>{
        if(res.status == 200) {
          // console.log(res.data)
          this.showDialog = true
          this.dialog.icon = "task_alt"
          this.dialog.iconColor = "primary"
          this.dialog.msg = 
          "<div class='text-h6'>Welcome,<br>" + 
          res.data.fullname + 
          "</div> Your account has been created successfully."
          this.dialog.btnType = "Signup"
          this.storeLogUser.userid = res.data.id
          this.storeLogUser.fullname = res.data.fullname
          this.storeLogUser.accessToken = res.data.accessToken
          if(res.data.img != null) {
            this.storeLogUser.avatar = 
            this.$RESTURL + "/file/" + res.data.img
          }else{
            this.storeLogUser.avatar = "download.png"
          }
        }
        this.$refs.myRegisterForm.reset()
      })
      .catch((err)=>{
        console.log(err)
          this.showErrDialog("on submit error: " + err)
      })
    },
    onSubmit() {
      // this.showErrDialog("Test error case")
      // return;
      if(this.upload_avatar == "") this.upload_avatar = null
      if(this.upload_avatar) {
        //with upload file
        const formData = new FormData()
        formData.append("singlefile", this.upload_avatar)
        this.$api
        .post("/file/upload", formData)
        .then((response)=>{
          if(response.status == 200) {
            // continue to submit form data
            this.submitData(response.data.uploadFileName)
          }
        })
        .catch((err)=>{
          console.log(err)
          this.showErrDialog("on submit error: " + err)
        })
      }
      else {
        //without upload file
        this.submitData(null);
      }
    },
    showErrDialog(err) {
      this.showDialog = true
      this.dialog.icon = "error"
      this.dialog.iconColor = "negative"
      this.dialog.msg = err;
      this.dialog.btnType = "error";
    },
    usernameValidate(){
      if(this.username) {
        this.$api.get("/auth/" + this.username)
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
    onRejected(rejectedEntries) {
      let msg
      if(rejectedEntries[0].failedPropValidation == "accept")
        msg = "Only images (jpg, jpeg, png) are allowed."
      else if(rejectedEntries[0].failedPropValidation == "max-file-size")
        msg = "File size cannot be larger than 1MB."
      Notify.create({
        type: "negative",
        message: msg
      })
    },
    uploadFile() {
      this.isShowIcon = false
      this.imageUrl = URL.createObjectURL(this.upload_avatar)
    },
    onReset() {
      this.fullname = null
      this.email = null
      this.username = null
      this.password = null
      this.isPwd = true
      this.resetUserCaption()
      this.upload_avatar = null
      this.isShowIcon = true
      this.imageUrl = ""
    }
  },
  watch: {
    username() {
      this.usernameValidate();
    }
  }
}
</script>

<style>

</style>