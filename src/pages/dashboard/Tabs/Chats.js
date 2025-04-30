import React, { Component, useEffect, useRef } from 'react';
import { Input, InputGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { ChatPlatform, ChatPlatformConverter } from "../../../redux/chat/constants";
import { useChatUrlParams } from "../../../helpers/chatUtils";
import { MessageType } from "../../../redux/chat/constants";
import { showLastMessageDate } from "../../../helpers/chatUtils";
import PropTypes from 'prop-types';

//simplebar
import SimpleBar from "simplebar-react";

//actions
import {
    setconversationNameInOpenChat, setActiveConversationId, setActiveConversation,
    fetchConversations, fetchConversationById, fetchAllLastMessages, fetchMessagesByConversationId
} from "../../../redux/actions";
import { ROLES } from '../../../redux/role/constants';

// Create a wrapper functional component
const ChatsWrapper = (props) => {
    let user = useSelector((state) => state.User.user);
    const { updateChatUrl } = useChatUrlParams(
        props.conversations,
        props.setActiveConversationId,
        props.setActiveConversation
    );

    useEffect(() => {
        // Fetch messages by conversation id
        if (props.activeConversation) {
             // Fetch last messages by last_message_id of each conversation to show in chat list
         props.activeConversation?.id && props.fetchMessagesByConversationId(props.activeConversation);
        }
    }, [props.activeConversationId])

    return <Chats updateChatUrl={updateChatUrl} user={user}  {...props} />;
}

class Chats extends Component {



    constructor(props) {

        super(props);
        this.state = {
            socket: null,
            searchChat: "",
            recentChatList: this.props.conversations,
            upsenseChatList: [],
        }
        this.openUserChat = this.openUserChat.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.fetchConversations()

        const { socket } = this.props;

        if (socket) {
            this.handleConnect = () => console.log('Connected to server');
            this.handleNewMessage = (message) => {
               console.log('New message received', message);
            };

            socket.on('connect', this.handleConnect);
            socket.on('new_message', this.handleNewMessage);
        }
    }
    handleNewMessage = (message) => {
        this.setState((prevState) => ({
            recentChatList: [...prevState.recentChatList, message]
        }));

        
    }
    


    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                recentChatList: this.props.recentChatList
            });
        }
    }


    componentWillUnmount() {
        const { socket } = this.props;

        if (socket) {
            socket.off('connect', this.handleConnect);
            socket.off('new_message', this.handleNewMessage);
        }
    }



    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.recentChatList !== nextProps.recentChatList) {
            this.setState({
                recentChatList: nextProps.recentChatList,
            });
        }
    }

    handleChange(e) {
        this.setState({ searchChat: e.target.value });
        var search = e.target.value;
        let conversation = this.props.conversations;
        let filteredArray = [];

        //find conversation name from array
        for (let i = 0; i < conversation.length; i++) {
            if (conversation[i].name.toLowerCase().includes(search) || conversation[i].name.toUpperCase().includes(search))
                filteredArray.push(conversation[i]);
        }

        //set filtered items to state
        this.setState({ recentChatList: filteredArray })

        //if input value is blanck then assign whole recent chatlist to array
        if (search === "") this.setState({ recentChatList: this.props.conversations })
    }

    openUserChat(e, chat) {

        e.preventDefault();


        // Update URL with the clicked chat's ID
        this.props.updateChatUrl(chat.id);
        this.props.setconversationNameInOpenChat(chat.contact_name);
        this.props.setActiveConversation(chat);
        this.props.setActiveConversationId(chat.id);

        var chatList = document.getElementById("chat-list");
        var clickedItem = e.target;
        var currentli = null;

        if (chatList) {
            var li = chatList.getElementsByTagName("li");
            //remove coversation user
            for (var i = 0; i < li.length; ++i) {
                if (li[i].classList.contains('active')) {
                    li[i].classList.remove('active');
                }
            }
            //find clicked coversation user
            for (var k = 0; k < li.length; ++k) {
                if (li[k].contains(clickedItem)) {
                    currentli = li[k];
                    break;
                }
            }
        }

        //activation of clicked coversation user
        if (currentli) {
            currentli.classList.add('active');
        }

        var userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.add("user-chat-show");
        }

        //removes unread badge if user clicks
        var unread = document.getElementById("unRead" + chat.id);
        if (unread) {
            unread.style.display = "none";
        }

    }




    render() {
        const { conversations, user } = this.props;
        let filteredConversations = conversations.filter(conversation => {
            if (user?.role_id === ROLES.User) {
                return conversation?.assigned_user_id === user?.id;
            }
            else return true;
        });

        return (
            <React.Fragment>
                <div>
                    <div className="px-4 pt-4">
                        <h4 className="mb-4">Chats</h4>
                        <div className="search-box chat-search-box">
                            <InputGroup className="mb-3 rounded-3">
                                <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                    <i className="ri-search-line search-icon font-size-18"></i>
                                </span>
                                <Input type="text" value={this.state.searchChat} onChange={(e) => this.handleChange(e)} className="form-control bg-light" placeholder="Search messages or users" />
                            </InputGroup>
                        </div>
                        {/* Search Box */}
                    </div>

                    {/*<OnlineUsers />*/}

                    {/* Start chat-message-list  */}
                    <div>
                        <h5 className="mb-3 px-3 font-size-16">Recent</h5>
                        <SimpleBar className="chat-message-list">
                            <ul className="list-unstyled chat-list chat-user-list px-2" id="chat-list">
                                {
                                    filteredConversations?.map((chat, key) =>
                                        <li key={key} id={"conversation" + key} className={chat.unRead ? "unread" : chat.isTyping ? "typing" : key === this.props.active_user ? "active" : ""}>
                                            <Link to="#" onClick={(e) => this.openUserChat(e, chat)}>
                                                <div className="d-flex">
                                                    {
                                                        chat?.profilePicture ?
                                                            <div className={"chat-user-img " + chat.status + " align-self-center ms-0"}>
                                                                <img src={chat.profilePicture} className="rounded-circle avatar-xs" alt="chatvia" />
                                                                {
                                                                    chat.status && <span className="user-status"></span>

                                                                }
                                                            </div>
                                                            :
                                                            <div className={"chat-user-img " + chat.status + " align-self-center ms-0"}>
                                                                <div className="avatar-xs">
                                                                    <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                        {chat.contact_name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                                {
                                                                    chat.status && <span className="user-status"></span>
                                                                }
                                                            </div>

                                                    }

                                                    {/* Middle Part*/}
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="text-truncate font-size-15 mb-1 ms-3">{chat.contact_name}</h5>
                                                        <p className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                                                            {
                                                                chat.isTyping ?
                                                                    <>
                                                                        typing<span className="animate-typing">
                                                                            <span className="dot ms-1"></span>
                                                                            <span className="dot ms-1"></span>
                                                                            <span className="dot ms-1"></span>
                                                                        </span>
                                                                    </>
                                                                    :
                                                                    <div>
                                                                        {
                                                                            chat?.last_message && chat?.message_type_id === MessageType.Image ? <i className="ri-image-fill align-middle me-1"></i> : null
                                                                        }
                                                                        {
                                                                            chat?.last_message && chat?.message_type_id === MessageType.File ? <i className="ri-file-text-fill align-middle me-1"></i> : null
                                                                        }
                                                                        {
                                                                            chat?.last_message && chat?.last_message?.length>20 ? chat?.last_message?.substring(0, 30)+"..." :  chat?.last_message
                                                                        }
                                                                    </div>
                                                            }



                                                        </p>
                                                        {/* Middle Bottom Part  - Platform Card*/}
                                                        <p className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                                                            {
                                                                <>
                                                                    {
                                                                        chat.message_channel_id && chat.message_channel_id === ChatPlatform.Whatsapp ? <span><i className="ri-whatsapp-fill align-middle me-1 text-success"></i>{ChatPlatformConverter[ChatPlatform.Whatsapp]}</span> : null
                                                                    }
                                                                    {
                                                                        chat.message_channel_id && chat.message_channel_id === ChatPlatform.Facebook ? <span><i className="ri-messenger-fill align-middle me-1 text-info"></i>{ChatPlatform.Facebook}</span> : null
                                                                    }
                                                                    {
                                                                        chat.message_channel_id && chat.message_channel_id === ChatPlatform.Instagram ? <span><i className="ri-instagram-fill align-middle me-1 text-dark"></i>{ChatPlatform.Instagram}</span> : null
                                                                    }
                                                                </>
                                                            }



                                                        </p>
                                                    </div>

                                                    <div className="font-size-11">{showLastMessageDate(chat?.updated_at)}</div>
                                                    {chat?.unRead === 0 ? null :
                                                        <div className="unread-message" id={"unRead" + chat?.id}>
                                                            <span className="badge badge-soft-success rounded-pill">{chat?.last_message ?  chat.unRead  : "" }</span>
                                                        </div>
                                                    }
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                }
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
    const { activeConversation, conversations, activeConversationId } = state.Chat;
    return { activeConversation, conversations, activeConversationId };
};

export default connect(mapStateToProps, {
    setconversationNameInOpenChat, fetchConversations,
    setActiveConversationId, setActiveConversation, fetchConversationById, fetchAllLastMessages,
    fetchMessagesByConversationId
})(ChatsWrapper);


ChatsWrapper.propTypes = {
    fetchMessagesByConversationId: PropTypes.func.isRequired,
    fetchAllLastMessages: PropTypes.func.isRequired,
    fetchConversations: PropTypes.func.isRequired,
    activeConversation: PropTypes.object,
    conversations: PropTypes.array,
    setActiveConversationId: PropTypes.func,
    setActiveConversation: PropTypes.func,
    activeConversationId: PropTypes.string,
};

Chats.propTypes = {
    conversations: PropTypes.array.isRequired,
    fetchConversations: PropTypes.func.isRequired,
    setconversationNameInOpenChat: PropTypes.func.isRequired,
    setActiveConversationId: PropTypes.func.isRequired,
    setActiveConversation: PropTypes.func.isRequired,
};