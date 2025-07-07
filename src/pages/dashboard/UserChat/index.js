import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
  Button,
  ModalFooter,
} from "reactstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import SimpleBar from "simplebar-react";
import withRouter from "../../../components/withRouter";
//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ChatInput from "./ChatInput";
import FileList from "./FileList";
import { showChatMessageTime } from "../../../helpers/chatUtils";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";
import SendFileModal from "./SendFileModal";
import { downloadFile } from "../../../helpers/fileUtils";
import {
  fetchConversations,
  fetchMessagesByConversationId,
  setChatMessagesPage,
} from "../../../redux/chat/actions";
import { throttle } from "lodash";

//actions
import {
  fetchContactById,
  hasPermission,
  openUserSidebar,
  setChatMessages,
  setConversations,
} from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
//i18n
import { useTranslation } from "react-i18next";
import RenderImage from "./RenderImage";
import RenderAudio from "./RenderAudio";
import RenderVideo from "./RenderVideo";
import MessageStatus from "./MessageStatus";
import RenderPDFFirstPage from "./RenderPDFFirstPage";
import RenderFilePreview from "./RenderFilePreview";
import { PERMISSION_MAP, PERMISSIONS } from "../../../redux/role/constants";
import PermissionWrapper from "../../../components/PermissionWrapper";
import axios from "axios";
import AiSuggestionModal from "./AiSuggestionModal";
import AIPromptInputModal from "./AIPromptInputModal";
import RenderDocPreview from "./RenderDoc";
import { toast } from "react-toastify";

