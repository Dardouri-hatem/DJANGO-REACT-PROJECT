import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  logout,
  checkAuthenticated,
  load_user,
} from "../../JS/actions/account";
import { fetchCart } from "../../JS/actions/product";

export class Header extends Component {
  componentDidMount = () => {
    const fetchData = async () => {
      try {
        await this.props.checkAuthenticated();
        await this.props.load_user();
        await this.props.fetchCart(this.props.account.user.id);
      } catch (err) {}
    };

    fetchData();
  };

  render() {
    const { access, user } = this.props.account;
    const { cart } = this.props;

    const authLinks = (
      <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
        <li className="nav-item item-cart">
          <a className="nav-link waves-effect item-cart">
            {cart
              ? cart.order_items.length !== 0 && (
                  <span className="badge">{cart.order_items.length}</span>
                )
              : null}
          </a>
          <div className="dropdown ">
            <button
              className="btn btn-secondary dropdown-toggle bg-transparent border-0 btn_cart mr-2"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fa fa-shopping-cart mr-1" aria-hidden="true"></i>{" "}
              Cart
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {cart
                ? cart.order_items.length !== 0 &&
                  cart.order_items.map((item) => (
                    <a className="dropdown-item" key={item.id}>
                      {item.quantity} x {item.item.title}
                    </a>
                  ))
                : null}
              {cart
                ? cart.order_items.length == 0 && (
                    <a className="dropdown-item">No item in your cart</a>
                  )
                : null}

              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="/order_summary">
                <i className="fa fa-arrow-right mr-1" aria-hidden="true"></i>
                Checkout
              </a>
            </div>
          </div>
        </li>
        <span className="navbar-text mr-3">
        <Link to="/profile" className = 'nav-link-to mr-3 ml-2'>Profile</Link>
          <strong>{user ? `Welcome ${user.name}` : ""}</strong>
        </span>
        <li className="nav-item">
          <button
            onClick={this.props.logout}
            className="nav-link btn btn-info btn-sm text-light"
          >
            Logout
          </button>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a className="navbar-brand" href="#">
              Store App
            </a>
            <Link className="nav-link-to" to="/">
              Home
            </Link>
          </div>
          {access ? authLinks : guestLinks}
          {/* {access ? null : <Redirect to="/" />} */}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  cart: state.product.cart,
});

export default connect(mapStateToProps, {
  logout,
  checkAuthenticated,
  load_user,
  fetchCart,
})(Header);
