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
        <FormGroup>
          <Label for="keyInput">Key (ex: 2)</Label>
          <Input
            id="keyInput"
            type="number"
            value={tempContentKey}
            onChange={(e) => setTempContentKey(e.target.value)}
            placeholder="Enter Key"
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
