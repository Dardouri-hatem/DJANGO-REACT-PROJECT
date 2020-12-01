import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import Select from "react-select";
import {fetchCart} from '../../JS/actions/product'

const CheckoutForm = ({ success, user,fetchCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [countries, setCountries] = React.useState([]);
  const [address_data, setData] = React.useState({
    apartment_address: "",
    country: "",
    street_address: "",
    zip: "",
  });

  const handleFormatCountries = (countries) => {
    const keys = Object.keys(countries);
    return keys.map((k) => {
      return {
        label: countries[k],
        value: k,
      };
    });
  };
  React.useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/products/country_list/")
      .then((res) => setCountries(handleFormatCountries(res.data)));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const user_id = user.id;
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("access")}`,
            Accept: "application/json",
          },
        };
        const { data } = await axios.post(
          `http://127.0.0.1:8000/products/checkout/`,
          {
            payment_method_id: paymentMethod.id,
            user_id,
            zip: address_data.zip,
            street_address: address_data.street_address,
            apartement_address: address_data.apartment_address,
            country: address_data.country,
          },
          config
        );
        fetchCart(user_id)
        success();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setData({ ...address_data, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (e, { name, value }) => {
    setData({ ...address_data, [name]: e.label });
  };

  return (
    <div className="w-50 m-5">
      <Form>
        <h6>You need to add addresses before you can complete your purchase</h6>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Street address"
            name="street_address"
            value={address_data.street_address}
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Apartment address"
            name="apartment_address"
            value={address_data.apartment_address}
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Select
            options={countries}
            placeholder="Country"
            name="country"
            label={address_data.country}
            onChange={handleSelectChange}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Postal code"
            name="zip"
            value={address_data.zip}
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
      </Form>
      <form
        className="mt-3 mr-5"
        onSubmit={handleSubmit}
        style={{ width: "100%" }}
      >
        <h4 className="mb-3">Would you complete your purchase ?</h4>
        <CardElement />
        <Button
          className="mt-3"
          type="submit"
          disabled={!stripe}
          style={{ width: "100%" }}
        >
          Pay
        </Button>
      </form>
    </div>
  );
};
const mapSTP = (state) => ({
  user: state.account.user,
});
export default connect(mapSTP,{fetchCart})(CheckoutForm);
