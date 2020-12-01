import "bootstrap/dist/css/bootstrap.min.css";
// import 'semantic-ui-css/semantic.min.css'

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/layout/Header";
import ProductList from "./components/Products/ProductList";
import ProductsDetails from "./components/Products/ProductsDetails";
import Login from "./components/accounts/Login";
import Signup from "./components/accounts/Signup";
import Activate from "./components/accounts/Activate";
import ResetPassword from "./components/accounts/ResetPassword";
import ResetPasswordConfirm from "./components/accounts/ResetPasswordConfirm";
import Footer from "./components/layout/footer";
import OrderSummary from "./components/Products/OrderSummary";
import CheckoutForm from "./components/Products/checkout";
import Profile from "./components/accounts/profile";

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
          <Switch>
            <Route exact path="/" component={ProductList} />
            <Route exact path="/products/:id" component={ProductsDetails} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Signup} />
            <Route exact path="/reset_password" component={ResetPassword} />
            <Route
              exact
              path="/password/reset/confirm/:uid/:token"
              component={ResetPasswordConfirm}
            />
            <Route exact path="/activate/:uid/:token" component={Activate} />
            <Route exact path="/order_summary" component={OrderSummary} />
            <Route exact path="/checkout" component={CheckoutForm} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        <Footer />
      </Router>
    );
  }
}

export default App;
