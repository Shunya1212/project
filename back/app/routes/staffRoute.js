module.exports = (app) => {
    const staff_controller = require("../controllers/staff.controller");
    var router = require("express").Router();
    router.post("/create", staff_controller.createNewStaff);
    // router.get("/:us", staff_controller.validUsername);
    router.get("/", staff_controller.getAllStaffs);
    router.put("/:id", staff_controller.updateStaff);
    router.delete("/:id", staff_controller.deleteStaff);
    app.use("/staffs", router);
  };