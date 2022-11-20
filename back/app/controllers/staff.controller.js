const Staff = require("../models/Staff");
const createNewStaff = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  //const salt = bcrypt.genSaltSync(10);
  const staffObj = new Staff({
    name: req.body.name,
    visible: req.body.visible
  });
  Staff.create(staffObj, (err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."

      })
    }else res.send(data)
  });
}

const getAllStaffs = (req, res) => {
  Staff.getStaffRecords((err, data) => {
    console.log(data)
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."
      })
    }else res.send(data);
  })
}

const updateStaff = (req, res) => {
  if(!req.body) {
    res.status(400).send({ message: "Content can not be empty."});
  }
  const data = {
    name: req.body.name
  };
  Staff.updateByID(req.params.id, data, (err, result) => {
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

const deleteStaff = (req, res) => {
  Staff.remove(req.params.id, (err, result)=>{
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
  createNewStaff,
  getAllStaffs,
  updateStaff,
  deleteStaff
}