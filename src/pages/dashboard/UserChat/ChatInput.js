import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  UncontrolledTooltip,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  Label,
  Form,
} from "reactstrap";
import EmojiPicker from "emoji-picker-react";
import TemplatePicker from "./TemplatePicker";
import SendTemplateMessageModal from "./SendTemplateMessageModal";
import { setChatFile } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";
import VoiceRecorder from "./VoiceRecorder";
import { useTranslation } from "react-i18next";
import { setTextMessage } from "../../../redux/chat/actions";
import UpsenseLogo from "../../../assets/images/upsense-logo.png";

function ChatInput(props) {
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const textMessage = useSelector((state) => state.Chat.textMessage);
  const [isOpen, setisOpen] = useState(false);
  const [isTemplatePickerOpen, setisTemplatePickerOpen] = useState(false);
  const [fileImage, setfileImage] = useState("");
  const [audioMessage, setAudioMessage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const chatFile = useSelector((state) => state.Chat.chatFile);
  useEffect(() => {
    if (props.isAiRes) {
      setInputValue(props.anotherAiResponse || props.aiResponse);
    }
  }, [props.isAiRes, props.aiResponse, props.anotherAiResponse]);

  const toggle = () => setisOpen(!isOpen);
  const toggleTemplatePicker = () =>
    setisTemplatePickerOpen(!isTemplatePickerOpen);

  const handleAudioCapture = (audioURL, audioBlob) => {
    setAudioMessage({ url: audioURL, blob: audioBlob });
    dispatch(
      setChatFile(new File([audioBlob], "audio.ogg", { type: "audio/ogg" }))
    );
  };

  //function for text input value change
  const onEmojiClick = (event) => {
    setInputValue(inputValue + event.emoji);
  };

  //function for file input change
  const handleFileChange = (e) => {
    if (e.target.files.length !== 0) dispatch(setChatFile(e.target.files[0]));
  };

  //function for image input change
  const handleImageChange = (e) => {
    if (e.target.files.length !== 0) dispatch(setChatFile(e.target.files[0]));
  };

  //function for send data to onaddMessage function(in userChat/index.js component)
  const onaddMessage = async (e, textMessage) => {
    e.preventDefault();

    if (inputValue !== "") {
      await props.onaddMessage(inputValue, "textMessage");
      setInputValue("");
      props.setIsAiRes(false);
    }

    if (chatFile) {
      const fileType = findFileType(chatFile.type);

      if (fileType === FileTypeId.Document) {
        await props.onaddMessage(chatFile, "fileMessage");
      } else if (FileTypeId.Image.includes(fileType)) {
        await props.onaddMessage(chatFile, "imageMessage");
      } else if (FileTypeId.Audio.includes(fileType)) {
        await props.onaddMessage(chatFile, "audioMessage");
      }

      dispatch(setChatFile(null));
    }

    // Eğer textMessage gönderildiyse inputu sıfırlama işlemini de burada yapabilirsin
    if (textMessage) {
      dispatch(setTextMessage(""));
    }
  };

  const [showSendTemplateMessageModal, setShowSendTemplateMessageModal] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (e, template, activeTab) => {
    e.preventDefault();
    activeTab === "1" && setSelectedTemplate(template);
    activeTab === "1" && setShowSendTemplateMessageModal(true);
    activeTab === "2" && setInputValue(template?.content);
  };

  const getRowCount = (text) => {
    const length = text?.length || 0;

    if (length > 500) return 5;
    if (length > 400) return 4;
    if (length > 300) return 3;
    return 1;
  };

  const handleKeyDown = (e) => {
    if (e?.key === "Enter" && !e?.shiftKey) {
      e?.preventDefault();
      e?.target?.form.requestSubmit();
    }
  };

  const getLastContactMessageBlock = (messages) => {
    const result = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.sender_type === "contact") {
        result.unshift(msg);
      } else {
        break;
      }
    }
    return result;
  };

  return (
    <div className="chat-input-section ps-3 pe-3 pb-3  ps-lg-4  pe-lg-4  pb-lg-4 border-top mb-0">
      <SendTemplateMessageModal
        show={showSendTemplateMessageModal}
        template={selectedTemplate}
        handleClose={(e) => {
          setShowSendTemplateMessageModal(false);
        }}
        markConversationAsRead={props.markConversationAsRead}
      />
      <Form onSubmit={async (e) => await onaddMessage(e, textMessage)}>
        <Row className="g-0 mt-2 align-items-center">
          <Col>
            <div>
              <Input
                type="textarea"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="form-control form-control-lg bg-light border-light"
                placeholder="Enter Message..."
                rows={getRowCount(inputValue)}
              />
            </div>
          </Col>
          {/* Only visible on mobile */}
          <Col xs="auto" className="d-lg-none">
            <Button
              color="link"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-decoration-none font-size-16 btn-lg waves-effect"
            >
              <i className="ri-more-2-fill"></i>
            </Button>
          </Col>

          {isMobileMenuOpen && (
            <div className="mobile-menu-actions p-3 border-top bg-white d-lg-none">
              <ul className="list-inline mb-0 d-flex justify-content-around align-items-center">
                {/* AI */}
                <li>
                  <Button
                    color="link"
                    onClick={() => {
                      const lastUserMessages = getLastContactMessageBlock(
                        props.chatMessages
                      );
                      props.handleAiClick(lastUserMessages);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <img
                      src={UpsenseLogo}
                      alt="Upsense AI"
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                    />
                  </Button>
                </li>

                {/* Emoji */}
                <li>
                  <Button
                    color="link"
                    onClick={() => {
                      setisOpen(!isOpen);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <i className="ri-emotion-happy-line"></i>
                  </Button>
                </li>

                {/* Template */}
                <li>
                  <Button
                    color="link"
                    onClick={() => {
                      setisTemplatePickerOpen(!isTemplatePickerOpen);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <i className="ri-command-line"></i>
                  </Button>
                </li>

                {/* File Upload */}
                <li>
                  <Label className="btn btn-link p-0 m-0">
                    <i className="ri-attachment-line"></i>
                    <Input
                      onChange={handleFileChange}
                      type="file"
                      className="d-none"
                    />
                  </Label>
                </li>

                {/* Image Upload */}
                <li>
                  <Label className="btn btn-link p-0 m-0">
                    <i className="ri-image-fill"></i>
                    <Input
                      onChange={handleImageChange}
                      type="file"
                      accept="image/*"
                      className="d-none"
                    />
                  </Label>
                </li>
              </ul>
            </div>
          )}

          <Col xs="auto">
            <VoiceRecorder onAudioCapture={handleAudioCapture} />
          </Col>

          <Col xs="auto">
            <div className="chat-input-links ms-md-2 d-none d-lg-block">
              <Button
                id="ai"
                color="link"
                className="text-decoration-none font-size-16 btn-lg waves-effect p-0"
                onClick={() => {
                  const lastUserMessages = getLastContactMessageBlock(
                    props.chatMessages
                  );
                  props.handleAiClick(lastUserMessages);
                }}
              >
                <img
                  src={UpsenseLogo}
                  alt="Upsense AI"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
              </Button>
              <UncontrolledTooltip target="ai" placement="top">
                Ask to Upsense
              </UncontrolledTooltip>
            </div>
          </Col>

          <Col xs="auto">
            <div className="chat-input-links ms-md-2 d-none d-lg-block">
              <ul className="list-inline mb-0 ms-0">
                <li className="list-inline-item">
                  <ButtonDropdown
                    className="template-dropdown"
                    direction="up"
                    isOpen={isTemplatePickerOpen}
                    toggle={toggleTemplatePicker}
                  >
                    <DropdownToggle
                      id="template"
                      color="link"
                      className="text-decoration-none font-size-16 btn-lg waves-effect"
                    >
                      <i className="ri-command-line"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <TemplatePicker
                        handleTemplateSelect={handleTemplateSelect}
                      />
                    </DropdownMenu>
                  </ButtonDropdown>

                  <UncontrolledTooltip target="template" placement="top">
                    Templates
                  </UncontrolledTooltip>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs="auto">
            <div className="chat-input-links ms-md-2 d-none d-lg-block">
              <ul className="list-inline mb-0 ms-0">
                <li className="list-inline-item">
                  <ButtonDropdown
                    className="emoji-dropdown"
                    direction="up"
                    isOpen={isOpen}
                    toggle={toggle}
                  >
                    <DropdownToggle
                      id="emoji"
                      color="link"
                      className="text-decoration-none font-size-16 btn-lg waves-effect"
                    >
                      <i className="ri-emotion-happy-line"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </DropdownMenu>
                  </ButtonDropdown>

                  <UncontrolledTooltip target="emoji" placement="top">
                    Emoji
                  </UncontrolledTooltip>
                </li>
                <li className="list-inline-item input-file">
                  <Label
                    id="files"
                    className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                  >
                    <i className="ri-attachment-line"></i>
                    <Input
                      onChange={(e) => handleFileChange(e)}
                      type="file"
                      name="fileInput"
                      size="60"
                    />
                  </Label>

                  <UncontrolledTooltip target="files" placement="top">
                    Attached File
                  </UncontrolledTooltip>
                </li>
                <li className="list-inline-item input-file">
                  <Label
                    id="images"
                    className="me-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                  >
                    <i className="ri-image-fill"></i>
                    <Input
                      onChange={(e) => handleImageChange(e)}
                      accept="image/*"
                      type="file"
                      name="fileInput"
                      size="60"
                    />
                  </Label>

                  <UncontrolledTooltip target="images" placement="top">
                    Images
                  </UncontrolledTooltip>
                </li>
              </ul>
            </div>
          </Col>
          <Col xs="auto">
            <Button
              type="submit"
              color="primary"
              className="font-size-16 btn-lg chat-send waves-effect waves-light"
            >
              <i className="ri-send-plane-2-fill"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default memo(ChatInput);
