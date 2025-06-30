import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const BlockListModal = ({
  blockedModal,
  toggleBlockedModal,
  blockedContacts,
  t,
  confirmBlockAction,
  setBlockedContacts,
}) => {
  return (
    <Modal isOpen={blockedModal} toggle={toggleBlockedModal} centered>
      <ModalHeader toggle={toggleBlockedModal}>
        {t("Blocked Contacts")}
      </ModalHeader>
      <ModalBody>
        {blockedContacts?.data?.length === 0 ? (
          <p>{t("No blocked contacts found.")}</p>
        ) : (
          <ul className="list-unstyled">
            {blockedContacts?.data?.map((contact) => (
              <li
                key={contact.id}
                className="d-flex justify-content-between align-items-center py-2 border-bottom"
              >
                <span>
                  {contact?.name} {contact?.surname}
                </span>
                <Button
                  size="sm"
                  onClick={async () => {
                    const result = await confirmBlockAction(contact);
                    if (result?.success) {
                      setBlockedContacts((prev) => ({
                        ...prev,
                        data: prev.data.filter((c) => c.id !== contact.id),
                      }));
                    }
                  }}
                >
                  <i className="ri-subtract-line me-1"></i>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleBlockedModal}>
          {t("Close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BlockListModal;
