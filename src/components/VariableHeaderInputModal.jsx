import React from "react";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const VariableHeaderInputModal = ({
  openHeaderModal,
  toggleHeaderModal,
  variableHeader,
  setVariableHeader,
  handleAddVariableHeader,
  setOpenHeaderModal,
  tempKey,
  setTempKey,
  tempValue,
  setTempValue,
}) => {
  return (
    <Modal
      isOpen={openHeaderModal}
      toggle={() => setOpenHeaderModal(!openHeaderModal)}
    >
      <ModalHeader toggle={() => setOpenHeaderModal(!openHeaderModal)}>
        Add Header Variable
      </ModalHeader>
      <ModalBody>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
          You can enter a number (e.g., 1, 2, 3) for the variable inside the
          curly braces in the header field, and assign a corresponding value
          below.
        </p>
        <div className="mb-3">
          <label>Variable</label>
          <input
            className="form-control"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Enter Variable Number (e.g., 1, 2, 3)"
          />
        </div>
        <div className="mb-3">
          <label>Value</label>
          <input
            className="form-control"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Value"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddVariableHeader}>
          Ekle
        </Button>
        <Button color="secondary" onClick={() => setOpenHeaderModal(false)}>
          İptal
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableHeaderInputModal;
