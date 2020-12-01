import {
  SIGNUP_SUCCESS,
  LOGOUT,
  LOGIN_SUCCESS,
  AUTHENTICATED_SUCCESS,
  USER_LOADED_SUCCESS,
  DELETE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  SET_PASSWORD_SUCCESS,
} from "../constants";
const initialeState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: null,
  user: JSON.parse(localStorage.getItem("user")),
  loading: false,
};

const account = (state = initialeState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("access", payload.access);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };

    case USER_LOADED_SUCCESS:
      localStorage.setItem("user", JSON.stringify(payload));
      return {
        ...state,
        user: payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: { ...state.user, name: payload },
      };
    case UPDATE_USER_FAIL:
      return {
        ...state,
        loading: false,
      };
    case SET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case DELETE_USER_SUCCESS:
    case LOGOUT:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default account;
