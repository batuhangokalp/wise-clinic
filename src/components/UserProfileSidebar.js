import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Card, Badge } from "reactstrap";
import { fetchContactById } from "../redux/contact/actions";
import { getCountryData } from "../helpers/countryList";
import { getSexValue } from "../helpers/sexList";

//Simple bar
import SimpleBar from "simplebar-react";

//components
import AttachedFiles from "./AttachedFiles";
import CustomCollapse from "./CustomCollapse";

//actions
import { closeUserSidebar } from "../redux/actions";

//i18n
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

function UserProfileSidebar(props) {
  const dispatch = useDispatch();

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  // closes sidebar
  const closeuserSidebar = () => {
    props.closeUserSidebar();
  };

  useEffect(() => {
    if (props.activeConversation && props.activeConversation?.contact_id) {
      dispatch(fetchContactById(props.activeConversation?.contact_id));
    }
  }, [props?.activeConversation]);

  const renderBitrixData = () => {
    const { leads = [], contacts = [], deals = [] } = props.bitrixData || {};

    const renderList = (title, data) => (
      <div className="mt-4">
        <h5 className="font-size-16">
          {title} ({data.length})
        </h5>
        {data.length === 0 ? (
          <p className="text-muted">No data</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {data.map((item, index) => (
              <li key={item.ID || index} className="text-muted">
                {item.ITEM_LINK ? (
                  <a
                    href={item.ITEM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0d6efd", textDecoration: "underline" }}
                  >
                    <strong>ID:</strong> {item.ID}{" "}
                    {item.TITLE ? (
                      <>
                        {" "}
                        - <strong>Title:</strong> {item.TITLE}
                      </>
                    ) : item.NAME || item.LAST_NAME ? (
                      <>
                        {" "}
                        - <strong>Name:</strong> {item.NAME || ""}{" "}
                        {item.LAST_NAME || ""}
                      </>
                    ) : null}
                  </a>
                ) : (
                  <>
                    <strong>ID:</strong> {item.ID}{" "}
                    {item.TITLE ? (
                      <>
                        {" "}
                        - <strong>Title:</strong> {item.TITLE}
                      </>
                    ) : item.name || item.lastname ? (
                      <>
                        {" "}
                        - <strong>Name:</strong> {item.name || ""}{" "}
                        {item.lastname || ""}
                      </>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );

    return (
      <Card className="shadow-none border mt-4 p-3">
        <h4 className="font-size-18 mb-3">Bitrix Info</h4>
        {renderList("Leads", leads)}
        {renderList("Contacts", contacts)}
        {renderList("Deals", deals)}
      </Card>
    );
  };

  // style={{display: props.userSidebar  ? "block" : "none"}}
  return (
    <React.Fragment>
      <div
        style={{ display: props.userSidebar === true ? "block" : "none" }}
        className="user-profile-sidebar"
      >
        <div className="px-3 px-lg-4 pt-3 pt-lg-4">
          <div className="user-chat-nav  text-end">
            <Button
              color="none"
              type="button"
              onClick={closeuserSidebar}
              className="nav-btn"
              id="user-profile-hide"
            >
              <i className="ri-close-line"></i>
            </Button>
          </div>
        </div>

        <div className="text-center p-4 border-bottom">
          <div className="mb-4 d-flex justify-content-center">
            {props.contact?.avatar ? (
              <img
                src={props.contact?.avatar}
                className="rounded-circle avatar-lg img-thumbnail"
                alt="chatvia"
              />
            ) : (
              <div className="avatar-lg">
                <span className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-24">
                  {props.contact?.name.charAt(0) ?? (
                    <i className="ri-user-fill font-size-50 text-primary"></i>
                  )}
                </span>
              </div>
            )}
          </div>

          <h5 className="font-size-16 mb-1 text-truncate">
            {props.contact?.name}
          </h5>
          <p className="text-muted text-truncate mb-1">
            {(() => {
              switch (props.contact?.status) {
                case "online":
                  return (
                    <>
                      <i className="ri-record-circle-fill font-size-10 text-success me-1"></i>
                    </>
                  );

                case "away":
                  return (
                    <>
                      <i className="ri-record-circle-fill font-size-10 text-warning me-1"></i>
                    </>
                  );

                case "offline":
                  return (
                    <>
                      <i className="ri-record-circle-fill font-size-10 text-secondary me-1"></i>
                    </>
                  );

                default:
                  return;
              }
            })()}
          </p>
        </div>
        {/* End profile user */}

        {/* Start user-profile-desc */}
        <SimpleBar
          style={{ maxHeight: "100%" }}
          className="p-4 user-profile-desc"
        >
          <div id="profile-user-accordion" className="custom-accordion">
            <Card className="shadow-none border mb-2">
              {/* import collaps */}
              <CustomCollapse
                title="About"
                iconClass="ri-user-2-line"
                isOpen={true}
                toggleCollapse={() => {}}
              >
                <div>
                  <p className="text-muted mb-1">{t("Name")}</p>
                  <h5 className="font-size-14">{props.contact?.name}</h5>
                </div>
                <div>
                  <p className="text-muted mb-1">{t("Surname")}</p>
                  <h5 className="font-size-14">{props.contact?.surname}</h5>
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Birth Date")}</p>
                  <h5 className="font-size-14">
                    {props.contact?.birth_date
                      ? dayjs(props.contact?.birth_date).format("DD.MM.YYYY")
                      : "-"}
                  </h5>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Email")}</p>
                  <h5 className="font-size-14">
                    {props.contact?.contact_email}
                  </h5>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Phone Number")}</p>
                  <h5 className="font-size-14">
                    {props.contact?.phone_number}
                  </h5>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Country")}</p>
                  <h5 className="font-size-14">
                    {props.contact?.country
                      ? getCountryData(props.contact?.country)
                      : "-"}
                  </h5>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Sex")}</p>
                  <h5 className="font-size-14">
                    {props.contact?.sex ? getSexValue(props.contact?.sex) : "-"}
                  </h5>
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Instagram User Id")}</p>
                  <h5 className="font-size-14">
                    {props.contact?.instagram_user_id
                      ? props.contact?.instagram_user_id
                      : "-"}
                  </h5>
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Facebook User Id")}</p>
                  <h5 className="font-size-14">
                    {props.contact?.facebook_user_id
                      ? props.contact?.facebook_user_id
                      : "-"}
                  </h5>
                </div>
              </CustomCollapse>
            </Card>
            {/* End About card */}
          </div>
          {renderBitrixData()}
        </SimpleBar>
        {/* end user-profile-desc */}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  const { users, active_user } = state.Chat;
  const { contact } = state.Contact;
  const { userSidebar } = state.Layout;
  return { contact, users, active_user, userSidebar };
};

export default connect(mapStateToProps, { closeUserSidebar })(
  UserProfileSidebar
);
