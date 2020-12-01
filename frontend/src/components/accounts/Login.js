import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../JS/actions/account";
import { Alert } from "react-bootstrap";

const Login = ({ login, isAuthenticated, error }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  };

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="container col-md-6 m-auto">
      <div className="card card-body mt-5">
        <h2 className="text-center">Login</h2>
        {error.id === "LOGIN_FAIL" ? (
          <Alert variant="danger">Please verify your email and password</Alert>
        ) : null}
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={(e) => onChange(e)}
              value={email}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={(e) => onChange(e)}
              value={password}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <p>
            Forget your Password?{" "}
            <Link to="/reset_password">Reset password</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.account.isAuthenticated,
  error: state.errors,
});

export default connect(mapStateToProps, { login })(Login);
