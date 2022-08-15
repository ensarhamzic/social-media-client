import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { modalActions } from "../store/modal-slice";

const MainModal = ({ children }) => {
  const dispatch = useDispatch();
  const modalHideHandler = () => {
    dispatch(modalActions.hide());
  };
  const modal = useSelector((state) => state.modal);
  return (
    <Modal show={modal.show} onHide={modalHideHandler} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {modal.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={modalHideHandler}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MainModal;
