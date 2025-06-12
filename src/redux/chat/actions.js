import {
    FETCH_CONVERSATIONS_REQUEST, FETCH_CONVERSATIONS_SUCCESS, FETCH_CONVERSATIONS_FAILURE,
    FETCH_CONVERSATION_BY_ID_REQUEST, FETCH_CONVERSATION_BY_ID_SUCCESS, FETCH_CONVERSATION_BY_ID_FAILURE,
    SET_ACTIVE_CONVERSATION_ID, SET_ACTIVE_CONVERSATION,
    FETCH_ALL_LAST_MESSAGES_REQUEST, FETCH_ALL_LAST_MESSAGES_SUCCESS, FETCH_ALL_LAST_MESSAGES_FAILURE,
    SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE,
    FETCH_MESSAGES_BY_CONVERSATION_ID_FAILURE, FETCH_MESSAGES_BY_CONVERSATION_ID_REQUEST, FETCH_MESSAGES_BY_CONVERSATION_ID_SUCCESS,
    SET_CHAT_MESSAGES, SET_CHAT_FILE, SET_CONVERSATIONS, SET_CHAT_MESSAGES_PAGE, SET_CHAT_MESSAGES_LIMIT,
    SET_CONVERSATIONS_PAGE, SET_CONVERSATIONS_LIMIT, SET_TEXT_MESSAGE, UPLOAD_FILE_REQUEST, UPLOAD_FILE_SUCCESS, UPLOAD_FILE_FAILURE

} from './constants';



export const fetchConversationsRequest = () => {
    return {
        type: FETCH_CONVERSATIONS_REQUEST
    }
}

export const fetchConversationsSuccess = (conversations) => {
    return {
        type: FETCH_CONVERSATIONS_SUCCESS,
        payload: conversations
    }
}

export const fetchConversationsFailure = (error) => {
    return {
        type: FETCH_CONVERSATIONS_FAILURE,
        payload: error
    }
}

export const fetchConversationByIdRequest = () => {
    return {
        type: FETCH_CONVERSATION_BY_ID_REQUEST
    }
}

export const fetchConversationByIdSuccess = (conversation) => {
    return {
        type: FETCH_CONVERSATION_BY_ID_SUCCESS,
        payload: conversation
    }
}

export const fetchConversationByIdFailure = (error) => {
    return {
        type: FETCH_CONVERSATION_BY_ID_FAILURE,
        payload: error
    }
}

export const setActiveConversationIdAction = (activeConversationId) => {
    return {
        type: SET_ACTIVE_CONVERSATION_ID,
        payload: activeConversationId
    }
}

export const setActiveConversationAction = (activeConversation) => {
    return {
        type: SET_ACTIVE_CONVERSATION,
        payload: activeConversation
    }
}

export const fetchAllLastMessagesRequest = () => {
    return {
        type: FETCH_ALL_LAST_MESSAGES_REQUEST
    }
}

export const fetchAllLastMessagesSuccess = (messages) => {
    return {
        type: FETCH_ALL_LAST_MESSAGES_SUCCESS,
        payload: messages
    }
}

export const fetchAllLastMessagesFailure = (error) => {
    return {
        type: FETCH_ALL_LAST_MESSAGES_FAILURE,
        payload: error
    }
}

export const sendMessageRequest = () => {
    return {
        type: SEND_MESSAGE_REQUEST
    }
}

export const sendMessageSuccess = (message) => {
    return {
        type: SEND_MESSAGE_SUCCESS,
        payload: message
    }
}

export const sendMessageFailure = (error) => {
    return {
        type: SEND_MESSAGE_FAILURE,
        payload: error
    }
}

export const fetchMessagesByConversationIdRequest = () => {
    return {
        type: FETCH_MESSAGES_BY_CONVERSATION_ID_REQUEST
    }
}

export const fetchMessagesByConversationIdSuccess = (chatMessages) => {
    return {
        type: FETCH_MESSAGES_BY_CONVERSATION_ID_SUCCESS,
        payload: chatMessages
    }
}

export const fetchMessagesByConversationIdFailure = (error) => {
    return {
        type: FETCH_MESSAGES_BY_CONVERSATION_ID_FAILURE,
        payload: error
    }
}

export const setChatMessagesAction = (messages) => {
    return {
        type: SET_CHAT_MESSAGES,
        payload: messages
    }
}

export const setChatFile = (file) => {
    return {
        type: SET_CHAT_FILE,
        payload: file
    }
}

export const setConversations = (conversations) => {
    return {
        type: SET_CONVERSATIONS,
        payload: conversations
    }
}

export const setChatMessagesPage = (page) => {
    return {
        type: SET_CHAT_MESSAGES_PAGE,
        payload: page
    }
}

export const setChatMessagesLimit = (limit) => {
    return {
        type: SET_CHAT_MESSAGES_LIMIT,
        payload: limit
    }
}

export const setConversationsPage = (page) => {
    return {
        type: SET_CONVERSATIONS_PAGE,
        payload: page
    }
}

