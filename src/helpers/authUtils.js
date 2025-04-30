import { jwtDecode } from "jwt-decode";


export const LoginType = {
    PHONE: 'phone',
    EMAIL: 'email',
    INVALID: 'invalid'
};
/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
    const user = getLoggedInUser();
    if (!user) {
        return false;
    }
    
    try {
        const decoded = jwtDecode(user.token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('access token expired');
            return false;
        }
        else {
            return true;
        }
    } catch(e) {
        console.warn('access token expired');
        return false;
    }
}

/**
 * Sets the logged in user
 */
const setLoggedInUser = (user) => {
    localStorage.setItem('authUser', JSON.stringify(user));
}

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
    const user = localStorage.getItem('authUser');
    return user ? (typeof (user) == 'object' ? user : JSON.parse(user)) : null;
}

export const isEmailOrPhoneNumber = (data) => {
    // Regular expression to match different phone number formats
    const phoneRegex = /^(\+?0?0?9?0?)?\d{10,11}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (data.match(phoneRegex)) {
        return LoginType.PHONE;
    } else if (data.match(emailRegex)) {
        return LoginType.EMAIL;
    } else {
        return LoginType.INVALID;
    }
}

export { isUserAuthenticated, setLoggedInUser, getLoggedInUser };