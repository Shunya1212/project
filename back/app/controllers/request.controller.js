const Request = require("../models/Request");
const createNewRequest = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  const requestObj = new Request({
    user_id: req.body.user_id,
    total_price: req.body.total_price,
    request_date: req.body.request_date,
    status: req.body.status
  });
  Request.create(requestObj, (err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."

      })
    }else res.send(data)
  });
}

const getAllRequests = (req, res) => {
  Request.getAllRecords((err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."
      })
    }else res.send(data);
  });
};

const getUserHistories  = (req, res) => {
  Request.getHistoriesByID(req.params.id, (err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."
      })
    }else res.send(data);
  })
}

const updateRequest = (req, res) => {
  if(!req.body) {
    res.status(400).send({ message: "Content can not be empty."});
  }
  const data = {
    user_id: req.body.user_id,
    total_price: req.body.total_price,
    request_date: req.body.request_date,
    status: req.body.status
  };
  Request.updateByID(req.params.id, data, (err, result) => {
    if(err) {
      if(err.kind == "not_found") {
        res.status(401).send({
          message: "Not found user id: " + req.params.id
        });
      } else {
        res.status(500).send({
          message: "Error update user id: " + req.params.id
        });
      }
    } else res.send(result);
  });
};

const deleteRequest = (req, res) => {
  Request.remove(req.params.id, (err, result)=>{
    if(err){
      if(err.kind == "not_found") {
        res.status(401).send({
          message: "Not found user id: " + req.params.id
        });
      }else{
        res.status(500).send({
          message: "Error delete user id: " + req.params.id
        });
      }
    }
    else res.send(result);
  });
}
module.exports = {
  createNewRequest,
  getAllRequests,
  getUserHistories,
  updateRequest,
  deleteRequest
} 