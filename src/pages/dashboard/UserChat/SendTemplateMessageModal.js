import React, { memo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import TemplateEditor from "./TemplateEditor";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchConversationById,
  fetchConversations,
  fetchMessagesByConversationId,
  sendMessage,
} from "../../../redux/actions";
import { useTranslation } from "react-i18next";

SendTemplateMessageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  template: PropTypes.object,
};

function SendTemplateMessageModal(props) {
  const [uploadedFile, setUploadedFile] = useState(null);

  const { t } = useTranslation();
  const { show, handleClose, template } = props;
  const dispatch = useDispatch();

  const activeConversation = useSelector(
    (state) => state.Chat.activeConversation
  );
  const user = useSelector((state) => state.User.user);

  const [templateParams, setTemplateParams] = useState({});
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/messages/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (response.ok) {
        setUploadedUrl(result.url);
        setUploadedFile(file);
      } else {
        console.error("Yükleme başarısız:", result);
      }
    } catch (error) {
      console.error("Upload hatası:", error);
    }
  };

  const handleSend = async () => {
    // Öncelikle parametreleri index numarasına göre sırala ve map et
    const orderedParams = Object.keys(templateParams)
      .sort((a, b) => {
        const aNum = parseInt(a.match(/_(\d+)$/)[1]);
        const bNum = parseInt(b.match(/_(\d+)$/)[1]);
        return aNum - bNum;
      })
      .map((key) => templateParams[key]);

    // Sonra messageContent'i baştan al
    let messageContent = template?.content || "";

    // Replace işlemi yaparken sadece index numarasına göre değiştir
    Object.entries(templateParams).forEach(([key, value]) => {
      const indexMatch = key.match(/_(\d+)$/);
      if (indexMatch) {
        const index = indexMatch[1];
        const regex = new RegExp(`{{${index}}}`, "g");
        messageContent = messageContent.replace(regex, value);
      }
    });

    const messageType = template?.template_type?.toLowerCase() || "text";

    const baseRequest = {
      phone_number: activeConversation?.phone_number,
      message_type_name: messageType,
      message_category: "template",
      sender_source: "908503770269",
      receiver_destination: activeConversation?.phone_number,
      assigned_user_id: user?.id,
      template: {
        id: template?.gupshup_id,
        params: orderedParams,
      },
      filename: uploadedFile?.name || "file",
    };

    let request = baseRequest;

    if (messageType === "text") {
      request = { ...baseRequest };
    } else if (["image", "video", "document"].includes(messageType)) {
      if (!uploadedUrl) {
        alert("Lütfen dosya yükleyin.");
        return;
      }

      request = {
        ...baseRequest,
        url: uploadedUrl,
        filename: uploadedFile?.name || "file",
      };
    }

    await dispatch(sendMessage(request));
    await dispatch(fetchConversations());
    await props.markConversationAsRead();
    setUploadedUrl("");
    await dispatch(fetchConversationById(activeConversation?.id));
    await dispatch(fetchMessagesByConversationId(activeConversation));

    handleClose();
  };
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
        <div>
          <Modal.Title>Submitting a template</Modal.Title>
          <p className="text-muted mb-0">{template?.vertical}</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {["IMAGE", "VIDEO", "DOCUMENT"].includes(template?.template_type) ? (
          <>
            <div className="mb-3">
              <label className="form-label">{t("Upload File")}</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>

            {/* Önizleme (eğer varsa yüklenmiş) */}
            {uploadedUrl && template.template_type === "IMAGE" && (
              <img
                src={uploadedUrl}
                alt="Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginTop: "10px",
                }}
              />
            )}

            {uploadedUrl && template.template_type === "VIDEO" && (
              <video
                src={uploadedUrl}
                controls
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            )}

            {uploadedUrl && template.template_type === "DOCUMENT" && (
              <div style={{ marginTop: "10px" }}>
                <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                  {t("View Uploaded Document")}
                </a>
              </div>
            )}

            {template?.content && (
              <div className="mt-3">
                <TemplateEditor
                  template={template}
                  onParamsChange={setTemplateParams}
                />
              </div>
            )}
          </>
        ) : (
          <TemplateEditor
            template={template}
            onParamsChange={setTemplateParams}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("Cancel")}
        </Button>

        <Button variant="primary" onClick={handleSend}>
          {t("Send")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default memo(SendTemplateMessageModal);
