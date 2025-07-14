import React, { useEffect, useState } from "react";
import { Row, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { useTranslation } from "react-i18next";
import RolesCard from "../../../components/RolesCard";
import UsersCard from "../../../components/UsersCard";
import DepartmentsCard from "../../../components/DepartmentsCard";
import PositionsCard from "../../../components/PositionsCard";
import PermissionWrapper from "./../../../components/PermissionWrapper";
import { PERMISSION_MAP, PERMISSIONS } from "../../../redux/role/constants";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../redux/actions";
import TemplatesCard from "../../../components/TemplatesCard";
import CannedResponsesCard from "../../../components/CannedResponsesCard";

function Settings(props) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const roleId = useSelector((state) => state.User.user?.role_id);
  const [activeTab, setActiveTab] = useState("roles");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const roles = useSelector((state) => state.Role.roles);
  const currentRole = roles.find((role) => role.id === roleId);

  const rawPermissions = currentRole?.permissions || [];
  const userPermissions = rawPermissions.reduce((acc, p) => {
    const perms = PERMISSION_MAP[p];
    if (Array.isArray(perms)) {
      acc.push(...perms);
    }
    return acc;
  }, []);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (hasPermission(userPermissions, PERMISSIONS.VIEW_ROLES)) {
      setActiveTab("roles");
    } else if (hasPermission(userPermissions, PERMISSIONS.VIEW_USERS)) {
      setActiveTab("users");
    } else if (hasPermission(userPermissions, PERMISSIONS.VIEW_DEPARTMENTS)) {
      setActiveTab("departments");
    } else if (hasPermission(userPermissions, PERMISSIONS.VIEW_POSITIONS)) {
      setActiveTab("positions");
    } else if (hasPermission(userPermissions, PERMISSIONS.VIEW_TEMPLATES)) {
      setActiveTab("templates");
    } else if (
      hasPermission(userPermissions, PERMISSIONS.VIEW_CANNED_RESPONSES)
    ) {
      setActiveTab("canned_responses");
    }
    setLoading(false);
  }, []);

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
          Loading settings...
        </div>
      </div>
    );
  }

