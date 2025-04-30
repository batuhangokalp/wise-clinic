import React from 'react'
import { useTranslation } from 'react-i18next';

export default function AccessDenied() {
    const { t } = useTranslation();

    return (
        <div className="container-fluid p-4 mt-5 ">

            <div className="text-center">
                <div className="mb-4">

                    <h1>🚫</h1>
                </div>
                <div>
                    <h3>{t("Access Denied")}</h3>
                    <p className="text-muted">{t("You do not have permission to access this page.")}</p>
                </div>
            </div>
        </div>
    )
}