export const setConversationsLimit = (limit) => {
    return {
        type: SET_CONVERSATIONS_LIMIT,
        payload: limit
    }
}

export const setTextMessage = (textMessage) => {
    return {
        type: SET_TEXT_MESSAGE,
        payload: textMessage
    }
}


export const uploadFileRequest = () => {
    return {
        type: UPLOAD_FILE_REQUEST
    }
}

export const uploadFileSuccess = (message) => {
    return {
        type: UPLOAD_FILE_SUCCESS,
        payload: message
    }
}

export const uploadFileFailure = (error) => {
    return {
        type: UPLOAD_FILE_FAILURE,
        payload: error
    }
}


export const fetchMessageById = (messageId, chatMessages = undefined) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${messageId}`, {
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                }
            })
            const data = await response.json()

            if (chatMessages) {
                let updatedMessages = [...chatMessages]
                updatedMessages.push(data?.message)
                dispatch(setChatMessagesAction(updatedMessages))
            }

            return data?.message
        } catch (error) {
            //console.log(error)
        }
    }
}

export const fetchConversations = (limit = 10, page = 1) => {
    return async (dispatch) => {
        dispatch(fetchConversationsRequest())
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conversations?limit=${limit}&page=${page}`, {
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                }
            })
            const data = await response.json()
            let sortedData = data?.data.sort((a, b) => new Date(b?.updated_at) - new Date(a?.updated_at))
            dispatch(fetchConversationsSuccess(sortedData))
        } catch (error) {
            dispatch(fetchConversationsFailure(error.message))
        }
    }
}

export const fetchConversationById = (conversationId) => {
    return async (dispatch) => {
        dispatch(fetchConversationByIdRequest())
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conversations/${conversationId}`, {
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                }
            })
            const data = await response.json()
            dispatch(fetchConversationByIdSuccess(data?.conversation))
        } catch (error) {
            dispatch(fetchConversationByIdFailure(error.message))
        }
    }
}

export const setActiveConversationId = (activeConversationId) => {
    return (dispatch) => {
        dispatch(setActiveConversationIdAction(activeConversationId))
    }
}

export const setActiveConversation = (activeConversation) => {
    return (dispatch) => {
        dispatch(setActiveConversationAction(activeConversation))
    }
}

export const fetchAllLastMessages = (conversations) => {
    return async (dispatch) => {
        dispatch(fetchAllLastMessagesRequest())
        try {
            const updatedConversations = [...conversations]
            for (let i = 0; i < updatedConversations.length; i++) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${updatedConversations[i]?.last_message_id}`, {
                    headers: {
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate",
                        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                        "Host": `${process.env.REACT_APP_API_URL}`,
                        "ngrok-skip-browser-warning": 69420,
                    }
                })
                const data = await response.json()
                updatedConversations[i].lastMessage = data?.message
            }
            dispatch(fetchAllLastMessagesSuccess(updatedConversations))
        } catch (error) {
            dispatch(fetchAllLastMessagesFailure(error.message))
        }
    }
}

export const sendMessage = (request) => {
    return async (dispatch) => {
        dispatch(sendMessageRequest())
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/send`, {
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
            dispatch(sendMessageSuccess(data?.message))
            return data?.data
        } catch (error) {
            dispatch(sendMessageFailure(error.message))
        }
    }
}

export const fetchMessagesByConversationId = (activeConversation, limit = 10, page = 1, concatMessages = false) => {
    return async (dispatch, getState) => {
        dispatch(fetchMessagesByConversationIdRequest());
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/messages/conversation/${activeConversation?.id}?limit=${limit}&page=${page}`,
                {
                    headers: {
                        Accept: "*/*",
                        "Accept-Encoding": "gzip, deflate",
                        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                        Host: `${process.env.REACT_APP_API_URL}`,
                        "ngrok-skip-browser-warning": 69420,
                    },
                }
            );
            const data = await response.json();
            if (data?.messages?.length > 0) {
                let sortedMessages = data.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                if (concatMessages) {
                    const currentMessages = getState().Chat?.chatMessages || [];
                    const updatedMessages = [...sortedMessages, ...currentMessages, ];
                    dispatch(setChatMessagesAction(updatedMessages));
                }

                else dispatch(setChatMessagesAction(sortedMessages));
            } else {
                dispatch(fetchMessagesByConversationIdSuccess([]));
            }
        } catch (error) {
            dispatch(fetchMessagesByConversationIdFailure(error.message));
        }
    };
};


export const setChatMessages = (messages) => {
    return (dispatch) => {
        dispatch(setChatMessagesAction(messages))
    }
}

export const uploadFile = (request) => {
    return async (dispatch) => {
        dispatch(uploadFileRequest())
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/upload`, {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                    "Host": `${process.env.REACT_APP_API_URL}`,
                    "ngrok-skip-browser-warning": 69420,
                },
                body: request
            })
            const data = await response.json()
            dispatch(uploadFileSuccess(data?.message))
            return data
        } catch (error) {
            dispatch(uploadFileFailure(error.message))
        }
    }
}