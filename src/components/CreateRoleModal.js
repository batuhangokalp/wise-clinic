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
import { countryList } from "../helpers/countryList";
import { uploadFile } from "../redux/actions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { sexList } from "../helpers/sexList";

export default function CreateRoleModal(props) {
  const dispatch = useDispatch();
  let {
    modal,
    toggleModal,
    validationSchema,
    handleSubmit,
    selectedRole,
    parentProps,
  } = props;

  return (
    <Modal isOpen={modal} centered toggle={toggleModal}>
      <ModalHeader tag="h5" className="font-size-16" toggle={toggleModal}>
        {parentProps.t("Create Role")}
      </ModalHeader>
      <ModalBody className="p-4">
        <Formik
          initialValues={{
            role_name: "",
            role_description: "",
            permissions: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue }) => (
            <FormikForm>
              {/* Name Field */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="role_name">
                  {parentProps.t("Role Name")}
                </Label>
                <Field
                  name="role_name"
                  type="text"
                  className="form-control"
                  id="role_name"
                  placeholder={parentProps.t("Enter role name")}
                  style={errors.role_name ? { borderColor: "red" } : {}}
                />
                {errors.role_name && touched.role_name && (
                  <span className="mt-2 text-danger">{errors.role_name}</span>
                )}
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <Label className="form-label" htmlFor="role_description">
                  {parentProps.t("Description")}
                </Label>
                <Field
                  name="role_description"
                  type="text"
                  className="form-control"
                  id="role_description"
                  placeholder={parentProps.t("Enter description")}
                  style={errors.surname ? { borderColor: "red" } : {}}
                />
                {errors.role_description && touched.role_description && (
                  <span className="mt-2 text-danger">
                    {errors.role_description}
                  </span>
                )}
              </div>
              {/* Permissions Checkboxes */}
              <div className="mb-4">
                <Label className="form-label">
                  {parentProps.t("Permissions")}
                </Label>
                <div className="d-flex flex-column gap-2 ps-2">
                  {[
                    "All Chats",
                    "Own Chat",
                    "Settings",
                    "Contacts",
                    "Reports",
                  ].map((perm) => (
                    <div key={perm} className="form-check">
                      <Field
                        type="checkbox"
                        name="permissions"
                        value={perm}
                        className="form-check-input"
                        id={perm}
                      />
                      <Label className="form-check-label" htmlFor={perm}>
                        {parentProps.t(perm)}
                      </Label>
                    </div>
                  ))}
                  {errors.permissions && touched.permissions && (
                    <span className="mt-2 text-danger">
                      {errors.permissions}
                    </span>
                  )}
                </div>
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
                    {parentProps.t("Close")}
                  </Button>
                  <Button type="submit" color="primary">
                    {parentProps.t("Create Role")}
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
