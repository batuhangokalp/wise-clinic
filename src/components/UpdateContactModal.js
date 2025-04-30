import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Alert } from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { countryList } from "../helpers/countryList";
import { uploadFile } from "../redux/actions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { sexList } from "../helpers/sexList";

export default function UpdateContactModal(props) {
    const dispatch = useDispatch();
    let { modal, toggleModal, validationSchema, handleSubmit, selectedContact, parentProps } = props;

    return (
        <Modal isOpen={modal} centered toggle={toggleModal}>
            <ModalHeader tag="h5" className="font-size-16" toggle={toggleModal}>
                {parentProps.t('Update Contacts')}
            </ModalHeader>
            <ModalBody className="p-4">
                <Formik
                    initialValues={selectedContact}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize // Updates the form when `selectedContact` changes
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <FormikForm>
                            {/* Avatar Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="avatar">
                                    {parentProps.t('Avatar')}
                                </Label>
                                <div className="d-block text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control mb-2"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                let formData = new FormData();
                                                formData.append("file", file);
                                                let avatar = dispatch(uploadFile(formData));
                                                setFieldValue("avatar", avatar?.url);
                                            }
                                        }}
                                    />
                                    <Field
                                        name="avatar"
                                        type="text"
                                        className="form-control"
                                        placeholder={parentProps.t('Or paste URL')}
                                    />
                                </div>
                                {values.avatar && (
                                    <div className="mt-2">
                                        <img
                                            src={values.avatar}
                                            alt="Preview"
                                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Name Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="name">
                                    {parentProps.t('Name')}
                                </Label>
                                <Field
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder={parentProps.t('Enter name')}
                                    style={errors.name ? { borderColor: "red" } : {}}
                                />
                                {errors.name && touched.name && (
                                    <span className="mt-2 text-danger">{errors.name}</span>
                                )}
                            </div>

                            {/* Surname Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="surname">
                                    {parentProps.t('Surname')}
                                </Label>
                                <Field
                                    name="surname"
                                    type="text"
                                    className="form-control"
                                    id="surname"
                                    placeholder={parentProps.t('Enter surname')}
                                    style={errors.surname ? { borderColor: "red" } : {}}
                                />
                                {errors.surname && touched.surname && (
                                    <span className="mt-2 text-danger">{errors.surname}</span>
                                )}
                            </div>

                            {/* Phone Number Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="phone_number">
                                    {parentProps.t('Phone Number')}
                                </Label>
                                <Field
                                    name="phone_number"
                                    type="tel"
                                    className="form-control"
                                    id="phone_number"
                                    placeholder={parentProps.t('Enter phone number')}
                                    style={errors.phone_number ? { borderColor: "red" } : {}}
                                />
                                {errors.phone_number && touched.phone_number && (
                                    <span className="mt-2 text-danger">{errors.phone_number}</span>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="contact_email">
                                    {parentProps.t('Email')}
                                </Label>
                                <Field
                                    name="contact_email"
                                    type="email"
                                    className="form-control"
                                    id="contact_email"
                                    placeholder={parentProps.t('Enter email')}
                                    style={errors.contact_email ? { borderColor: "red" } : {}}
                                />
                                {errors.contact_email && touched.contact_email && (
                                    <span className="mt-2 text-danger">{errors.contact_email}</span>
                                )}
                            </div>

                            {/* Country Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="country">
                                    {parentProps.t('Country')}
                                </Label>
                                <Field
                                    name="country"
                                    as="select"
                                    className="form-control"
                                    id="country"
                                >
                                    <option value="" disabled>
                                        {parentProps.t('Select country')}
                                    </option>
                                    {countryList.map((country) => (
                                        <option key={country.key} value={country.key}>
                                            {parentProps.t(country.value)}
                                        </option>
                                    ))}
                                </Field>
                                {errors.country && touched.country && (
                                    <span className="mt-2 text-danger">{errors.country}</span>
                                )}
                            </div>

                            {/* Instagram User ID Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="instagram_user_id">
                                    {parentProps.t('Instagram User ID')}
                                </Label>
                                <Field
                                    name="instagram_user_id"
                                    type="text"
                                    className="form-control"
                                    id="instagram_user_id"
                                    placeholder={parentProps.t('Enter Instagram User ID')}
                                />
                            </div>

                            {/* Facebook User ID Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="facebook_user_id">
                                    {parentProps.t('Facebook User ID')}
                                </Label>
                                <Field
                                    name="facebook_user_id"
                                    type="text"
                                    className="form-control"
                                    id="facebook_user_id"
                                    placeholder={parentProps.t('Enter Facebook User ID')}
                                />
                            </div>

                            {/* Sex Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="sex">
                                    {parentProps.t('Sex')}
                                </Label>
                                <Field
                                    name="sex"
                                    as="select"
                                    className="form-control"
                                    id="sex"
                                >
                                    <option value="" disabled>
                                        {parentProps.t('Select sex')}
                                    </option>
                                    {sexList.map((sex) => (
                                        <option key={sex.key} value={sex.key}>
                                            {parentProps.t(sex.value)}
                                        </option>
                                    ))}
                                </Field>
                                {errors.sex && touched.sex && (
                                    <span className="mt-2 text-danger">{errors.sex}</span>
                                )}
                            </div>


                            {/* Birth Date Field */}
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="birth_date">
                                    {parentProps.t('Birth Date')}
                                </Label>
                                <Field
                                    name="birth_date"
                                    type="date"
                                    className="form-control"
                                    id="birth_date"
                                    value={dayjs(values.birth_date).format("YYYY-MM-DD")}
                                />
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
                                        {parentProps.t('Update Contact')}
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
