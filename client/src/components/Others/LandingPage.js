import React, { Component } from "react";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/css/argon-design-system-react.css";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

// core components
import LandingNavbar from "components/Others/LandingNavbar.js";

class LandingPage extends Component {
  state = {};
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  render() {
    return (
      <>
        <LandingNavbar />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped pb-250">
              <div className="shape shape-style-1 shape-primary">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <Container className="py-lg-md d-flex">
                <div className="col px-0">
                  <Row>
                    <Col lg="6">
                      <h1 className="display-3 text-white">
                        Easiest way to secure and manage your passwords!
                      </h1>
                      <p className="lead text-white">
                        A password manager designed to securely store and manage
                        sensitive information such as login information and
                        personal notes.
                      </p>
                      <div className="btn-wrapper">
                        <Button
                          className="btn-icon mb-3 mb-sm-0"
                          color="primary"
                          href="/register"
                        >
                          <span className="btn-inner--icon mr-1">
                            {/* <i className="fa fa-code" /> */}
                          </span>
                          <span className="btn-inner--text">Get started</span>
                        </Button>
                        <Button
                          className="btn-white btn-icon mb-3 mb-sm-0 ml-1"
                          color="default"
                          href="/login"
                        >
                          <span className="btn-inner--icon mr-1">
                            {/* <i className="ni ni-cloud-download-95" /> */}
                          </span>
                          <span className="btn-inner--text">Log in</span>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Container>
              {/* SVG separator */}
              <div className="separator separator-bottom separator-skew">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="fill-white"
                    points="2560 0 2560 100 0 100"
                  />
                </svg>
              </div>
            </section>
            {/* 1st Hero Variation */}
          </div>
        </main>
      </>
    );
  }
}

export default LandingPage;
