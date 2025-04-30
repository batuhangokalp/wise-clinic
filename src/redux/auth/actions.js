import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    API_FAILED, LOGIN_USER_FAILURE,FORGET_PASSWORD_FAILURE,API_SUCCESS
} from './constants';

export const loginUserAction = (request) => ({
    type: LOGIN_USER,
    payload: request
});

export const loginUserSuccess = (token) => ({
    type: LOGIN_USER_SUCCESS,
    payload: token
});

export const loginUserFailure= (error) => ({
    type: LOGIN_USER_FAILURE,
    payload: error
});

export const registerUser = (user) => ({
    type: REGISTER_USER,
    payload: { user }
});

export const registerUserSuccess = (user) => ({
    type: REGISTER_USER_SUCCESS,
    payload: user
});

export const logoutUser = (history) => ({
    type: LOGOUT_USER,
    payload: { history }
});

export const logoutUserSuccess = () => {
    return {
      type: LOGOUT_USER_SUCCESS,
      payload: {},
    };
  };

export const forgetPasswordAction = (request) => ({
    type: FORGET_PASSWORD,
    payload: request
});

export const forgetPasswordSuccess = (success) => ({
    type: FORGET_PASSWORD_SUCCESS,
    payload: success
});

export const forgetPasswordFailure = (error) => ({
    type: FORGET_PASSWORD_FAILURE,
    payload: error
});


export const apiError = (error) => ({
    type: API_FAILED,
    payload: error
});

export const apiSuccess = (success) => ({
    type: API_SUCCESS,
    payload: success
});


export const loginUser = (request) => {
    return async (dispatch) => {
        dispatch(loginUserAction())
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(request)
            })
            const data = await response.json()
            if(response.status !== 200) {
                throw data
            }
            dispatch(loginUserSuccess(data?.token))
            dispatch(apiSuccess(data?.message))
            return data
        } catch (error) {
            dispatch(loginUserFailure(error.error))
        }
    }
}

export const  forgetPassword = (request) => {
    return async (dispatch) => {
        dispatch(forgetPasswordAction(request))
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(request)
            })
            const data = await response.json()
            
            if(response.status !== 200) {
                throw data
            }
            dispatch(forgetPasswordSuccess(data?.data))
            return data?.data
        } catch (error) {
            dispatch(forgetPasswordFailure(error.error))
        }
    }
}