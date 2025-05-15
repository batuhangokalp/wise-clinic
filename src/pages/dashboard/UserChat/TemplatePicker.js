import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplates,
  fetchCannedResponses,
} from "../../../redux/template/actions";

const TemplatePicker = (props) => {
  const { handleTemplateSelect } = props;

  const dispatch = useDispatch();
  const { templates, loading, error, cannedResponses } = useSelector(
    (state) => state.Templates
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [cannedTags, setCannedTags] = useState([]);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const toggleTags = () => setIsTagsOpen(!isTagsOpen);
  const handleTabChange = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchCannedResponses());
  }, [dispatch]);

  useEffect(() => {
    if (templates?.length > 0) {
      let tags = new Set(
        templates.map((template) => template?.category).flat()
      );
      tags.add("All");
      setTags(Array.from(tags));
    }
  }, [templates]);

  useEffect(() => {
    if (cannedResponses?.length > 0) {
      let tags = new Set(
        cannedResponses.map((template) => template?.tags).flat()
      );
      tags.add("All");
      setCannedTags(Array.from(tags));
    }
  }, [cannedResponses]);

  const filteredTemplates = templates?.filter(
    (template) =>
      template?.vertical?.toLowerCase().includes(searchQuery?.toLowerCase()) &&
      (selectedTag === "All" || template?.category.includes(selectedTag))
  );

  const filteredCannedResponses = cannedResponses?.filter(
    (template) =>
      template?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) &&
      (selectedTag === "All" || template?.tags.includes(selectedTag))
  );

  return (
    <div className="template-list-container">
      {activeTab === "1" && (
        <div className="template-list-header">
          {tags?.length > 0 && (
            <Dropdown
              group
              isOpen={isTagsOpen}
              size="sm"
              toggle={toggleTags}
              value={selectedTag}
            >
              <DropdownToggle caret>Tags</DropdownToggle>
              <DropdownMenu>
                {tags && tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem disabled>No tags available</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
          <Input
            className="form-control bg-light border-light w-auto"
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      {activeTab === "2" && (
        <div className="template-list-header">
          {tags?.length > 0 && (
            <Dropdown
              group
              isOpen={isTagsOpen}
              size="sm"
              toggle={toggleTags}
              value={selectedTag}
            >
              <DropdownToggle caret>Tags</DropdownToggle>
              <DropdownMenu>
                {tags && tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem disabled>No tags available</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
          <Input
            className="form-control bg-light border-light w-auto"
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      <hr />
      <div
        className="tabs"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          color={activeTab === "1" ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleTabChange("1")}
        >
          Templates
        </Button>
        <Button
          color={activeTab === "2" ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleTabChange("2")}
        >
          Canned Responses
        </Button>
      </div>
      <hr />
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              {filteredTemplates?.length <= 0 && loading && <p>Loading...</p>}
              {filteredTemplates?.length <= 0 && error && <p>Error: {error}</p>}
              {filteredTemplates?.map((template, index) => (
                <div
                  key={index}
                  onClick={(e) => handleTemplateSelect(e, template, activeTab)}
                >
                  <div style={{ display: "block" }}>
                    <div className="template-list">
                      <span className="template-title">
                        <i
                          className="ri-whatsapp-fill text-success template-platform"
                          aria-hidden="true"
                        ></i>
                        <b>{template?.vertical}</b>
                      </span>
                      <br />
                      <span className="template-text">
                        {template?.data?.substring(0, 50) + "..."}
                      </span>
                    </div>
                    <hr />
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              {cannedResponses?.map((template, index) => (
                <div
                  key={index}
                  onClick={(e) => handleTemplateSelect(e, template, activeTab)}
                >
                  <div style={{ display: "block" }}>
                    <div className="template-list">
                      <span className="template-title">
                        <i
                          className="ri-whatsapp-fill text-success template-platform"
                          aria-hidden="true"
                        ></i>
                        <b>{template?.name}</b>
                      </span>
                      <br />
                      <span className="template-text">
                        {template?.content?.substring(0, 50) + "..."}
                      </span>
                    </div>
                    <hr />
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default TemplatePicker;
