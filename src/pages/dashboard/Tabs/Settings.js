import React, { useEffect, useState } from 'react';
import { Row, Nav, NavItem, NavLink, TabContent, TabPane, } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import RolesCard from '../../../components/RolesCard';
import UsersCard from '../../../components/UsersCard';
import DepartmentsCard from '../../../components/DepartmentsCard';
import PositionsCard from '../../../components/PositionsCard';
import PermissionWrapper from './../../../components/PermissionWrapper';
import { PERMISSIONS } from "../../../redux/role/constants";
import { useSelector } from 'react-redux';
import { hasPermission } from '../../../redux/actions';
import TemplatesCard from '../../../components/TemplatesCard';
import CannedResponsesCard from '../../../components/CannedResponsesCard';

function Settings(props) {
    const roleId = useSelector((state) => state.User.user?.role_id);
    const [activeTab, setActiveTab] = useState('roles');
    const { t } = useTranslation();

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    useEffect(() => {
        if (hasPermission(roleId, PERMISSIONS.VIEW_ROLES)) {
            setActiveTab('roles');
        }
        else if (hasPermission(roleId, PERMISSIONS.VIEW_USERS)) {
            setActiveTab('users');
        }
        else if (hasPermission(roleId, PERMISSIONS.VIEW_DEPARTMENTS)) {
            setActiveTab('departments');
        }
        else if (hasPermission(roleId, PERMISSIONS.VIEW_POSITIONS)) {
            setActiveTab('positions');
        }
        else if (hasPermission(roleId, PERMISSIONS.VIEW_TEMPLATES)) {
            setActiveTab('templates');
        }
        else if (hasPermission(roleId, PERMISSIONS.VIEW_CANNED_RESPONSES)) {
            setActiveTab('canned_responses');
        }
    }, [roleId]);


    return (
        <div className='container-fluid w-100 align-items-center'>
            <Row>
                <div className="d-flex justify-content align-items-center px-4 pt-4">
                    <h4 className="mb-0">{t('Settings')}</h4>
                    <Row className="ms-2">
                        <Nav tabs>
                            {
                                hasPermission(roleId, PERMISSIONS.VIEW_ROLES) &&
                                <NavItem>
                                <NavLink
                                    className={activeTab === 'roles' ? 'active text-primary text fw-bolder text-decoration-underline' : ''}
                                    onClick={() => { toggle('roles'); }}
                                >
                                    {t('Roles')}
                                </NavLink>
                            </NavItem>
                           }
                            {hasPermission(roleId, PERMISSIONS.VIEW_USERS) &&
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'users' ? 'active text-primary text fw-bolder text-decoration-underline' : ''}
                                        onClick={() => { toggle('users'); }}
                                    >
                                        {t('Users')}
                                    </NavLink>
                                </NavItem>
                            }

                            {hasPermission(roleId, PERMISSIONS.VIEW_DEPARTMENTS) && <NavItem>
                                <NavLink
                                    className={activeTab === 'departments' ? 'active text-primary text fw-bolder text-decoration-underline' : ''}
                                    onClick={() => { toggle('departments'); }}
                                >
                                    {t('Departments')}
                                </NavLink>
                            </NavItem>
                            }

                            {hasPermission(roleId, PERMISSIONS.VIEW_POSITIONS) &&
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'positions' ? 'active text-primary text fw-bolder text-decoration-underline' : ''}
                                        onClick={() => { toggle('positions'); }}
                                    >
                                        {t('Positions')}
                                    </NavLink>
                                </NavItem>
                            }

                            {hasPermission(roleId, PERMISSIONS.VIEW_TEMPLATES) &&
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'templates' ? 'active text-primary text fw-bolder text-decoration-underline' : ''}
                                        onClick={() => { toggle('templates'); }}
                                    >
                                        {t('Templates')}
                                    </NavLink>
                                </NavItem>
                            }

                            {hasPermission(roleId, PERMISSIONS.VIEW_CANNED_RESPONSES) &&
                                <NavItem>
                                    <NavLink
                                        className={activeTab === 'canned_responses' ? 'active text-primary text fw-bolder text-decoration-underline' : ''}
                                        onClick={() => { toggle('canned_responses'); }}
                                    >
                                        {t('Canned Responses')}
                                    </NavLink>
                                </NavItem>}
                        </Nav>
                    </Row>
                </div>

            </Row>

            <Row>
                <div>
                    <TabContent activeTab={activeTab}>
                        { hasPermission(roleId, PERMISSIONS.VIEW_ROLES) &&
                        <TabPane tabId="roles" id="pills-roles">
                            <RolesCard t={t} />
                        </TabPane>
                        }
                        { hasPermission(roleId, PERMISSIONS.VIEW_USERS) &&
                        <TabPane tabId="users" id="pills-users">
                            <UsersCard t={t} />
                        </TabPane>
                        }
                        { hasPermission(roleId, PERMISSIONS.VIEW_DEPARTMENTS) &&
                        <TabPane tabId="departments" id="pills-departmens">
                            <DepartmentsCard t={t} />
                        </TabPane>
                        }
                        { hasPermission(roleId, PERMISSIONS.VIEW_POSITIONS) &&
                        <TabPane tabId="positions" id="pills-positions">
                            <PositionsCard t={t} />
                        </TabPane>
                        }
                        { hasPermission(roleId, PERMISSIONS.VIEW_TEMPLATES) &&
                        <TabPane tabId="templates" id="pills-templates">
                           <TemplatesCard  t={t} />
                        </TabPane>
                        }
                        { hasPermission(roleId, PERMISSIONS.VIEW_CANNED_RESPONSES) &&
                        <TabPane tabId="canned_responses" id="pills-canned_responses">
                             <CannedResponsesCard  t={t} />
                            </TabPane>
                        }
                    </TabContent>
                </div>
            </Row>
        </div>
    );
}

export default PermissionWrapper(Settings, PERMISSIONS.VIEW_SETTINGS_PANEL);