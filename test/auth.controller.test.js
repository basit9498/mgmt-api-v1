const { expect } = require("chai");
const sinon = require("sinon");
const Staff = require("../model/staffModel");
const AuthController = require("../controller/staffController");
const mongoose = require("mongoose");
const { before } = require("mocha");

describe("Staff  Controller", function () {
  before(function (done) {
    mongoose
      .connect("mongodb://0.0.0.0:27017/mgmt-db-test")
      .then((result) => {
        const staff = new Staff({
          name: "Abc Test",
          email: "test@test.com",
          password: "1234",
          role: "ADMIN",
          _id: "6361ee698d013355bb1f838b",
        });
        return staff.save();
      })
      .then(() => {
        done();
      });
  });

  it("should throw error with code 500 id access the database fail", function (done) {
    sinon.stub(Staff, "findOne");
    Staff.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "12345678",
      },
    };
    AuthController.loginStaff(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("status", 500);
      done();
    });
    expect();
    Staff.findOne.restore();
  });

  it("should send response with valid user status for an existing user", function (done) {
    const req = { staff_id: "6361ee698d013355bb1f838b" };
    const res = {
      statusCode: 500,
      staffRole: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.staffRole = data.staff_role;
      },
    };
    AuthController.checkStaffRole(req, res, () => {}).then((result) => {
      // console.log("result", res);
      expect(res.statusCode).to.be.equal(200);
      expect(res.staffRole).to.be.equal("ADMIN");
      done();
    });
  });

  after(function (done) {
    Staff.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
