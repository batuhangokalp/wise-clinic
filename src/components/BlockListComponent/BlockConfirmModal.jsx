import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const BlockConfirmModal = ({
  confirmBlockModal,
  toggleConfirmBlockModal,
  contactToBlock,
  confirmBlockAction,
  t,
}) => {
  return (
    <Modal isOpen={confirmBlockModal} toggle={toggleConfirmBlockModal} centered>
      <ModalHeader toggle={toggleConfirmBlockModal}>
        {contactToBlock?.is_blocked ? t("Unblock Contact") : t("Block Contact")}
      </ModalHeader>
      <ModalBody>
        {contactToBlock?.is_blocked
          ? t("Are you sure you want to unblock {{name}}?", {
              name: contactToBlock?.name,
            })
          : t("Are you sure you want to block {{name}}?", {
              name: contactToBlock?.name,
            })}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleConfirmBlockModal}>
          {t("Cancel")}
        </Button>
        <Button
          color="danger"
          onClick={() => confirmBlockAction(contactToBlock)}
        >
          {contactToBlock?.is_blocked ? t("Unblock") : t("Block")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BlockConfirmModal;
