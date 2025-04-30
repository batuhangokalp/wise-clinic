import React from 'react';
import { Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";

//i18n
import { useTranslation } from 'react-i18next';

function FileList(props) {

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Card className="p-2 mb-2">
                <div className="d-flex align-items-center">
                    <div className="avatar-sm me-3 ms-0">
                        <div className="avatar-title bg-primary-subtle text-primary rounded font-size-20">
                            <i className="ri-file-text-fill"></i>
                        </div>
                    </div>
                    <div className="flex-grow-1">
                        <div className="text-start">
                            <h5 className="font-size-14 mb-1">{props.file?.message_content}</h5>
                        </div>
                    </div>

                    <div className="ms-4">
                        <ul className="list-inline mb-0 font-size-20">
                           
                            <li className="list-inline-item">
                                <a
                                    href={props.file?.file_path}
                                    download
                                    className="text-muted"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={t('Open')}
                                    target='_blank'
                                >
                                    <i className="ri-book-2-line"></i>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a
                                    href={props.file?.file_path?.replace("download=false", "download=true")}
                                    download
                                    className="text-muted"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={t('Download')}
                                    target='_blank'
                                >
                                    <i className="ri-download-2-line"></i>
                                </a>
                            </li>

                            {

                                /*
                                                            <UncontrolledDropdown tag="li" className="list-inline-item">
                                                                <DropdownToggle tag="a" className="dropdown-toggle text-muted">
                                                                    <i className="ri-more-fill"></i>
                                                                </DropdownToggle>
                                                             
                                                                    <DropdownMenu className="dropdown-menu-end">
                                                                    <DropdownItem>{t('Share')} <i className="ri-share-line float-end text-muted"></i></DropdownItem>
                                                                </DropdownMenu>
                                                                   
                                                            </UncontrolledDropdown>
                                                             */
                            }
                        </ul>
                    </div>
                </div>
            </Card>
        </React.Fragment>
    );
}

export default FileList;