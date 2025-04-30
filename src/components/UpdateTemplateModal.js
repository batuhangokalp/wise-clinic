import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Alert } from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { countryList } from "../helpers/countryList";
import { uploadFile } from "../redux/actions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { sexList } from "../helpers/sexList";

export default function UpdateTemplateModal(props) {
    const dispatch = useDispatch();
    let { modal, toggleModal, validationSchema, handleSubmit, selectedItem, parentProps } = props;

    return (
        <Modal isOpen={modal} centered toggle={toggleModal}>
            <ModalHeader tag="h5" className="font-size-16" toggle={toggleModal}>
                {parentProps.t('Update Template')}
            </ModalHeader>
            <ModalBody className="p-4">
                <Formik
                    initialValues={selectedItem}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize 
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <FormikForm>

                            {/* Name Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="elementName">
                                    {parentProps.t('Template Name')}
                                </Label>
                                <Field
                                    name="elementName"
                                    type="text"
                                    className="form-control"
                                    id="elementName"
                                    placeholder={parentProps.t('Enter template name')}
                                    style={errors.elementName ? { borderColor: "red" } : {}}
                                />
                                {errors.elementName && touched.elementName && (
                                    <span className="mt-2 text-danger">{errors.elementName}</span>
                                )}
                            </div>

                            {/* content Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="data">
                                    {parentProps.t('Content')}
                                </Label>
                                <Field
                                    name="data"
                                    type="text"
                                    className="form-control"
                                    id="contedatant"
                                    placeholder={parentProps.t('Enter content')}
                                    style={errors.data ? { borderColor: "red" } : {}}
                                />
                                {errors.data && touched.data && (
                                    <span className="mt-2 text-danger">{errors.condatatent}</span>
                                )}
                            </div>

                            <ModalFooter style={{ display: "block" }}>
                                {parentProps.success && (
                                    <div
                                        style={{
                                            display: "block",
                                            justifyContent: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Alert color="success">{parentProps.success}</Alert>
                                    </div>
                                )}
                                {parentProps.error && (
                                    <div
                                        style={{
                                            display: "block",
                                            justifyContent: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Alert color="danger">{parentProps.error}</Alert>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <Button type="button" color="link" onClick={toggleModal}>
                                        {parentProps.t('Close')}
                                    </Button>
                                    <Button type="submit" color="primary">
                                        {parentProps.t('Update Template')}
                                    </Button>
                                </div>
                            </ModalFooter>
                        </FormikForm>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
    );
}
