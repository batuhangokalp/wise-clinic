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
        Variable Ekle
      </ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label>Variable Key (ex: 1)</label>
          <input
            className="form-control"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="1"
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
