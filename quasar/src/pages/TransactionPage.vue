<template>
  <q-page>
    <div class="row q-mt-lg q-mx-sm">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <q-table
            title="Manage Request"
            :rows="transactions"
            :columns="transactionCols"
            row-key="name"
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="this.statusColor(props.row)">
                  {{props.row.status}}
                </q-badge>
              </q-td>
            </template>

            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="q-pa-md">
                  <q-btn-dropdown
                    dense
                    :value="props.row.staffID"
                    :label="props.row.staffNameLabel"
                    icon="engineering" 
                    color="primary"
                    :disabled="assignedCheck[this.transactions.indexOf(props.row)] ? '' : disabled"
                  >
                    <!-- <q-list>
                      <q-item 
                        clickable 
                        v-close-popup 
                        @click="props.row.staffNameLabel = staff.name, props.row.staffID = staff.staffId"
                        v-for="(staff,index) in renewStaffs"
                        :key="index"
                      >
                        <q-item-section>
                          <q-item-label>{{staff.staffId}}: {{staff.name}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list> -->

                     <q-list>
                      <q-item 
                        clickable 
                        v-close-popup 
                        @click="props.row.staffNameLabel = staff.name, props.row.staffID = staff.staffId"
                        :key="index"
                      >
                        <q-item-section>
                          <q-item-label>{{staff.staffId}}: {{staff.name}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <q-btn
                    dense
                    :color="assignedCheck[this.transactions.indexOf(props.row)] ? 'green-8' : 'grey-8'"
                    :icon="assignedCheck[this.transactions.indexOf(props.row)] ? 'check' : 'unchecked'"
                    @click="onInProgress(props.row)"
                    :disabled="assignedCheck[this.transactions.indexOf(props.row)] ? '' : disabled"
                  />
                  <q-btn
                    class="q-mx-sm"
                    dense
                    color="red" 
                    icon="not_interested" 
                    @click="onReject(props.row)"
                    :disabled="disableCheck[this.transactions.indexOf(props.row)] ? '' : disabled"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { Notify } from "quasar"
import { userStore } from "../stores/user-store"

export default defineComponent({
  name: 'TransactionPage',
    data() {
    return {
      store: userStore(),
      transactions:[],
      transactionCols: [
        { name: 'requestId', label: 'Request ID', field: 'requestId', align: 'left'},
        { name: 'date', label: 'Date', field: 'date', align: 'left', },
        { name: 'status', label: 'Status', field: 'status', align: 'left', },
        { name: 'action', label: 'Action', field: 'action', align: 'center' }
      ],
      transaction: '',
      changedLabel: 'Status',
      status: [],
      staffNameLabel: [],
      staffID: [],
      staffs:[],
      visibleStaff:[],
      assignedCheck:[],
      input:[],
      s_form_edit : false
    }
  },
  methods:{
    getAlltransactions(){
      this.$api.get('/transactions')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.transactions = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized transactions"
        })
        console.log(err);
      })
    },
    onInProgress(record){
      this.input = record
      this.transactions.status = "In-progress"
      const data = {
        status: this.input.status,
        staff_id: this.input.staffID
      }
      this.$api.put('/transactions/'+this.input.id, data)
      .then((res) => {
        if(res.status == 200) {
          console.log("Status updated to in-Progress");
          Notify.create({
            type: "positive",
            message: "Status updated succesfully"
          })
          this.getAllTransactions()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },

    onReject(record){
      this.input = record
      this.transactions.status = "Reject"
      const data = {
        status: this.input.status,
        staff_id: this.input.staffID
      }
      this.$api.put('/transactions/' + this.input.id, data)
      .then((res) => {
        if(res.status == 200) {
          console.log("Status updated to Reject");
          Notify.create({
            type: "positive",
            message: "Status updated Reject"
          })
          this.getAllTransactions()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },

    statusColor(status) {
      for(let i = 0; i < this.transactions.length; i++)
       {
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
    }

  },
 
  async mounted() {
    await this.getAllTransactions()
  }
})
</script>
