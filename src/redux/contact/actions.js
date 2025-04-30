import {
    FETCH_CONTACT_BY_ID, UPDATE_CONTACT, DELETE_CONTACT, CREATE_CONTACT, FETCH_CONTACTS,
    API_FAILED,
    API_SUCCESS, RESET_WARNINGS
} from './constants';

export const fetchContactByIdAction = (contact) => ({
    type: FETCH_CONTACT_BY_ID,
    payload: contact
});

export const updateContactAction = (contact) => ({
    type: UPDATE_CONTACT,
        payload: contact
});

export const deleteContactAction = (contactId) => ({
    type: DELETE_CONTACT,
        payload: contactId
});

export const createContactAction = (contact) => ({
    type: CREATE_CONTACT,
        payload: contact
});

export const fetchContactsAction = (contacts) => ({
    type: FETCH_CONTACTS,
    payload: contacts
});


export const apiContactError = (error) => ({
    type: API_FAILED,
    payload: error
});

export const apiContactSuccess = (success) => ({
    type: API_SUCCESS,
    payload: success
});

export const resetContactWarnings = () => ({
    type: RESET_WARNINGS
});



export const fetchContactById = (contactId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/${contactId}`, {
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                }
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            await dispatch(fetchContactByIdAction(data?.contact))
            await dispatch(apiContactSuccess("Contact fetched successfully"))
            return data?.contact
        } catch (error) {
            await dispatch(apiContactError(error.error ?? "An error occurred"))
        }
    }
}

export const createContact = (request) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(request)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            await dispatch(createContactAction(data?.contact))
            await dispatch(apiContactSuccess("Contact created successfully"))
            return data?.contact
        } catch (error) {
            error.error &&   dispatch(apiContactError(error.error ?? "An error occurred"))
        }
    }
}

export const fetchContacts = (limit=10, page=1) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts?limit=${limit}&page=${page}`, {
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                }
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            await dispatch(fetchContactsAction(data?.contacts))
            await dispatch(apiContactSuccess("Contacts fetched successfully"))
            return data?.contacts
        } catch (error) {
              await dispatch(apiContactError(error.error ?? "An error occurred"))
        }
    }
}

export const updateContact = (request) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/${request?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(request)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            await dispatch(updateContactAction(data?.contact))
            await dispatch(apiContactSuccess("Contact updated successfully"))
            return data?.contact
        } catch (error) {
            await dispatch(apiContactError(error.error ?? "An error occurred"))
        }
    }
}

export const deleteContact = (contactId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/${contactId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                }
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            await dispatch(deleteContactAction(contactId))
            await  dispatch(apiContactSuccess("Contact deleted successfully"))
            return data?.contact
        } catch (error) {
            await dispatch(apiContactError(error.error ?? "An error occurred"))
        }
    }
}