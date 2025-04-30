import {
    API_SUCCESS,
    API_FAILED,
    FETCH_USER_BY_ID, UPDATE_USER, DELETE_USER, CREATE_USER, FETCH_USERS, FETCH_DEPARTMENTS, FETCH_POSITIONS, CREATE_POSITION, DELETE_POSITION, UPDATE_POSITION, CREATE_DEPARTMENT, DELETE_DEPARTMENT, UPDATE_DEPARTMENT
} from './constants';

import { getLoggedInUser } from '../../helpers/authUtils';

const INIT_STATE = {
    user: getLoggedInUser(),
    users: [],
    success: null,
    error: null,
    loading: false,
    departments: [],
    positions: []
};

const User = (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_BY_ID:
            return { ...state, loading: false, user: action.payload };
        case UPDATE_USER:
            return { ...state, loading: false };
        case DELETE_USER:
            return { ...state, loading: false };
        case CREATE_USER:
            return { ...state, loading: false };
        case FETCH_USERS:
            return { ...state, loading: false, users: action.payload };
        case API_FAILED:
            return { ...state, loading: false, error: action.payload };
        case API_SUCCESS:
            return { ...state, loading: false, error: null, success: action.payload };
        case FETCH_DEPARTMENTS:
            return { ...state, loading: false, departments: action.payload };
        case FETCH_POSITIONS:
            return { ...state, loading: false, positions: action.payload };
        case CREATE_POSITION:
            return { ...state, loading: false };
        case DELETE_POSITION:
            return { ...state, loading: false };
        case UPDATE_POSITION:
            return { ...state, loading: false };
        case CREATE_DEPARTMENT:
            return { ...state, loading: false };
        case DELETE_DEPARTMENT:
            return { ...state, loading: false };
        case UPDATE_DEPARTMENT:
            return { ...state, loading: false };

        default: return { ...state };
    }
}

export default User;