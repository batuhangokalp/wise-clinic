import React, { useEffect, useState } from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    UncontrolledTooltip,
    InputGroup,
} from 'reactstrap';
import SimpleBar from "simplebar-react";
import { connect, useDispatch } from "react-redux";
import { withTranslation } from 'react-i18next';
import { createContact, fetchContacts, resetContactWarnings, updateContact } from '../../../redux/actions';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import AddContactModal from '../../../components/AddContactModal';
import UpdateContactModal from '../../../components/UpdateContactModal';


const Contacts = (props) => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState({
        assigned_user_id: null,
                        avatar: null,
                        birth_date: null,
                        contact_email: '',
                        country: '',
                        created_at: null,
                        facebook_user_id: null,
                        id: null,
                        instagram_user_id: '',
                        language_id: null,
                        message_channel_id: null,
                        name: '',
                        phone_number: '',
                        sex: '',
                        surname: '',
                        updated_at: null,
     });

    const toggleModal = () => {
        dispatch(resetContactWarnings());
        setModal(!modal);
    };

    const toggleUpdateModal = () => {
        dispatch(resetContactWarnings());
        setUpdateModal(!updateModal);
    };


    const validationSchema = Yup.object({
        name: Yup.string().required(props.t('Name is required')),
        surname: Yup.string().required(props.t('Surname is required')),
        phone_number: Yup.string()
            .matches(/^\+?[0-9]{7,15}$/, props.t('Phone number is not valid'))
            .required(props.t('Phone number is required')),
        contact_email: Yup.string()
            .email(props.t('Email is not valid'))
            .required(props.t('Email is required')),
    });

    const updateValidationSchema = Yup.object({
        name: Yup.string().required(props.t('Name is required')),
        contact_email: Yup.string()
            .email(props.t('Email is not valid'))
            .required(props.t('Email is required')),
    });

    const handleSubmit = async (values, { resetForm }) => {
        let response = await dispatch(createContact(values))
        if (response) {
            setTimeout(async () => {
                toggleModal();
                resetForm();
                await dispatch(fetchContacts());

            }, 3000);
        }

    };

    const handleUpdateSubmit = async (values, { resetForm }) => {
        let response = await dispatch(updateContact(values))
        if (response) {
            setTimeout(async () => {
                toggleUpdateModal();
                resetForm();
                await dispatch(fetchContacts());
            }, 3000);
        }
    }

    const handleContact = (e, contact) => {
        e.preventDefault();
        setSelectedContact({ id:contact?.id, name: contact?.name, contact_email: contact?.contact_email, ...contact });
        toggleUpdateModal();
    };


    useEffect(() => {
        dispatch(fetchContacts());
    }, []);


    const groupContactsByInitial = (contacts) => {
        return contacts.reduce((grouped, contact) => {
            const initial = contact?.name?.charAt(0)?.toUpperCase() || '#';
            if (!grouped[initial]) {
                grouped[initial] = [];
            }
            grouped[initial].push(contact);
            return grouped;
        }, {});
    };

    const groupedContacts = groupContactsByInitial(props.contacts || []);


    return (
        <React.Fragment>
            <div>
                <div className="p-4">
                    <div className="user-chat-nav float-end">
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
                            {props.t('Add Contact')}
                        </UncontrolledTooltip>
                    </div>
                    <h4 className="mb-4">{props.t('Contacts')}</h4>

                    {/* Add Contact Modal */}
                   <AddContactModal modal={modal} toggleModal={toggleModal} handleSubmit={handleSubmit} validationSchema={validationSchema} parentProps={props} t={props.t} />
                    {/* Update Contact Modal */}
                   <UpdateContactModal modal={updateModal} toggleModal={toggleUpdateModal} handleSubmit={handleUpdateSubmit} validationSchema={updateValidationSchema} parentProps={props} t={props.t} selectedContact={selectedContact} />


                    <div className="search-box chat-search-box">
                        <InputGroup size="lg" className="bg-light rounded-lg">
                            <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                                <i className="ri-search-line search-icon font-size-18"></i>
                            </Button>
                            <input
                                type="text"
                                className="form-control bg-light"
                                placeholder={props.t('Search users..')}
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
                    {Object.keys(groupedContacts).sort().map((initial) => (
                        <div key={initial}>
                            <div className="p-3 fw-bold text-primary">{initial}</div>
                            <ul className="list-unstyled contact-list">
                                {groupedContacts[initial].map((contact, index) => (
                                    <li key={index}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 onClick={(e) => handleContact(e, contact)} className="font-size-14 m-0">{contact.name}</h5>
                                            </div>
                                            <UncontrolledDropdown>
                                                <DropdownToggle tag="a" className="text-muted">
                                                    <i className="ri-more-2-fill"></i>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-end">
                                                    <DropdownItem>
                                                        {props.t('Share')} <i className="ri-share-line float-end text-muted"></i>
                                                    </DropdownItem>
                                                    <DropdownItem>
                                                        {props.t('Block')} <i className="ri-forbid-line float-end text-muted"></i>
                                                    </DropdownItem>
                                                    <DropdownItem>
                                                        {props.t('Remove')} <i className="ri-delete-bin-line float-end text-muted"></i>
                                                    </DropdownItem>
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
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const { contacts, error, success } = state.Contact;
    return { contacts, error, success };
};

export default connect(mapStateToProps, null)(withTranslation()(Contacts));
