import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Alert,
} from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { uploadFile } from "../redux/actions";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function UpdateTemplateModal(props) {
  const languages = useSelector((state) => state.Layout.languages);

  const categoryOptions = [
    { label: "Marketing", value: "MARKETING" },
    { label: "Utility", value: "UTILITY" },
    { label: "Authentication", value: "AUTHENTICATION" },
  ];

  const templateTypeOptions = [
    { label: "Text", value: "TEXT" },
    { label: "Image", value: "IMAGE" },
    { label: "Video", value: "VIDEO" },
    { label: "Document", value: "DOCUMENT" },
  ];

  let {
    modal,
    toggleModal,
    validationSchema,
    handleSubmit,
    selectedItem,
    parentProps,
  } = props;

  return (
    <Modal isOpen={modal} centered toggle={toggleModal}>
      <ModalHeader tag="h5" className="font-size-16" toggle={toggleModal}>
        {parentProps?.t?.("Update Template")}
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
              {/* Category Field */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="category">
                  {parentProps?.t?.("Category")}
                </Label>
                <Field
                  name="category"
                  as="select"
                  className="form-control"
                  id="category"
                  style={errors.category ? { borderColor: "red" } : {}}
                >
                  <option value="">
                    {values?.category
                      ? values?.category
                      : parentProps?.t?.("Select category")}
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Field>
                {errors.category && touched.category && (
                  <span className="mt-2 text-danger">{errors.category}</span>
                )}
              </div>
              {/* Name Field */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="element_name">
                  {parentProps?.t?.("Template Name")}
                </Label>
                <Field
                  name="element_name"
                  type="text"
                  className="form-control"
                  id="element_name"
                  placeholder={parentProps?.t?.("Enter template name")}
                  style={errors.element_name ? { borderColor: "red" } : {}}
                />
                {errors.element_name && touched.element_name && (
                  <span className="mt-2 text-danger">
                    {errors.element_name}
                  </span>
                )}
              </div>

              {/* language code Field as Dropdown */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="language_code">
                  {parentProps?.t?.("Language")}
                </Label>
                <Field
                  name="language_code"
                  as="select"
                  className="form-control"
                  id="language_code"
                  style={errors.language_code ? { borderColor: "red" } : {}}
                >
                  <option value="">
                    {values?.language_code
                      ? values?.language_code
                      : parentProps?.t?.("Select language")}
                  </option>
                  {languages.map((lang) => (
                    <option key={lang.language_code} value={lang.language_code}>
                      {lang.language_name}
                    </option>
                  ))}
                </Field>
                {errors.language_code && touched.language_code && (
                  <span className="mt-2 text-danger">
                    {errors.language_code}
                  </span>
                )}
              </div>
              {/* template type Field as Dropdown */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="template_type">
                  {parentProps?.t?.("Template Type")}
                </Label>
                <Field
                  name="template_type"
                  as="select"
                  className="form-control"
                  id="template_type"
                  style={errors.template_type ? { borderColor: "red" } : {}}
                >
                  <option value="" disabled hidden>
                    {values?.template_type
                      ? values?.template_type
                      : parentProps?.t?.("Select template type")}
                  </option>
                  {templateTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>

                {errors.template_type && touched.template_type && (
                  <span className="mt-2 text-danger">
                    {errors.template_type}
                  </span>
                )}
              </div>

              {/* Dynamic Content Input */}
              {values?.template_type === "TEXT" && (
                <div className="mb-4">
                  <Label className="form-label" htmlFor="header">
                    {parentProps?.t?.("Header")}
                  </Label>
                  <Field
                    name="header"
                    type="text"
                    className="form-control"
                    id="header"
                    placeholder={parentProps?.t?.("Enter header")}
                    style={errors.header ? { borderColor: "red" } : {}}
                  />
                  {errors.header && touched.header && (
                    <span className="mt-2 text-danger">{errors.header}</span>
                  )}
                </div>
              )}

              {["IMAGE", "VIDEO", "DOCUMENT"].includes(
                values?.template_type
              ) && (
                <div className="mb-4">
                  <Label className="form-label" htmlFor="header">
                    {parentProps?.t?.("Upload File")}
                  </Label>
                  <input
                    type="file"
                    id="header"
                    name="header"
                    className="form-control"
                    onChange={(event) => {
                      setFieldValue("header", event.currentTarget.files[0]);
                    }}
                    style={errors.header ? { borderColor: "red" } : {}}
                  />
                  {errors.header && touched.header && (
                    <span className="mt-2 text-danger">{errors.header}</span>
                  )}
                </div>
              )}

              {/* content Field */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="content">
                  {parentProps?.t?.("Content")}
                </Label>
                <Field
                  name="content"
                  type="text"
                  className="form-control"
                  id="content"
                  placeholder={parentProps?.t?.("Enter content")}
                  style={errors.data ? { borderColor: "red" } : {}}
                />
                {errors.content && touched.content && (
                  <span className="mt-2 text-danger">{errors.content}</span>
                )}
              </div>

              {/* Footer Field */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="footer">
                  {parentProps?.t?.("Footer")}
                </Label>
                <Field
                  name="footer"
                  type="text"
                  className="form-control"
                  id="footer"
                  placeholder={parentProps?.t?.("Enter footer")}
                  style={errors.footer ? { borderColor: "red" } : {}}
                />
                {errors.footer && touched.footer && (
                  <span className="mt-2 text-danger">{errors.footer}</span>
                )}
              </div>
              <ModalFooter style={{ display: "block" }}>
                {parentProps?.success && (
                  <div
                    style={{
                      display: "block",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Alert color="success">{parentProps?.success}</Alert>
                  </div>
                )}
                {parentProps?.error && (
                  <div
                    style={{
                      display: "block",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Alert color="danger">{parentProps?.error}</Alert>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <Button type="button" color="link" onClick={toggleModal}>
                    {parentProps?.t?.("Close")}
                  </Button>
                  <Button type="submit" color="primary">
                    {parentProps?.t?.("Update Template")}
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
