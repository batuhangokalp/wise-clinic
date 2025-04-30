import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Alert,
  Form,
  Input,
  Button,
  FormFeedback,
  Label,
  InputGroup,
} from "reactstrap";
import { connect, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import withRouter from "../../components/withRouter";
import { useFormik } from "formik";
import * as Yup from "yup";

//i18n
import { useTranslation } from "react-i18next";

//redux store
import { loginUser, apiError } from "../../redux/actions";
import { apiSuccess, loginUserAction } from "./../../redux/auth/actions";
import { fetchUserById } from "./../../redux/user/actions";

//Import Images
import logodark from "../../assets/images/logo.svg";
import logolight from "../../assets/images/logo.svg";

const Login = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showMagic, setShowMagic] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicMessage, setMagicMessage] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);

  const clearWarnings = () => {
    setTimeout(() => {
      props.apiError("");
      props.apiSuccess("");
      setMagicMessage("");
    }, 4000);
  };

  useEffect(() => {
    if (props.error) {
      clearWarnings();
    }
  }, [props.error]);

  const handleAuth = async (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    let tokenData = atob(token.split(".")[1]);
    let tokenJson = JSON.parse(tokenData);
    let userId = tokenJson?.id;

    let user = await dispatch(fetchUserById(userId));
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  useEffect(() => {
    if (props.token && props.error === null) {
      handleAuth(props.token);
      clearWarnings();
    }
  }, [props.token]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your Email/Phone Number"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      let request = {
        password: values.password,
      };
      values.username.includes("@")
        ? (request.email = values.username)
        : (request.phone_number = values.username);
      await props.loginUser(request);
    },
  });

  const sendMagicLink = async () => {
    if (!magicEmail) {
      setMagicMessage("Lütfen geçerli bir email adresi giriniz.");
      return;
    }

    setMagicLoading(true);
    setMagicMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/magic-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: magicEmail }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMagicMessage("Giriş bağlantısı e-posta adresinize gönderildi.");
      } else {
        setMagicMessage(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      setMagicMessage("Bağlantı gönderilirken bir hata oluştu.");
    } finally {
      setMagicLoading(false);
    }
  };

  if (localStorage.getItem("authUser")) {
    return <Navigate to="/" />;
  }

  document.title = "Login | Upsense";

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <div className="text-center mb-4">
                <Link to="/" className="auth-logo mb-5 d-block">
                  <img
                    src={logodark}
                    alt=""
                    height="30"
                    className="logo logo-dark"
                  />
                  <img
                    src={logolight}
                    alt=""
                    height="30"
                    className="logo logo-light"
                  />
                </Link>
                <h4>{t("Sign in")}</h4>
                <p className="text-muted mb-4">
                  {t("Sign in to continue to Upsense")}.
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  {props.error && <Alert color="danger">{props.error}</Alert>}
                  {props.success && (
                    <Alert color="success">{props.success}</Alert>
                  )}
                  <div className="p-3">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="mb-3">
                        <Label className="form-label">
                          {t("Email / Phone Number")}
                        </Label>
                        <InputGroup className="mb-3 bg-soft-light rounded-3">
                          <span
                            className="input-group-text text-muted"
                            id="basic-addon3"
                          >
                            <i className="ri-user-2-line"></i>
                          </span>
                          <Input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control form-control-lg border-light bg-soft-light"
                            placeholder="Enter email / phone number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            invalid={
                              formik.touched.username && formik.errors.username
                                ? true
                                : false
                            }
                          />
                          {formik.touched.username &&
                            formik.errors.username && (
                              <FormFeedback type="invalid">
                                {formik.errors.username}
                              </FormFeedback>
                            )}
                        </InputGroup>
                      </div>

                      <FormGroup className="mb-4">
                        <div className="float-end">
                          <Link
                            to="/forget-password"
                            className="text-muted font-size-13"
                          >
                            {t("Forgot password")}?
                          </Link>
                        </div>
                        <Label className="form-label">{t("Password")}</Label>
                        <InputGroup className="mb-3 bg-soft-light rounded-3">
                          <span className="input-group-text text-muted">
                            <i className="ri-lock-2-line"></i>
                          </span>
                          <Input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control form-control-lg border-light bg-soft-light"
                            placeholder="Enter Password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            invalid={
                              formik.touched.password && formik.errors.password
                                ? true
                                : false
                            }
                          />
                          {formik.touched.password &&
                            formik.errors.password && (
                              <FormFeedback type="invalid">
                                {formik.errors.password}
                              </FormFeedback>
                            )}
                        </InputGroup>
                      </FormGroup>

                      <div className="form-check mb-4">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="remember-check"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="remember-check"
                        >
                          {t("Remember me")}
                        </Label>
                      </div>

                      <div className="d-grid">
                        <Button color="primary" block type="submit">
                          {t("Sign in")}
                        </Button>
                      </div>
                    </Form>

                    {/* Magic Link Section */}
                    <div className="text-center mt-4 mb-2">
                      <span className="text-muted">{t("or")}</span>
                    </div>
                    {/* Magic Link Toggle */}
                    <FormGroup check className="mb-3">
                      <Input
                        type="checkbox"
                        id="magic-check"
                        checked={showMagic}
                        onChange={(e) => setShowMagic(e.target.checked)}
                      />
                      <Label
                        check
                        htmlFor="magic-check"
                        className="form-check-label"
                      >
                        Login with Magic Link
                      </Label>
                    </FormGroup>

                    {/* Magic Link Section */}
                    {showMagic && (
                      <>
                        <FormGroup className="mb-3">
                          <Label className="form-label">
                            {t("Get Magic Link via Email")}
                          </Label>
                          <InputGroup className="bg-soft-light rounded-3">
                            <span className="input-group-text text-muted">
                              <i className="ri-mail-line"></i>
                            </span>
                            <Input
                              type="email"
                              name="magicEmail"
                              className="form-control form-control-lg border-light bg-soft-light"
                              placeholder="Email address"
                              value={magicEmail}
                              onChange={(e) => setMagicEmail(e.target.value)}
                            />
                          </InputGroup>
                        </FormGroup>

                        {magicMessage && (
                          <Alert color="info">{magicMessage}</Alert>
                        )}

                        <div className="d-grid mb-4">
                          <Button
                            color="secondary"
                            block
                            type="button"
                            onClick={sendMagicLink}
                            disabled={magicLoading}
                          >
                            {magicLoading
                              ? t("Sending...")
                              : t("Send Magic Link")}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { user, loading, error, success, token } = state.Auth;
  return { user, loading, error, success, token };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, apiSuccess, fetchUserById })(
    Login
  )
);
