import React, { act, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  fetchConversationById,
  fetchMessagesByConversationId,
  sendMessage,
  setChatFile,
  uploadFile,
} from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";
import RenderPDFFirstPage from "./RenderPDFFirstPage";
import RenderVideo from "./RenderVideo";
import RenderImage from "./RenderImage";
import RenderAudio from "./RenderAudio";
import { convertFileToBinary } from "../../../helpers/fileUtils";

export default function SendFileModal() {
  const [show, setShow] = React.useState(false);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const activeConversation = useSelector(
    (state) => state.Chat.activeConversation
  );
  const chatFile = useSelector((state) => state.Chat.chatFile);
  const user = useSelector((state) => state.User.user);

  const handleSend = async () => {
    const formData = new FormData();
    formData.append("file", chatFile);

    const uploadResponse = await dispatch(uploadFile(formData));

    let url = uploadResponse?.url || chatFile?.url;

    let request = {
      phone_number: activeConversation?.phone_number,
      message_type_name: null,
      message_category: "session",
      sender_source: "908503770269",
      receiver_destination: activeConversation?.phone_number,
      assigned_user_id: user?.id,
      url: url,
      caption: chatFile?.type,
    };

    let fileType = findFileType(chatFile?.type);

    if (FileTypeId.Image?.includes(fileType)) {
      request["message_type_name"] = "image";
    } else if (fileType === FileTypeId.Document) {
      request["message_type_name"] = "file";
    } else if (FileTypeId.Audio?.includes(fileType)) {
      request["message_type_name"] = "audio";
    } else if (fileType === FileTypeId.Video) {
      request["message_type_name"] = "video";
    } else if (fileType === FileTypeId.Text) {
      request["message_type_name"] = "text";
    }

    await dispatch(sendMessage(request));
    await dispatch(fetchConversationById(activeConversation?.id));
    await dispatch(fetchMessagesByConversationId(activeConversation));

    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    dispatch(setChatFile(null));
  };

  useEffect(() => {
    if (chatFile) {
      setShow(true);
      //console.log(chatFile)
      //console.log("url: ", URL.createObjectURL(chatFile))
      FileTypeId.Image?.includes(findFileType(chatFile?.type)) &&
        console.log(URL.createObjectURL(chatFile));
    }
  }, [chatFile]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={true}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <div style={{ display: "block" }}>
          <Modal.Title>{t("Send File")}</Modal.Title>
          <p>{chatFile?.name}</p>
        </div>
      </Modal.Header>

      <Modal.Body style={{ alignSelf: "center" }}>
        <RenderImage chatFile={chatFile} />
        <RenderPDFFirstPage chatFile={chatFile} />

        <RenderAudio chatFile={chatFile} />
        <RenderVideo chatFile={chatFile} />

        {/* {chatFile && findFileType(chatFile?.type) === FileTypeId.Text && (
          <div className="text-center">
            <i className="ri-file-text-fill" style={{ fontSize: "100px" }}></i>
          </div>
        )} */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSend}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
