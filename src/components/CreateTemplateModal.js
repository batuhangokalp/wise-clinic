import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Alert,
} from "reactstrap";
import { Formik, Form as FormikForm, Field, FieldArray } from "formik";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import VariableInputModal from "./VariableInputModal";
import VariableHeaderInputModal from "./VariableHeaderInputModal";

export default function CreateTemplateModal(props) {
  let {
    modal,
    toggleModal,
    validationSchema,
    handleSubmit,
    parentProps,
    open,
    toggle,
    variableContent,
    setVariableContent,
    handleAddVariableContent,
    setOpen,
    toggleHeaderModal,
    setOpenHeaderModal,
    openHeaderModal,
    variableHeader,
    setVariableHeader,
    handleAddVariableHeader,
    tempKey,
    setTempKey,
    tempValue,
    setTempValue,
    tempContentKey,
    setTempContentKey,
    tempContentValue,
    setTempContentValue,
  } = props;
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

  const handleFileUpload = async (file, setFieldValue) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/templates/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setFieldValue("sample_media", result);
      } else {
        console.error("Yükleme başarısız:", result);
      }
    } catch (error) {
      console.error("Upload hatası:", error);
    }
  };

  return (
    <Modal isOpen={modal} centered toggle={toggleModal}>
      <ModalHeader tag="h5" className="font-size-16" toggle={toggleModal}>
        {parentProps.t("Create Template")}
      </ModalHeader>
      <ModalBody className="p-4">
        <Formik
          initialValues={{
            element_name: "",
            content: "",
            header: "",
            showHeader: false,
            footer: "",
            showFooter: false,
            template_type: "",
            language_code: "",
            category: "",
            buttons: [],
          }}
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
                    {values.category
                      ? values.category
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
                    {values.language_code
                      ? values.language_code
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
                    {values.template_type
                      ? values.template_type
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
              {/* Header Toggle */}

              {values.template_type === "TEXT" && (
                <>
                  {/* Show Header Toggle */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showHeaderInput"
                        onChange={(e) =>
                          setFieldValue("showHeader", e.target.checked)
                        }
                        checked={values.showHeader || false}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="showHeaderInput"
                      >
                        {parentProps?.t?.("Add Header")}
                      </label>
                    </div>
                  </div>

                  {/* Header Input */}
                  {values.showHeader && (
                    <div className="mb-4">
                      <Label className="form-label" htmlFor="header">
                        {parentProps?.t?.("Header")}
                      </Label>

                      <div className="d-flex gap-2 mb-2">
                        <Field
                          name="header"
                          type="text"
                          className="form-control"
                          id="header"
                          placeholder="Enter header"
                          style={errors.header ? { borderColor: "red" } : {}}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setOpenHeaderModal(true)}
                        >
                          Add Variable
                        </Button>
                      </div>

                      {/* Önizleme */}
                      <div className="text-muted small">
                        Preview:{" "}
                        {values.header?.replace(/\{\{(\d+)\}\}/g, (_, key) => {
                          const found = variableHeader.find(
                            (v) => v.key === key
                          );
                          return found ? found.value : `{{${key}}}`;
                        })}
                      </div>

                      <VariableHeaderInputModal
                        openHeaderModal={openHeaderModal}
                        toggleHeaderModal={toggleHeaderModal}
                        variableHeader={variableHeader}
                        setVariableHeader={setVariableHeader}
                        handleAddVariableHeader={handleAddVariableHeader}
                        setOpenHeaderModal={setOpenHeaderModal}
                        tempKey={tempKey}
                        setTempKey={setTempKey}
                        tempValue={tempValue}
                        setTempValue={setTempValue}
                      />

                      {errors.header && touched.header && (
                        <span className="mt-2 text-danger">
                          {errors.header}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}

              {["IMAGE", "VIDEO", "DOCUMENT"].includes(
                values.template_type
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
                    onChange={(event) =>
                      handleFileUpload(
                        event.currentTarget.files[0],
                        setFieldValue
                      )
                    }
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
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Field
                    name="content"
                    type="text"
                    className="form-control"
                    id="content"
                    placeholder={parentProps?.t?.("Enter content")}
                    style={errors.data ? { borderColor: "red" } : {}}
                  />
                  <Button type="button" size="sm" onClick={() => setOpen(true)}>
                    Add Variable
                  </Button>
                </div>
                {/* Önizleme */}
                <div className="text-muted small">
                  Preview:{" "}
                  {values.content
                    ? values.content.replace(/\{\{(\d+)\}\}/g, (_, key) => {
                        const found = variableContent.find(
                          (v) => v.key === key
                        );
                        return found ? found.value : `{{${key}}}`;
                      })
                    : ""}
                </div>
                {errors.content && touched.content && (
                  <span className="mt-2 text-danger">{errors.content}</span>
                )}
              </div>
              {/* Modal */}
              <VariableInputModal
                open={open}
                toggle={toggle}
                variableContent={variableContent}
                setVariableContent={setVariableContent}
                handleAddVariableContent={handleAddVariableContent}
                tempContentKey={tempContentKey}
                setTempContentKey={setTempContentKey}
                tempContentValue={tempContentValue}
                setTempContentValue={setTempContentValue}
              />
              {/* Footer Toggle */}
              <div className="mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="showFooterInput"
                    onChange={(e) =>
                      setFieldValue("showFooter", e.target.checked)
                    }
                    checked={values.showFooter || false}
                  />
                  <label className="form-check-label" htmlFor="showFooterInput">
                    {parentProps?.t?.("Add Footer")}
                  </label>
                </div>
              </div>

              {/* Footer Input */}
              {values.showFooter && (
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
              )}

              {/* Buttons Section */}
              <div className="mb-4">
                <Label className="form-label">
                  {parentProps?.t?.("Buttons")}
                </Label>
                <FieldArray name="buttons">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.buttons.map((btn, index) => (
                        <div key={index} className="mb-3 border rounded p-3">
                          {/* Type Dropdown */}
                          <div className="mb-2">
                            <Field
                              name={`buttons[${index}].type`}
                              as="select"
                              className="form-control"
                            >
                              <option value="">
                                {parentProps?.t?.("Select button type")}
                              </option>
                              <option value="QUICK_REPLY">Quick Reply</option>
                              <option value="URL">URL</option>
                              <option value="CALL">Call</option>
                            </Field>
                          </div>

                          {/* Text input */}
                          <div className="mb-2">
                            <Field
                              name={`buttons[${index}].text`}
                              className="form-control"
                              placeholder={parentProps?.t?.("Button text")}
                            />
                          </div>

                          {/* URL / Phone input */}
                          {["URL", "CALL"].includes(
                            form.values.buttons[index].type
                          ) && (
                            <div className="mb-2">
                              <Field
                                name={`buttons[${index}].url`}
                                className="form-control"
                                placeholder={
                                  form.values.buttons[index].type === "CALL"
                                    ? parentProps?.t?.(
                                        "Phone number (e.g. +90555...)"
                                      )
                                    : parentProps?.t?.(
                                        "Website URL (e.g. https://...)"
                                      )
                                }
                              />
                            </div>
                          )}

                          {/* Remove Button */}
                          <div className="text-end">
                            <Button
                              color="danger"
                              size="sm"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              {parentProps?.t?.("Remove")}
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Add Button (Max 2 buttons) */}
                      {form.values.buttons.length < 2 && (
                        <Button
                          type="button"
                          color="primary"
                          onClick={() => push({ type: "", text: "", url: "" })}
                          style={{
                            fontSize: "0.8rem",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          + Add
                        </Button>
                      )}
                    </>
                  )}
                </FieldArray>
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
                    {parentProps?.t?.("Create Template")}
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
