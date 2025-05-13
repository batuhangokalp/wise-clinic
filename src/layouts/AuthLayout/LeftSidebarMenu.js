import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Nav, NavItem, NavLink, UncontrolledTooltip, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap";
import classnames from "classnames";
import { connect, useDispatch, useSelector } from "react-redux";
import { setActiveTab, changeLayoutMode, hasPermission } from "../../redux/actions";
//Import Images
import logo from "../../assets/images/logo.svg"
import avatar1 from "../../assets/images/users/avatar-1.jpg";
//i18n
import i18n from '../../i18n';
// falgs
import usFlag from "../../assets/images/flags/us.jpg";
import spain from "../../assets/images/flags/spain.jpg";
import germany from "../../assets/images/flags/germany.jpg";
import italy from "../../assets/images/flags/italy.jpg";
import russia from "../../assets/images/flags/russia.jpg";
import { createSelector } from 'reselect';
import { useTabNavigation } from "../../helpers/chatUtils";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../redux/role/constants";


function LeftSidebarMenu(props) {
    const roleId = useSelector((state) => state.User.user?.role_id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
    const selectLayoutProperties = createSelector(
        (state) => state.Layout,
        (layout) => ({
            layoutMode: layout.layoutMode,
        })
    );

    const { layoutMode } = useSelector(selectLayoutProperties);

    const mode =
        layoutMode === "dark"
            ? "light"
            : "dark";

    const onChangeLayoutMode = (value) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    }

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
    const [lng, setlng] = useState("English");


    const toggle = () => setDropdownOpen(!dropdownOpen);
    const toggle2 = () => setDropdownOpen2(!dropdownOpen2);
    const toggleMobile = () => setDropdownOpenMobile(!dropdownOpenMobile);

    const { toggleTab } = useTabNavigation();



    const activeTab = props.activeTab;

    /* changes language according to clicked language menu item */
    const changeLanguageAction = (lng) => {

        /* set the selected language to i18n */
        i18n.changeLanguage(lng);

        if (lng === "sp")
            setlng("Spanish");
        else if (lng === "gr")
            setlng("German");
        else if (lng === "rs")
            setlng("Russian");
        else if (lng === "it")
            setlng("Italian");
        else if (lng === "eng")
            setlng("English");
    }


    useEffect(() => {
        if (location.search) {
            const query = new URLSearchParams(location.search);
            const tabId = query.get('tabId');
            if (tabId) {
                props.setActiveTab(tabId)
            }
        }
    }, [location.search, props.setActiveTab]);

    return (
        <React.Fragment>
            <div className="side-menu flex-lg-column me-lg-1">
                {/* LOGO */}
                <div className="navbar-brand-box">
                    <Link to="/" className="logo logo-dark">
                        <span className="logo-sm">
                            <img src={logo} alt="logo" height="30" />
                        </span>
                    </Link>

                    <Link to="/" className="logo logo-light">
                        <span className="logo-sm">
                            <img src={logo} alt="logo" height="30" />
                        </span>
                    </Link>
                </div>
                {/* end navbar-brand-box  */}

                {/* Start side-menu nav */}
                <div className="flex-lg-column my-auto">
                    <Nav className="side-menu-nav nav-pills justify-content-center" role="tablist">
                        {
                            hasPermission(roleId, PERMISSIONS.VIEW_PROFILE_PANEL) &&
                            <>
                                <NavItem id="profile">
                                    <NavLink id="pills-user-tab" className={classnames({ active: activeTab === 'profile' }) + " mb-2"} onClick={() => { toggleTab('profile'); }}>
                                        <i className="ri-user-2-line"></i>
                                    </NavLink>
                                </NavItem>
                                <UncontrolledTooltip target="profile" placement="top">
                                    {t("Profile")}
                                </UncontrolledTooltip>
                            </>
                        }

                        {
                            hasPermission(roleId, PERMISSIONS.VIEW_CHATS_PANEL) &&
                            <>

                                <NavItem id="Chats">
                                    <NavLink id="pills-chat-tab" className={classnames({ active: activeTab === 'chat' }) + " mb-2"} onClick={() => { toggleTab('chat'); }}>
                                        <i className="ri-message-3-line"></i>
                                    </NavLink>
                                </NavItem>
                                <UncontrolledTooltip target="Chats" placement="top">
                                    {t("Chats")}
                                </UncontrolledTooltip>
                            </>
                        }
                        {
                            hasPermission(roleId, PERMISSIONS.VIEW_CONTACTS_PANEL) &&
                            <>
                                <NavItem id="Contacts">
                                    <NavLink id="pills-contacts-tab" className={classnames({ active: activeTab === 'contacts' }) + " mb-2"} onClick={() => { toggleTab('contacts'); }}>
                                        <i className="ri-contacts-line"></i>
                                    </NavLink>
                                </NavItem>
                                <UncontrolledTooltip target="Contacts" placement="top">
                                    {t("Contacts")}
                                </UncontrolledTooltip>
                            </>
                        }
                        {
                            hasPermission(roleId, PERMISSIONS.VIEW_SETTINGS_PANEL) &&
                            <>

                                <NavItem id="Settings">
                                    <NavLink id="pills-settings-tab" className={classnames({ active: activeTab === 'settings' }) + " mb-2"} onClick={() => { toggleTab('settings'); }}>
                                        <i className="ri-settings-line"></i>
                                    </NavLink>
                                </NavItem>
                                <UncontrolledTooltip target="Settings" placement="top">
                                    {t("Settings")}
                                </UncontrolledTooltip>
                            </>
                        }



                        <Dropdown nav isOpen={dropdownOpenMobile} toggle={toggleMobile} className="profile-user-dropdown d-inline-block d-lg-none dropup">
                            <DropdownToggle nav>
                                <img src={avatar1} alt="chatvia" className="profile-user rounded-circle" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem onClick={() => { toggleTab('profile'); }}>Profile <i className="ri-profile-line float-end text-muted"></i></DropdownItem>
                                <DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-end text-muted"></i></DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem href="/logout">Log out <i className="ri-logout-circle-r-line float-end text-muted"></i></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                </div>
                {/* end side-menu nav */}

                <div className="flex-lg-column d-none d-lg-block">
                    <Nav className="side-menu-nav justify-content-center">
                        <Dropdown nav isOpen={dropdownOpen2} className="btn-group dropup profile-user-dropdown" toggle={toggle2}>
                            <DropdownToggle nav>
                                <i className="ri-global-line"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => changeLanguageAction('eng')} active={lng === "English"}>
                                    <img src={usFlag} alt="user" className="me-1" height="12" /> <span className="align-middle">English</span>
                                </DropdownItem>

                                <DropdownItem onClick={() => changeLanguageAction('sp')} active={lng === "Spanish"}>
                                    <img src={spain} alt="user" className="me-1" height="12" /> <span className="align-middle">Spanish</span>
                                </DropdownItem>

                                <DropdownItem onClick={() => changeLanguageAction('gr')} active={lng === "German"}>
                                    <img src={germany} alt="user" className="me-1" height="12" /> <span className="align-middle">German</span>
                                </DropdownItem>

                                <DropdownItem onClick={() => changeLanguageAction('it')} active={lng === "Italian"}>
                                    <img src={italy} alt="user" className="me-1" height="12" /> <span className="align-middle">Italian</span>
                                </DropdownItem>

                                <DropdownItem onClick={() => changeLanguageAction('rs')} active={lng === "Russian"}>
                                    <img src={russia} alt="user" className="me-1" height="12" /> <span className="align-middle">Russian</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <li className="nav-item">
                            <NavLink id="light-dark" className='mb-2' onClick={() => onChangeLayoutMode(mode)}>
                                <i className="ri-sun-line theme-mode-icon"></i>
                            </NavLink>
                            <UncontrolledTooltip target="light-dark" placement="right">
                                Dark / Light Mode
                            </UncontrolledTooltip>
                        </li>
                        <Dropdown nav isOpen={dropdownOpen} className="nav-item btn-group dropup profile-user-dropdown" toggle={toggle}>
                            <DropdownToggle className="nav-link mb-2" tag="a">
                                <img src={avatar1} alt="" className="profile-user rounded-circle" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => { toggleTab('profile'); }}>Profile <i className="ri-profile-line float-end text-muted"></i></DropdownItem>
                                {
                                    // <DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-end text-muted"></i></DropdownItem>
                                }
                                <DropdownItem divider />
                                <DropdownItem href="/logout">Log out <i className="ri-logout-circle-r-line float-end text-muted"></i></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                </div>
                {/* Side menu user */}
            </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
        ...state.Layout
    };
};

export default connect(mapStatetoProps, {
    setActiveTab
})(LeftSidebarMenu);