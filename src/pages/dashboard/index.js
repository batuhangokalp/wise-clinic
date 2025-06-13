import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/index";
import Layout from './../../redux/layout/reducer';
import Settings from './Tabs/Settings';
import { leftPanelDecider } from './../../helpers/leftPanelDecider';
import { pageTabs } from '../../helpers/pageTabs';

const Index = () => {
    const activeTab = useSelector((state) => state.Layout.activeTab);
    const [showLeftPanel, setShowLeftPanel] = React.useState(true);


    useEffect(() => {
        document.title = "Chat | Upsense";
    }, []);

    useEffect(() => {
        let result = leftPanelDecider(activeTab);
        setShowLeftPanel(result);
    }, [activeTab]);

    return (
        <React.Fragment>
            {/* chat left sidebar */}
            {showLeftPanel && <ChatLeftSidebar />}
            

            {/* user chat */}
            {activeTab === pageTabs.chat && <UserChat />}
            {activeTab === pageTabs.settings && <Settings />}
        </React.Fragment>
    );
};

export default Index;