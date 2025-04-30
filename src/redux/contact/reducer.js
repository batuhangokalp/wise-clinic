import {
    API_SUCCESS,
    API_FAILED,
    FETCH_CONTACT_BY_ID, UPDATE_CONTACT, DELETE_CONTACT, CREATE_CONTACT, FETCH_CONTACTS, RESET_WARNINGS
} from './constants';

import { getLoggedInUser } from '../../helpers/authUtils';

const INIT_STATE = {
    contact: null,
    contacts: [],
    success: null,
    error: null,
    loading: false,
};

const Contact = (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_CONTACT_BY_ID:
            return { ...state, loading: false, contact: action.payload };
        case UPDATE_CONTACT:
            return { ...state, loading: false, contact: action.payload };
        case DELETE_CONTACT:
            return { ...state, loading: false, contact: action.payload };
        case CREATE_CONTACT:
            return { ...state, loading: false, contact: action.payload };
        case FETCH_CONTACTS:
            return { ...state, loading: false, contacts: action.payload };
        case API_FAILED:
            return { ...state, loading: false, error: action.payload, success: null };
        case API_SUCCESS:
            return { ...state, loading: false, error: null, success: action.payload };
        case RESET_WARNINGS:
            return { ...state, loading: false, error: null, success: null };

        default: return { ...state };
    }
}

export default Contact;