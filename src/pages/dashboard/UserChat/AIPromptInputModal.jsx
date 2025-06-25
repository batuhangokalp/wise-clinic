import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const AiPromptInputModal = ({
  showPromptModal,
  setShowPromptModal,
  customPrompt,
  setCustomPrompt,
  sendCustomPrompt,
}) => {
  return (
    <Modal
      isOpen={showPromptModal}
      toggle={() => setShowPromptModal(false)}
      centered
    >
      <ModalHeader toggle={() => setShowPromptModal(false)}>
        New AI Prompt
      </ModalHeader>
      <ModalBody>
        <Input
          type="textarea"
          placeholder="Enter your custom AI prompt here..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={4}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={sendCustomPrompt}>
          Send
        </Button>
        <Button color="secondary" onClick={() => setShowPromptModal(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AiPromptInputModal;
