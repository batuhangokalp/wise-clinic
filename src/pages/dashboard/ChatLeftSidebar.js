import React from "react";
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

//Import Components
import Profile from "./Tabs/Profile";
import Chats from "./Tabs/Chats";
import Contacts from "./Tabs/Contacts";
import Settings from "./Tabs/Settings";

function ChatLeftSidebar(props) {

  const activeTab = props.activeTab;

  return (
    <React.Fragment>
      <div className="chat-leftsidebar me-lg-1">
        <TabContent activeTab={activeTab}>
          <TabPane tabId="profile" id="pills-user">
            <Profile />
          </TabPane>

          <TabPane tabId="chat" id="pills-chat">
            <Chats recentChatList={props.recentChatList} />
          </TabPane>

          <TabPane tabId="contacts" id="pills-contacts">
            <Contacts />
          </TabPane>

          <TabPane tabId="settings" id="pills-setting">
            <Settings />
          </TabPane>
        </TabContent>
      </div>
    </React.Fragment>
  );
}

const mapStatetoProps = (state) => {
  return {
    ...state.Layout,
  };
};

export default connect(mapStatetoProps, null)(ChatLeftSidebar);
