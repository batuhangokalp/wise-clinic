import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TemplateEditor from './TemplateEditor';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { fetchConversationById, fetchMessagesByConversationId, sendMessage } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setTextMessage } from '../../../redux/chat/actions';

SendTemplateMessageModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    template: PropTypes.object
};
export default function SendTemplateMessageModal(props) {
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const { show, handleClose, template } = props;
    const dispatch = useDispatch();

    const selectedTemplate = useSelector((state) => state.Templates.selectedTemplate);
    const activeConversation = useSelector((state) => state.Chat.activeConversation);
    const user = useSelector((state) => state.User.user);

    const handleSend = async () => {
        let request = {
            "phone_number": activeConversation?.phone_number,
            "message_type_name": "text",
            "message_category": "template",
            "sender_source": "908503770269",
            "receiver_destination": activeConversation?.phone_number,
            "assigned_user_id": user?.id,
            "template": {
                "id": selectedTemplate?.id,
                "params": selectedTemplate?.params
            }

        }

        await dispatch(sendMessage(request))
        await dispatch(fetchConversationById(activeConversation?.id))
        await dispatch(fetchMessagesByConversationId(activeConversation))

        handleClose()
    }

    const handleSetInput = () => { 
        dispatch(setTextMessage(selectedTemplate?.data))
        handleClose()
    }
    return (
        <Modal show={show} onHide={handleClose} animation={true} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <div style={{ display: "block" }}>
                    <Modal.Title>Submitting a template</Modal.Title>
                    <p>{template?.vertical}</p>
                </div>
            </Modal.Header>

            <Modal.Body>
                <TemplateEditor template={template} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('Cancel')}
                </Button>
                <Button variant="warning" onClick={handleSetInput}>
                    {t('Canned Response')}
                </Button>
                <Button variant="primary" onClick={handleSend}>
                    {t('Send')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


