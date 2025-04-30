// reducer.js
import {
    FETCH_TEMPLATES_REQUEST, FETCH_TEMPLATES_SUCCESS, FETCH_TEMPLATES_FAILURE,
    FETCH_TEMPLATE_BY_ID_REQUEST, FETCH_TEMPLATE_BY_ID_SUCCESS, FETCH_TEMPLATE_BY_ID_FAILURE,
    SET_SELECTED_TEMPLATE, FETCH_CANNED_RESPONSES_REQUEST, FETCH_CANNED_RESPONSES_SUCCESS,
    FETCH_CANNED_RESPONSES_FAILURE, FETCH_CANNED_RESPONSE_BY_ID_REQUEST, FETCH_CANNED_RESPONSE_BY_ID_SUCCESS,
    FETCH_CANNED_RESPONSE_BY_ID_FAILURE, SET_SELECTED_CANNED_RESPONSE, CREATE_CANNED_RESPONSE, UPDATE_CANNED_RESPONSE, DELETE_CANNED_RESPONSE,
    CREATE_TEMPLATE, UPDATE_TEMPLATE, DELETE_TEMPLATE, API_ERROR, API_SUCCESS
 } from './constants'

const initialState = {
    templates: [],
    loading: false,
    error: null,
    success: null,
    selectedTemplate: null,
    template: null,
    cannedResponses: [],
    selectedCannedResponse: null,
    

}

const templatesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TEMPLATES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_TEMPLATES_SUCCESS:
            return {
                ...state,
                loading: false,
                templates: action.payload
            }
        case FETCH_TEMPLATES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                template: action.payload
            }
        case FETCH_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case SET_SELECTED_TEMPLATE:
            return {
                ...state,
                selectedTemplate: action.payload
            }
        case FETCH_CANNED_RESPONSES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_CANNED_RESPONSES_SUCCESS:
            return {
                ...state,
                loading: false,
                cannedResponses: action.payload
            }
        case FETCH_CANNED_RESPONSES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_CANNED_RESPONSE_BY_ID_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_CANNED_RESPONSE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                cannedResponse: action.payload
            }
        case FETCH_CANNED_RESPONSE_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case SET_SELECTED_CANNED_RESPONSE:
            return {
                ...state,
                selectedCannedResponse: action.payload
            }
        case CREATE_CANNED_RESPONSE:
            return {
                ...state
            }
        case UPDATE_CANNED_RESPONSE:
            return {
                ...state
            }
        case DELETE_CANNED_RESPONSE:
            return {
                ...state
            }
        case CREATE_TEMPLATE:
            return {
                ...state
            }
        case UPDATE_TEMPLATE:
            return {
                ...state
            }
        case DELETE_TEMPLATE:
            return {
                ...state
            }
        case API_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case API_SUCCESS:
            return {
                ...state,
                success: action.payload
            }
        
        default:
            return state
    }
}

export default templatesReducer