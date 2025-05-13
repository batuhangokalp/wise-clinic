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
  fetchMessagesByConversationId,
  setChatMessagesPage,
} from "../../../redux/chat/actions";
import { throttle } from "lodash";

//actions
import {
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

function UserChat(props) {
  const dispatch = useDispatch();
  const SOCKET_SERVER_URL = `${process.env.REACT_APP_SOCKET_SERVER_URL}`;
  const ref = useRef();
  const chatEndRef = useRef(null);
  const [modal, setModal] = useState(false);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  //demo conversation messages
  //sender_type must be required
  const chatMessages = useSelector((state) => state.Chat?.chatMessages);
  const [socket, setSocket] = useState(null);

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

  useEffect(() => {
    if (socket) {
      const handleConnect = () => console.log("Connected to server");

      const handleMessage = (message) => {
        console.log("Received message data:", message); // Mesajın içeriğini kontrol et
        console.log("chatMessages", chatMessages);
        if (chatMessages?.length > 0) {
          console.log("Received message:", message);
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

          dispatch(setChatMessages(prevMessages => [...prevMessages, data]));
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

        console.log("conv", props.conversations);
        console.log("test", message);
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
  }, [socket, props.activeConversationId, props.conversations]);

  const toggle = () => setModal(!modal);
  const user = useSelector((state) => state.User.user);

  const sendMessage = async (message) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/messages/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: props.activeConversation?.phone_number,
            message_content: message,
            message_type_name: "text",
            message_category: "session",
            sender_source: "908503770269",
            receiver_destination: props.activeConversation?.phone_number,
            assigned_user_id: user?.id,
          }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addMessage = async (message, type) => {
    var messageObj = null;

    let d = new Date();
    var n = d.getSeconds();

    //matches the message type is text, file or image, and create object according to it
    switch (type) {
      case "textMessage":
        messageObj = {
          id: chatMessages[chatMessages.length - 1]?.id + 1,
          message_content: message,
          created_at: new Date(),
          sender_type: "user",
          file_type_id: null,
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
          file_type_id: FileTypeId.Image[0],
        };
        break;

      default:
        break;
    }

    await sendMessage(message);

    //add message object to chat
    dispatch(setChatMessages((prev) => [...prev, messageObj]));

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
          dispatch(
            fetchMessagesByConversationId(
              props.activeConversation,
              chatMessagesLimit,
              nextPage,
              true
            )
          )
            .then(() => {
              // Restore relative scroll position smoothly
              const newScrollHeight = scrollableElement.scrollHeight;
              const heightDifference = newScrollHeight - currentScrollHeight;

              // Add smooth scrolling with slight delay
              setTimeout(() => {
                scrollableElement.scrollTo({
                  top: heightDifference,
                  behavior: "smooth",
                });
              }, 200); // Delay for smoother experience
            })
            .finally(() => setLoadingOlderMessages(false)); // Reset loading flag
        }, 100); // Artificial delay before fetching
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

  return (
    <div className="user-chat w-100 overflow-hidden">
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
              {chatMessages?.map((chat, key) =>
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
                            {chat?.file_type_id === null && (
                              <p className="mb-0">{chat?.message_content}</p>
                            )}
                            {FileTypeId.Image?.includes(chat?.file_type_id) && (
                              <RenderImage url={chat?.file_path} />
                            )}
                            {chat?.file_type_id === FileTypeId.Document && (
                              //file input component
                              <FileList file={chat} />
                            )}
                            {chat?.file_type_id === FileTypeId.Video && (
                              //file input component
                              <RenderVideo url={chat?.file_path} />
                            )}
                            {FileTypeId.Audio?.includes(chat?.file_type_id) && (
                              //file input component
                              <RenderAudio url={chat?.file_path} />
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

                      <div className="user-chat-content">
                        <div className="ctext-wrap mb-3">
                          <div className="ctext-wrap-content ">
                            {chat?.file_type_id === null && (
                              <p className="mb-0">{chat?.message_content}</p>
                            )}
                            {FileTypeId.Image?.includes(chat?.file_type_id) && (
                              <RenderImage url={chat?.file_path} />
                            )}
                            {chat?.file_type_id === FileTypeId.Document && (
                              //file input component
                              <FileList file={chat} />
                            )}
                            {chat?.file_type_id === FileTypeId.Video && (
                              //file input component
                              <RenderVideo url={chat?.file_path} />
                            )}
                            {FileTypeId.Audio?.includes(chat?.file_type_id) && (
                              //file input component
                              <RenderAudio url={chat?.file_path} />
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
                          </div>
                          {!chat?.isTyping && (
                            <>
                              <br />
                              <p className="chat-time mb-0">
                                <i className="ri-time-line align-middle"></i>{" "}
                                <span className="align-middle">
                                  {showChatMessageTime(chat?.created_at)}
                                </span>
                              </p>
                            </>
                          )}
                          {!chat?.isTyping && (
                            <UncontrolledDropdown className="align-self-start ms-1">
                              <DropdownToggle tag="a" className="text-muted">
                                <i className="ri-more-2-fill"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                {chat?.file_type_id && (
                                  <DropdownItem
                                    onClick={() =>
                                      downloadFile(chat?.file_path)
                                    }
                                  >
                                    {t("Download")}{" "}
                                    <i className="ri-file-download-line float-end text-muted"></i>
                                  </DropdownItem>
                                )}

                                {/*
                                                                             <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>
                                                                        <DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>
                                                                        <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>
                                                                        <DropdownItem onClick={() => deleteMessage(chat?.id)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                            */}
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

          <ChatInput onaddMessage={addMessage} />
        </div>

        <UserProfileSidebar activeConversation={props.activeConversation} />
      </div>
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

export default withRouter(
  connect(mapStateToProps, { openUserSidebar, setChatMessages })(UserChat)
);
