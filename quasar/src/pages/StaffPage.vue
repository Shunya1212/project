<template>
  <q-page class="flex flex-center">
    <div class="text-h1">This is staff page</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { userStore } from "../stores/user-store"
import { Notify } from "quasar"
import { ref } from 'vue'

export default defineComponent({
  name: 'StaffPage',
  data() {
    return {
      store: userStore(),
      todoColumns: [
        { name: 'requestId', label: 'Request ID', field: 'requestId', align: 'left'},
        { name: 'date', label: 'Date', field: 'date', align: 'left', },
        { name: 'address', label: 'Address', field: 'address', align: 'left', },
        { name: 'email', label: 'Email', field: 'email', align: 'left', },
        { name: 'status', label: 'Status', field: 'status', align: 'left', },
        { name: 'staffId', label: 'Staff ID', field: 'staffId', align: 'left' },
        { name: 'action', label: 'Action', field: 'action', align: 'left' }
      ],
    }
  }
})
</script>
