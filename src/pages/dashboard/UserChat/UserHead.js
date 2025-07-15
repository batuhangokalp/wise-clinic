import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Input,
  Row,
  Col,
  Modal,
  ModalBody,
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { openUserSidebar } from "../../../redux/actions";

//import images
import user from "../../../assets/images/users/avatar-4.jpg";

function UserHead(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [Callmodal, setCallModal] = useState(false);
  const [Videomodal, setVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const chatMessages = props.chatMessages;

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggle1 = () => setDropdownOpen1(!dropdownOpen1);
  const toggleCallModal = () => setCallModal(!Callmodal);
  const toggleVideoModal = () => setVideoModal(!Videomodal);

  const openUserSidebar = (e) => {
    e.preventDefault();
    props.openUserSidebar();
  };

  function closeUserChat(e) {
    e.preventDefault();
    var userChat = document.getElementsByClassName("user-chat");
    if (userChat) {
      userChat[0].classList.remove("user-chat-show");
    }
  }

  function deleteMessage() {
    let allUsers = props.conversations;
    let copyallUsers = allUsers;
    copyallUsers[0].messages = [];
  }
  const handleSearch = () => {
    const results = chatMessages?.filter((msg) =>
      msg.message_content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <React.Fragment>
      <div className="p-3 p-lg-4 border-bottom user-chat-topbar">
        <Row className="align-items-center">
          <Col sm={4} xs={8}>
            <div className="d-flex align-items-center">
              <div className="d-block d-lg-none me-2 ms-0">
                <Link
                  to="#"
                  onClick={(e) => closeUserChat(e)}
                  className="user-chat-remove text-muted font-size-16 p-2"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </Link>
              </div>
              {props?.activeConversation?.profilePicture ? (
                <div className="me-3 ms-0">
                  <img
                    src={props?.activeConversation?.profilePicture}
                    className="rounded-circle avatar-xs"
                    alt="chatvia"
                  />
                </div>
              ) : (
                <div className="chat-user-img align-self-center me-3">
                  <div className="avatar-xs">
                    <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                      {props?.activeConversation?.contact_name?.charAt(0)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex-grow-1 overflow-hidden">
                <h5 className="font-size-16 mb-0 text-truncate">
                  <Link
                    to="#"
                    onClick={(e) => openUserSidebar(e)}
                    className="text-reset user-profile-show"
                  >
                    {props?.activeConversation?.contact_name}
                  </Link>
                  {(() => {
                    switch (props.activeConversation?.status) {
                      case "online":
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-2"></i>
                          </>
                        );

                      case "away":
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-warning d-inline-block ms-1"></i>
                          </>
                        );

                      case "offline":
                        return (
                          <>
                            <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ms-1"></i>
                          </>
                        );

                      default:
                        return;
                    }
                  })()}
                </h5>
              </div>
            </div>
          </Col>
          <Col sm={8} xs={4}>
            <ul className="list-inline user-chat-nav text-end mb-0 float-end">
              <li className="list-inline-item">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle
                    color="none"
                    className="btn nav-btn "
                    type="button"
                  >
                    <i className="ri-search-line"></i>
                  </DropdownToggle>
                  <DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-md">
                    <div className="search-box p-2">
                      <div className="d-flex gap-2 mb-2">
                        <Input
                          type="text"
                          className="form-control bg-light border-0"
                          placeholder="Search.."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button color="primary" onClick={handleSearch}>
                          Search
                        </Button>
                      </div>

                      {/* Arama sonuçlarını göster */}
                      {searchResults.length > 0 ? (
                        <div
                          className="search-results"
                          style={{ maxHeight: "250px", overflowY: "auto" }} // scroll ekledim
                        >
                          {searchResults.map((msg, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                const el = document.getElementById(
                                  `message-${msg.id}`
                                );
                                if (el) {
                                  el.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });

                                  el.style.transition = "background-color 0.3s";
                                  el.style.backgroundColor = "#fff9c4";
                                  setTimeout(() => {
                                    el.style.backgroundColor = "";
                                  }, 2000);
                                }
                              }}
                              style={{
                                padding: "6px",
                                borderBottom: "1px solid #eee",
                                fontSize: "14px",
                                cursor: "pointer",
                              }}
                            >
                              {msg.message_content.length > 50
                                ? msg.message_content.substring(0, 50) + "..."
                                : msg.message_content}
                            </div>
                          ))}
                        </div>
                      ) : searchTerm ? (
                        <div className="text-muted px-2">No results found</div>
                      ) : null}
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </li>
              {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                                <button type="button" onClick={toggleCallModal} className="btn nav-btn" >
                                    <i className="ri-phone-line"></i>
                                </button>
                            </li>
                            <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                                <button type="button" onClick={toggleVideoModal} className="btn nav-btn">
                                    <i className="ri-vidicon-line"></i>
                                </button>
                            </li> */}

              <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                <Button
                  type="button"
                  color="none"
                  onClick={(e) => openUserSidebar(e)}
                  className="nav-btn user-profile-show"
                >
                  <i className="ri-user-2-line"></i>
                </Button>
              </li>

              <li className="list-inline-item">
                <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                  <DropdownToggle
                    className="btn nav-btn "
                    color="none"
                    type="button"
                  >
                    <i className="ri-more-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      className="d-block d-lg-none user-profile-show"
                      onClick={(e) => openUserSidebar(e)}
                    >
                      View profile{" "}
                      <i className="ri-user-2-line float-end text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      Archive{" "}
                      <i className="ri-archive-line float-end text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      Muted{" "}
                      <i className="ri-volume-mute-line float-end text-muted"></i>
                    </DropdownItem>
                    <DropdownItem onClick={(e) => deleteMessage(e)}>
                      Delete{" "}
                      <i className="ri-delete-bin-line float-end text-muted"></i>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </ul>
          </Col>
        </Row>
      </div>

      {/* Start Audiocall Modal */}
      {/* <Modal tabIndex="-1" isOpen={Callmodal} toggle={toggleCallModal} centered>
                <ModalBody>
                    <div className="text-center p-4">
                        <div className="avatar-lg mx-auto mb-4">
                            <img src={user} alt="" className="img-thumbnail rounded-circle" />
                        </div>

                        <h5 className="text-truncate">Doris Brown</h5>
                        <p className="text-muted">Start Audio Call</p>

                        <div className="mt-5">
                            <ul className="list-inline mb-1">
                                <li className="list-inline-item px-2 me-2 ms-0">
                                    <button type="button" className="btn btn-danger avatar-sm rounded-circle" onClick={toggleCallModal}>
                                        <span className="avatar-title bg-transparent font-size-20">
                                            <i className="ri-close-fill"></i>
                                        </span>
                                    </button>
                                </li>
                                <li className="list-inline-item px-2">
                                    <button type="button" className="btn btn-success avatar-sm rounded-circle">
                                        <span className="avatar-title bg-transparent font-size-20">
                                            <i className="ri-phone-fill"></i>
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ModalBody>
            </Modal> */}

      {/* Start VideoCall Modal */}
      {/* <Modal tabIndex="-1" isOpen={Videomodal} toggle={toggleVideoModal} centered>
                <ModalBody>
                    <div className="text-center p-4">
                        <div className="avatar-lg mx-auto mb-4">
                            <img src={user} alt="" className="img-thumbnail rounded-circle" />
                        </div>

                        <h5 className="text-truncate">Doris Brown</h5>
                        <p className="text-muted">Start Video Call</p>

                        <div className="mt-5">
                            <ul className="list-inline mb-1">
                                <li className="list-inline-item px-2 me-2 ms-0">
                                    <button type="button" className="btn btn-danger avatar-sm rounded-circle" onClick={toggleVideoModal}>
                                        <span className="avatar-title bg-transparent font-size-20">
                                            <i className="ri-close-fill"></i>
                                        </span>
                                    </button>
                                </li>
                                <li className="list-inline-item px-2">
                                    <button type="button" className="btn btn-success avatar-sm rounded-circle">
                                        <span className="avatar-title bg-transparent font-size-20">
                                            <i className="ri-vidicon-fill"></i>
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ModalBody>
            </Modal> */}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { activeConversation, activeConversationIndex } = state.Chat;
  return { ...state.Layout, activeConversation, activeConversationIndex };
};

export default connect(mapStateToProps, { openUserSidebar })(UserHead);
