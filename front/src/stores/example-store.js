import { defineStore } from 'pinia';
import moment from "moment"

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    categories:[
      {categoryId: 1, name: "Steel"},
      {categoryId: 2, name: "Paper"},
      {categoryId: 3, name: "Glass"},
      {categoryId: 4, name: "Plastic"},
    ],
    categoryId: 5,

    products: [
      {productId: 1, name: "Chair", price: 50, category: "Steel"},
      {productId: 2, name: "Table", price: 40, category: "Plastic"},
      {productId: 3, name: "Newspaper", price: 20, category: "Paper"},
      {productId: 4, name: "Book", price: 30, category: "Paper"},
    ],
    productID: 5,

    staffs: [
      {staffId:1, name: 'Honda', password: 111111},
      {staffId:2, name: 'Kagawa', password: 123456},
      {staffId:3, name: 'Ono', password: 123456},
      {staffId:4, name: 'Nagatomo', password: 123456},
      {staffId:5, name: 'Okazaki', password: 123456},
      {staffId:6, name: 'Uchida', password: 123456},
      {staffId:7, name: 'Kawashima', password: 123456},
    ],
    staffId: 8,

    user: [
      {userId: 1, username: "admin", email: "ava@aaa.com", address: "111-111,aaa,aaa,ava", password: 123456},
      {userId: 2, username: "Honda", email: "aaa@aaa.com", address: "111-111,aaa,aaa,aaa", password: 123456},
      {userId: 3, username: "Suzuki", email: "bbb@bbb.com", address: "222-222,bbb,bbb,bbb", password: 123456},
      {userId: 4, username: "Kawasaki", email: "ccc@ccc.com", address: "333-333,ccc,ccc,ccc", password: 123456},
      {userId: 5, username: "Toyota", email: "ddd@ddd.com", address: "444-444,ddd,ddd,ddd", password: 123456},
      {userId: 6, username: "Yamaha", email: "eee@eee.com", address: "555-555,eee,eee,eee", password: 123456},
      {userId: 7, username: "Isuzu", email: "fff@fff.com", address: "666-666,fff,fff,fff", password: 123456},
      {userId: 8, username: "Kubota", email: "ggg@ggg.com", address: "777-777,ggg,ggg,ggg", password: 123456},
      {userId: 9, username: "Tanaka", email: "hhh@hhh.com", address: "888-888,hhh,hhh,hhh", password: 123456},
      {userId: 10, username: "Sasaki", email: "iii@iii.com", address: "999-999,iii,iii,iii", password: 123456},
      {userId: 11, username: "Sato", email: "jjj@jjj.com", address: "000-000,jjj,jjj,jjj", password: 123456},
      {userId: 12, username: "Maeda", email: "kkk@kkk.com", address: "000-111,kkk,kkk,kkk", password: 123456},
    ],
    userId: 13,

    requestList: [],
    todoList:[],
    requestID: 1,
    dashBoardStatus: [
      // {requestId: 1}
    ],
    dashBoardRow: [],
    date: [],
    time: '',
    onVisibilityForProduct: [
      
    ],
    totalTransactions: 0,
    todayTransactions: 0,
    pending: 0,
    inProgress: 0,
    rejected: 0,

    total: 0,
    assignedCheck: [],
    staffIds: '',
    visibleCategory: [],
    visibleProduct: [],
    visibleStaff: [],
    disableCheck: [],
    login: false,
    loginUser: null,
    email: '',
    address: '',
    getUsername: '',
    histories: [],
    history: '',
    adminBar: false
  }),
  getters: {
    numOfTotalTransaction(state) {
      return state.requestList.length
    },

    numOfTodayTransaction(state) {
      let total = 0
      let length = state.requestList.length
      for(let i = 0; i < length; i++){
        let date1 = moment(state.date[i])
        let date2 = moment(this.printDate())
        if (date1.isSame(date2)) {
          total++
        }
      }
      return total
    },

    numOfPending(state) {
      let total = 0
      let length = state.requestList.length
      for(let i = 0; i < length; i++){
        let date1 = moment(state.date[i])
        let date2 = moment(this.printDate())
        if (state.requestList[i].status == 'Pending' && date1.isSame(date2)) {
          total++
        }
      }
      return total
    },

    numOfInprogress(state) {
      let total = 0
      let length = state.requestList.length
      for(let i = 0; i < length; i++){
        let date1 = moment(state.date[i])
        let date2 = moment(this.printDate())
        if (state.requestList[i].status == 'In-progress' && date1.isSame(date2)) {
          total++
        }
      }
      return total
    },

    numOfRejected(state) {
      let total = 0
      let length = state.requestList.length
      for(let i = 0; i < length; i++){
        let date1 = moment(state.date[i])
        let date2 = moment(this.printDate())
        if (state.requestList[i].status == 'Rejected' && date1.isSame(date2)) {
          total++
        }
      }
      return total
    },
  },
  actions: {
    printDate: function () {
      let today = new Date();
      let format = today.getFullYear() + "/" + (today.getMonth() + 1) + "/"+ today.getDate()
      let printToday = moment(format).format("YYYY-MM-DD")
      return printToday
    },
    printTime: function () {
      return new Date();
    },
    statusColor: function(status) {
      for(let i = 0; i < this.requestList.length; i++) {
        if (status.status == 'Pending') {
          return 'grey-8'
        }
        else if (status.status == 'In-progress') {
          return 'green-8'
        }
        else if (status.status == 'Rejected') {
          return 'red-8'
        }
        else if (status.status == 'Completed') {
          return 'blue-8'
        }
      }
    }
  },
});
