const Transaction = require("../models/Transaction");
// const InProgressTransaction = (req, res) => {
//     if (!req.body.staff_id) {
//         res.status(400).send({
//           message: "Must choose a staff."
//         });
//       }
//     const data = {
//         status: req.body.status,
//         staff_id: req.body.staff_id,
//       };
//     Transaction.InProgressByID(req.params.id, data, (err, result) => {
//         if(err) {
//           if(err.kind == "not_found") {
//             res.status(401).send({
//               message: "Not found transaction id: " + req.params.id
//             });
//           } else {
//             res.status(500).send({
//               message: "Error update transaction id: " + req.params.id
//             });
//           }
//         } else res.send(result);
//       });       
// };

// const RejectTransaction = (req, res) => {
//     const dataReject = {
//         status: req.body.status
//       };
//     Transaction.RejectByID(req.params.id, dataReject, (err, result) => {
//         if(err) {
//           if(err.kind == "not_found") {
//             res.status(401).send({
//               message: "Not found transaction id: " + req.params.id
//             });
//           } else {
//             res.status(500).send({
//               message: "Error update transaction id: " + req.params.id
//             });
//           }
//         } else res.send(result);
//       });  
// };

const getAllTransactions = (req, res) => {
    Transaction.getAllRecords((err, data) => {
        if(err) {
          res.status(500).send({
            message: err.message || "Some error occured while changing status."
          })
        }else res.send(data);
      });
}

const updateTransaction = (req, res) => {
    if(req.body.status == "Reject"){
        const dataReject = {
            status: req.body.status,
            staff_id: req.body.staff_id
          };
        Transaction.RejectByID(req.params.id, dataReject, (err, result) => {
            if(err) {
              if(err.kind == "not_found") {
                res.status(401).send({
                  message: "Not found transaction id: " + req.params.id
                });
              } else {
                res.status(500).send({
                  message: "Error update transaction id: " + req.params.id
                });
              }
            } else res.send(result);
          });  
    }
    else{
        if (!req.body.staff_id) {
            res.status(400).send({
              message: "Must choose a staff."
            });
          }
        const data = {
            status: req.body.status,
            staff_id: req.body.staff_id,
          };
        Transaction.InProgressByID(req.params.id, data, (err, result) => {
            if(err) {
              if(err.kind == "not_found") {
                res.status(401).send({
                  message: "Not found transaction id: " + req.params.id
                });
              } else {
                res.status(500).send({
                  message: "Error update transaction id: " + req.params.id
                });
              }
            } else res.send(result);
          });   
    }
}

const deleteTransaction = (req, res) => {
    Transaction.remove(req.params.id, (err, result)=>{
        if(err){
          if(err.kind == "not_found") {
            res.status(401).send({
              message: "Not found transaction id: " + req.params.id
            });
          }else{
            res.status(500).send({
              message: "Error delete transaction id: " + req.params.id
            });
          }
        }
        else res.send(result);
      });
}

module.exports = {
    // InProgressTransaction,
    // RejectTransaction,
    getAllTransactions,
    updateTransaction,
    deleteTransaction
  }