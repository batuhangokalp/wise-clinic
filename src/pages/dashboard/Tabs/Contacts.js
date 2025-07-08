import React, { useEffect, useState } from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  UncontrolledTooltip,
  InputGroup,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { connect, useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  createContact,
  fetchContacts,
  resetContactWarnings,
  updateContact,
} from "../../../redux/actions";
import * as Yup from "yup";
import AddContactModal from "../../../components/AddContactModal";
import UpdateContactModal from "../../../components/UpdateContactModal";
import { PERMISSIONS } from "../../../redux/role/constants";
import PermissionWrapper from "../../../components/PermissionWrapper";
import BlockListModal from "../../../components/BlockListComponent/BlockListModal";
import BlockConfirmModal from "../../../components/BlockListComponent/BlockConfirmModal";
import { toast } from "react-toastify";

const Contacts = (props) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmBlockModal, setConfirmBlockModal] = useState(false);
  const [contactToBlock, setContactToBlock] = useState(null);
  const [blockedModal, setBlockedModal] = useState(false);
  const [blockedContacts, setBlockedContacts] = useState([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedContact, setSelectedContact] = useState({
    assigned_user_id: null,
    avatar: null,
    birth_date: null,
    contact_email: "",
    country: "",
    created_at: null,
    facebook_user_id: null,
    id: null,
    instagram_user_id: "",
    language_id: null,
    message_channel_id: null,
    name: "",
    phone_number: "",
    sex: "",
    surname: "",
    updated_at: null,
    is_blocked: false,
  });

  const toggleModal = () => {
    dispatch(resetContactWarnings());
    setModal(!modal);
  };

  const toggleUpdateModal = () => {
    dispatch(resetContactWarnings());
    setUpdateModal(!updateModal);
  };

  const toggleConfirmBlockModal = () => {
    setConfirmBlockModal(!confirmBlockModal);
  };

  const handleBlockToggleClick = (contact) => {
    setContactToBlock(contact);
    toggleConfirmBlockModal();
  };

  const toggleBlockedModal = () => setBlockedModal(!blockedModal);

  const validationSchema = Yup.object({
    name: Yup.string().required(props.t("Name is required")),
    surname: Yup.string().required(props.t("Surname is required")),
    phone_number: Yup.string()
      .matches(/^\+?[0-9]{7,15}$/, props.t("Phone number is not valid"))
      .required(props.t("Phone number is required")),
    contact_email: Yup.string()
      .email(props.t("Email is not valid"))
      .required(props.t("Email is required")),
  });

  const updateValidationSchema = Yup.object({
    name: Yup.string().required(props.t("Name is required")),
    contact_email: Yup.string()
      .email(props.t("Email is not valid"))
      .required(props.t("Email is required")),
  });

  const handleSubmit = async (values, { resetForm }) => {
    let response = await dispatch(createContact(values));
    if (response) {
      setTimeout(async () => {
        toggleModal();
        resetForm();
        await dispatch(fetchContacts());
      }, 3000);
    }
  };

  const handleUpdateSubmit = async (values, { resetForm }) => {
    let response = await dispatch(updateContact(values));
    if (response) {
      setTimeout(async () => {
        toggleUpdateModal();
        resetForm();
        await dispatch(fetchContacts());
      }, 3000);
    }
  };

  const handleContact = (e, contact) => {
    e.preventDefault();
    setSelectedContact({
      id: contact?.id,
      name: contact?.name,
      contact_email: contact?.contact_email,
      ...contact,
    });
    toggleUpdateModal();
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        await dispatch(fetchContacts());
      } catch (error) {
        console.error("Contacts fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [dispatch]);

  const groupContactsByInitial = (contacts) => {
    return contacts.reduce((grouped, contact) => {
      const initial = contact?.name?.charAt(0)?.toUpperCase() || "#";
      if (!grouped[initial]) {
        grouped[initial] = [];
      }
      grouped[initial].push(contact);
      return grouped;
    }, {});
  };
  const filteredContacts = (props.contacts || []).filter((contact) => {
    const fullName = `${contact.name} ${contact.surname}`.toLowerCase();
    const phone = contact.phone_number?.toLowerCase() || "";
    const email = contact.contact_email?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) || phone.includes(query) || email.includes(query)
    );
  });

  const groupedContacts = groupContactsByInitial(filteredContacts);

  const confirmBlockAction = async (contact) => {
    if (!contact) return { success: false };

    try {
      const url = contact.is_blocked
        ? `${process.env.REACT_APP_API_URL}/api/contacts/unblock/${contact.id}`
        : `${process.env.REACT_APP_API_URL}/api/contacts/block/${contact.id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update block status");

      toast.success(
        contact.is_blocked
          ? "Contact unblocked successfully."
          : "Contact blocked successfully."
      );

      await dispatch(fetchContacts());
      return { success: true };
    } catch (error) {
      console.error("Error updating block status:", error);
      toast.error("Failed to update block status.");
      return { success: false };
    } finally {
      setConfirmBlockModal(false);
      setContactToBlock(null);
    }
  };

  const handleBlockedButtonClick = () => {
    toggleBlockedModal();
    fetchBlockedContacts();
  };

  const fetchBlockedContacts = async () => {
    setLoadingBlocked(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/contacts/blocklist`,
        {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch blocked contacts");
      const data = await response.json();
      setBlockedContacts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blocked contacts");
    } finally {
      setLoadingBlocked(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          flexDirection: "column",
        }}
      >
        <img
          src="/upsense-logo.png"
          alt=""
          style={{
            width: "150px",
            height: "150px",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            marginTop: "12px",
            color: "#cfd8dc",
            fontSize: "20px",
          }}
        >
          Loading contacts...
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div>
        <div className="p-4">
          <div className="user-chat-nav float-end ">
            <div id="add-contact">
              <Button
                type="button"
                color="link"
                onClick={toggleModal}
                className="text-decoration-none text-muted font-size-18 py-0"
              >
                <i className="ri-user-add-line"></i>
              </Button>
            </div>
            <UncontrolledTooltip target="add-contact" placement="bottom">
              {props.t("Add Contact")}
            </UncontrolledTooltip>
            <div id="blocked-contacts" className="ms-2">
              <Button
                type="button"
                color="link"
                onClick={handleBlockedButtonClick}
                className="text-decoration-none text-muted font-size-18 py-0"
              >
                <i className="ri-forbid-line"></i>
              </Button>
            </div>
            <UncontrolledTooltip target="blocked-contacts" placement="bottom">
              {props.t("Blocked Contacts")}
            </UncontrolledTooltip>
          </div>

          <h4 className="mb-4">{props.t("Contacts")}</h4>

          {/* Add Contact Modal */}
          <AddContactModal
            modal={modal}
            toggleModal={toggleModal}
            handleSubmit={handleSubmit}
            validationSchema={validationSchema}
            parentProps={props}
            t={props.t}
          />
          {/* Update Contact Modal */}
          <UpdateContactModal
            modal={updateModal}
            toggleModal={toggleUpdateModal}
            handleSubmit={handleUpdateSubmit}
            validationSchema={updateValidationSchema}
            parentProps={props}
            t={props.t}
            selectedContact={selectedContact}
          />

          <div className="search-box chat-search-box">
            <InputGroup size="lg" className="bg-light rounded-lg">
              <Button
                color="link"
                className="text-decoration-none text-muted pr-1"
                type="button"
              >
                <i className="ri-search-line search-icon font-size-18"></i>
              </Button>
              <input
                type="text"
                className="form-control bg-light"
                placeholder={props.t("Search users..")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        {/* Contact List */}
        <SimpleBar
          style={{ maxHeight: "100%" }}
          id="chat-room"
          className="p-4 chat-message-list chat-group-list"
        >
          {Object.keys(groupedContacts)
            .sort()
            .map((initial) => (
              <div key={initial}>
                <div className="p-3 fw-bold text-primary">{initial}</div>
                <ul className="list-unstyled contact-list">
                  {groupedContacts[initial].map((contact, index) => (
                    <li key={index}>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h5
                            onClick={(e) => handleContact(e, contact)}
                            className="font-size-14 m-0"
                          >
                            {contact.name}
                          </h5>
                        </div>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="text-muted">
                            <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem
                              onClick={() => handleBlockToggleClick(contact)}
                            >
                              {contact.is_blocked
                                ? props.t("Unblock")
                                : props.t("Block")}{" "}
                              <i
                                className={
                                  contact.is_blocked
                                    ? "ri-check-line float-end text-muted"
                                    : "ri-forbid-line float-end text-muted"
                                }
                              ></i>
                            </DropdownItem>

                            {/* <DropdownItem>
                              {props.t("Share")}{" "}
                              <i className="ri-share-line float-end text-muted"></i>
                            </DropdownItem>

                            <DropdownItem>
                              {props.t("Remove")}{" "}
                              <i className="ri-delete-bin-line float-end text-muted"></i>
                            </DropdownItem> */}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </SimpleBar>
      </div>
      {/* Confirm Block Modal */}
      <BlockConfirmModal
        confirmBlockModal={confirmBlockModal}
        toggleConfirmBlockModal={toggleConfirmBlockModal}
        contactToBlock={contactToBlock}
        confirmBlockAction={confirmBlockAction}
        t={props.t}
      />

      <BlockListModal
        blockedModal={blockedModal}
        toggleBlockedModal={toggleBlockedModal}
        blockedContacts={blockedContacts}
        confirmBlockAction={confirmBlockAction}
        setBlockedContacts={setBlockedContacts}
        t={props.t}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { contacts, error, success } = state.Contact;
  return { contacts, error, success };
};

export default PermissionWrapper(
  connect(mapStateToProps, null)(withTranslation()(Contacts)),
  PERMISSIONS.VIEW_CONTACTS
);
