import React, { act, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  fetchConversationById,
  fetchMessagesByConversationId,
  sendMessage,
  setChatFile,
  setTextMessage,
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
import RenderFilePreview from "./RenderFilePreview";
import { Input } from "reactstrap";
import RenderDocPreview from "./RenderDoc";

export default function SendFileModal() {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  const textMessage = useSelector((state) => state.Chat.textMessage);

  const dispatch = useDispatch();

  const activeConversation = useSelector(
    (state) => state.Chat.activeConversation
  );
  const chatFile = useSelector((state) => state.Chat.chatFile);
  const user = useSelector((state) => state.User.user);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", chatFile);

      const uploadResponse = await dispatch(uploadFile(formData));
      const url = uploadResponse?.url || chatFile?.url;

      const request = {
        phone_number: activeConversation?.phone_number,
        message_type_name: null,
        message_category: "session",
        sender_source: "908503770269",
        receiver_destination: activeConversation?.phone_number,
        assigned_user_id: user?.id,
        url: url,
        caption: textMessage || "",
        message_content: textMessage || "",
        filename: chatFile?.name,
      };

      const fileType = findFileType(chatFile?.type);

      if (FileTypeId.Image.includes(fileType)) {
        request["message_type_name"] = "image";
      } else if (
        FileTypeId.Document.includes(fileType) ||
        fileType === FileTypeId.TextFile // txt, doc, pdf gibi dosyalar file olarak geçsin
      ) {
        request["message_type_name"] = "file";
      } else if (FileTypeId.Audio.includes(fileType)) {
        request["message_type_name"] = "audio";
      } else if (FileTypeId.Video.includes(fileType)) {
        request["message_type_name"] = "video";
      } else if (fileType === FileTypeId.Text) {
        request["message_type_name"] = "text"; // sade metin mesaj
      } else {
        request["message_type_name"] = "text"; // fallback
      }
      await dispatch(sendMessage(request));
      await dispatch(fetchConversationById(activeConversation?.id));
      await dispatch(fetchMessagesByConversationId(activeConversation));
      handleClose();
    } catch (err) {
      console.error("Gönderme hatası:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    dispatch(setChatFile(null));
    dispatch(setTextMessage(""));
  };

  useEffect(() => {
    if (chatFile) {
      setShow(true);
      //console.log(chatFile)
      //console.log("url: ", URL.createObjectURL(chatFile))
      FileTypeId.Image?.includes(findFileType(chatFile?.type)) 
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
        <RenderFilePreview chatFile={chatFile} />
        <RenderDocPreview chatFile={chatFile} /> 
        <RenderAudio chatFile={chatFile} />
        <RenderVideo chatFile={chatFile} />
        {/* Yazı alanı (dosya açıklaması / caption) */}
        <div className="mt-4" style={{ width: "100%" }}>
          <Input
            type="text"
            value={textMessage}
            onChange={(e) => dispatch(setTextMessage(e.target.value))}
            className="form-control form-control-lg bg-light border-light"
            placeholder="Enter Message..."
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          {t("Cancel")}
        </Button>

        <Button variant="primary" onClick={handleSend} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="me-2">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </span>
              {t("Sending...")}
            </>
          ) : (
            t("Send")
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
