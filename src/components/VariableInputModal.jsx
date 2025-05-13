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
  variableContent,
  setVariableContent,
  handleAddVariableContent,
}) => {
  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add Variable</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="variableInput">Variable</Label>
          <Input
            id="variableInput"
            value={variableContent}
            onChange={(e) => setVariableContent(e.target.value)}
            placeholder="{{content}}"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => handleAddVariableContent(variableContent)}
        >
          Add
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableInputModal;
