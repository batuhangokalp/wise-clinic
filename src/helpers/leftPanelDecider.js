
import React from "react";
import Profile from "../pages/dashboard/Tabs/Profile";
import Chats from "../pages/dashboard/Tabs/Chats";
import Contacts from "../pages/dashboard/Tabs/Contacts";
import Settings from "../pages/dashboard/Tabs/Settings";

import { pageTabs } from "./pageTabs";
export const leftPanelDecider = (activeTab) => {
    switch (activeTab) {
        case pageTabs.profile:
            return true
        case pageTabs.chat:
            return true
        case  pageTabs.contacts:
            return true
        case  pageTabs.settings:
            return false
        default:
            return true;
    }
}