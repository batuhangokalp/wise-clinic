import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function AiSuggestionModal({
  isOpen,
  suggestion,
  anotherSuggestion, // yeni prop
  onAccept,
  onReject,
  loading,
}) {
  const finalSuggestion = anotherSuggestion || suggestion;

  return (
    <Modal isOpen={isOpen} backdrop="static" centered>
      <ModalHeader>AI Suggestion</ModalHeader>
      <ModalBody>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <i
              className="ri-robot-2-line ri-spin"
              style={{ fontSize: "48px", color: "#0d6efd" }}
            />
            <p style={{ marginTop: "12px", fontSize: "18px" }}>
              Waiting for AI...
            </p>
          </div>
        ) : (
          <p>{finalSuggestion}</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" disabled={loading} onClick={onAccept}>
          Accept
        </Button>
        <Button color="secondary" disabled={loading} onClick={onReject}>
          Try Again
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default AiSuggestionModal;
