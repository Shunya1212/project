<template>
  <q-page>
    <div class="row q-mt-lg q-mx-sm">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <q-table
            title="Manage Request"
            :rows="store.requestList"
            :columns="columns"
            row-key="name"
          >
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="this.store.statusColor(props.row)">
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
                    :disabled="this.store.assignedCheck[this.store.requestList.indexOf(props.row)] ? '' : disabled"
                  >
                    <q-list>
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
                    </q-list>
                  </q-btn-dropdown>
                  <q-btn
                    dense
                    :color="store.assignedCheck[this.store.requestList.indexOf(props.row)] ? 'green-8' : 'grey-8'"
                    :icon="store.assignedCheck[this.store.requestList.indexOf(props.row)] ? 'check' : 'unchecked'"
                    @click="onAssigned(props.row)"
                    :disabled="this.store.assignedCheck[this.store.requestList.indexOf(props.row)] ? '' : disabled"
                  />
                  <q-btn
                    class="q-mx-sm"
                    dense
                    color="red" 
                    icon="not_interested" 
                    @click="onReject(props.row)"
                    :disabled="this.store.disableCheck[this.store.requestList.indexOf(props.row)] ? '' : disabled"
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
import { useItemStore } from "../stores/example-store"

export default defineComponent({
  name: 'TransactionPage',
  data() {
    return {
      store: useItemStore(),
      columns: [
        { name: 'requestId', label: 'Request ID', field: 'requestId', align: 'left'},
        { name: 'date', label: 'Date', field: 'date', align: 'left', },
        { name: 'status', label: 'Status', field: 'status', align: 'left', },
        { name: 'action', label: 'Action', field: 'action', align: 'center' }
      ],
      changedLabel: 'Status',
      status: [],
      staffNameLabel: [],
      staffID: [],
    }
  },
  methods: {
    OnInProgress(item) {
      const itemIndex = this.store.requestList.indexOf(item)
      if( 
          this.store.requestList[itemIndex].status == "Pending" || 
          this.store.requestList[itemIndex].status == "Rejected"
        ) {
        this.store.requestList[itemIndex].status = "In-progress"
      }
    },
    OnRejected(item) {
      const itemIndex = this.store.requestList.indexOf(item)
      if( 
          this.store.requestList[itemIndex].status == "Pending" || 
          this.store.requestList[itemIndex].status == "In-progress"
        ) {
        this.store.requestList[itemIndex].status = "Rejected"

      }
    },
    statusArray() {
      for(let i = 0; i < this.status.length; i++) {
        this.status[i] = 'Status'
      }
    },
    onAssigned(request) {
      const index = this.store.requestList.indexOf(request)
      const length = this.store.staffs.length
      let id = 0
      for(let i = 0; i < length; i++) {
        if(this.store.staffs[i].staffId == request.staffID) {
          id = this.store.staffs[i].staffId
        }
      }
      if(request.staffNameLabel != null) {
        this.store.assignedCheck[index] = true
        this.store.requestList[index].status = 'In-progress'
        this.store.todoList.push({
          requestId: request.requestId,
          date: request.date,
          address: request.address,
          email: request.email,
          status: request.status,
          staffId: id + ": " + request.staffNameLabel
        })
      }
    },
    onReject(request) {
      const index = this.store.requestList.indexOf(request)
      // if(request.status == 'Completed') {
      //   this.store.disableCheck[index] = false
      // }
      this.store.requestList[index].status = 'Rejected'
      request.staffNameLabel = ''
      this.store.disableCheck[this.store.requestList.indexOf(request)] = true
      this.store.assignedCheck[this.store.requestList.indexOf(request)] = true
      for(let i = 0; i < this.store.todoList.length; i++) {
        if(this.store.requestList[index].requestId == this.store.todoList[i].requestId) {
          this.store.todoList.splice(i, 1)
        }
      }
    },
  },
  computed: {
    renewStaffs: function() {
      let staffs = this.store.staffs
      let newStaffs = []
      for(let i = 0; i < staffs.length; i++) {
        if(!this.store.visibleStaff[i]) {
          newStaffs.push({
            staffId: this.store.staffs[i].staffId,
            name: this.store.staffs[i].name
          })
        }
      }
      return newStaffs
    }
  }
})
</script>