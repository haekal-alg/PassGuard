import React, { Component } from "react";
export default class Login extends Component {
  render() {
    return (
      <form>
        <h3 style={{ color: "white", fontWeight: "bold" }}>Sign In</h3>
        <div className="mb-3">
          <label style={{ color: "white", fontWeight: "bold" }}>
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label style={{ color: "white", fontWeight: "bold" }}>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label
              style={{ color: "white" }}
              className="custom-control-label"
              htmlFor="customCheck1"
            >
              Remember me
            </label>
          </div>
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ background: "#4e2fff" }}
          >
            Submit
          </button>
        </div>
        <p
          style={{ color: "white", fontWeight: "bold" }}
          className="forgot-password text-right"
        >
          Don't have an{" "}
          <a style={{ color: "white", fontWeight: "bold" }} href="/sign-up">
            account?
          </a>
        </p>
      </form>
    );
  }
}
