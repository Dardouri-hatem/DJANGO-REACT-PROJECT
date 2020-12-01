import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchCart } from "../../JS/actions/product";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { Redirect } from "react-router-dom";
function Order(props) {
  useEffect(() => {
    if (props.user) {
      props.fetchCart(props.user.id);
    }
  }, [props.user]);
  return (
    <div
      className="mt-5"
      style={{
        width: "60%",
      }}
    >
      <MDBTable scrollY maxHeight="400px">
        <MDBTableBody style={{ height: "800px"}}>
          {props.cart &&
            props.cart.order_items.map((item) => (
              <tr key={item.id}>
                <th scope="row">
                  <img
                    src={item.item.photo_main}
                    alt=""
                    style={{ height: "100px", width: "150px" }}
                    className="img-fluid z-depth-0"
                  />
                </th>
                <td>
                  <h5 className="mt-3">
                    <strong>
                      {item.quantity} x {item.item.title}
                    </strong>
                  </h5>
                  <p className="text-muted">{item.item.category}</p>
                </td>
                <td className='d-flex justify-content-center pt-4'>{item.final_price}</td>
              </tr>
            ))}
        </MDBTableBody>
      </MDBTable>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          borderBottom:'0.1px solid gray'
        }}
      >
        <tr className="mr-4" style={{ alignSelf: "flex-end" }}>
          <td>Total : </td>
          <td></td>
          <td>{props.cart ? <h5>{props.cart.total}</h5> : null}</td>
        </tr>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  cart: state.product.cart,
  user: state.account.user,
});
export default connect(mapStateToProps, { fetchCart })(Order);
