import React, { useState, useEffect, useMemo } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
} from "reactstrap";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from "react-i18next";
import UpdateUserModal from "../../../components/UpdateUserModal";
import {
  apiUserError,
  apiUserSuccess,
  fetchUsers,
  updateUser,
} from "../../../redux/actions";

function Profile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateUserModal, setUpdateUserModal] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const userInfo = useMemo(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const currentUser = user?.user;

  const userError = useSelector((state) => state.User.error);
  const userSuccess = useSelector((state) => state.User.success);

  const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    email: Yup.string().required("Email is required"),
    phone_number: Yup.string().required("Phone Number is required"),
    password: Yup.string().nullable(),
    role_id: Yup.number().required("Role is required"),
    language_id: Yup.number().nullable(),
    sex: Yup.string().nullable(),
    birth_date: Yup.string().nullable(),
    position: Yup.string().nullable(),
    department: Yup.string().nullable(),
    is_active: Yup.string().nullable(),
  });

  useEffect(() => {
    if (!userInfo?.id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/${userInfo.id}`,
          {
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": 69420,
            },
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Kullanıcı alınamadı: ${res.status} - ${errText}`);
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("fetchUser hatası:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userInfo?.id]);

  const handleUpdateSubmit = async (values) => {
    values["is_active"] = values.is_active ? "Y" : "N";
    if (!values.password) {
      delete values.password;
    }
    await dispatch(updateUser(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setUpdateUserModal(false);
          dispatch(fetchUsers());
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }, 3000);
      }
    });
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          flexDirection: "column",
        }}
      >
        <img
          src="/upsense-logo.png"
          alt=""
          style={{
            width: "150px",
            height: "150px",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            marginTop: "12px",
            color: "#cfd8dc",
            fontSize: "20px",
          }}
        >
          Loading profile...
        </div>
      </div>
    );
  }
  if (!user) return <p className="p-4 text-danger">{t("User not found")}</p>;

  return (
    <React.Fragment>
      <div>
        <div className="px-4 pt-4">
          <div className="user-chat-nav float-end">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle
                tag="a"
                className="font-size-18 text-muted dropdown-toggle"
              >
                <i className="ri-more-2-fill"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem onClick={() => setUpdateUserModal(true)}>
                  {t("Edit")}
                </DropdownItem>
                <UpdateUserModal
                  modal={updateUserModal}
                  toggleModal={() => {
                    setUpdateUserModal(!updateUserModal);
                  }}
                  validationSchema={updateValidationSchema}
                  selectedUser={currentUser}
                  parentProps={{
                    t: t,
                    error: userError,
                    success: userSuccess,
                  }}
                  handleSubmit={handleUpdateSubmit}
                />
                {/* <DropdownItem>{t("Action")}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>{t("Another action")}</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
          <h4 className="mb-0">{t("My Profile")}</h4>
        </div>

        <div className="text-center p-4 border-bottom">
          <div className="mb-4">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                className="rounded-circle avatar-lg img-thumbnail"
                alt="avatar"
              />
            ) : (
              <div
                className="rounded-circle avatar-lg img-thumbnail d-flex align-items-center justify-content-center bg-primary text-white fw-bold"
                style={{
                  fontSize: "24px",
                  width: "60px",
                  height: "60px",
                  margin: "0 auto",
                }}
              >
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <h5 className="font-size-16 mb-1 text-truncate">
            {t(currentUser?.name)}
          </h5>
          <p className="text-muted text-truncate mb-1">
            <i className="ri-record-circle-fill font-size-10 text-success me-1 d-inline-block"></i>{" "}
            {t("Active")}
          </p>
        </div>

        <div className="p-4 user-profile-desc">
          <div className="text-muted">
            <p className="mb-4">{t(currentUser?.description)}</p>
          </div>

          <div id="profile-user-accordion-1" className="custom-accordion">
            <Card className="shadow-none border mb-2">
              <CustomCollapse
                title="About"
                iconClass="ri-user-2-line"
                isOpen={true}
                toggleCollapse={() => {}}
              >
                <div>
                  <p className="text-muted mb-1">{t("Name")}</p>
                  <h5 className="font-size-14">{t(currentUser?.name)}</h5>
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Surname")}</p>
                  <h5 className="font-size-14">{t(currentUser?.surname)}</h5>
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Email")}</p>
                  <h5 className="font-size-14">{t(currentUser?.email)}</h5>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Phone Number")}</p>
                  <h5 className="font-size-14 mb-0">
                    {t(currentUser?.phone_number)}
                  </h5>
                </div>
              </CustomCollapse>
            </Card>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Profile;
