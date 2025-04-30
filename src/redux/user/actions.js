import {
    FETCH_USER_BY_ID, UPDATE_USER, DELETE_USER, CREATE_USER, FETCH_USERS,
    API_FAILED,
    API_SUCCESS,
    FETCH_DEPARTMENTS,
    FETCH_POSITIONS, CREATE_POSITION, DELETE_POSITION, UPDATE_POSITION, CREATE_DEPARTMENT, DELETE_DEPARTMENT, UPDATE_DEPARTMENT
} from './constants';

export const fetchUserByIdAction = (user) => ({
    type: FETCH_USER_BY_ID,
    payload: user
});

export const updateUserAction = (user) => ({
    type: UPDATE_USER,
        payload: user
});

export const deleteUserAction = (userId) => ({
    type: DELETE_USER,
        payload: userId
});

export const createUserAction = (user) => ({
    type: CREATE_USER,
        payload: user
});

export const fetchUsersAction = (users) => ({
    type: FETCH_USERS,
    payload: users
});


export const apiUserError = (error) => ({
    type: API_FAILED,
    payload: error
});

export const apiUserSuccess = (success) => ({
    type: API_SUCCESS,
    payload: success
});

export const fetchDepartmentsAction = (departments) => ({
    type: FETCH_DEPARTMENTS,
    payload: departments
});

export const fetchPositionsAction = (positions) => ({
    type: FETCH_POSITIONS,
    payload: positions
});

export const createPositionAction = (position) => ({
    type: CREATE_POSITION,
    payload: position
});

export const deletePositionAction = (positionId) => ({
    type: DELETE_POSITION,
    payload: positionId
});

export const updatePositionAction = (position) => ({
    type: UPDATE_POSITION,
    payload: position
});

export const createDepartmentAction = (department) => ({
    type: CREATE_DEPARTMENT,
    payload: department
});

export const deleteDepartmentAction = (departmentId) => ({
    type: DELETE_DEPARTMENT,
    payload: departmentId
});

export const updateDepartmentAction = (department) => ({
    type: UPDATE_DEPARTMENT,
    payload: department
});


export const fetchUserById = (userId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
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
            dispatch(fetchUserByIdAction(data?.user))
            dispatch(apiUserSuccess("User fetched successfully"))
            return data?.user
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const fetchUsers = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
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
            dispatch(fetchUsersAction(data?.users))
            dispatch(apiUserSuccess("Users fetched successfully"))
            return data?.users
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const updateUser = (user) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(user)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            dispatch(updateUserAction(data?.user))
            dispatch(apiUserSuccess("User updated successfully"))
            return data?.user
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const deleteUser = (userId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                method: 'DELETE',
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
            dispatch(deleteUserAction(userId))
            dispatch(apiUserSuccess("User deleted successfully"))
            return data
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const createUser = (user) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(user)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            dispatch(createUserAction(data?.user))
            dispatch(apiUserSuccess("User created successfully"))
            return data?.user
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const fetchDepartments = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/departments`, {
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
            dispatch(fetchDepartmentsAction(data?.departments))
            //dispatch(apiUserSuccess("Departments fetched successfully"))
            return data?.departments
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const fetchPositions = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/positions`, {
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
            dispatch(fetchPositionsAction(data?.positions))
            //dispatch(apiUserSuccess("Positions fetched successfully"))
            return data?.positions
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const createPosition = (position) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/positions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(position)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            dispatch(createPositionAction(data?.position))
            dispatch(apiUserSuccess("Position created successfully"))
            return data?.position
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const deletePosition = (positionId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/positions/${positionId}`, {
                method: 'DELETE',
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
            dispatch(deletePositionAction(positionId))
            dispatch(apiUserSuccess("Position deleted successfully"))
            return data
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const updatePosition = (position) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/positions/${position.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(position)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            dispatch(updatePositionAction(data?.position))
            dispatch(apiUserSuccess("Position updated successfully"))
            return data?.position
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}


export const createDepartment = (department) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/departments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(department)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            dispatch(createDepartmentAction(data?.department))
            dispatch(apiUserSuccess("Department created successfully"))
            return data?.department
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const deleteDepartment = (departmentId) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/departments/${departmentId}`, {
                method: 'DELETE',
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
            dispatch(deleteDepartmentAction(departmentId))
            dispatch(apiUserSuccess("Department deleted successfully"))
            return data
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}

export const updateDepartment = (department) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/departments/${department.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: JSON.stringify(department)
            })
            const data = await response.json()

            if (response?.status !== 200 && response?.status !== 201) {
                throw data
            }
            dispatch(updateDepartmentAction(data?.department))
            dispatch(apiUserSuccess("Department updated successfully"))
            return data?.department
        } catch (error) {
            dispatch(apiUserError(error.error))
        }
    }
}










