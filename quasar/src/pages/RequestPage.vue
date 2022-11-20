<template>
  <q-page>
    <div class="row">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <div class="text-h4 q-mt-xl q-pt-xl q-pb-lg">Request Form</div>
          <q-form
            @submit.prevent="onSubmit()"
            @reset="onReset()"
            class="q-pa-lg"
            ref="myRequestForm"
          >
            <q-table
              title="Product(s)"
              class="q-mb-md"
              :rows="items"
              :columns="itemCols"
              row-key="id"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }}
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
                      v-model="weight[this.items.indexOf(props.row)]"
                      type="number" 
                      label="weight/kg *"
                      ref="weightValue"
                    />
                  </q-td>
                  <q-td key="actions">
                    <div>
                      <q-icon 
                        class="cursor-pointer" 
                        :name="checkItem[this.items.indexOf(props.row)] ? 'check_circle' : 'radio_button_unchecked'"
                        :color="checkItem[this.items.indexOf(props.row)] ? 'green' : 'black'"
                        size="sm"
                        @click="checkBtn(props.row)"
                      />
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-list style="width: 200px" dense bordered padding class="rounded-borders q-mb-md">
              <q-item clickable v-ripple
                v-for="weight in msg"
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
  
            <div class="q-py-xs">
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
          <div class="q-pa-lg">
            <q-table
              title="History"
              :rows="histories"
              :columns="historyCols"
              row-key="name"
              class=""
            > 
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="this.statusColor(props.row.status)">
                    {{props.row.status}}
                  </q-badge>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar"
import { ref } from 'vue'
import { defineComponent } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { userStore } from "../stores/user-store"

export default defineComponent({
  name: 'RequestPage',
  components: { Datepicker },
  data() {
    return {
      store: userStore(),
      items: [],
      itemCols: [
        { name: 'id', label: 'ID', field: 'id', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'price', label: 'Price', field: 'price',align: 'center',  },
        { name: 'category', label: 'Category', field: 'category',align: 'center',  },
        { name: 'weight', label: 'Weight', field: 'weight',align: 'center',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      histories: [],
      historyCols: [
        { name: 'id', label: 'Request ID', field: 'id', align: 'left'},
        // { name: 'user_id', label: 'User ID', field: 'user_id', align: 'left'},
        { name: 'total_price', label: 'Total Price', field: 'total_price', align: 'left'},
        { name: 'request_date', label: 'Date', field: 'request_date', align: 'left' },
        { name: 'status', label: 'Status', field: 'status', align: 'left' },
      ],
      selectedPrice: [],
      checkItem: [],
      weight: [],
      msg: [],
      date: ref(new Date()),
      time: ''
    }
  },
  methods: {
    getAllItems() {
      this.$api.get('/items')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.items = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
        this.store.clearStore()
        this.$router.push("/login")
      })
    },
    getAllHistories() {
      console.log(this.store.getUserId)
      this.$api.get(`/requests/${this.store.getUserId}`)
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.histories = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized"
        })
        // this.store.clearStore()
        // this.$router.push("/login")
      })
    },
    checkBtn(item) {
      //console.log(typeof(this.weight[4]))
      const index = this.items.indexOf(item)
      if(this.weight[index] != null) this.checkItem[index] = !this.checkItem[index];
      if(!this.checkItem[index]) this.weight[index] = null;
      if(this.checkItem[index] == true && this.weight[index] > 0 && this.weight[index] != null) {
        this.msg.push(
          this.items[index].name + ": " + (this.weight[index] * this.items[index].price) + " Baht"
        )
        this.selectedPrice.push(
          this.weight[index] * this.items[index].price
        )
      }else if(this.checkItem[index] == false){
        this.msg = this.msg.filter((obj) => {
          return obj != this.items[index].name + ": " + (this.weight[index] * this.items[index].price) + " Baht"
        })
        this.selectedPrice = this.selectedPrice.filter((obj) => {
          return obj != this.weight[index] * this.items[index].price
        })
        this.msg.splice(index, 1)
        this.selectedPrice.splice(index, 1)
        console.log(this.selectedPrice)
      }
    },
    totalPrice() {
      let total = 0
      const length = this.selectedPrice.length
      for(let i = 0; i < length; i++){
        if(this.selectedPrice[i] < 0) {
          this.selectedPrice[i] = 0
        }
        total += this.selectedPrice[i]
      }
      return total
    },
    onSubmit() {
      const month = this.date.getMonth() + 1
      let date = this.date.getFullYear() + "-" + month + "-" + this.date.getDate()
      let time = ('0' + this.time.hours).slice(-2) + ":" + ('0' + this.time.minutes).slice(-2)
      const requestDate = date + ' ' + time
      console.log(requestDate)
      if(this.totalPrice() > 0) {
        const data = {
          user_id: this.store.userid,
          total_price: this.totalPrice(),
          request_date: requestDate,
          status: "Pending"
        }
        this.$api.post('/requests/create', data)
        .then((res) => {
          console.log("Created request.")
          Notify.create({
            type: "positive",
            message: "Accepted request."
          })
          console.log(res.data.request_date)
          this.getAllHistories()
          this.$refs.myRequestForm.reset()
        })
        .catch((err)=>{
          console.log(err)
        })
      }
      else {
        this.confirm = true
      }

      
    },
    onReset() {
      this.weight = []
      this.checkItem = []
      this.selectedPrice = []
      this.date = ''
      this.time = undefined
    },
    statusColor(status) {
      for(let i = 0; i < this.histories.length; i++) {
        if (status == 'Pending') {
          return 'grey-8'
        }
        else if (status == 'In-progress') {
          return 'green-8'
        }
        else if (status == 'Rejected') {
          return 'red-8'
        }
        else if (status == 'Completed') {
          return 'blue-8'
        }
      }
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
    },
  },
  async mounted() {
    await this.getAllItems();
    //this.dataReady = true
    await this.getAllHistories();
  }
})
</script>