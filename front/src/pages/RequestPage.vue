<template>
  <q-page>
    <div class="row">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <div class="text-h4 q-mt-xl q-pt-xl q-pb-lg">Request Form</div>
          <q-form
            @submit.prevent="onAddRequest()"
            @reset="onResetRequest()"
            class="q-pa-lg"
            ref="refRequest"
          >
            <q-table
              title="Product(s)"
              class="q-mb-md"
              :rows="store.products"
              :columns="productColumns"
              row-key="name"
            >
              <template #body="props">
                <q-tr :props="props"
                  v-if="!this.store.visibleProduct[this.store.products.indexOf(props.row)]"
                >
                  <q-td key="productId" :props="props">
                    {{ props.row.productId }}
                  </q-td>
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="price" :props="props">
                    {{ props.row.price }} B/kg
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="weight" :props="props">
                    <q-input
                      class="q-mt-md"
                      dense outlined 
                      v-model="weight[this.store.products.indexOf(props.row)]"
                      type="number" 
                      label="weight/kg *"
                      ref="weightValue"
                    />
                  </q-td>
                  <q-td key="actions">
                    <div>
                      <q-icon 
                        class="cursor-pointer" 
                        :name="checkProduct[this.store.products.indexOf(props.row)] ? 'check_circle' : 'radio_button_unchecked'"
                        :color="checkProduct[this.store.products.indexOf(props.row)] ? 'green' : 'black'"
                        size="sm"
                        @click="onAddProductBtn(props.row)"
                      />
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-list style="width: 200px" dense bordered padding class="rounded-borders q-mb-md">
              <q-item clickable v-ripple
                v-for="weight in weights"
                :key="weight"
              >
                <q-item-section >
                  {{ weight }}
                </q-item-section>
              </q-item>
              <hr>
              <h7 class="q-mx-md">Total: {{ this.totalPrice() }} Baht</h7>
            </q-list>
            <div class="row q-mb-md">
              <div class="col">
                <Datepicker
                  class="q-pr-sm"
                  v-model="date"
                  :minDate="new Date()"
                  placeholder="Date for pick up"
                  :disabledWeekDays="[6, 0]"
                  :enableTimePicker="false"
                />
              </div>
              <div class="col">
                <Datepicker
                  v-model="time"
                  :minTime="{ hours: startTime() }"
                  :maxTime="{ hours:  17 }"
                  placeholder="Time for pick up"
                  :is24="false"
                  timePicker='HH:mm'
                />
              </div>
            </div>
            <div v-if="!store.login">
              <q-input v-model="store.email"
                outlined dense
                type="text" 
                label="Your Email"
                lazy-rules
                :rules="[ emailValidate, requiredValidate ]"
              />

              <q-input 
                outlined 
                v-model="store.address" 
                type="address" 
                label="Address" 
                dense
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' || 'Please type address',
                ]"
              />
            </div>
  
            <div class="q-py-xs">
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
          <div class="q-pa-lg" v-if="store.login">
            <q-table
              title="History"
              :rows="store.history"
              :columns="historyColumns"
              row-key="name"
              class=""
            > 
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="this.store.statusColor(props.row)">
                    {{props.row.status}}
                  </q-badge>
                </q-td>
              </template>
        
            </q-table>
          </div>

          <q-dialog v-model="alert">
            <q-card>
              <q-card-section>
                <div class="text-h6">Successed request</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-h6">
                  
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="confirm">
            <q-card>
              <q-card-section>
              <div class="text-h6">Invalid request</div>
              </q-card-section>
      
              <q-card-section class="q-pt-none">
                <div class="text-h6">
                  Please type correct information
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useItemStore } from "../stores/example-store"
import { emailValidate, requiredValidate } from "../utils/validations"
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: "RequestForm",
  components: { Datepicker },
  data() {
    return {
      store: useItemStore(),
      productColumns: [
        { name: 'productId', label: 'ID', field: 'productId', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'price', label: 'Price', field: 'price',align: 'center',  },
        { name: 'category', label: 'Category', field: 'category',align: 'center',  },
        { name: 'weight', label: 'Weight', field: 'weight',align: 'center',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      historyColumns: [
        { name: 'requestId', label: 'Request ID', field: 'requestId', align: 'left'},
        { name: 'totalPrice', label: 'Total Price', field: 'totalPrice', align: 'left'},
        { name: 'address', label: 'Address', field: 'address', align: 'left'},
        { name: 'email', label: 'Email', field: 'email', align: 'left'},
        { name: 'date', label: 'Date', field: 'date', align: 'left' },
        { name: 'status', label: 'Status', field: 'status', align: 'left' },
      ],
      
      selectedGarbage: [],
      weight: [],
      weights:[],
      priceOfselected:[],
      orange: ref([]),
      total: 0,
      totalArray:[],
      checkProduct: [],
      model: [],
      address: '',
      email: '',

      date: ref(new Date()),
      time: null,
      alert: false,
      confirm: false,
      alertValue: '',
      chackProductBtn: false
    }
  },
  methods: {
    submitData() {
      const month = this.date.getMonth() + 1
      this.store.date[this.store.requestID - 1] = this.date.getFullYear() + "-" + month + "-" + this.date.getDate()
      if(this.totalPrice() > 0) {
        const data = {
          user_id: this.user_id,
          total_price: this.total_Price,
          total_weight: this.total_weight,
          date: this.date
        }
        this.$api.post('/create', data)
        .then((res) => {
          if(res.data == 200) {
            console.log(res.data);
          }
        })
        .catch((err)=>{
          console.log(err)
            this.showErrDialog("on submit error: " + err)
        })
      }
    },
    onAddRequest() {
      const month = this.date.getMonth() + 1
      this.store.date[this.store.requestID - 1] = this.date.getFullYear() + "-" + month + "-" + this.date.getDate()
      if(this.totalPrice() > 0) {
        this.store.requestList.push({
          requestId: this.store.requestID++,
          totalPrice: this.totalPrice(),
          address: this.store.address,
          email: this.store.email,
          date: this.date.getFullYear() + "-" + month + "-" + this.date.getDate() + " " + this.time.hours + ":" + this.time.minutes,
          status: "Pending"
        })
        this.store.history = this.store.requestList.filter((request) => {
          return request.email === this.store.email && request.address === this.store.address
        })
        this.store.histories[this.store.user.indexOf(this.store.loginUser)] = this.store.history
        console.log("history"+this.store.history)
        this.alert = true
        this.$refs.refRequest.reset()
      }
      else {
        this.confirm = true
      }

      
    },
    onResetRequest() {
      this.weight = []
      this.weights = []
      this.checkProduct = []
      this.priceOfselected = []
      this.date = ''
      this.time = undefined
      if(this.store.login == false) {
        this.store.email = ''
        this.store.address = ''
      }
    },
    onAddProductBtn(product) {
      this.chackProductBtn = !this.chackProductBtn

      console.log(this.weight[0])
      const index = this.store.products.indexOf(product)
      this.checkProduct[index] = !this.checkProduct[index]
      if(this.checkProduct[index] == true && this.weight[index] > 0 && this.weight[index] != null) {
        this.weights.push(
          this.store.products[index].name + ": " + (this.weight[index] * this.store.products[index].price) + " Baht"
        )
        this.priceOfselected.push(
          this.weight[index] * this.store.products[index].price
        )
      }else{
        this.weights = this.weights.filter((obj) => {
          return obj != this.store.products[index].name + ": " + (this.weight[index] * this.store.products[index].price) + " Baht"
        })
        this.priceOfselected = this.priceOfselected.filter((obj) => {
          return obj != this.weight[index] * this.store.products[index].price
        })
        this.weights.splice(index, 1)
        this.priceOfselected.splice(index, 1)
        console.log(this.priceOfselected)
      }
    },
    emailValidate,
    requiredValidate,
    totalPrice() {
      let total = 0
      const length = this.priceOfselected.length
      for(let i = 0; i < length; i++){
        if(this.priceOfselected[i] < 0) {
          this.priceOfselected[i] = 0
        }
        total += this.priceOfselected[i]
      }
      return total
    },
    getMinutes(){
      let date = new Date();
      let minute = date.getMinutes()
      return minute
    },
    getHours() {
      let date = new Date();
      let hour = date.getHours()
      return hour
    },
    maxDate() {
      let date = new Date();
      let newDate = new Date(date.getFullYear(),date.getMonth(),date.getDate() + 7)
      return newDate
    },
    startTime() {
      const date = new Date()
      if(date.getHours() > 9) {
        console.log(date.getHours())
        return date.getHours() + 2
      }else{
        return 9
      }
    }
    
  },
  computed: {
    minTime: function() {
      return new Date().setHours(9, 0, 0, 0);
    },
    
    maxTime: function() {
      return new Date().setHours(18, 0, 0, 0);
    }
  }
}
</script>

<style>

</style>