const sql = require("./db");
const { strictEqual } = require("assert");

// Constructor
const Request = function (request) {
  this.user_id = request.user_id;
  this.total_price = request.total_price;
  this.request_date = request.request_date;
  this.status = request.status;
}

Request.create = (newRequest, result) => {
  sql.query("INSERT INTO requests SET ?", newRequest, (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    console.log("Created request: ", {
      id: res.insertId,
      ...newRequest
    });
    result(null, {
      id: res.insertId,
      ...newRequest
    });
  });
};

Request.getAllRecords = (result) => {
  sql.query("SELECT * FROM requests", (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// User.updateByID = (id, data, result) => {
//   sql.query("UPDATE users SET name=?, email=?, address=? WHERE id=?", 
//   [data.name, data.email, data.address, id], (err, res) => {
//     if(err) {
//       console.log("Query error: " + err);
//       result(err, null);
//       return;
//     }
//     if(res.affectedRows == 0) {
//       // this user id not found
//       result({kind: "not_found"}, null);
//       return;
//     }
//     console.log("Update user: " , { id: id, ...data });
//     result(null, { id: id, ...data });
//   })
// };
Request.getHistoriesByID = (id, result) => {
  sql.query("SELECT id, total_price, request_date, status FROM requests WHERE user_id = ?", id, (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
}

Request.remove = (id, result) => {
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
    console.group("Deleted user id: " + id)
    result(null, {id: id})
  });
};
module.exports = Request;