import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./profile.css";
import {
  Button,
  Modal,
  Accordion,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { deleteUser, updateUser, set_password } from "../../JS/actions/account";
import { fetchPayment } from "../../JS/actions/product";
import { Redirect } from "react-router-dom";

function ModalConfirm(props) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handelchange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirm = () => {
    props.deleteUser(password);
    handleClose();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete account
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label> Current Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Current Password"
            onChange={handelchange}
            value={password}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ProfileUser(props) {
  useEffect(() => {
    props.fetchPayment();
  }, []);
  const [updatePassword, setPassword] = useState({
    current_password: "",
    new_password: "",
    re_new_password: "",
  });

  const [updatedUser, setUpdatedUser] = useState({
    name: props.user ? props.user.name : "",
    email: props.user ? props.user.email : "",
  });

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    setPassword({ ...updatePassword, [e.target.name]: e.target.value });
  };
  const updateUser = () => {
    const name = updatedUser.name;
    props.updateUser(name);
  };

  const changePassword = () => {
    props.set_password(updatePassword);
  };

  return !props.user ? (
    <Redirect to="/login"></Redirect>
  ) : (
    <Container>
      <Accordion defaultActiveKey="0">
        <Row>
          <Col xs={4} className="show mt-4">
            <Accordion.Toggle className="show" as={Card.Header} eventKey="0">
              Account
            </Accordion.Toggle>
            <Accordion.Toggle className="show" as={Card.Header} eventKey="1">
              Payment History
            </Accordion.Toggle>
          </Col>

          <Col xs={8}>
            <Accordion.Collapse eventKey="0">
              <Card.Body style={{ height: "100%" }}>
                <div className="container-profile border-left pl-5">
                  <h3>My account</h3>
                  <div className="container-edit">
                    <label>Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entre Name"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleChange}
                    />
                    <Button className="btn-update" onClick={updateUser}>
                      {props.loading ? (
                        <i className="fa fa-circle-o-notch fa-spin"></i>
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                  <h5>Change your password</h5>
                  <div className="container-edit">
                    <label> Current Password</label>
                    <input
                      type="password"
                      name="current_password"
                      className="form-control"
                      placeholder="Current Password"
                      value={updatePassword.current_password}
                      onChange={handleChange}
                    />
                    <label>New Password</label>
                    <input
                      type="password"
                      name="new_password"
                      className="form-control"
                      placeholder="New Password"
                      value={updatePassword.new_password}
                      onChange={handleChange}
                    />
                    <label>Repeat new Password</label>
                    <input
                      type="password"
                      name="re_new_password"
                      className="form-control"
                      placeholder="confirm new Password"
                      value={updatePassword.re_new_password}
                      onChange={handleChange}
                    />
                    <Button className=" btn-update" onClick={changePassword}>
                      Confirm
                    </Button>
                  </div>
                  <div className="remove-account mb-4">
                    <h6>Remove Account</h6>
                    <p>You have the option to delete your account</p>
                    <p>NB: you will can't login with this account again </p>
                    <ModalConfirm deleteUser={props.deleteUser} />
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <table className="table border border-left pl-4">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border">
                        ID
                      </th>
                      <th scope="col" className="border">
                        Amount
                      </th>
                      <th scope="col" className="border">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.payments &&
                      props.payments.map((p) => {
                        return (
                          <tr key={p.id}>
                            <td className="pl-2 border">{p.id}</td>
                            <td className="pl-2 border">$ {p.amount}</td>
                            <td className="pl-2 border">
                              {new Date(p.timestamp).toUTCString()}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Card.Body>
            </Accordion.Collapse>
          </Col>
        </Row>
      </Accordion>
    </Container>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.account.user,
    loading: state.account.loading,
    error: state.error,
    payments: state.product.payments,
  };
};
export default connect(mapStateToProps, {
  deleteUser,
  updateUser,
  set_password,
  fetchPayment,
})(ProfileUser);
