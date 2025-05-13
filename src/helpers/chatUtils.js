import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../redux/actions";

export const useChatUrlParams = (
  conversations,
  setActiveConversationId,
  setActiveConversation
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const DEFAULT_CHAT_ID = 13;

  const updateChatUrl = (chatId) => {
    const searchParams = new URLSearchParams(location.search);
    if (chatId && chatId !== 0) {
      searchParams.set("chatId", chatId.toString());
    } else {
      searchParams.set("chatId", DEFAULT_CHAT_ID.toString());
    }
    if (!searchParams.has("tabId")) {
      searchParams.set("tabId", "chat");
    }
    navigate(`?${searchParams.toString()}`);
  };

  // Helper function to update UI elements
  const updateChatUI = (index) => {
    // Update chat list selection
    const chatList = document.getElementById("chat-list");
    if (chatList) {
      const items = chatList.getElementsByTagName("li");
      // Remove active class from all items
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
      }
      // Add active class to selected item
      const selectedItem = document.getElementById("conversation" + index);
      if (selectedItem) {
        selectedItem.classList.add("active");
      }
    }

    // Show chat window
    const userChat = document.getElementsByClassName("user-chat");
    if (userChat && userChat[0]) {
      userChat[0].classList.add("user-chat-show");
    }
  };

  const updateChat = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabId = searchParams.get("tabId");

    if (tabId === "chat") {
      const chatId = Number(searchParams.get("chatId"));
      const chat = conversations?.find((c) => c?.id === chatId);

      if (chat) {
        setActiveConversation(chat);
        const index = conversations?.indexOf(chat);
        setActiveConversationId(chat?.id);
        updateChatUI(index);
      } else {
        conversations?.length > 0 && updateChatUrl(conversations[0]?.id);
      }
    }
  }, [
    location.search,
    conversations,
    setActiveConversation,
    setActiveConversationId,
    updateChatUI,
    updateChatUrl,
  ]);

  // Initial setup effect
  useEffect(() => {
    updateChat();
  }, [updateChat]);

  return { updateChatUrl, updateChatUI, updateChat };
};

export const useTabNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const DEFAULT_TAB = "chat";
  const VALID_TABS = ["chat", "group", "contacts", "settings", "profile"]; // Add all valid tab IDs

  const toggleTab = (tab) => {
    console.log("32478362748362432", tab);
    if (VALID_TABS.includes(tab)) {
      dispatch(setActiveTab(tab));
      navigate(`/dashboard?tabId=${tab}`);
    } else {
      dispatch(setActiveTab(DEFAULT_TAB));
      navigate(`/dashboard?tabId=${DEFAULT_TAB}`);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tabId = query.get("tabId");

    if (tabId && VALID_TABS.includes(tabId)) {
      dispatch(setActiveTab(tabId));
    } else {
      // If no tabId or invalid tabId, set to default chat tab
      dispatch(setActiveTab(DEFAULT_TAB));
      // Preserve other URL parameters while setting the correct tabId
      query.set("tabId", DEFAULT_TAB);
      navigate(`/dashboard?${query.toString()}`, { replace: true });
    }
  }, [location.search, dispatch, navigate]);

  return { toggleTab };
};

export const showLastMessageDate = (lastMessageDate) => {
  const date = new Date(lastMessageDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export const showChatMessageTime = (messageDate) => {
  const date = new Date(messageDate);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
