import {
	SET_ACTIVE_TAB,
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	SET_LAYOUT_MODE,
	FETCH_LANGUAGES
} from "./constants";

export const setActiveTab = (tabId) => ({
	type: SET_ACTIVE_TAB,
	payload: tabId
});

export const openUserSidebar = () => ({
	type: OPEN_USER_PROFILE_SIDEBAR
});

export const closeUserSidebar = () => ({
	type: CLOSE_USER_PROFILE_SIDEBAR
});

export const setconversationNameInOpenChat = (conversationName) => ({
	type: SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	payload: conversationName
});

export const changeLayoutMode = layoutMode => ({
	type: SET_LAYOUT_MODE,
	payload: layoutMode,
});
  
export const fetchLanguagesAction = (languages) => ({
	type: FETCH_LANGUAGES,
	payload: languages
});

export const fetchLanguages = () => {
	return async (dispatch) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/languages`, {
				headers: {
					"Accept": "*/*",
					"Accept-Encoding": "gzip, deflate",
					"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
					"Host": `${process.env.REACT_APP_API_URL}`,
					"ngrok-skip-browser-warning": 69420,
				}
			})
			const data = await response.json()

			if (response?.status !== 200) {
				throw data
			}

			dispatch(fetchLanguagesAction(data?.languages))
		} catch (error) {
			//dispatch(apiUserError(error.error))
		}
	}
};
