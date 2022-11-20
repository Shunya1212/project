const sql = require("./db");
const { strictEqual } = require("assert");

// Constructor
const Staff = function (staff) {
  this.name = staff.name;
  this.visible = staff.visible
}

Staff.create = (newStaff, result) => {
  sql.query("INSERT INTO staffs SET ?", newStaff, (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    console.log("Created staff: ", {
      id: res.insertId,
      ...newStaff
    });
    result(null, {
      id: res.insertId,
      ...newStaff
    });
  });
};

Staff.getStaffRecords = (result) => {
  sql.query("SELECT * FROM staffs", (err, res) => {
    console.log(res)
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Staff.updateByID = (id, data, result) => {
  sql.query("UPDATE staffs SET name=? WHERE id=?", 
  [data.name, id], (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if(res.affectedRows == 0) {
      // this staff id not found
      result({kind: "not_found"}, null);
      return;
    }
    console.log("Update staff: " , { id: id, ...data });
    result(null, { id: id, ...data });
  })
};

Staff.remove = (id, result) => {
  sql.query("DELETE FROM staffs WHERE id = ?", id, (err, res) => {
    if(err) {
      console.group("Query error: " + err)
      result(err, null)
      return;
    }
    if(res.affectedRows == 0) {
      result({kind: "not_found"}, null)
      return;
    }
    console.group("Deleted staffs id: " + id)
    result(null, {id: id})
  });
};

module.exports = Staff;