function UserChat(props) {
  const dispatch = useDispatch();
  const SOCKET_SERVER_URL = `${process.env.REACT_APP_SOCKET_SERVER_URL}`;
  const roleId = useSelector((state) => state.User.user?.role_id);
  const roles = useSelector((state) => state.Role.roles);
  const currentUser = useSelector((state) => state.User.user);
  const currentRole = roles.find((role) => role.id === roleId);
  const ref = useRef();
  const chatEndRef = useRef(null);
  const [modal, setModal] = useState(false);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  //demo conversation messages
  //sender_type must be required
  const chatMessages = useSelector((state) => state.Chat?.chatMessages);
  const [socket, setSocket] = useState(null);
  const [bitrixData, setBitrixData] = useState([]);
  const [isAiRes, setIsAiRes] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [anotherAiResponse, setAnotherAiResponse] = useState(null);

  useEffect(() => {
    const fetchBitrixData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/bitrix/crm-records/${props.activeConversation?.phone_number}`,
          {
            headers: {
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
              Host: `${process.env.REACT_APP_API_URL}`,
              "ngrok-skip-browser-warning": 69420,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP hata durumu: ${response.status}`);
        }

        const data = await response.json();
        setBitrixData(data);
      } catch (error) {
        console.error("Bitrix API hatası:", error);
      }
    };

    fetchBitrixData();
  }, [props.activeConversation?.phone_number]);

  useEffect(() => {
    // Initialize the socket connection
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ["websocket"], // Optional, just in case you want to ensure WebSocket connection
      debug: true,
    });

    // Save the socket instance in the state
    setSocket(socketInstance);

    // Clean up the socket connection when the component is unmounted
    return () => {
      socketInstance.disconnect();
      console.log("Disconnected from the server");
    };
  }, [SOCKET_SERVER_URL]);

  const playNotificationSound = () => {
    const audio = new Audio("/notifications.wav");
    audio.play().catch((err) => {
      console.warn("Ses çalınamadı:", err);
    });
  };

  const showDesktopNotification = (title, message) => {
    if (Notification.permission === "granted") {
      try {
        new Notification(title, {
          body: message,
          icon: "/upsense-logo.png",
        });
      } catch (error) {
        //console.error("Bildirim gönderilemedi:", error);
      }
    } else {
      //console.log("Bildirim izni yok.");
    }
  };
  const contacts = useSelector((state) => state.Contact.contacts);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => console.log("Connected to server");

      const handleMessage = (message) => {
        const contact = contacts.find((c) => c.id === message.senderId);
        const senderName = contact?.name || "";
        const senderSurname = contact?.surname || "";
        playNotificationSound();
        showDesktopNotification(
          `${senderName} ${senderSurname} sent message!`,
          message.message
        );
        if (chatMessages?.length > 0) {
          let data = {
            id: chatMessages[chatMessages.length - 1]?.id + 1,
            message_content: message?.message,
            created_at: message?.timestamp,
            sender_type: "receiver",
            conversationId: message?.conversationId,
            mediaType: message?.mediaType,
            mediaUrl: message?.mediaUrl,
            message: message?.message,
            senderId: message?.senderId,
            timestamp: message?.timestamp,
            file_type_id: findFileType(message?.mediaType),
            file_path: message?.mediaUrl,
          };

          dispatch(setChatMessages([...chatMessages, data]));

          scrollToBottom();
        }
      };

      const handleNewMessage = (message) => {
        let messageSender = message?.senderId;
        let conversation = props.conversations.find(
          (conversation) => conversation?.phone_number === messageSender
        );
        if (conversation) {
          conversation.last_message = message?.message ?? t("Media Message");
          conversation.unRead =
            conversation.unRead && conversation.unRead >= 0
              ? conversation.unRead + 1
              : 1;
          conversation.updated_at = new Date();

          let currentConversations = props.conversations.filter(
            (conversation) => conversation?.phone_number !== messageSender
          );
          currentConversations.unshift(conversation);
          dispatch(setConversations(currentConversations));
        }
      };
      // Reset chatMessages when conversation changes
      socket.on("connect", handleConnect);
      socket.on("new_message", handleNewMessage);

      // Dynamically handle conversation updates based on activeConversationId
      socket.on(`conversation_${props.activeConversationId}`, handleMessage);

      socket.on(`conversation_update`, handleMessage);

      return () => {
        socket.off("connect", handleConnect);
        socket.off(`conversation_${props.activeConversationId}`, handleMessage);
        socket.off("new_message", handleNewMessage);
        socket.off("conversation_update", handleMessage);
      };
    }
  }, [
    socket,
    props.activeConversationId,
    props.conversations,
    chatMessages,
    dispatch,
    t,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageStatus = (data) => {
      if (data.eventType === "message-status") {
        const { messageId, status, error } = data;
        // console.log("Gupshup ID:", messageId, "Status:", status);

        if (!Array.isArray(chatMessages)) return;

        const updatedMessages = chatMessages.map((msg) =>
          msg.gupshup_message_id === messageId ? { ...msg, status } : msg
        );

        dispatch(setChatMessages(updatedMessages));

        if (status === "failed") {
          toast.error(error, {
            position: "bottom-right",
          });
        }
      }
    };

    socket.on("message_event", handleMessageStatus);

    return () => {
      socket.off("message_event", handleMessageStatus);
    };
  }, [socket, dispatch, chatMessages]);

  const toggle = () => setModal(!modal);
  const user = useSelector((state) => state.User.user);

  const sendMessage = async (message, type) => {
    try {
      let bodyData;

      if (
        type === "audioMessage" ||
        type === "fileMessage" ||
        type === "imageMessage"
      ) {
        // Eğer dosya gönderiyorsan form-data kullan
        const formData = new FormData();
        formData.append("phone_number", props.activeConversation?.phone_number);
        formData.append(
          "message_type_name",
          type === "audioMessage"
            ? "audio"
            : type === "fileMessage"
            ? "document"
            : "image"
        );
        formData.append("message_category", "session");
        formData.append("sender_source", "908503770269");
        formData.append(
          "receiver_destination",
          props.activeConversation?.phone_number
        );
        formData.append("assigned_user_id", user?.id);
        formData.append("file", message); // message burada File veya Blob nesnesi

        bodyData = formData;
      } else {
        // Text mesaj için JSON gönder
        bodyData = JSON.stringify({
          phone_number: props.activeConversation?.phone_number,
          message_content: message,
          message_type_name: "text",
          message_category: "session",
          sender_source: "908503770269",
          receiver_destination: props.activeConversation?.phone_number,
          assigned_user_id: user?.id,
        });
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/messages/send`,
        {
          method: "POST",
          headers:
            type === "textMessage"
              ? { "Content-Type": "application/json" }
              : {}, // form-data için content-type otomatik atanır
          body: bodyData,
        }
      );
      const data = await response.json();
      dispatch(fetchConversations());

      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addMessage = async (message, type) => {
    var messageObj = null;

    let d = new Date();
    var n = d.getSeconds();

    // Backend’den dönen mesajı bekle
    const responseData = await sendMessage(message, type);

    const backendMessage = responseData?.data;
    switch (type) {
      case "textMessage":
        messageObj = {
          id: chatMessages[chatMessages.length - 1]?.id + 1,
          message_content: message,
          created_at: new Date(),
          sender_type: "user",
          file_type_id: null,
          gupshup_message_id: backendMessage?.gupshup_message_id || null,
        };
        break;

      case "fileMessage":
        messageObj = {
          id: chatMessages.length + 1,
          message_content: "file",
          fileMessage: message.name,
          size: message.size,
          time: "00:" + n,
          sender_type: "user",
          image: avatar4,
          isFileMessage: true,
          isImageMessage: false,
          isAudioMessage: false,
          file_type_id: FileTypeId.Document,
        };
        break;

      case "imageMessage":
        var imageMessage = [{ image: message }];

        messageObj = {
          id: chatMessages.length + 1,
          message_content: "image",
          imageMessage: imageMessage,
          size: message.size,
          time: "00:" + n,
          sender_type: "user",
          isImageMessage: true,
          isFileMessage: false,
          isAudioMessage: false,

          file_type_id: FileTypeId.Image[0],
        };
        break;
      case "audioMessage":
        messageObj = {
          id: chatMessages.length + 1,
          message_content: "audio",
          fileMessage: message.name,
          size: message.size,
          time: "00:" + n,
          sender_type: "user",
          isFileMessage: false,
          isImageMessage: false,
          isAudioMessage: true,
          file_type_id: FileTypeId.Audio[0],
        };
        break;

      default:
        break;
    }

    //add message object to chat
    dispatch(setChatMessages([...chatMessages, messageObj]));

    scrollToBottom();
  };

  useEffect(() => {
    if (!loadingOlderMessages) {
      scrollToBottom();
    }
  }, [chatMessages]);

  function scrollToBottom() {
    if (ref.current?.el) {
      ref.current.getScrollElement().scrollTop =
        ref.current.getScrollElement().scrollHeight;
    }
  }

  const chatMessagesLimit = useSelector(
    (state) => state.Chat?.chatMessagesLimit
  );
  const chatMessagesPage = useSelector((state) => state.Chat?.chatMessagesPage);
  const chatMessagesPageRef = useRef(chatMessagesPage);
  useEffect(() => {
    chatMessagesPageRef.current = chatMessagesPage; // Keep ref updated
  }, [chatMessagesPage]);

  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);

  const handleScroll = throttle(() => {
    if (ref.current) {
      const scrollableElement = ref.current.getScrollElement();
      const scrollTop = scrollableElement.scrollTop;

      if (scrollTop === 0 && !loadingOlderMessages) {
        const currentScrollHeight = scrollableElement.scrollHeight; // Save current scroll height
        setLoadingOlderMessages(true); // Set loading flag

        const nextPage = chatMessagesPageRef.current + 1;

        // Fetch messages with a slight delay
        setTimeout(() => {
          dispatch(setChatMessagesPage(nextPage));

          const lastMessageId = props.activeConversation?.last_message_id;

          if (lastMessageId) {
            dispatch(
              fetchMessagesByConversationId(
                props.activeConversation,
                chatMessagesLimit,
                nextPage,
                true
              )
            )
              .then(() => {
                const newScrollHeight = scrollableElement.scrollHeight;
                const heightDifference = newScrollHeight - currentScrollHeight;

                setTimeout(() => {
                  scrollableElement.scrollTo({
                    top: heightDifference,
                    behavior: "smooth",
                  });
                }, 200);
              })
              .finally(() => setLoadingOlderMessages(false));
          } else {
            setLoadingOlderMessages(false);
          }
        }, 100);
      }
    }
  }, 300); // Throttle interval to prevent rapid triggering

  const deleteMessage = (id) => {
    let conversation = chatMessages;

    var filtered = conversation.filter(function (item) {
      return item.id !== id;
    });

    dispatch(setChatMessages(filtered));
  };

  useEffect(() => {
    const scrollableElement = ref.current?.getScrollElement();
    scrollableElement?.addEventListener("scroll", handleScroll);

    return () => {
      scrollableElement?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const rawPermissions = currentRole?.permissions || [];
  const userPermissions = rawPermissions
    .flatMap((p) => PERMISSION_MAP[p] || [])
    .filter(Boolean);

  const canViewAllChats = hasPermission(
    userPermissions,
    PERMISSIONS.VIEW_ALL_CHATS
  );
  const canViewAssignedChats = hasPermission(
    userPermissions,
    PERMISSIONS.VIEW_ASSIGNED_CHATS
  );
  const activeChat = props.activeConversation;

  const canAccessChat =
    canViewAllChats ||
    (canViewAssignedChats && activeChat?.assigned_user_id === currentUser?.id);

  if (!canAccessChat) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100%" }}
      >
        <p className="text-muted"></p>
      </div>
    );
  }

  const handleAiClick = async (messages) => {
    console.log("messages:", messages);
    setCurrentChat(messages); // İstersen sadece son mesajı da set edebilirsin
    setAiModalOpen(true);
    setAiLoading(true);

    try {
      // Mesaj içeriklerini birleştir
      const combinedMessage = messages
        .map((msg) => msg.message_content)
        .join("\n");

      console.log("objects:", combinedMessage);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/ai/suggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: combinedMessage }),
        }
      );

      if (!response.ok) throw new Error(`HTTP hata: ${response.status}`);

      const data = await response.json();
      setAiResponse(data.suggestion);
    } catch (error) {
      console.error("AI isteği sırasında hata oluştu:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAccept = () => {
    setIsAiRes(true);
    setAiModalOpen(false);
    setCurrentChat(null);
  };

  const handleReject = () => {
    setShowPromptModal(true);
  };

  const sendCustomPrompt = async () => {
    if (!currentChat || !customPrompt.trim()) return;

    setAiLoading(true);
    setShowPromptModal(false);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/ai/regenerate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalMessage: currentChat.message_content,
            newPrompt: customPrompt,
            initialSuggestion: aiResponse,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP hata: ${response.status}`);
      const data = await response.json();
      setAnotherAiResponse(data.regenerated);
    } catch (error) {
      console.error("Alternatif AI isteği sırasında hata oluştu:", error);
    } finally {
      setAiLoading(false);
      setCustomPrompt("");
    }
  };

  return (
    <div className="user-chat w-100 overflow-hidden">
      {aiLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 0",
            }}
          >
            <img
              src="/upsense-logo.png" 
              alt=""
              style={{
                width: "120px",
                height: "120px",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                marginTop: "12px",
                color: "#cfd8dc",
                fontSize: "20px",
              }}
            >
              Waiting for AI reply...
            </div>
          </div>
        </div>
      ) : (
        <div className="d-lg-flex">
          <div
            className={
              props.userSidebar
                ? "w-70 overflow-hidden position-relative"
                : "w-100 overflow-hidden position-relative"
            }
          >
            {/* render user head */}
            <UserHead activeConversation={props.activeConversation} />

            <SimpleBar
              onScroll={() => {
                const scrollTop = ref.current.getScrollElement().scrollTop;
                if (scrollTop === 0) alert("TOP");
              }}
              style={{ maxHeight: "100%", overflow: "auto" }}
              ref={ref}
              className="chat-conversation p-5 p-lg-4"
              id="messages"
            >
              <ul className="list-unstyled mb-0">
                {chatMessages &&
                  chatMessages?.map((chat, key) =>
                    chat?.isToday && chat?.isToday === true ? (
                      <li key={chat.id}>
                        <div className="chat-day-title">
                          <span className="title">Today</span>
                        </div>
                      </li>
                    ) : chat?.isGroup === true ? (
                      <li
                        key={chat.id}
                        className={chat?.sender_type === "user" ? "right" : ""}
                      >
                        <div className="conversation-list">
                          <div className="chat-avatar">
                            {chat?.sender_type === "user" ? (
                              <div className="chat-user-img align-self-center me-3">
                                <div className="avatar-xs">
                                  <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                    {props.activeConversation?.contact_name?.charAt(
                                      0
                                    ) ?? "A"}
                                  </span>
                                </div>
                              </div>
                            ) : chat?.profilePicture === null ? (
                              <div className="chat-user-img align-self-center me-3">
                                <div className="avatar-xs">
                                  <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                    {chat?.userName && chat?.userName.charAt(0)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="chat-user-img align-self-center me-3">
                                <div className="avatar-xs">
                                  <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                    {props.activeConversation?.contact_name?.charAt(
                                      0
                                    ) ?? "A"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="user-chat-content">
                            <div className="ctext-wrap">
                              <div className="ctext-wrap-content">
                                {!chat?.message_content?.startsWith(
                                  "https"
                                ) && <div>{chat.message_content}</div>}
                                {FileTypeId.Image?.includes(
                                  chat?.file_type_id
                                ) && <RenderImage url={chat?.file_path} />}

                                {FileTypeId.Document.includes(
                                  Number(chat?.file_type_id)
                                ) &&
                                  (chat?.file_path?.endsWith("pdf") ? (
                                    <RenderPDFFirstPage url={chat?.file_path} />
                                  ) : (
                                    <RenderFilePreview url={chat?.file_path} />
                                  ))}

                                {chat?.file_type_id === FileTypeId.Video && (
                                  //file input component
                                  <RenderVideo url={chat?.file_path} />
                                )}

                                {FileTypeId.Audio?.includes(
                                  chat?.file_type_id
                                ) && (
                                  //file input component
                                  <RenderAudio url={chat?.file_path} />
                                )}
                                {(FileTypeId.TextFile ===
                                  Number(chat?.file_type_id) ||
                                  (Number(chat?.file_type_id) ===
                                    FileTypeId.Document[0] &&
                                    (chat?.file_path?.endsWith(".txt") ||
                                      chat?.file_path?.endsWith(".doc") ||
                                      chat?.file_path?.endsWith(".docx")))) && (
                                  <RenderDocPreview url={chat?.file_path} />
                                )}

                                {chat?.isTyping && (
                                  <p className="mb-0">
                                    typing
                                    <span className="animate-typing">
                                      <span className="dot ms-1"></span>
                                      <span className="dot ms-1"></span>
                                      <span className="dot ms-1"></span>
                                    </span>
                                  </p>
                                )}
                                {!chat?.isTyping && (
                                  <p className="chat-time mb-0">
                                    <i className="ri-time-line align-middle"></i>{" "}
                                    <span className="align-middle">
                                      {chat?.time}
                                    </span>
                                  </p>
                                )}
                              </div>
                              {!chat?.isTyping && (
                                <UncontrolledDropdown className="align-self-start">
                                  <DropdownToggle
                                    tag="a"
                                    className="text-muted ms-1"
                                  >
                                    <i className="ri-more-2-fill"></i>
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem>
                                      {t("Copy")}{" "}
                                      <i className="ri-file-copy-line float-end text-muted"></i>
                                    </DropdownItem>
                                    <DropdownItem>
                                      {t("Save")}{" "}
                                      <i className="ri-save-line float-end text-muted"></i>
                                    </DropdownItem>
                                    <DropdownItem onClick={toggle}>
                                      Forward{" "}
                                      <i className="ri-chat-forward-line float-end text-muted"></i>
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => deleteMessage(chat?.id)}
                                    >
                                      Delete{" "}
                                      <i className="ri-delete-bin-line float-end text-muted"></i>
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              )}
                            </div>
                            {
                              <div className="conversation-name">
                                {chat?.sender_type === "user"
                                  ? props.activeConversation?.contact_name
                                  : chat?.contact_name}
                              </div>
                            }
                          </div>
                        </div>
                      </li>
                    ) : (
                      <li
                        key={key}
                        className={chat?.sender_type === "user" ? "right" : ""}
                      >
                        <div className="conversation-list">
                          {
                            //logic for display user name and profile only once, if current and last messaged sent by same receiver
                            chatMessages[key + 1] ? (
                              chatMessages[key].sender_type ===
                              chatMessages[key + 1].sender_type ? (
                                <div className="chat-avatar">
                                  <div className="blank-div"></div>
                                </div>
                              ) : (
                                <div className="chat-avatar">
                                  {chat?.sender_type === "user" ? (
                                    <div className="chat-user-img align-self-center me-3">
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                          {props.user?.name?.charAt(0) ?? "A"}{" "}
                                          {/* User Name Initials */}
                                        </span>
                                      </div>
                                    </div>
                                  ) : chat?.profilePicture === null ? (
                                    <div className="chat-user-img align-self-center me-3">
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                          {props.user?.name?.charAt(0) ?? "A"}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="chat-user-img align-self-center me-3">
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                          {props.activeConversation?.contact_name?.charAt(
                                            0
                                          ) ?? "A"}{" "}
                                          {/*other user */}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            ) : (
                              <div className="chat-avatar">
                                {chat?.sender_type === "user" ? (
                                  <div className="chat-user-img align-self-center me-3">
                                    <div className="avatar-xs">
                                      <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        {props.user?.name?.charAt(0) ?? "A"}{" "}
                                        {/* User Name Initials last me*/}
                                      </span>
                                    </div>
                                  </div>
                                ) : chat?.profilePicture === null ? (
                                  <div className="chat-user-img align-self-center me-3">
                                    <div className="avatar-xs">
                                      <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        {props.activeConversation?.contact_name?.charAt(
                                          0
                                        ) ?? "A"}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="chat-user-img align-self-center me-3">
                                    <div className="avatar-xs">
                                      <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        {props.activeConversation?.contact_name?.charAt(
                                          0
                                        ) ?? "A"}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          }

                          <div
                            className="user-chat-content"
                            style={{ position: "relative" }}
                          >
                            <div className="ctext-wrap mb-3">
                              <div className="ctext-wrap-content">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    alignSelf: "flex-start",
                                    textAlign: "left",
                                  }}
                                >
                                  {/* Görsel varsa üstte */}
                                  {FileTypeId.Image?.includes(
                                    chat?.file_type_id
                                  ) && <RenderImage url={chat?.file_path} />}

                                  {FileTypeId.Document.includes(
                                    Number(chat?.file_type_id)
                                  ) &&
                                    (chat?.file_path?.endsWith("pdf") ? (
                                      <RenderPDFFirstPage
                                        url={chat?.file_path}
                                      />
                                    ) : (
                                      <RenderFilePreview
                                        url={chat?.file_path}
                                      />
                                    ))}
                                  {/* Video varsa */}
                                  {FileTypeId.Video.includes(
                                    Number(chat?.file_type_id)
                                  ) && <RenderVideo url={chat?.file_path} />}

                                  {/* Ses varsa */}
                                  {FileTypeId.Audio?.includes(
                                    chat?.file_type_id
                                  ) && <RenderAudio url={chat?.file_path} />}

                                  {/* Dosya varsa */}
                                  {(FileTypeId.TextFile ===
                                    Number(chat?.file_type_id) ||
                                    (Number(chat?.file_type_id) ===
                                      FileTypeId.Document[0] &&
                                      chat?.file_path?.endsWith(".txt"))) && (
                                    <RenderFilePreview url={chat?.file_path} />
                                  )}
                                  {/* Text dosyası, Word dosyası veya txt dosyası */}
                                  {(FileTypeId.TextFile ===
                                    Number(chat?.file_type_id) ||
                                    (Number(chat?.file_type_id) ===
                                      FileTypeId.Document[0] &&
                                      (chat?.file_path?.endsWith(".txt") ||
                                        chat?.file_path?.endsWith(".doc") ||
                                        chat?.file_path?.endsWith(
                                          ".docx"
                                        )))) && (
                                    <RenderDocPreview url={chat?.file_path} />
                                  )}
                                  {/* Text mesaj (https ile başlamıyorsa) */}
                                  {!chat?.message_content?.startsWith(
                                    "https"
                                  ) && <div>{chat.message_content}</div>}
                                </div>

                                {chat?.isTyping && (
                                  <p className="mb-0">
                                    typing
                                    <span className="animate-typing">
                                      <span className="dot ms-1"></span>
                                      <span className="dot ms-1"></span>
                                      <span className="dot ms-1"></span>
                                    </span>
                                  </p>
                                )}
                              </div>
                              {!chat?.isTyping && (
                                <>
                                  <br />
                                  {chat?.sender_type === "user" ? (
                                    <p
                                      className="chat-time mb-0"
                                      style={{ zIndex: 1 }}
                                    >
                                      <i className="ri-time-line align-middle"></i>{" "}
                                      <span className="align-middle">
                                        {showChatMessageTime(chat?.created_at)}

                                        <MessageStatus status={chat?.status} />
                                      </span>
                                    </p>
                                  ) : (
                                    <p
                                      className="chat-time mb-0"
                                      style={{
                                        position: "absolute",
                                        right: "25px",
                                      }}
                                    >
                                      <i className="ri-time-line align-middle"></i>{" "}
                                      <span className="align-middle">
                                        {showChatMessageTime(chat?.created_at)}
                                      </span>
                                    </p>
                                  )}
                                </>
                              )}
                              {!chat?.isTyping && (
                                <UncontrolledDropdown className="align-self-start ms-1">
                                  <DropdownToggle
                                    tag="a"
                                    className="text-muted"
                                  >
                                    <i className="ri-more-2-fill"></i>
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    {chat?.file_type_id ? (
                                      <DropdownItem
                                        onClick={() =>
                                          downloadFile(chat?.file_path)
                                        }
                                      >
                                        {t("Download")}
                                        <i className="ri-file-download-line float-end text-muted"></i>
                                      </DropdownItem>
                                    ) : (
                                      <>
                                        {/* {chat?.sender_type === "contact" && (
                                          <DropdownItem
                                            onClick={() => handleAiClick(chat)}
                                          >
                                            <i className="ri-robot-2-line me-2 text-primary"></i>
                                            Reply with AI
                                          </DropdownItem>
                                        )} */}
                                      </>
                                    )}
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              )}
                            </div>
                            {chatMessages[key + 1] ? (
                              chatMessages[key].sender_type ===
                              chatMessages[key + 1].sender_type ? null : (
                                <div className="conversation-name">
                                  {chat?.sender_type === "user"
                                    ? props.user?.name
                                    : chat?.contact_name}
                                </div>
                              )
                            ) : (
                              <div className="conversation-name">
                                {chat?.sender_type === "user"
                                  ? props.user?.name
                                  : chat?.contact_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  )}

                {/* Chat End Reference */}
                <li ref={chatEndRef} />
              </ul>
            </SimpleBar>
            <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
              <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
              <ModalBody>
                <CardBody className="p-2">
                  <SimpleBar style={{ maxHeight: "200px" }}>
                    <SelectContact handleCheck={() => {}} />
                  </SimpleBar>
                  <ModalFooter className="border-0">
                    <Button color="primary">Forward</Button>
                  </ModalFooter>
                </CardBody>
              </ModalBody>
            </Modal>

            <SendFileModal show={false} />

            <ChatInput
              onaddMessage={addMessage}
              aiResponse={aiResponse}
              isAiRes={isAiRes}
              setIsAiRes={setIsAiRes}
              anotherAiResponse={anotherAiResponse}
              handleAiClick={handleAiClick}
              chatMessages={chatMessages}
            />
          </div>

          <UserProfileSidebar
            activeConversation={props.activeConversation}
            bitrixData={bitrixData}
          />
          <AiSuggestionModal
            isOpen={aiModalOpen}
            suggestion={aiResponse}
            anotherSuggestion={anotherAiResponse}
            loading={aiLoading}
            onAccept={handleAccept}
            onReject={handleReject}
          />

          <AIPromptInputModal
            showPromptModal={showPromptModal}
            setShowPromptModal={setShowPromptModal}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            sendCustomPrompt={sendCustomPrompt}
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { activeConversationId, activeConversation, conversations } =
    state.Chat;
  const { userSidebar } = state.Layout;
  const { user } = state.User;
  return {
    userSidebar,
    activeConversationId,
    activeConversation,
    user,
    conversations,
  };
};
const requiredPermissions = [
  PERMISSIONS.VIEW_ASSIGNED_CHATS,
  PERMISSIONS.VIEW_ALL_CHATS,
];

const ConnectedUserChat = connect(mapStateToProps, {
  openUserSidebar,
  setChatMessages,
})(UserChat);

const RoutedUserChat = withRouter(ConnectedUserChat);

export default PermissionWrapper(RoutedUserChat, requiredPermissions);
