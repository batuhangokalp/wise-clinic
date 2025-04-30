import {
    ChatPlatform, FETCH_CONVERSATIONS_REQUEST, FETCH_CONVERSATIONS_SUCCESS, FETCH_CONVERSATIONS_FAILURE, 
    FETCH_CONVERSATION_BY_ID_REQUEST, FETCH_CONVERSATION_BY_ID_SUCCESS, FETCH_CONVERSATION_BY_ID_FAILURE,
    SET_ACTIVE_CONVERSATION_ID, SET_ACTIVE_CONVERSATION,
    FETCH_ALL_LAST_MESSAGES_REQUEST, FETCH_ALL_LAST_MESSAGES_SUCCESS, FETCH_ALL_LAST_MESSAGES_FAILURE,
    SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE,
    FETCH_MESSAGES_BY_CONVERSATION_ID_REQUEST, FETCH_MESSAGES_BY_CONVERSATION_ID_SUCCESS, FETCH_MESSAGES_BY_CONVERSATION_ID_FAILURE,
    SET_CHAT_MESSAGES,
    FETCH_MESSAGE_BY_ID, SET_CHAT_FILE, SET_CONVERSATIONS,
    SET_CONVERSATIONS_PAGE, SET_CONVERSATIONS_LIMIT, SET_CHAT_MESSAGES_PAGE, SET_CHAT_MESSAGES_LIMIT, SET_TEXT_MESSAGE,
    UPLOAD_FILE_FAILURE, UPLOAD_FILE_SUCCESS, UPLOAD_FILE_REQUEST
} from './constants';


//Import Images
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";

const INIT_STATE = {
    activeConversationId: 1,
    activeConversation: {},
    conversations: [],
    chatMessages: [],
    conversationPage: 1,
    conversationLimit: 10,
    chatMessagesPage: 1,
    chatMessagesLimit: 10,
    textMessage:"",
    loading: false,
    error: null,
    chatFile: null,
    chatFileUrl: null,

    groups : [
        { gourpId : 1, name : "#General", profilePicture : "Null", isGroup : true, unRead : 0, desc : "General Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 2, name : "#Reporting", profilePicture : "Null", isGroup : true, unRead : 23,  desc : "reporing Group here...",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 3, name : "#Designer", profilePicture : "Null", isGroup : true, unRead : 0, isNew : true, desc : "designers Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 4, name : "#Developers", profilePicture : "Null", isGroup : true, unRead : 0,  desc : "developers Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 5, name : "#Project-aplha", profilePicture : "Null", isGroup : true, unRead : 0, isNew : true, desc : "project related Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 6, name : "#Snacks", profilePicture : "Null", isGroup : true, unRead : 0,  desc : "snacks Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
    ],
    contacts : [
        { id : 1, name : "Albert Rodarte" },
        { id : 2, name : "Allison Etter" },
        { id : 3, name : "Craig Smiley" },
        { id : 4, name : "Daniel Clay" },
        { id : 5, name : "Doris Brown" },
        { id : 6, name : "Iris Wells" },
        { id : 7, name : "Juan Flakes" },
        { id : 8, name : "John Hall" },
        { id : 9, name : "Joy Southern" },
        { id : 10, name : "Mary Farmer" },
        { id : 11, name : "Mark Messer" },
        { id : 12, name : "Michael Hinton" },
        { id : 13, name : "Ossie Wilson" },
        { id : 14, name : "Phillis Griffin" },
        { id : 15, name : "Paul Haynes" },
        { id : 16, name : "Rocky Jackson" },
        { id : 17, name : "Sara Muller" },
        { id : 18, name : "Simon Velez" },
        { id : 19, name : "Steve Walker" },
        { id : 20, name : "Hanah Mile" },
    ]
};

const Chat = (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_CONVERSATIONS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_CONVERSATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                conversations: action.payload
            }
        case FETCH_CONVERSATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_CONVERSATION_BY_ID_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_CONVERSATION_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                activeConversation: action.payload
            }
        case FETCH_CONVERSATION_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case SET_ACTIVE_CONVERSATION_ID:
            return {
                ...state,
                activeConversationId: action.payload
            }
        case SET_ACTIVE_CONVERSATION:
            return {
                ...state,
                activeConversation: action.payload
            }
        case FETCH_ALL_LAST_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_ALL_LAST_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                conversations: action.payload
            }
        case FETCH_ALL_LAST_MESSAGES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case SEND_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
            }
        case SEND_MESSAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_MESSAGES_BY_CONVERSATION_ID_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_MESSAGES_BY_CONVERSATION_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                activeConversation: action.payload
            }
        case FETCH_MESSAGES_BY_CONVERSATION_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case SET_CHAT_MESSAGES:
            return {
                ...state,
                chatMessages: action.payload
            }
        case FETCH_MESSAGE_BY_ID:
            return {
                ...state,
                loading: false,
                chatMessages: action.payload
            }
        case SET_CHAT_FILE:
            return {
                ...state,
                chatFile: action.payload
            }
        case SET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload
            }
        case SET_CHAT_MESSAGES_PAGE:
            return {
                ...state,
                chatMessagesPage: action.payload
            }
        case SET_CHAT_MESSAGES_LIMIT:
            return {
                ...state,
                chatMessagesLimit: action.payload
            }
        case SET_CONVERSATIONS_PAGE:
            return {
                ...state,
                conversationPage: action.payload
            }
        case SET_CONVERSATIONS_LIMIT:
            return {
                ...state,
                conversationLimit: action.payload
            }
        case SET_TEXT_MESSAGE:
            return {
                ...state,
                textMessage: action.payload
            }
        case UPLOAD_FILE_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case UPLOAD_FILE_SUCCESS:
            return {
                ...state,
                loading: false,
                chatFileUrl: action.payload
            }
        case UPLOAD_FILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        
        default: return { ...state };
    }
}

export default Chat;