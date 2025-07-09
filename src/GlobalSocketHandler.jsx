import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatMessages, setConversations } from "./redux/actions";
import socket from "./socket";

const GlobalSocketHandler = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.Chat.conversations);
  const activeConversationId = useSelector(
    (state) => state.Chat.activeConversationId
  );
  const chatMessages = useSelector((state) => state.Chat.chatMessages);
  const contacts = useSelector((state) => state.Contact.contacts);

  const playNotificationSound = () => {
    const audio = new Audio("/notifications.wav");
    audio.play().catch((err) => {
      console.warn("Ses çalınamadı:", err);
    });
  };

  const showDesktopNotification = (title, message) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/upsense-logo.png",
      });
    }
  };

  useEffect(() => {
    const handleMessage = (message) => {
      const contact = contacts.find((c) => c.id === message.senderId);
      const senderName = contact?.name || "";
      const senderSurname = contact?.surname || "";

      playNotificationSound();
      showDesktopNotification(
        `${senderName} ${senderSurname} sent message!`,
        message.message
      );

      if (activeConversationId === message.conversationId) {
        const data = {
          id: chatMessages[chatMessages.length - 1]?.id + 1 || 1,
          message_content: message?.message,
          created_at: message?.timestamp,
          sender_type: "receiver",
          conversationId: message?.conversationId,
          mediaType: message?.mediaType,
          mediaUrl: message?.mediaUrl,
          message: message?.message,
          senderId: message?.senderId,
          timestamp: message?.timestamp,
          file_type_id: 1,
          file_path: message?.mediaUrl,
        };
        dispatch(setChatMessages([...chatMessages, data]));
      }
    };

    const handleNewMessage = (message) => {
      let messageSender = message?.senderId;
      let conversation = conversations.find(
        (conv) => conv?.phone_number === messageSender
      );

      if (conversation) {
        conversation.last_message = message?.message ?? "Media Message";
        conversation.unread_count =
          typeof conversation.unread_count === "number"
            ? conversation.unread_count + 1
            : 1;
        conversation.updated_at = new Date();

        const filtered = conversations.filter(
          (conv) => conv?.phone_number !== messageSender
        );
        const newList = [conversation, ...filtered];

        dispatch(setConversations(newList));
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on(`conversation_${activeConversationId}`, handleMessage);
    socket.on("conversation_update", handleMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off(`conversation_${activeConversationId}`, handleMessage);
      socket.off("conversation_update", handleMessage);
    };
  }, [
    socket,
    activeConversationId,
    chatMessages,
    conversations,
    contacts,
    dispatch,
  ]);

  return null;
};

export default GlobalSocketHandler;
