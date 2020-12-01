import { CART_SUCCESS, CART_FAIL, DELETE_SUCCESS,GET_PAYMENT_SUCCESS} from "../constants";
import axios from "axios";
// import { returnErrors, clearErrors } from "./errors";

export const fetchCart = (user_id) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/products/OrderSummary/${user_id}`,
        config
      );

      dispatch({
        type: CART_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CART_FAIL,
      });
    }
  } else {
    dispatch({
      type: CART_FAIL,
    });
  }
};

export const DeleteItemFromCart = (id) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      await axios.delete(
        `http://127.0.0.1:8000/products/order-items/${id}/delete/`,
        config
      );

      dispatch({
        type: DELETE_SUCCESS,
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: CART_FAIL,
      });
    }
  } else {
    dispatch({
      type: CART_FAIL,
    });
  }
};

// Payment history
export const fetchPayment = () => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `JWT ${localStorage.getItem("access")}`,
    },
  };
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/products/payment_history/",
      config
    );
    dispatch({
      type : GET_PAYMENT_SUCCESS,
      payload: res.data.results,
    });
  } catch (error) {}
};
