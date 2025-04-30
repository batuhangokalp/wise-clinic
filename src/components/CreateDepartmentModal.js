import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Alert } from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { countryList } from "../helpers/countryList";
import { uploadFile } from "../redux/actions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { sexList } from "../helpers/sexList";

export default function CreateDepartmentModal(props) {
    const dispatch = useDispatch();
    let { modal, toggleModal, validationSchema, handleSubmit, selectedItem, parentProps } = props;

    return (
        <Modal isOpen={modal} centered toggle={toggleModal}>
            <ModalHeader tag="h5" className="font-size-16" toggle={toggleModal}>
                {parentProps.t('Create Department')}
            </ModalHeader>
            <ModalBody className="p-4">
                <Formik
                    initialValues={{name: "", description: ""}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize 
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <FormikForm>

                            {/* Name Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="name">
                                    {parentProps.t('Department Name')}
                                </Label>
                                <Field
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder={parentProps.t('Enter department name')}
                                    style={errors.name ? { borderColor: "red" } : {}}
                                />
                                {errors.name && touched.name && (
                                    <span className="mt-2 text-danger">{errors.name}</span>
                                )}
                            </div>

                            {/* Description Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="description">
                                    {parentProps.t('Description')}
                                </Label>
                                <Field
                                    name="description"
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    placeholder={parentProps.t('Enter description')}
                                    style={errors.surname ? { borderColor: "red" } : {}}
                                />
                                {errors.description && touched.description && (
                                    <span className="mt-2 text-danger">{errors.description}</span>
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
                                        {parentProps.t('Create Department')}
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
