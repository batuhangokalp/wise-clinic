import React, { useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Alert,
  Col,
} from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { countryList } from "../helpers/countryList";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { sexList } from "../helpers/sexList";
import {
  fetchRoles,
  fetchLanguages,
  fetchDepartments,
  fetchPositions,
} from "../redux/actions";
import { find } from "lodash";

export default function UpdateUserModal(props) {
  const dispatch = useDispatch();
  let {
    modal,
    toggleModal,
    validationSchema,
    handleSubmit,
    selectedUser,
    parentProps,
  } = props;
  const roles = useSelector((state) => state.Role.roles);
  const languages = useSelector((state) => state.Layout.languages);
  const departments = useSelector((state) => state.User.departments);
  const positions = useSelector((state) => state.User.positions);

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(fetchRoles());
    }
    if (languages.length === 0) {
      dispatch(fetchLanguages());
    }
    if (departments.length === 0) {
      dispatch(fetchDepartments());
    }
    if (positions.length === 0) {
      dispatch(fetchPositions());
    }
  }, [languages]);



  return (
    <Modal size="xl" isOpen={modal} centered toggle={toggleModal}>
      <ModalHeader tag="h5" className="font-size-16" toggle={toggleModal}>
        {parentProps?.t?.("Update User")}
      </ModalHeader>
      <ModalBody className="p-4">
        <Formik
          initialValues={{
            ...selectedUser,
            password: null,
            is_active:
              selectedUser?.is_active === "Y" ||
              selectedUser?.is_active === "Yes"
                ? true
                : false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue }) => (
            <FormikForm>
              <div className="d-flex justify-content-center">
                <Col md={5}>
                  {/* Name Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="name">
                      {parentProps?.t?.("Name")}
                    </Label>
                    <Field
                      name="name"
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder={parentProps?.t?.("Enter name")}
                      style={errors.name ? { borderColor: "red" } : {}}
                    />
                    {errors.name && touched.name && (
                      <span className="mt-2 text-danger">{errors.name}</span>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="surname">
                      {parentProps?.t?.("Surname")}
                    </Label>
                    <Field
                      name="surname"
                      type="text"
                      className="form-control"
                      id="surname"
                      placeholder={parentProps?.t?.("Enter surname")}
                      style={errors.surname ? { borderColor: "red" } : {}}
                    />
                    {errors.surname && touched.surname && (
                      <span className="mt-2 text-danger">{errors.surname}</span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="email">
                      {parentProps?.t?.("Email")}
                    </Label>
                    <Field
                      name="email"
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder={parentProps?.t?.("Enter email")}
                      style={errors.email ? { borderColor: "red" } : {}}
                    />
                    {errors.email && touched.email && (
                      <span className="mt-2 text-danger">{errors.email}</span>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="phone_number">
                      {parentProps?.t?.("Phone Number")}
                    </Label>
                    <Field
                      name="phone_number"
                      type="tel"
                      className="form-control"
                      id="phone_number"
                      placeholder={parentProps?.t?.("Enter phone number")}
                      style={errors.phone_number ? { borderColor: "red" } : {}}
                    />
                    {errors.phone_number && touched.phone_number && (
                      <span className="mt-2 text-danger">
                        {errors.phone_number}
                      </span>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="password">
                      {parentProps?.t?.("Password")}
                    </Label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                      id="password"
                      value={null}
                      placeholder={parentProps?.t?.("Enter password")}
                      style={errors.password ? { borderColor: "red" } : {}}
                    />
                    {errors.password && touched.password && (
                      <span className="mt-2 text-danger">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {/* Role Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="country">
                      {parentProps?.t?.("Role")}
                    </Label>
                    <Field
                      name="role_id"
                      as="select"
                      className="form-control"
                      id="role_id"
                    >
                      <option value="" disabled>
                        {parentProps?.t?.("Select role")}
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {parentProps?.t?.(role.role_name)}
                        </option>
                      ))}
                    </Field>
                    {errors.role_id && touched.role_id && (
                      <span className="mt-2 text-danger">{errors.role_id}</span>
                    )}
                  </div>
                </Col>
                <Col md={1}></Col>
                <Col md={5}>
                  {/* Language Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="language_id">
                      {parentProps?.t?.("Language")}
                    </Label>
                    <Field
                      name="language_id"
                      as="select"
                      className="form-control"
                      id="language_id"
                    >
                      <option value="" disabled>
                        {parentProps?.t?.("Select language")}
                      </option>
                      {languages.map((language) => (
                        <option key={language.id} value={language.id}>
                          {parentProps?.t?.(language.language_name)}
                        </option>
                      ))}
                    </Field>
                    {errors.language_id && touched.language_id && (
                      <span className="mt-2 text-danger">
                        {errors.language_id}
                      </span>
                    )}
                  </div>

                  {/* Position Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="position">
                      {parentProps?.t?.("Position")}
                    </Label>
                    <Field
                      name="position"
                      as="select"
                      className="form-control"
                      id="position"
                      placeholder={parentProps?.t?.("Enter position")}
                      style={errors.position ? { borderColor: "red" } : {}}
                    >
                      <option value="" disabled>
                        {parentProps?.t?.("Select position")}
                      </option>
                      {positions.map((position) => (
                        <option key={position.id} value={position.id}>
                          {parentProps?.t?.(position.name)}
                        </option>
                      ))}
                    </Field>
                    {errors.position && touched.position && (
                      <span className="mt-2 text-danger">
                        {errors.position}
                      </span>
                    )}
                  </div>

                  {/* Department Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="department">
                      {parentProps?.t?.("Department")}
                    </Label>
                    <Field
                      name="department"
                      as="select"
                      className="form-control"
                      id="department"
                      placeholder={parentProps?.t?.("Enter department")}
                      style={errors.department ? { borderColor: "red" } : {}}
                    >
                      <option value="" disabled>
                        {parentProps?.t?.("Select department")}
                      </option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {parentProps?.t?.(department.name)}
                        </option>
                      ))}
                    </Field>
                    {errors.department && touched.department && (
                      <span className="mt-2 text-danger">
                        {errors.department}
                      </span>
                    )}
                  </div>

                  {/* Is Active Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="is_active">
                      {parentProps?.t?.("Is Active")}
                    </Label>
                    <Field name="is_active">
                      {({ field, form }) => (
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="is_active"
                            {...field}
                            value={values.is_active}
                            checked={field.value}
                            onChange={(e) => {
                              form.setFieldValue(field.name, e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="is_active"
                          >
                            {field.value
                              ? parentProps?.t?.("Active")
                              : parentProps?.t?.("Inactive")}
                          </label>
                        </div>
                      )}
                    </Field>
                    {errors.is_active && touched.is_active && (
                      <span className="mt-2 text-danger">
                        {errors.is_active}
                      </span>
                    )}
                  </div>

                  {/* Sex Field */}
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="sex">
                      {parentProps?.t?.("Sex")}
                    </Label>
                    <Field
                      name="sex"
                      as="select"
                      className="form-control"
                      id="sex"
                      placeholder={parentProps?.t?.("Enter sex")}
                      style={errors.sex ? { borderColor: "red" } : {}}
                    >
                      <option value="" disabled>
                        {parentProps?.t?.("Select sex")}
                      </option>
                      {sexList.map((sex) => (
                        <option key={sex.key} value={sex.key}>
                          {parentProps?.t?.(sex.value)}
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
                      {parentProps?.t?.("Birth Date")}
                    </Label>
                    <Field
                      name="birth_date"
                      type="date"
                      className="form-control"
                      id="birth_date"
                      value={dayjs(values.birth_date).format("YYYY-MM-DD")}
                      placeholder={parentProps?.t?.("Enter birth date")}
                      style={errors.birth_date ? { borderColor: "red" } : {}}
                    />
                    {errors.birth_date && touched.birth_date && (
                      <span className="mt-2 text-danger">
                        {errors.birth_date}
                      </span>
                    )}
                  </div>
                </Col>
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
                    {parentProps?.t?.("Update User")}
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
