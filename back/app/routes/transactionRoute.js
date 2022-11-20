module.exports = (app) => {
    const transaction_controller = require("../controllers/transaction.controller");
    var router = require("express").Router();
    // router.put("/InProgress", transaction_controller.InProgressTransaction);
    // router.put("/Reject", transaction_controller.RejectTransaction);
    router.get("/", transaction_controller.getAllTransactions);
    router.put("/:id", transaction_controller.updateTransaction);
    router.delete("/:id", transaction_controller.deleteTransaction);
    app.use("/transactions", router);
  };