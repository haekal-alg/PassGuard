import React, { Component } from "react";
export default class SignUp extends Component {
  render() {
    return (
      <form>
        <h3 style={{ color: "white", fontWeight: "bold" }}>Sign Up</h3>

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
        <div className="mb-3" style={{ color: "white", fontWeight: "bold" }}>
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
          />
        </div>
        <div className="mb-3">
          <label style={{ color: "white", fontWeight: "bold" }}>
            Master Password
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter master password"
          />
        </div>
        <div className="mb-3">
          <label style={{ color: "white", fontWeight: "bold" }}>
            Re-type Master Password
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter master password"
          />
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ background: "#4e2fff" }}
          >
            Sign Up
          </button>
        </div>
        <p
          className="forgot-password text-right"
          style={{ color: "white", fontWeight: "bold" }}
        >
          Already have an{" "}
          <a href="/sign-in" style={{ color: "white", fontWeight: "bold" }}>
            account?
          </a>
        </p>
      </form>
    );
  }
}
