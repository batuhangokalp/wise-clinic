import {
    CREATE_ROLE,
    UPDATE_ROLE,
    DELETE_ROLE,
    FETCH_ROLES,
    FETCH_ROLE_PERMISSIONS,
    API_PERMISSION_ERROR,
    API_PERMISSION_SUCCESS,
    API_ROLE_ERROR,
    API_ROLE_SUCCESS,
    FETCH_PERMISSIONS,
    CREATE_PERMISSION,
    UPDATE_PERMISSION,
    DELETE_PERMISSION,
    FETCH_PERMISSIONS_BY_ROLE_ID,
    ROLE_PERMISSIONS

} from './constants';


const INIT_STATE = {
    roles: [],
    rolePermission: null,
    loading: false,
    roleSuccess: null,
    roleError: null,
    permissionSuccess: null,
    permissionError: null,
    permissions: ROLE_PERMISSIONS ?? []
};

const User = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CREATE_ROLE:
            return { ...state, loading: false, roleSuccess: action.payload, roleError: null };
        case UPDATE_ROLE:
            return { ...state, loading: false, roleSuccess: action.payload, roleError: null };
        case DELETE_ROLE:
            return { ...state, loading: false, roleSuccess: action.payload, roleError: null };
        case FETCH_ROLES:
            return { ...state, loading: false, roles: action.payload, roleError: null };
        case FETCH_ROLE_PERMISSIONS:
            return { ...state, loading: false, rolePermission: action.payload, roleError: null };
        case API_ROLE_ERROR:
            return { ...state, loading: false, roleError: action.payload };
        case API_ROLE_SUCCESS:
            return { ...state, loading: false, roleSuccess: action.payload };
        case FETCH_PERMISSIONS:
            return { ...state, loading: false, permissions: action.payload, permissionError: null };
        case CREATE_PERMISSION:
            return { ...state, loading: false, permissionSuccess: action.payload, permissionError: null };
        case UPDATE_PERMISSION:
            return { ...state, loading: false, permissionSuccess: action.payload, permissionError: null };
        case DELETE_PERMISSION:
            return { ...state, loading: false, permissionSuccess: action.payload, permissionError: null };
        case FETCH_PERMISSIONS_BY_ROLE_ID:
            return { ...state, loading: false, permissions: action.payload, permissionError: null };
        case API_PERMISSION_ERROR:
            return { ...state, loading: false, permissionError: action.payload };
        case API_PERMISSION_SUCCESS:
            return { ...state, loading: false, permissionSuccess: action.payload };
        default: return { ...state };
    }
}

export default User;