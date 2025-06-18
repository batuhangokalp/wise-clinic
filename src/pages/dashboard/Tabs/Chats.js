import React, { act, Component, useEffect, useRef, useState } from "react";
import { Input, InputGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  ChatPlatform,
  ChatPlatformConverter,
} from "../../../redux/chat/constants";
import { useChatUrlParams } from "../../../helpers/chatUtils";
import { MessageType } from "../../../redux/chat/constants";
import { showLastMessageDate } from "../../../helpers/chatUtils";
import PropTypes from "prop-types";

//simplebar
import SimpleBar from "simplebar-react";

//actions
import {
  setconversationNameInOpenChat,
  setActiveConversationId,
  setActiveConversation,
  fetchConversations,
  fetchConversationById,
  fetchAllLastMessages,
  fetchMessagesByConversationId,
  setChatMessages,
} from "../../../redux/actions";
import { ROLES } from "../../../redux/role/constants";
import { io } from "socket.io-client";
import axios from "axios";

// Create a wrapper functional component
const ChatsWrapper = (props) => {
  const SOCKET_SERVER_URL = `${process.env.REACT_APP_SOCKET_SERVER_URL}`;
  const API_URL = `${process.env.REACT_APP_API_URL}`;

  const chatMessages = useSelector((state) => state.Chat.chatMessages);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  const user = useSelector((state) => state.User.user);
  const prevIdRef = useRef();
  const { updateChatUrl } = useChatUrlParams(
    props.conversations,
    props.setActiveConversationId,
    props.setActiveConversation
  );

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
    if (!socket || !props.activeConversation?.id) return;

    const currentId = props.activeConversation.id;
    const handleConnect = () => console.log("Connected to server");

    const availableConversation = props.conversations?.find(
      (conv) => conv.id === currentId
    );

    if (props.activeConversation?.last_message_id !== null) {
      props.fetchMessagesByConversationId(props.activeConversation);
    }
    if (currentId && !availableConversation) {
      props.setActiveConversation(null);
      props.setActiveConversationId(null);
    }

    if (
      currentId &&
      currentId !== prevIdRef.current &&
      props?.activeConversation?.last_message_id !== null
    ) {
      prevIdRef.current = currentId;
      props.fetchMessagesByConversationId(props.activeConversation);
    }

    const handleNewMessage = (message) => {
      if (
        message.conversation_id === props?.activeConversation?.id &&
        props.activeConversation.last_message_id !== null
      ) {
        dispatch(fetchMessagesByConversationId(props.activeConversation));
      }

      dispatch(fetchConversations());
    };
    socket.on("connect", handleConnect);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("connect", handleConnect);
    };
  }, [
    socket,
    props.conversations,
    props.activeConversation?.id,
    props.activeConversation?.last_message_id,
    dispatch,
  ]);

  return (
    <Chats
      updateChatUrl={updateChatUrl}
      user={user}
      {...props}
      activeConversationId={props.activeConversation?.id?.toString()}
      chatMessages={chatMessages}
      dispatch={dispatch}
      API_URL={API_URL}
    />
  );
};

