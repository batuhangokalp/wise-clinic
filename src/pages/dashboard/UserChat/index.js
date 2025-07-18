import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import {
  getFullDateInfo,
  showChatMessageTime,
} from "../../../helpers/chatUtils";
import { FileTypeId } from "../../../helpers/chatConstants";
import SendFileModal from "./SendFileModal";
import { downloadFile } from "../../../helpers/fileUtils";
import {
  fetchConversations,
  fetchMessagesByConversationId,
  markConversationAsReadInList,
  setActiveConversation,
  setChatMessagesPage,
} from "../../../redux/chat/actions";
import { throttle } from "lodash";

//actions
import {
  hasPermission,
  openUserSidebar,
  setChatMessages,
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
import AiSuggestionModal from "./AiSuggestionModal";
import AIPromptInputModal from "./AIPromptInputModal";
import RenderDocPreview from "./RenderDoc";
import { toast } from "react-toastify";
import MarkAsReadButton from "../../../components/MarkAsReadButton";

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
  const [chatLoading, setChatLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (Array.isArray(chatMessages)) {
      setChatLoading(false);
    }
  }, [chatMessages]);

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
      //console.log("Disconnected from the server");
    };
  }, [SOCKET_SERVER_URL]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageStatus = (data) => {
      if (data.eventType === "message-status") {
        const { messageId, status, error } = data;

        if (!Array.isArray(chatMessages)) return;

        const updatedMessages = chatMessages.map((msg) =>
          msg.gupshup_message_id === messageId
            ? {
                ...msg,
                status,
                ...(status === "failed" && error
                  ? { error_reason: error }
                  : {}),
              }
            : msg
        );

        dispatch(setChatMessages(updatedMessages));

        if (status === "failed" && error) {
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

  const markConversationAsRead = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/messages/conversation/${props.activeConversation.id}/mark-as-read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = await response.json();

      const updatedConversation = {
        ...props.activeConversation,
        unread_count: 0,
      };

      dispatch(setActiveConversation(updatedConversation));
      dispatch(markConversationAsReadInList(props.activeConversation.id));

      return data;
    } catch (error) {
      throw error;
    }
  }, [props.activeConversation, dispatch]);

  const handleMessageInfo = (message) => {
    setSelectedMessage(message);
  };

  const sendMessage = async (message) => {
    try {
      const bodyData = JSON.stringify({
        phone_number: props.activeConversation?.phone_number,
        message_content: message,
        message_type_name: "text",
        message_category: "session",
        sender_source: "908503770269",
        receiver_destination: props.activeConversation?.phone_number,
        assigned_user_id: user?.id,
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/messages/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Mesaj gönderilemedi:", data);
        toast.error(data?.message || "Unsuccesful");
        return;
      }

      dispatch(fetchConversations());
      markConversationAsRead();

      return data;
    } catch (error) {
      console.error("SendMessage error:", error);
      toast.error("Mesaj gönderilirken bir hata oluştu.");
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
    setCurrentChat(messages);
    setAiModalOpen(true);
    setAiLoading(true);
    setAnotherAiResponse(null);
    try {
      const combinedMessage = messages
        .map((msg) => msg.message_content)
        .join("\n");
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
      // Mesajları birleştir (örn. tümünü boşlukla birleştir)
      const originalMessage = currentChat
        .map((msg) => msg.message_content)
        .join(" ");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/ai/regenerate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalMessage,
            newPrompt: customPrompt,
            initialSuggestion: aiResponse,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP hata: ${response.status}`);
      const data = await response.json();
      setAnotherAiResponse(data.regenerated);
      console.log("REGENERATE", data);
    } catch (error) {
      console.error("Alternatif AI isteği sırasında hata oluştu:", error);
    } finally {
      setAiLoading(false);
      setCustomPrompt("");
    }
  };
  function replaceTemplateParams(text = "", params = {}) {
    let result = text;
    Object.entries(params).forEach(([key, value]) => {
      const index = key.split("_")[1]; // örn: header_1 -> 1
      if (index) {
        const regex = new RegExp(`{{${index}}}`, "g");
        result = result.replace(regex, value);
      }
    });
    return result;
  }

  return (
    <div className="user-chat w-100 overflow-hidden">
      {chatLoading ? (
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
          <img
            src="/upsense-logo.png"
            alt=""
            style={{
              width: "150px",
              height: "150px",
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
            Loading chat messages...
          </div>
        </div>
      ) : aiLoading ? (
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
      ) : props.activeConversationId ? (
        <div className="d-lg-flex">
          <div
            className={
              props.userSidebar
                ? "w-70 overflow-hidden position-relative"
                : "w-100 overflow-hidden position-relative"
            }
          >
            {/* render user head */}
            <UserHead
              activeConversation={props.activeConversation}
              chatMessages={chatMessages}
            />

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
                                  (FileTypeId.Document.includes(
                                    Number(chat?.file_type_id)
                                  ) &&
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
                        {/* !!!NORMAL CHATLER BURADA!!! */}
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
                                        senderType={chat?.sender_type}
                                      />
                                    ))}
                                  {/* Video varsa */}
                                  {FileTypeId.Video.includes(
                                    Number(chat?.file_type_id)
                                  ) && <RenderVideo url={chat?.file_path} />}

                                  {/* Ses varsa */}
                                  {FileTypeId.Audio?.includes(
                                    Number(chat?.file_type_id)
                                  ) && <RenderAudio url={chat?.file_path} />}

                                  {/* Dosya varsa */}
                                  {(FileTypeId.TextFile ===
                                    Number(chat?.file_type_id) ||
                                    (Number(chat?.file_type_id) ===
                                      FileTypeId.Document[0] &&
                                      chat?.file_path?.endsWith(".txt"))) && (
                                    <RenderFilePreview
                                      url={chat?.file_path}
                                      senderType={chat?.sender_type}
                                    />
                                  )}

                                  {/* Text dosyası, Word dosyası veya txt dosyası */}
                                  {(FileTypeId.TextFile ===
                                    Number(chat?.file_type_id) ||
                                    (FileTypeId.Document.includes(
                                      Number(chat?.file_type_id)
                                    ) &&
                                      (chat?.file_path?.endsWith(".txt") ||
                                        chat?.file_path?.endsWith(".doc") ||
                                        chat?.file_path?.endsWith(
                                          ".docx"
                                        )))) && (
                                    <RenderDocPreview
                                      url={chat?.file_path}
                                      senderType={chat?.sender_type}
                                    />
                                  )}
                                  {console.log("chat:", chat)}
                                  {/* Text mesaj (https ile başlamıyorsa) */}
                                  <div id={`message-${chat.id}`}>
                                    {!chat?.message_content?.startsWith(
                                      "https"
                                    ) && (
                                      <>
                                        {chat.header &&
                                          chat.header.trim() !== "" && (
                                            <div
                                              style={{
                                                fontWeight: "bold",
                                                marginBottom: "4px",
                                              }}
                                            >
                                              {replaceTemplateParams(
                                                chat.header,
                                                chat.templateParams
                                              )}
                                            </div>
                                          )}

                                        <div style={{ marginBottom: "8px" }}>
                                          {replaceTemplateParams(
                                            chat.message_content,
                                            chat.templateParams
                                          )}
                                        </div>

                                        {chat.footer &&
                                          chat.footer.trim() !== "" && (
                                            <div
                                              style={{
                                                fontSize: "15px",
                                                color: "#999",
                                                marginTop: "4px",
                                              }}
                                            >
                                              {replaceTemplateParams(
                                                chat.footer,
                                                chat.templateParams
                                              )}
                                            </div>
                                          )}

                                        {chat.buttons?.length > 0 && (
                                          <div
                                            style={{
                                              marginTop: "8px",
                                              display: "flex",
                                              gap: "8px",
                                              flexWrap: "wrap",
                                            }}
                                          >
                                            {chat.buttons.map(
                                              (button, index) => (
                                                <button
                                                  key={index}
                                                  onClick={() =>
                                                    console.log(
                                                      "Button clicked:",
                                                      button
                                                    )
                                                  }
                                                  style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#e0f0ff",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {button.text}
                                                </button>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
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
                                      <span className="align-middle">
                                        {showChatMessageTime(chat?.created_at)}

                                        <MessageStatus
                                          status={chat?.status}
                                          messageError={chat?.error_reason}
                                        />
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
                                    <DropdownItem
                                      onClick={() => handleMessageInfo(chat)}
                                      className="d-flex justify-content-between align-items-center"
                                    >
                                      {t("Message Info")}
                                      <i className="ri-information-line text-muted"></i>
                                    </DropdownItem>

                                    {chat?.file_type_id && (
                                      <DropdownItem
                                        onClick={() =>
                                          downloadFile(chat?.file_path)
                                        }
                                        className="d-flex justify-content-between align-items-center"
                                      >
                                        {t("Download")}
                                        <i className="ri-file-download-line text-muted"></i>
                                      </DropdownItem>
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
                {props.activeConversation?.unread_count > 0 && (
                  <MarkAsReadButton
                    count={props.activeConversation?.unread_count || 0}
                    onClick={markConversationAsRead}
                  />
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
            <Modal
              isOpen={!!selectedMessage}
              toggle={() => setSelectedMessage(null)}
            >
              <ModalHeader toggle={() => setSelectedMessage(null)}>
                Message Info
              </ModalHeader>
              <ModalBody>
                <p>
                  <strong>Message:</strong>{" "}
                  {selectedMessage?.message_content?.length > 100
                    ? selectedMessage.message_content.substring(0, 100) + "..."
                    : selectedMessage?.message_content}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {getFullDateInfo(selectedMessage?.created_at)}
                </p>
                <p>
                  <strong>Status:</strong> {selectedMessage?.status}
                </p>
                {selectedMessage?.error_reason && (
                  <p>
                    <strong>Error:</strong> {selectedMessage?.error_reason}
                  </p>
                )}
              </ModalBody>
            </Modal>

            <SendFileModal
              show={false}
              markConversationAsRead={markConversationAsRead}
            />

            <ChatInput
              onaddMessage={addMessage}
              aiResponse={aiResponse}
              isAiRes={isAiRes}
              setIsAiRes={setIsAiRes}
              anotherAiResponse={anotherAiResponse}
              handleAiClick={handleAiClick}
              chatMessages={chatMessages}
              markConversationAsRead={markConversationAsRead}
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
            onClose={() => setAiModalOpen(false)}
          />

          <AIPromptInputModal
            showPromptModal={showPromptModal}
            setShowPromptModal={setShowPromptModal}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            sendCustomPrompt={sendCustomPrompt}
          />
        </div>
      ) : (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          <p className="text-muted fs-5"> No chat has been selected yet</p>
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
