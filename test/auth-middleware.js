const { expect } = require("chai");
const isAuth = require("../middleware/is-auth");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

describe("Auth Middleware", function () {
  it("should be throw error if no auth header is present", function () {
    //   req
    const req = {
      get: function (header) {
        return null;
      },
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw(
      "Not Authenticated !"
    );
  });

  it("should thrown an error id auth header is only one string", function () {
    const req = {
      get: function (header) {
        return "sac";
      },
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decode the token ", function () {
    const req = {
      get: function (header) {
        return "Bearer sac";
      },
    };

    sinon.stub(jwt, "verify");

    jwt.verify.returns({ id: "abc" });

    // jwt.verify = function () {
    //   return { userId: "aba" };
    // };

    isAuth(req, {}, () => {});

    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;

    jwt.verify.restore();
  });

  it("should thrown error if the token cannot be verified", function () {
    const req = {
      get: function (header) {
        return "Bearer sac";
      },
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });
});