return (
  <div className="container-fluid w-100 align-items-center">
    <Row>
      <div className="d-flex justify-content-between align-items-center px-4 pt-4 w-100">
        <h4 className="mb-0">{t("Settings")}</h4>

        {/* Hamburger menu button (only on mobile) */}
        <button
          className="btn d-lg-none"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <i className="ri-menu-line fs-4" />
        </button>
      </div>
    </Row>

    {/* Mobile Menu */}
    {showMobileMenu && (
      <div className="px-4 py-2 d-lg-none">
        <Nav vertical>
          {hasPermission(userPermissions, PERMISSIONS.VIEW_ROLES) && (
            <NavItem>
              <NavLink
                onClick={() => {
                  toggle("roles");
                  setShowMobileMenu(false);
                }}
                className={activeTab === "roles" ? "fw-bold text-primary" : ""}
              >
                {t("Roles")}
              </NavLink>
            </NavItem>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_USERS) && (
            <NavItem>
              <NavLink
                onClick={() => {
                  toggle("users");
                  setShowMobileMenu(false);
                }}
                className={activeTab === "users" ? "fw-bold text-primary" : ""}
              >
                {t("Users")}
              </NavLink>
            </NavItem>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_DEPARTMENTS) && (
            <NavItem>
              <NavLink
                onClick={() => {
                  toggle("departments");
                  setShowMobileMenu(false);
                }}
                className={
                  activeTab === "departments" ? "fw-bold text-primary" : ""
                }
              >
                {t("Departments")}
              </NavLink>
            </NavItem>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_POSITIONS) && (
            <NavItem>
              <NavLink
                onClick={() => {
                  toggle("positions");
                  setShowMobileMenu(false);
                }}
                className={
                  activeTab === "positions" ? "fw-bold text-primary" : ""
                }
              >
                {t("Positions")}
              </NavLink>
            </NavItem>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_TEMPLATES) && (
            <NavItem>
              <NavLink
                onClick={() => {
                  toggle("templates");
                  setShowMobileMenu(false);
                }}
                className={
                  activeTab === "templates" ? "fw-bold text-primary" : ""
                }
              >
                {t("Templates")}
              </NavLink>
            </NavItem>
          )}
          {hasPermission(
            userPermissions,
            PERMISSIONS.VIEW_CANNED_RESPONSES
          ) && (
            <NavItem>
              <NavLink
                onClick={() => {
                  toggle("canned_responses");
                  setShowMobileMenu(false);
                }}
                className={
                  activeTab === "canned_responses"
                    ? "fw-bold text-primary"
                    : ""
                }
              >
                {t("Canned Responses")}
              </NavLink>
            </NavItem>
          )}
        </Nav>
      </div>
    )}

    {/* Desktop Tab Menu */}
    <Row className="ms-2 d-none d-lg-block">
      <Nav tabs>
        {hasPermission(userPermissions, PERMISSIONS.VIEW_ROLES) && (
          <NavItem>
            <NavLink
              className={
                activeTab === "roles"
                  ? "active text-primary fw-bolder text-decoration-underline"
                  : ""
              }
              onClick={() => toggle("roles")}
            >
              {t("Roles")}
            </NavLink>
          </NavItem>
        )}
        {hasPermission(userPermissions, PERMISSIONS.VIEW_USERS) && (
          <NavItem>
            <NavLink
              className={
                activeTab === "users"
                  ? "active text-primary fw-bolder text-decoration-underline"
                  : ""
              }
              onClick={() => toggle("users")}
            >
              {t("Users")}
            </NavLink>
          </NavItem>
        )}
        {hasPermission(userPermissions, PERMISSIONS.VIEW_DEPARTMENTS) && (
          <NavItem>
            <NavLink
              className={
                activeTab === "departments"
                  ? "active text-primary fw-bolder text-decoration-underline"
                  : ""
              }
              onClick={() => toggle("departments")}
            >
              {t("Departments")}
            </NavLink>
          </NavItem>
        )}
        {hasPermission(userPermissions, PERMISSIONS.VIEW_POSITIONS) && (
          <NavItem>
            <NavLink
              className={
                activeTab === "positions"
                  ? "active text-primary fw-bolder text-decoration-underline"
                  : ""
              }
              onClick={() => toggle("positions")}
            >
              {t("Positions")}
            </NavLink>
          </NavItem>
        )}
        {hasPermission(userPermissions, PERMISSIONS.VIEW_TEMPLATES) && (
          <NavItem>
            <NavLink
              className={
                activeTab === "templates"
                  ? "active text-primary fw-bolder text-decoration-underline"
                  : ""
              }
              onClick={() => toggle("templates")}
            >
              {t("Templates")}
            </NavLink>
          </NavItem>
        )}
        {hasPermission(
          userPermissions,
          PERMISSIONS.VIEW_CANNED_RESPONSES
        ) && (
          <NavItem>
            <NavLink
              className={
                activeTab === "canned_responses"
                  ? "active text-primary fw-bolder text-decoration-underline"
                  : ""
              }
              onClick={() => toggle("canned_responses")}
            >
              {t("Canned Responses")}
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </Row>

    {/* Tab Content */}
    <Row>
      <div>
        <TabContent activeTab={activeTab}>
          {hasPermission(userPermissions, PERMISSIONS.VIEW_ROLES) && (
            <TabPane tabId="roles" id="pills-roles">
              <RolesCard t={t} />
            </TabPane>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_USERS) && (
            <TabPane tabId="users" id="pills-users">
              <UsersCard t={t} />
            </TabPane>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_DEPARTMENTS) && (
            <TabPane tabId="departments" id="pills-departments">
              <DepartmentsCard t={t} />
            </TabPane>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_POSITIONS) && (
            <TabPane tabId="positions" id="pills-positions">
              <PositionsCard t={t} />
            </TabPane>
          )}
          {hasPermission(userPermissions, PERMISSIONS.VIEW_TEMPLATES) && (
            <TabPane tabId="templates" id="pills-templates">
              <TemplatesCard t={t} />
            </TabPane>
          )}
          {hasPermission(
            userPermissions,
            PERMISSIONS.VIEW_CANNED_RESPONSES
          ) && (
            <TabPane tabId="canned_responses" id="pills-canned_responses">
              <CannedResponsesCard t={t} />
            </TabPane>
          )}
        </TabContent>
      </div>
    </Row>
  </div>
);

}

export default PermissionWrapper(Settings, PERMISSIONS.VIEW_SETTINGS);
