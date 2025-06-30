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

const VariableInputModal = ({
  open,
  toggle,
  handleAddVariableContent,
  tempContentKey,
  setTempContentKey,
  tempContentValue,
  setTempContentValue,
}) => {
  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add Content Variable</ModalHeader>
      <ModalBody>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
          You can enter a number (e.g., 1, 2, 3) for the variable inside the
          curly braces in the content field, and assign a corresponding value
          below.
        </p>
        <FormGroup>
          <Label for="keyInput">Variable</Label>
          <Input
            id="keyInput"
            type="number"
            value={tempContentKey}
            onChange={(e) => setTempContentKey(e.target.value)}
            placeholder="Enter Variable Number (e.g., 1, 2, 3)"
          />
        </FormGroup>
        <FormGroup>
          <Label for="valueInput">Value</Label>
          <Input
            id="valueInput"
            value={tempContentValue}
            onChange={(e) => setTempContentValue(e.target.value)}
            placeholder="Enter Value"
          />
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleAddVariableContent}>
          Add
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableInputModal;
