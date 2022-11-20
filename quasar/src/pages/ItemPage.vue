<template>
  <q-page>
    <div class="row q-mt-lg">
      <div class="col">
        <div style="max-width:650px; text-align:center; margin-left:auto; margin-right:auto">
          <!-- Category section -->
          <q-list class="rounded-borders">
            <q-expansion-item
              class="shadow-1 overflow-hidden"
              style="border-radius: 30px"
              icon="category"
              label="Category List"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card>
                <q-card-section>
                  <q-table
                    title="Category"
                    :rows="categories"
                    :columns="categoryCols"
                    row-key="id"
                  >
                    <template #top-right>
                      <q-form
                        ref="myCategoryForm"
                        @submit.prevent="onAddCategory()"
                        @reset="onResetCategory()"
                        class="q-gutter-sm row"
                        dense
                      >
                        <q-input
                          outlined
                          v-model="category"
                          label="Category *"
                          lazy-rules
                          :rules="[ val => val && val.length > 0 || 'Please type something']"
                          dense
                          class="q-py-md q-px-xs"
                          style="size: 15px"
                        />
                        <div class="q-py-md">
                          <q-btn label="Add" type="submit" color="primary"/>
                          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                      </q-form>
                    </template>
                    <template #body="props">
                      <q-tr :class="[visibleCategory[this.categories.indexOf(props.row)] ? 'inv' : '']">
                        <q-td key="id" :props="props">
                          {{ props.row.id }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="q-ma-sm">
                            <q-btn class="q-pa-sm q-mx-sm" icon="edit" color="primary" 
                              @click="editRecordCategory(props.row)" 
                              :disabled="visibleCategory[this.categories.indexOf(props.row)]? '':disabled"
                            />
                            <q-btn class="q-pa-sm" icon="delete" color="red" 
                              @click="onDeleteCategory(props.row)" 
                              :disabled="visibleCategory[this.categories.indexOf(props.row)]? '':disabled"
                            />
                            <q-icon 
                              :name="visibleCategory[this.categories.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
                              class="cursor-pointer q-ma-sm"
                              @click="onVisibleCategory(props.row)"
                              size="sm"
                            />
                          </div>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <!---------------------->
          <br />
          <!-- Product section -->
          <q-list class="rounded-borders">
            <q-expansion-item
              class="shadow-1 overflow-hidden"
              style="border-radius: 30px"
              icon="recycling"
              label="Product List"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card>
                <q-card-section>
                  <q-table
                    title="Products"
                    :rows="items"
                    :columns="itemCols"
                    row-key="name"
                  >
                    <template #top-right="props">
                      <q-form
                        ref="myItemForm"
                        @submit.prevent="onAddProduct(props.row)"
                        @reset="onResetProduct()"
                        class="q-gutter-sm row"
                        dense
                        :props="props"
                      >
                        <div class="row">
                          <q-input
                            outlined
                            v-model="item"
                            label="Product *"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please type something']"
                            dense
                            class="q-py-md q-px-xs"
                            style="size: 10px"
                          />
                          <q-input
                            outlined
                            type="number"
                            v-model="price"
                            label="Price/kg *"
                            lazy-rules
                            :rules="[
                              val => val !== null && val !== '' || 'Please type price',
                              val => val > 0  || 'Please type a valid price'
                            ]"
                            dense
                            class="q-py-md q-px-xs"
                          />
                          <div class="q-pa-xs">
                            <q-btn-dropdown
                              key="label" 
                              :props="props"
                              color="primary" 
                              :label="label"
                              lazy-rules
                              :rules="[rule]"
                              aria-errormessage="errormessage"
                            >
                              <q-list>
                                <q-item 
                                  v-for="(category, index) in categories"
                                  :key="index"
                                  clickable v-close-popup 
                                  @click="label= category.name"
                                >
                                  <q-item-section>
                                    <q-item-label>{{ category.name }}</q-item-label>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-btn-dropdown>
                          </div>
                          <div align="center">
                            <q-btn label="Add" type="submit" color="primary" />
                            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                          </div>
                        </div>
                      </q-form>
                    </template>
                    <template #body="props">
                      <q-tr :class="[visibleItem[this.items.indexOf(props.row)] ? 'inv' : '']">
                        <q-td key="id" :props="props">
                          {{ props.row.id }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                        </q-td>
                        <q-td key="price" :props="props">
                          {{ props.row.price }}
                        </q-td>
                        <q-td key="category" :props="props">
                          {{ props.row.category }}
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="q-pa-sm">
                            <q-btn class="q-pa-sm q-mx-sm" icon="edit" color="primary"
                              @click="editRecordItem(props.row)"
                              :disabled="visibleItem[this.items.indexOf(props.row)]? '':disabled"
                            />
                            <q-btn class="q-pa-sm" color="red" icon="delete" 
                              @click="onDeleteProduct(props.row)"
                              :disabled="visibleItem[this.items.indexOf(props.row)]? '':disabled"
                            />
                            <q-icon 
                              :name="visibleItem[this.items.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
                              class="cursor-pointer q-ma-sm"
                              @click="onVisibleItem(props.row)"
                              size="sm"
                            />
                          </div>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <!--------------------->
          <br />
          <!-- Staff section -->
          <q-list class="rounded-borders">
            <q-expansion-item
              class="shadow-1 overflow-hidden"
              style="border-radius: 30px"
              icon="engineering"
              label="Staff List"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card>
                <q-card-section>
                  <q-table
                    class="q-ma-md"
                    title="Staff List"
                    :rows="staffs"
                    :columns="staffCols"
                    row-key="name"
                  >
                    <template #top-right>
                      <q-form
                        ref="refStaff"
                        @submit.prevent="onAddStaff"
                        @reset="onResetStaff"
                        class="q-gutter-sm row"
                        dense
                      >
                        <q-input
                          filled
                          v-model="staff"
                          label="Staff *"
                          lazy-rules
                          :rules="[ val => val && val.length > 0 || 'Please type something']"
                          dense
                          class="q-py-md q-px-xs"
                        />
                        <div class="q-py-md">
                          <q-btn label="Add" type="submit" color="primary"/>
                          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                      </q-form>
                    </template>
                    
                    <template #body="props">
                      <q-tr :class="[visibleStaff[this.staffs.indexOf(props.row)] ? 'inv' : '']">
                        <q-td key="id" :props="props">
                          {{ props.row.id }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="q-pa-sm">
                            <q-btn class="q-ma-sm q-pa-sm" icon="edit" color="primary" dense
                              @click="editRecordStaff(props.row)"
                              :disabled="visibleStaff[this.staffs.indexOf(props.row)]? '':disabled"
                            />
                            <q-btn class="q-pa-sm" name="delete" icon='delete' color="red" 
                              @click="onDeleteStaff(props.row)"
                              :disabled="visibleStaff[this.staffs.indexOf(props.row)]? '':disabled"
                            />
                            <q-icon 
                              :name="visibleStaff[this.staffs.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
                              class="cursor-pointer q-ma-sm"
                              @click="onVisibleStaff(props.row)"
                              size="sm"
                            />
                          </div>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <!------------------->
        </div>
      </div>
    </div>
    <!-- Category Edit dialog -->
    <q-dialog v-model="c_form_edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">
            Edit Category ID: {{ input.id }}
          </span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="input.name" type="text" label="Category name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" 
            color="primary" 
            v-close-popup 
            @click="onCancelEdit()"
          />
          <q-btn flat label="Edit" 
            color="primary" 
            v-close-popup 
            @click="onEditCategory()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-------------------------->

    <!-- Item Edit dialog -->
    <q-dialog v-model="i_form_edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">
            Edit Item ID: {{ input.id }}
          </span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="input.name" type="text" label="Item name" />
          <q-input v-model="input.price" type="number" label="Item price" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" 
            color="primary" 
            v-close-popup 
            @click="onCancelEdit()"
          />
          <q-btn flat label="Edit" 
            color="primary" 
            v-close-popup 
            @click="onEditItem()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!---------------------->

    <!-- Staff Edit dialog -->
    <q-dialog v-model="s_form_edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">
            Edit Staff ID: {{ input.id }}
          </span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="input.name" type="text" label="Staff name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" 
            color="primary" 
            v-close-popup 
            @click="onCancelEdit()"
          />
          <q-btn flat label="Edit" 
            color="primary" 
            v-close-popup 
            @click="onEditStaff()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!---------------------->
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { Notify } from "quasar"
import { userStore } from "../stores/user-store"

export default defineComponent({
  name: 'ItemPage',
  data() {
    return {
      store: userStore(),
      // category
      categories: [],
      categoryCols: [
        { name: 'id', label: 'Category ID', field: 'id', align: 'center'},
        { name: 'name', label: 'Name', field: 'name',align: 'center',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      category: '',
      // editCategory: [],
      visibleCategory: [],

      // product
      items: [],
      itemCols: [
        { name: 'id', label: 'Product ID', field: 'id', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'price', label: 'Price', field: 'price',align: 'left',  },
        { name: 'category', label: 'Category', field: 'category',align: 'left',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      item: '',
      price: '',
      label: 'category',
      //selectedCategory: '',
      visibleItem: [],

      // staff
      //users: [],
      staff: '',
      staffs: [],
      staffCols: [
        { name: 'id', required: true, label: 'Staff ID', field: 'id', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      visibleStaff: [],

      // edit & delete
      input: [],
      c_form_edit: false,
      i_form_edit: false,
      s_form_edit: false
    }
  },
  methods: {
    getAllCategories() {
      this.$api.get('/categories')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          this.categories = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized categories"
        })
        console.log(err);
      })
    },
    
    getAllItems() {
      this.$api.get('/items')
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data);
          this.items = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized items"
        })
        console.log(err);
      })
    },

    getAllStaffs() {
      this.$api.get('/staffs')
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data)
          this.staffs = res.data
        }
      })
      .catch((err) => {
        Notify.create({
          type: "negative",
          message: "Unauthorized staffs"
        })
        console.log(err);
      })
    },

    onAddCategory() {
      //console.log(this.category)
      const data = {
        name: this.category,
        visible: false
      }
      this.$api.post('/categories/create', data)
      .then((res) => {
        if(res.status == 200) {
          console.log("created category");
          Notify.create({
            type: "positive",
            message: "Created category"
          })
          this.getAllCategories()
          this.$refs.myCategoryForm.reset()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },

    onAddProduct() {
      let c_id = 0;
      for(let i=0; i < this.categories.length; i++) {
        if(this.label == this.categories[i].name) {
          c_id = this.categories[i].id
        }
      }
      const data = {
        name: this.item,
        price: this.price,
        category_id: c_id,
        visible: false
      }
      this.$api.post('/items/create', data)
      .then((res) => {
        if(res.status == 200) {
          console.log("created item: " + res.data);
          Notify.create({
            type: "positive",
            message: "Created item"
          })
          //console.log(res.data.request_date)
          this.getAllItems()
          this.$refs.myItemForm.reset()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },

    onAddStaff() {
      const data = {
        name: this.staff,
        visible: false
      }
      this.$api.post('/staffs/create', data)
      .then((res) => {
        if(res.status == 200) {
          console.log("add staff: " + res.data);
          Notify.create({
            type: "positive",
            message: "Add staff"
          })
          //console.log(res.data.request_date)
          this.getAllStaffs()
          this.$refs.refStaff.reset()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },

    onResetCategory() {
      this.category = ''
    },

    onResetProduct() {
      this.item = ''
      this.price = ''
      this.label = 'category'
    },

    onResetStaff() {
      this.staff = ''
    },

    editRecordCategory(record) {
      console.log(record)
      this.input = record
      this.c_form_edit = true
    },

    editRecordItem(record) {
      console.log(record)
      this.input = record
      this.i_form_edit = true
    },

    editRecordStaff(record) {
      console.log(record)
      this.input = record
      this.s_form_edit = true
    },

    onEditCategory() {
      const data = {
        name: this.input.name
      }
      console.log(data)
      this.$api.put("/categories/" + this.input.id, data)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Updated category ID: " + res.data.id
          })
          this.input = [];
          this.getAllCategories();
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    },

    onEditItem() {
      const data = {
        name: this.input.name,
        price: this.input.price,
      }
      console.log(data)
      this.$api.put("/items/" + this.input.id, data)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Updated item ID: " + res.data.id
          })
          console.log("input: "+this.input)
          this.input = [];
          this.getAllItems();
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    },

    onEditStaff() {
      const data = {
        name: this.input.name,
      }
      console.log(data)
      this.$api.put("/staffs/" + this.input.id, data)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Updated staff ID: " + res.data.id
          })
          console.log("input: "+this.input)
          this.input = [];
          this.getAllStaffs();
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    },

    onDeleteCategory(category) {
      this.$api
      .delete("/categories/" + category.id)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Deleted category ID: " + res.data.id
          })
          this.getAllCategories();
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },

    onDeleteProduct(item) {
      this.$api
      .delete("/items/" + item.id)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Deleted item ID: " + res.data.id
          })
          this.getAllItems();
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },

    onDeleteStaff(staff) {
      this.$api
      .delete("/staffs/" + staff.id)
      .then((res) => {
        if(res.status == 200) {
          Notify.create({
            type: "positive",
            message: "Deleted staff ID: " + res.data.id
          })
          this.getAllStaffs();
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },

    onCancelEdit() {
      this.getAllCategories()
      this.getAllItems();
      this.getAllStaffs();
    },

    onVisibleCategory(category) {
      const index = this.categories.indexOf(category);
      this.visibleCategory[index] = !this.visibleCategory[index]
    },

    onVisibleItem(item) {
      const index = this.items.indexOf(item);
      this.visibleItem[index] = !this.visibleItem[index]
    },

    onVisibleStaff(staff) {
      const index = this.staffs.indexOf(staff);
      this.visibleStaff[index] = !this.visibleStaff[index]
    }
  },
  async mounted() {
    await this.getAllCategories();
    await this.getAllItems();
    await this.getAllStaffs();
  }
})
</script>

<style>
  .inv {
    opacity: 0.3;
  }
</style>