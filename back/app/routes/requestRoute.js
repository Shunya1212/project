module.exports = (app) => {
  const request_controller = require("../controllers/request.controller");
  var router = require("express").Router();
  router.post("/create", request_controller.createNewRequest);
  // router.get("/:us", request_controller.validRequest);
  //router.post("/login", user_controller.login);
  router.get("/", request_controller.getAllRequests);
  router.put("/:id", request_controller.updateRequest);
  router.delete("/:id", request_controller.deleteRequest);
  router.get("/:id", request_controller.getUserHistories);
  app.use("/requests", router);
};