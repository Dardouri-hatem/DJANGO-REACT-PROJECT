import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Redirect } from "react-router-dom";
import Order from "./order";

import CheckoutForm from "./checkoutForm";
// you should use env variables here to not commit this
// but it is a public key anyway, so not as sensitive
const stripePromise = loadStripe(
  "pk_test_51HpWUdAHdk3LQCR4NdO1v4XGdIci4KVffOBjlY3p84Y65CDxa2wz3NgaGAxoLDAFDbh8UoAy85cqHWNd5I5MyypH00fcFtkQqs"
);

const Index = () => {
  const [status, setStatus] = React.useState("ready");

  if (!localStorage.getItem("access")) {
    return <Redirect to="/"></Redirect>;
  }
  if (status === "success") {
    return (
      <div className="mt-5">
        <i
          class="fa fa-check-circle fa-5x d-flex justify-content-center"
          style={{ color: "green" }}
          aria-hidden="true"
        ></i>
        <h1 className="d-flex justify-content-center ">
          Congrats on your payment!
        </h1>
      </div>
    );
  }
  

  return (
    <Elements stripe={stripePromise}>

      <div className='container' style={{ display: "flex" }}>
        <CheckoutForm
          success={() => {
            setStatus("success");
          }}
        />
        <Order />
      </div>
    </Elements>
  );
};

export default Index;
