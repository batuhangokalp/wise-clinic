import React, { useEffect, useState } from "react";
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
import SuggestionInput from "./SuggestionInput";
import TemplatePicker from "./TemplatePicker";
import SendTemplateMessageModal from "./SendTemplateMessageModal";
import { setChatFile } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";
import VoiceRecorder from "./VoiceRecorder";
import { useTranslation } from "react-i18next";
import { setTextMessage } from "../../../redux/chat/actions";

function ChatInput(props) {
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const textMessage = useSelector((state) => state.Chat.textMessage);
  const [isOpen, setisOpen] = useState(false);
  const [isTemplatePickerOpen, setisTemplatePickerOpen] = useState(false);
  const [fileImage, setfileImage] = useState("");
  const [audioMessage, setAudioMessage] = useState(null);
  const chatFile = useSelector((state) => state.Chat.chatFile);

  const toggle = () => setisOpen(!isOpen);
  const toggleTemplatePicker = () =>
    setisTemplatePickerOpen(!isTemplatePickerOpen);

  const handleAudioCapture = (audioURL, audioBlob) => {
    setAudioMessage({ url: audioURL, blob: audioBlob });
  };

  //function for text input value change
  const handleChange = (e) => {
    dispatch(setTextMessage(e.target.value));
  };

  const onEmojiClick = (event) => {
    dispatch(setTextMessage(textMessage + event.emoji));
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
    //if text value is not emptry then call onaddMessage function
    if (textMessage !== "") {
      await props.onaddMessage(textMessage, "textMessage");
      dispatch(setTextMessage(""));
    }

    //if file input value is not empty then call onaddMessage function
    if (findFileType(chatFile?.type) === FileTypeId.Document) {
      await props.onaddMessage(chatFile, "fileMessage");
      dispatch(setChatFile(null));
    }

    //if image input value is not empty then call onaddMessage function
    if (FileTypeId.Image?.includes(findFileType(chatFile?.type))) {
      await props.onaddMessage(chatFile, "imageMessage");
      dispatch(setChatFile(null));
    }
  };

  const definedSuggestions = [
    "Hello, how can I help you? Hello, how can I help you?",
    "Thank you for reaching out!",
    "I will get back to you soon.",
  ];

  const [suggestions, setsuggestions] = useState(definedSuggestions);

  const handleSuggestionClick = (suggestion) => {
    dispatch(setTextMessage(suggestion));
    setsuggestions([]);
  };

  const [showSendTemplateMessageModal, setShowSendTemplateMessageModal] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (e, template, activeTab) => {
    e.preventDefault();
    activeTab === "1" && setSelectedTemplate(template);
    activeTab === "1" && setShowSendTemplateMessageModal(true);
    activeTab === "2" && dispatch(setTextMessage(template?.content));
  };

  return (
    <div className="chat-input-section ps-3 pe-3 pb-3  ps-lg-4  pe-lg-4  pb-lg-4 border-top mb-0 ">
      <SendTemplateMessageModal
        show={showSendTemplateMessageModal}
        template={selectedTemplate}
        handleClose={(e) => {
          setShowSendTemplateMessageModal(false);
        }}
      />
      <Form onSubmit={async (e) => await onaddMessage(e, textMessage)}>
        {/*suggestions?.length > 0 && (
                    <div className='chat-suggestion-section'>
                        <SuggestionInput
                            handleSuggestionClick={handleSuggestionClick}
                            suggestions={suggestions}
                        />
                    </div>
                )*/}

        <Row className="g-0 mt-2">
          <Col>
            <div>
              <Input
                type="text"
                value={textMessage}
                onChange={handleChange}
                className="form-control form-control-lg bg-light border-light"
                placeholder="Enter Message..."
              />
            </div>
          </Col>
          <Col xs="auto">
            <VoiceRecorder onAudioCapture={handleAudioCapture} />
          </Col>
          <Col xs="auto">
            <div className="chat-input-links ms-md-2">
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
            <div className="chat-input-links ms-md-2">
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
                <li className="list-inline-item">
                  <Button
                    type="submit"
                    color="primary"
                    className="font-size-16 btn-lg chat-send waves-effect waves-light"
                  >
                    <i className="ri-send-plane-2-fill"></i>
                  </Button>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default ChatInput;
