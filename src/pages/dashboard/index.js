import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
// Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/index";
import Layout from "./../../redux/layout/reducer";
import Settings from "./Tabs/Settings";
import { leftPanelDecider } from "./../../helpers/leftPanelDecider";
import { pageTabs } from "../../helpers/pageTabs";

const Index = () => {
  const activeTab = useSelector((state) => state.Layout.activeTab);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const conversations = useSelector((state) => state.Chat.conversations);

  const unreadConversations = conversations.filter(
    (conv) => conv.unread_count > 0
  );
  const hasUnread = unreadConversations.length > 0;

  useEffect(() => {
    if (hasUnread) {
      document.title = "Chat | Upsense  🔴";
    } else {
      document.title = "Chat | Upsense";
    }
  }, [hasUnread]);

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
