import React, { Component } from "react";
import { fetchCart, DeleteItemFromCart } from "../../JS/actions/product";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

class OrderSummary extends Component {
  state = { loading: false };
  componentDidMount() {
    const fetchData = async () => {
      try {
        this.setState({ loading: true });
        await this.props.fetchCart(this.props.user.id);
        this.setState({ loading: false });
      } catch (error) {}
    };

    fetchData();
  }

  handleDelete = (id) => {
    this.props.DeleteItemFromCart(id);
    // this.props.fetchCart(this.props.user.id);
  };

  AddQuantityItem = (slug) => {
    if (this.props.user) {
      const user_id = this.props.user.id;
      console.log(user_id);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };

      axios
        .post(
          `http://127.0.0.1:8000/products/add-to-cart/`,
          { slug, user_id },
          config
        )
        .then((res) => {
          this.props.fetchCart(this.props.user.id);
          console.log("done", res.data);
        })
        .catch((err) => {});
    }
  };

  MinusQuantityItem = (slug) => {
    if (this.props.user) {
      const user_id = this.props.user.id;
      console.log(user_id);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };

      axios
        .post(
          `http://127.0.0.1:8000/products/update_quantity/`,
          { slug, user_id },
          config
        )
        .then((res) => {
          this.props.fetchCart(this.props.user.id);
          console.log("done", res.data);
        })
        .catch((err) => {});
    }
  };
  render() {
    const { cart } = this.props;
    const { loading } = this.state;
    if (!cart)
      return (
        <div>
          {" "}
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <div >
              <img
                className="w-25 rounded mx-auto d-block"
                src="https://webmobtuts.com/wp-content/uploads/2018/05/Creating-a-Shopping-Cart-With-Laravel.png"
                alt=""
              />
              <h2 className="d-flex justify-content-center mt-2">
                Your shoping cart is Empty
              </h2>
            </div>
          )}
        </div>
      );
    return (
      <div>
        {loading ? (
          <div className="d-flex justify-content-center mt-5  ">
            <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="card mt-1 container " style={{ width: "100%" }}>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table product-table ">
                  <thead className="mdb-color lighten-5">
                    <tr className='bg-light'>
                      <th></th>
                      <th className="font-weight-bold">
                        <strong>Product</strong>
                      </th>

                      <th></th>
                      <th className="font-weight-bold">
                        <strong>Price</strong>
                      </th>
                      <th className="font-weight-bold">
                        <strong>Quantity</strong>
                      </th>
                      <th className="font-weight-bold">
                        <strong>Total Item</strong>
                      </th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart
                      ? cart.order_items.map((item) => (
                          <tr key={item.id}>
                            <th scope="row">
                              <img
                                src={item.item.photo_main}
                                alt=""
                                className="img-fluid z-depth-0"
                              />
                            </th>
                            <td >
                              <h5 className="mt-3">
                                <strong>{item.item.title}</strong>
                              </h5>
                              <p className="text-muted">{item.item.category}</p>
                            </td>
                            <td></td>
                            <td className='pt-5'>{item.item.price}</td>
                            <td className='pt-5'>
                              <i
                                className="fa fa-minus mr-3"
                                aria-hidden="true"
                                onClick={(slug) =>
                                  this.MinusQuantityItem(item.item.slug)
                                }
                              ></i>
                              <span>{item.quantity}</span>
                              <i
                                className="fa fa-plus ml-3"
                                aria-hidden="true"
                                onClick={(slug) =>
                                  this.AddQuantityItem(item.item.slug)
                                }
                              ></i>
                            </td>
                            <td className="font-weight-bold pt-5 ">
                              <strong>{item.final_price}</strong>
                            </td>
                            <td className='pt-5'>
                              <span
                                className="btn btn-danger"
                                onClick={() => this.handleDelete(item.id)}
                              >
                                <i className="fa fa-trash-o fa-lg"></i> Delete
                              </span>
                            </td>
                          </tr>
                        ))
                      : null}
                    <tr>
                      <td colSpan="3"></td>
                      <td>
                        <h4 className="mt-2">
                          <strong>Total</strong>
                        </h4>
                      </td>
                      <td className="text-right">
                        <h4 className="mt-2">
                          <strong>{cart ? cart.total : null}</strong>
                        </h4>
                      </td>
                      <td colSpan="3" className="text-right">
                        <Link to="/checkout">
                          <button
                            type="button"
                            className="btn btn-warning btn-rounded"
                          >
                            Complete purchase
                            <i
                              className="fa fa-angle-right ml-2 fa-lg"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.account.user,
  cart: state.product.cart,
});
export default connect(mapStateToProps, { fetchCart, DeleteItemFromCart })(
  OrderSummary
);