class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchChat: "",
      recentChatList: this.props.conversations,
    };
    this.openUserChat = this.openUserChat.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { fetchConversations } = this.props;
    fetchConversations();
  }

  handleChange(e) {
    this.setState({ searchChat: e.target.value });
  }

  markConversationAsRead = async (apiUrl, chatId) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/messages/conversation/${chatId}/mark-as-read`,
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
      // console.log("✔️ Sohbet okunma durumu güncellendi:", data);
      return data;
    } catch (error) {
      // console.error("❌ Okunma durumu güncellenirken hata:", error);
      throw error;
    }
  };

  async openUserChat(e, chat) {
    const apiUrl = this.props.API_URL;
    const chatId = chat?.id;

    e.preventDefault();

    if (chat?.unread_count > 0 && chat.last_message_id) {
      try {
        await this.markConversationAsRead(apiUrl, chatId);
      } catch (err) {
        // hata zaten üstte loglanıyor
      }
    }

    if (!chat?.last_message) {
      this.props.setChatMessages([]);
    }

    this.props.updateChatUrl(chatId);
    this.props.setconversationNameInOpenChat(chat?.contact_name);
    this.props.setActiveConversation(chat);
    this.props.setActiveConversationId(chatId);

    const chatList = document.getElementById("chat-list");
    const clickedItem = e.target;
    let currentli = null;

    if (chatList) {
      const li = chatList.getElementsByTagName("li");

      for (let i = 0; i < li.length; ++i) {
        li[i].classList.remove("active");
      }

      for (let k = 0; k < li.length; ++k) {
        if (li[k].contains(clickedItem)) {
          currentli = li[k];
          break;
        }
      }
    }

    if (currentli) {
      currentli.classList.add("active");
    }

    const userChat = document.getElementsByClassName("user-chat");
    if (userChat.length > 0) {
      userChat[0].classList.add("user-chat-show");
    }

    const unread = document.getElementById("unRead" + chatId);
    if (unread) {
      unread.style.display = "none";
    }
  }

  render() {
    const { conversations, user } = this.props;
    const search = this.state.searchChat.toLowerCase();

    let filteredConversations = conversations.filter((conversation) => {
      const matchesSearch = conversation?.contact_name
        ?.toLowerCase()
        ?.includes(search);
      const matchesRole =
        user?.role_id === ROLES.User
          ? conversation?.assigned_user_id === user?.id
          : true;
      return matchesSearch && matchesRole;
    });

    return (
      <React.Fragment>
        <div>
          <div className="px-4 pt-4">
            <h4 className="mb-4">Chats</h4>
            <div className="search-box chat-search-box">
              <InputGroup className="mb-3 rounded-3">
                <span
                  className="input-group-text text-muted bg-light pe-1 ps-3"
                  id="basic-addon1"
                >
                  <i className="ri-search-line search-icon font-size-18"></i>
                </span>
                <Input
                  type="text"
                  value={this.state.searchChat}
                  onChange={(e) => this.handleChange(e)}
                  className="form-control bg-light"
                  placeholder="Search messages or users"
                />
              </InputGroup>
            </div>
            {/* Search Box */}
          </div>

          {/*<OnlineUsers />*/}

          {/* Start chat-message-list  */}
          <div>
            <h5 className="mb-3 px-3 font-size-16">Recent</h5>
            <SimpleBar className="chat-message-list">
              <ul
                className="list-unstyled chat-list chat-user-list px-2"
                id="chat-list"
              >
                {filteredConversations?.map((chat, key) => (
                  <li
                    key={chat?.id}
                    id={"conversation" + key}
                    className={
                      chat?.unRead
                        ? "unread"
                        : chat?.isTyping
                        ? "typing"
                        : key === this.props.active_user
                        ? "active"
                        : ""
                    }
                  >
                    <Link to="#" onClick={(e) => this.openUserChat(e, chat)}>
                      <div className="d-flex">
                        {chat?.profilePicture ? (
                          <div
                            className={
                              "chat-user-img " +
                              chat?.status +
                              " align-self-center ms-0"
                            }
                          >
                            <img
                              src={chat?.profilePicture}
                              className="rounded-circle avatar-xs"
                              alt="chatvia"
                            />
                            {chat?.status && (
                              <span className="user-status"></span>
                            )}
                          </div>
                        ) : (
                          <div
                            className={
                              "chat-user-img " +
                              chat?.status +
                              " align-self-center ms-0"
                            }
                          >
                            <div className="avatar-xs">
                              <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                {chat?.contact_name.charAt(0)}
                              </span>
                            </div>
                            {chat?.status && (
                              <span className="user-status"></span>
                            )}
                          </div>
                        )}

                        {/* Middle Part*/}
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="text-truncate font-size-15 mb-1 ms-3">
                            {chat?.contact_name}
                          </h5>

                          {chat?.isTyping ? (
                            <p className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                              typing
                              <span className="animate-typing">
                                <span className="dot ms-1"></span>
                                <span className="dot ms-1"></span>
                                <span className="dot ms-1"></span>
                              </span>
                            </p>
                          ) : (
                            <div className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                              {chat?.last_message &&
                                chat?.message_type_id === MessageType.Image && (
                                  <i className="ri-image-fill align-middle me-1"></i>
                                )}
                              {chat?.last_message &&
                                chat?.message_type_id === MessageType.File && (
                                  <i className="ri-file-text-fill align-middle me-1"></i>
                                )}
                              {chat?.last_message &&
                                (chat?.last_message?.length > 20
                                  ? chat?.last_message?.substring(0, 30) + "..."
                                  : chat?.last_message)}
                            </div>
                          )}

                          {/* Middle Bottom Part - Platform Card */}
                          <div className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                            {chat?.message_channel_id ===
                              ChatPlatform.Whatsapp && (
                              <span>
                                <i className="ri-whatsapp-fill align-middle me-1 text-success"></i>
                                {ChatPlatformConverter[ChatPlatform.Whatsapp]}
                              </span>
                            )}
                            {chat?.message_channel_id ===
                              ChatPlatform.Facebook && (
                              <span>
                                <i className="ri-messenger-fill align-middle me-1 text-info"></i>
                                {ChatPlatformConverter[ChatPlatform.Facebook]}

                                {/* {ChatPlatform.Facebook} */}
                              </span>
                            )}
                            {chat?.message_channel_id ===
                              ChatPlatform.Instagram && (
                              <span>
                                <i className="ri-instagram-fill align-middle me-1 text-dark"></i>
                                {ChatPlatformConverter[ChatPlatform.Instagram]}

                                {/* {ChatPlatform.Instagram} */}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="font-size-11">
                          {showLastMessageDate(chat?.updated_at)}
                        </div>
                        {chat?.unRead === 0 ? null : (
                          <div
                            className="unread-message"
                            id={"unRead" + chat?.id}
                          >
                            <span className="badge badge-soft-success rounded-pill">
                              {chat?.last_message && chat?.unread_count > 0
                                ? chat?.unread_count
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </SimpleBar>
          </div>
          {/* End chat-message-list */}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { activeConversation, conversations, activeConversationId } =
    state.Chat;
  return {
    activeConversation,
    conversations,
    activeConversationId: String(activeConversationId),
  };
};

export default connect(mapStateToProps, {
  setconversationNameInOpenChat,
  fetchConversations,
  setActiveConversationId,
  setActiveConversation,
  fetchConversationById,
  fetchAllLastMessages,
  fetchMessagesByConversationId,
  setChatMessages,
})(ChatsWrapper);

ChatsWrapper.propTypes = {
  fetchMessagesByConversationId: PropTypes.func.isRequired,
  fetchAllLastMessages: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  activeConversation: PropTypes.object,
  conversations: PropTypes.array,
  setActiveConversationId: PropTypes.func,
  setActiveConversation: PropTypes.func,
  activeConversationId: PropTypes.string.isRequired,
  setChatMessages: PropTypes.func.isRequired,
};

Chats.propTypes = {
  conversations: PropTypes.array.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  setconversationNameInOpenChat: PropTypes.func.isRequired,
  setActiveConversationId: PropTypes.func.isRequired,
  setActiveConversation: PropTypes.func.isRequired,
  setChatMessages: PropTypes.func.isRequired,
  activeConversationId: PropTypes.string,
};
