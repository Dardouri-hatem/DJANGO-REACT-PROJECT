import {
  START_CART,
  CART_SUCCESS,
  CART_FAIL,
  DELETE_SUCCESS,
  GET_PAYMENT_SUCCESS,
} from "../constants";
const initialeState = {
  loading: false,
  cart: null,
  payments:[]
};

const productReducer = (state = initialeState, { type, payload }) => {
  switch (type) {
    case START_CART:
      return { ...state, loading: true };
    case CART_SUCCESS:
      return { ...state, loading: false, cart: payload };
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: state.cart.filter((item) => item.order_items.id !== payload),
      };
    case CART_FAIL:
      return { ...state, loading: false, cart: null };
    case GET_PAYMENT_SUCCESS:
      return{...state,payments:payload}
    default:
      return state;
  }
};

export default productReducer;
