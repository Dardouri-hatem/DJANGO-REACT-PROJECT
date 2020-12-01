import axios from "axios";

import {
  SIGNUP_SUCCESS,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  LOGOUT,
  LOGIN_SUCCESS,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  DELETE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER,
  SET_PASSWORD_SUCCESS
} from "../constants";

import { returnErrors } from "./errors";

// CHECK AUTHENTICATION
export const checkAuthenticated = () => async (dispatch) => {
  if (typeof window == "undefined") {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ token: localStorage.getItem("access") });

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/auth/jwt/verify/`,
        body,
        config
      );

      if (res.data.code !== "token_not_valid") {
        dispatch({
          type: AUTHENTICATED_SUCCESS,
        });
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

// REGISTER A NEW USER
export const sign_up = ({ name, email, password, re_password }) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password, re_password });
  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/auth/users/`,
      body,
      config
    );

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch(
      returnErrors({
        msg: error.response.data,
        status: error.response.status,
        id: "SIGNUP_FAIL",
      })
    );
  }
};

// VERIFY WITH AN EMAIL SENT TO USER'S EMAIL
export const verify = (uid, token) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ uid, token });

  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/auth/users/activation/`,
      body,
      config
    );

    dispatch({
      type: ACTIVATION_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
  }
};

// LOGIN A USER
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/auth/jwt/create/`,
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(load_user());
  } catch (error) {
    dispatch(
      returnErrors({
        msg: error.response.data,
        status: error.response.status,
        id: "LOGIN_FAIL",
      })
    );
  }
};

// LOAD A USER
export const load_user = () => async (dispatch) => {
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
        `http://127.0.0.1:8000/auth/users/me/`,
        config
      );

      dispatch({
        type: USER_LOADED_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } else {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

// FORGET PASSWORD ----> SENT AN EMAIL TO CONFIRM
export const reset_password = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/auth/users/reset_password/`,
      body,
      config
    );

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch(
      returnErrors({
        msg: error.response.data,
        status: error.response.status,
        id: "RESET_PASSWORD_FAIL",
      })
    );
  }
};

// RESET A NEW PASSWORD WITH LIEN SENT IN EMAIL
export const reset_password_confirm = (
  uid,
  token,
  new_password,
  re_new_password
) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ uid, token, new_password, re_new_password });

  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/auth/users/reset_password_confirm/`,
      body,
      config
    );

    dispatch({
      type: RESET_PASSWORD_CONFIRM_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RESET_PASSWORD_CONFIRM_FAIL,
    });
  }
};

// Delete User
export const deleteUser = (current_password) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/auth/users/me/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
        data: { current_password },
      });

      dispatch({
        type: DELETE_USER_SUCCESS,
      });
    } catch (error) {
      console.log(error);
    }
  }
};
export const updateUser = (name) => async (dispatch) => {
  dispatch({ type: UPDATE_USER });
  if (localStorage.getItem("access")) {
    let req = {
      url: "http://127.0.0.1:8000/auth/users/me/",
      method: "PUT",
      data: { name },
      headers: { Authorization: `JWT ${localStorage.getItem("access")}` },
    };
    try {
      const res = await axios(req);
      dispatch({
        load_user,
        type: UPDATE_USER_SUCCESS,
        payload: name,
      });
    } catch (error) {
      dispatch({ type: UPDATE_USER_FAIL });
    }
  }
};

// Set Password
export const set_password = ({
  current_password,
  new_password,
  re_new_password,
}) => async (dispatch) => {
  dispatch({ type: UPDATE_USER });
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
    },
  };
  const body = JSON.stringify({
    current_password,
    new_password,
    re_new_password,
  });
  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/auth/users/set_password/`,
      body,
      config
    );
    dispatch({type : SET_PASSWORD_SUCCESS})
  } catch (error) {
    console.log(error);
    dispatch({ type: UPDATE_USER_FAIL });
  }
};
// LOGOUT
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
};
