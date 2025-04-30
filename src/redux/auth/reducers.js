import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER_SUCCESS,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    API_FAILED, LOGIN_USER_FAILURE, FORGET_PASSWORD_FAILURE,
    API_SUCCESS
} from './constants';

import { getLoggedInUser } from '../../helpers/authUtils';

const INIT_STATE = {
    user: getLoggedInUser(),
    token: null,
    loading: false,
    isUserLogout: false
};


const Auth = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true };
        case LOGIN_USER_SUCCESS:
            return { ...state, token: action.payload, loading: false, error: null };
        case LOGIN_USER_FAILURE:
            return { ...state, error: action.payload, loading: false };

        case REGISTER_USER:
            return { ...state, loading: true };
        case REGISTER_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };

        case LOGOUT_USER_SUCCESS:
            return { ...state, user: null, token: null, isUserLogout: true };

        case FORGET_PASSWORD:
            return { ...state, loading: true };
        case FORGET_PASSWORD_SUCCESS:
            return { ...state, passwordResetStatus: action.payload, loading: false, error: null };
        case FORGET_PASSWORD_FAILURE:
            return { ...state, error: action.payload, loading: false };

        case API_FAILED:
            return { ...state, loading: false, error: action.payload, isUserLogout: false };
        case API_SUCCESS:
            return { ...state, loading: false, error: null, success: action.payload, isUserLogout: false };

        default: return { ...state };
    }
}

export default Auth;