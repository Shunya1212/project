const sql = require("./db");
const { strictEqual } = require("assert");

// Constructor
const Transaction = function (transaction) {
    this.request_id = transaction.id;
  };

  Transaction.getAllRecords = (result) => {
    sql.query("SELECT id,request_date,status FROM requests", (err, res) => {
     if(err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  };

  Transaction.RejectByID = (id, data, result) => {
    sql.query("UPDATE requests SET status=? WHERE id=?", 
    [data.status, id], (err, res) => {
      if(err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if(res.affectedRows == 0) {
        // this user id not found
        result({kind: "not_found"}, null);
        return;
      }
      console.log("Update status: " , { id: id, ...data });
      result(null, { id: id, ...data });
    })

    sql.query("UPDATE staffs SET visible=? WHERE id=?", 
    [0, data.staff_id], (err, res) => {
      if(err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if(res.affectedRows == 0) {
        // this user id not found
        result({kind: "not_found"}, null);
        return;
      }
      console.log("Update status: " , { id: id, ...data });
      result(null, { id: id, ...data });
    })
  };

  Transaction.InProgressByID = (id, data, result) => {
    sql.query("UPDATE requests SET status=? WHERE id=?", 
    [data.status, id], (err, res) => {
      if(err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if(res.affectedRows == 0) {
        // this user id not found
        result({kind: "not_found"}, null);
        return;
      }
      console.log("Update status: " , { id: id, ...data });
      result(null, { id: id, ...data });
    })

    sql.query("UPDATE staffs SET visible=? WHERE id=?", 
    [1, data.staff_id], (err, res) => {
      if(err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if(res.affectedRows == 0) {
        // this user id not found
        result({kind: "not_found"}, null);
        return;
      }
      console.log("Update status: " , { id: id, ...data });
      result(null, { id: id, ...data });
    })
  };

  Transaction.remove = (id, result) => {
    sql.query("DELETE FROM requests WHERE id = ?", id, (err, res) => {
      if(err) {
        console.group("Query error: " + err)
        result(err, null)
        return;
      }
      if(res.affectedRows == 0) {
        result({kind: "not_found"}, null)
        return;
      }
      console.group("Deleted transaction id: " + id)
      result(null, {id: id})
    });
  };

  module.exports = Transaction;