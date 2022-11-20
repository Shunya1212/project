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
                    :rows="store.categories"
                    :columns="categoryColumns"
                    row-key="id"
                  >
                    <template #top-right>
                      <q-form
                        ref="refCategory"
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
                      <q-tr :class="[store.visibleCategory[this.store.categories.indexOf(props.row)] ? 'inv' : '']">
                        <q-td key="categoryId" :props="props">
                          {{ props.row.categoryId }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                          <q-popup-edit 
                            v-if="editCategory[this.store.categories.indexOf(props.row)]"
                            v-model="props.row.name" 
                            v-slot="scope"
                          >
                          <q-input type="text" 
                            v-model="scope.value" 
                            dense 
                            autofocus 
                            @keyup.enter="scope.set"
                            v-on:keyup.enter="onAfterEditCategory(props.row)"
                          />

                          </q-popup-edit>
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="q-ma-sm">
                            <q-btn
                              class="q-pa-sm q-mx-sm"
                              :icon="editCategory[this.store.categories.indexOf(props.row)] ? 'edit' : 'edit_off'"
                              :color="editCategory[this.store.categories.indexOf(props.row)] ? 'primary' : 'red'"
                              @click="onEditCategory(props.row)" 
                              :disabled="store.visibleCategory[this.store.categories.indexOf(props.row)]? '':disabled"
                            >
                              <q-tooltip class="bg-accent">Edit</q-tooltip>
                            </q-btn>
                            <q-btn 
                              class="q-pa-sm"
                              icon="delete"
                              color="red"
                              @click="onDeleteCategory(props.row)" 
                              :disabled="store.visibleCategory[this.store.categories.indexOf(props.row)]? '':disabled"
                            >
                              <q-tooltip class="bg-accent">Delete</q-tooltip>
                            </q-btn>
                            <q-icon 
                              :name="store.visibleCategory[this.store.categories.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
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
                    :rows="store.products"
                    :columns="productColumns"
                    row-key="name"
                  >
                    <template #top-right="props">
                      <q-form
                        ref="refProduct"
                        @submit.prevent="onAddProduct(props.row)"
                        @reset="onResetProduct()"
                        class="q-gutter-sm row"
                        dense
                        :props="props"
                      >
                        <q-input
                          outlined
                          v-model="product"
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
                        <q-btn-dropdown
                          key="defaultLabel" 
                          :props="props"
                          color="primary" 
                          :label="defaultLabel"
                          lazy-rules
                          :rules="[rule]"
                          aria-errormessage="errormessage"
                        >
                          <q-list>
                            <q-item 
                              v-for="(category, index) in renewCategory"
                              :key="index"
                              clickable v-close-popup 
                              @click="defaultLabel= category.name"
                            >
                              <q-item-section>
                                <q-item-label>{{ category.name }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-btn-dropdown>
                        <div align="center">
                          <q-btn label="Add" type="submit" color="primary" />
                          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                      </q-form>
                    </template>
                    <template #body="props">
                      <q-tr :class="[store.visibleProduct[this.store.products.indexOf(props.row)] ? 'inv' : '']">
                        <q-td key="productId" :props="props">
                          {{ props.row.productId }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                          <q-popup-edit 
                            v-if="editProduct[this.store.products.indexOf(props.row)]"
                            v-model.number="props.row.name"
                            buttons v-slot="scope"
                          >
                            <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please type something']"
                            />
                          </q-popup-edit>
                        </q-td>
                        <q-td key="price" :props="props">
                          {{ props.row.price }}
                          <q-popup-edit 
                            v-if="editProduct[this.store.products.indexOf(props.row)]"
                            v-model.number="props.row.price"
                            buttons 
                            v-slot="scope"
                            :validate="onProductPriceValidation"
                            @hide="onProductPriceValidation"
                          >
                          <q-input 
                            type="number" 
                            v-model.number="scope.value" 
                            :error="errorPrice"
                            :error-message="errorMessagePrice"
                            dense 
                            autofocus 
                            @keyup.enter="scope.set" 
                          />
                          </q-popup-edit>
                        </q-td>
                        <q-td key="category" :props="props">
                          {{ props.row.category }}
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="q-pa-sm">
                            <q-btn 
                              class="q-pa-sm q-mx-sm" 
                              :icon="editProduct[this.store.products.indexOf(props.row)] ? 'edit' : 'edit_off'"
                              :color="editProduct[this.store.products.indexOf(props.row)] ? 'primary' : 'red'"
                              @click="onEditProduct(props.row)"
                              :disabled="store.visibleProduct[this.store.products.indexOf(props.row)]? '':disabled"
                            />
                            <q-btn 
                              class="q-pa-sm" 
                              color="red" 
                              icon="delete" 
                              @click="onDeleteProduct(props.row)" 
                              :disabled="store.visibleProduct[this.store.products.indexOf(props.row)]? '':disabled"
                            />
                            <q-icon 
                              :name="store.visibleProduct[this.store.products.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
                              class="cursor-pointer q-ma-sm"
                              @click="onVisibleProduct(props.row)"
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
                    :rows="store.staffs"
                    :columns="staffColumns"
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
                          v-model="staffName"
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
                      <q-tr 
                        :props="props" 
                        :class="[this.store.visibleStaff[this.store.staffs.indexOf(props.row)] ? 'inv' : '']"
                      >
                        <q-td key="staffId" :props="props">
                          {{ props.row.staffId }}
                        </q-td>
                        <q-td key="name" :props="props">
                          {{ props.row.name }}
                          <q-popup-edit 
                            v-if="editStaff[this.store.staffs.indexOf(props.row)]"
                            v-model.number="props.row.name"
                            buttons v-slot="scope"
                          >
                            <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
                          </q-popup-edit>
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="q-pa-sm">
                            <q-btn 
                              class="q-ma-sm q-pa-sm"
                              :icon="editStaff[this.store.staffs.indexOf(props.row)] ? 'edit' : 'edit_off'"
                              :color="editStaff[this.store.staffs.indexOf(props.row)] ? 'blue' : 'red'"
                              @click="onEditStaff(props.row)"
                              dense
                              :disabled="store.visibleStaff[this.store.staffs.indexOf(props.row)]? '':disabled"
                            >
                              <q-tooltip class="bg-accent">Edit</q-tooltip>
                            </q-btn>
                            <q-btn class="q-pa-sm" name="delete" icon='delete' color="red" @click="onDeleteStaff(props.row)" :disabled="store.visibleStaff[this.store.staffs.indexOf(props.row)]? '':disabled">
                              <q-tooltip class="bg-accent">Delete</q-tooltip>
                            </q-btn>
                            <q-icon 
                              :name="store.visibleStaff[this.store.staffs.indexOf(props.row)] ? 'visibility_off' : 'visibility'" 
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
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useItemStore } from "../stores/example-store"

const errorPrice = ref(false)
const errorMessagePrice = ref('')

export default defineComponent({
  name: 'ItemPage',
  data() {
    return {
      store: useItemStore(),
      categoryColumns: [
        { name: 'categoryId', label: 'Category ID', field: 'categoryId', align: 'center'},
        { name: 'name', label: 'Name', field: 'name',align: 'center',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      productColumns: [
        { name: 'productId', label: 'Product ID', field: 'productId', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'price', label: 'Price', field: 'price',align: 'left',  },
        { name: 'category', label: 'Category', field: 'category',align: 'left',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      staffColumns: [
        { name: 'staffId', required: true, label: 'Staff ID', field: 'staffId', align: 'left'},
        { name: 'name', label: 'Name', field: 'name',align: 'left',  },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center', }
      ],
      category: '',
      product: '',
      price: '',
      staffName: '',

      editCategory: [],
      editProduct: [],
      editStaff: [],

      onVisibility: [],
      defaultLabel: "category",
      errorPrice,
      errorMessagePrice,
      scope: "",
      newval:'',
      errormessage:'select category',
      deleteProductList: [] ,

      onProductPriceValidation (val) {
        if (val <= 0) {
          errorPrice.value = true
          errorMessagePrice.value = 'The value must be larger than 0!'
          return false
        }
        errorPrice.value = false
        errorMessagePrice.value = ''
        return true
      }
    }
  },
  methods: {
    onAddCategory() {
      let A = 1
      for(let i = 0;i < this.store.categories.length; i++) {
        if(this.store.categories[i].name == this.category){
          A = 0
          break
        }
        else
          A = 1;
      }
      if(A==1) {
        this.store.categories.push({
          categoryId: this.store.categoryId++,
          name: this.category,
        })
      }
      this.category = null
      this.$refs.refCategory.reset()
      console.log(this.categories)
    },

    onResetCategory() {
      this.category = null
    },

    onDeleteCategory(category) {
      const index = this.store.categories.indexOf(category)
      const deletedCategory = this.store.categories[index].name
      this.store.categories.splice(index, 1)
      let i =0
      while(this.store.products[i]!==null){
        if(this.store.products[i].category===deletedCategory){
          this.store.products.splice(i,1)
          i--
        }
        i++
      }
    },

    onEditCategory(category) {
      const index = this.store.categories.indexOf(category)
      this.editCategory[index] = !this.editCategory[index]
      if(this.editCategory[index]){
        for(let i=0; i<=this.store.categories.length;i++){
          if(index!=i){
            this.editCategory[i]=false
          }
        }
      }
      this.newval=this.store.categories[index].name 
    },

    onVisibleCategory(category) {
      const index = this.store.categories.indexOf(category)
      this.store.visibleCategory[index] = !this.store.visibleCategory[index]
      if(this.store.visibleCategory[index]){
        this.editCategory[index] = false
        this.onVisibility.push(index)
        let i =0
        while(this.store.products[i]!==null){
          if(this.store.products[i].category===this.store.categories[index].name){
            this.store.visibleProduct[i] = true
            this.store.products[i].visible = true
            this.editProduct[i] = false
          }
          i++
        }
      }else{
        let i =0
        while(this.store.products[i]!==null){
          if(this.store.products[i].category===this.store.categories[index].name){
            this.store.visibleProduct[i] = false
            this.store.products[i].visible = false
          }
          i++
        }
      }
    },

    onAfterEditCategory(category) {
      const index = this.store.categories.indexOf(category)
      for(let i=0; i<this.store.products.length; i++){
        if(this.store.products[i].category==this.newval){
          this.store.products[i].category= this.store.categories[index].name
        }
      }
    },

    useEditLabel(newval,original){
      for(let i=0; i<this.store.products.length; i++){
        if(this.store.products[i].category==original)
          this.store.products.push({
          productId: this.store.productID,
          name: this.product,
          price: this.price,
          category: newval
        })
      }
    },

    onAddProduct(product) {
      const index = this.store.products.indexOf(product)
      if(this.defaultLabel === 'category') {
        return errormessage
      }
      else{
        let a = 0
        for(let i = 0;i < this.store.products.length; i++) {
          if((this.store.products[i].name == this.product) && this.store.products[i].category == this.defaultLabel) {
            a = 1
            break
          }
        }
        if(a == 0) {
          this.store.products.push({
            productId: this.store.productID++,
            name: this.product,
            price: this.price,
            category: this.defaultLabel
          })
        }
      }
    },

    onResetProduct() {
      this.product = null
      this.price = null
      this.defaultLabel = "category"
    },

    onEditProduct(product) {
      const index = this.store.products.indexOf(product)
      this.editProduct[index] = !this.editProduct[index]
      if(this.editProduct[index]){
        for(let i=0; i<=this.store.products.length;i++){
          if(index!=i){
            this.editProduct[i]=false
          }
        }
      }
    },

    onDeleteProduct(product) {
      const index = this.store.products.indexOf(product)
      this.store.products.splice(index, 1)
    },

    onCategoryClick(item){
      this.defaultLabel = item
    },

    onVisibleProduct(product) {
      const index = this.store.products.indexOf(product)
      this.store.visibleProduct[index] = !this.store.visibleProduct[index]
      this.store.products[index].visible =!this.store.products[index].visible
      if(this.store.visibleProduct[index]){
      this.editProduct[index] = false
      }
    },

    onDisabledCategory(category){
      const index = this.store.categories.indexOf(category)
      if(this.store.visibleCategory[index]==true){
        return true
      }
      else{
        return false
      }
    },

    onAddStaff() {
      this.store.staffs.push({
        staffId: this.store.staffId++,
        name: this.staffName
      })
      this.staffName = null
      this.$refs.refStaff.reset()
    },

    onResetStaff() {
      this.staffName = null
    },

    onEditStaff(staff) {
      const index = this.store.staffs.indexOf(staff)
      this.editStaff[index] = !this.editStaff[index]
      if(this.editStaff[index]){
        for(let i=0; i<=this.store.staffs.length;i++){
          if(index!=i){
            this.editStaff[i]=false
          }
        }
      }
    },

    onDeleteStaff(staff) {
      const index = this.store.staffs.indexOf(staff)
      this.store.staffs.splice(index, 1)
    },

    onVisibleStaff(staff) {
      const index = this.store.staffs.indexOf(staff)
      this.store.visibleStaff[index] = !this.store.visibleStaff[index]
      if(this.store.visibleStaff[index]){
        this.editStaff[index] = false
      }
    }
  },

  computed: {
    renewCategory: function() {
      let categories = this.store.categories
      let newCategories = []
      for(let i = 0; i < categories.length; i++) {
        if(!this.store.visibleCategory[i]) {
          newCategories.push({
            id: this.store.categories[i].id,
            name: this.store.categories[i].name
          })
        }
      }
      return newCategories
    }
  }
})
</script>

<style>
  .inv {
    opacity: 0.3;
  }
</style>
