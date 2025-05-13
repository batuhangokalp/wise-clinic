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
}) => {
  return (
    <Modal isOpen={openHeaderModal} toggle={toggleHeaderModal}>
      <ModalHeader toggle={toggleHeaderModal}>Add Variable</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="variableInput">Variable</Label>
          <Input
            id="variableInput"
            value={variableHeader}
            onChange={(e) => setVariableHeader(e.target.value)}
            placeholder="{{header}}"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleHeaderModal}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => handleAddVariableHeader(variableHeader)}
        >
          Add
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableHeaderInputModal;
