import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { sign_up } from "../../JS/actions/account";

export class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    re_password: "",
    accountCreated: false,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, re_password } = this.state;
    if (password === re_password) {
      this.props.sign_up({
        name,
        email,
        password,
        re_password,
      });
      this.setState({ accountCreated: true });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { accountCreated } = this.state;
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    if (accountCreated) return <Redirect to="/login" />;
    const { name, email, password, re_password } = this.state;
    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Register</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                name="name"
                onChange={this.onChange}
                value={name}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={this.onChange}
                value={email}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={this.onChange}
                value={password}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="re_password"
                onChange={this.onChange}
                value={re_password}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.account.isAuthenticated,
});

export default connect(mapStateToProps, { sign_up })(Register);
