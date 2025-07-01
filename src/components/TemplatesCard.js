import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { usePagination, useTable } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTemplates,
  createTemplate,
  apiTemplateError,
  apiTemplateSuccess,
  deleteTemplate,
} from "../redux/actions";
import * as Yup from "yup";
import Swal from "sweetalert2";
import CreateTemplateModal from "./CreateTemplateModal";

const columns = [
  {
    Header: "Template",
    accessor: "element_name",
  },
  {
    Header: "Content",
    accessor: "content",
    Cell: ({ value }) => {
      return (
        <div className="text-break">
          {value?.length > 50 ? value.substring(0, 50) + "..." : value}
        </div>
      );
    },
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

export default function TemplatesCard(props) {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.Templates?.templates); // Original data

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const [createTemplateModal, setCreateTemplateModal] = useState(false);
  const [variableContent, setVariableContent] = useState([]);
  const [variableHeader, setVariableHeader] = useState([]);

  // FOR HEADER
  const [tempKey, setTempKey] = useState("");
  const [tempValue, setTempValue] = useState("");

  // FOR CONTENT
  const [tempContentKey, setTempContentKey] = useState("");
  const [tempContentValue, setTempContentValue] = useState("");

  const [open, setOpen] = useState(false);
  const [openHeaderModal, setOpenHeaderModal] = useState(false);

  const error = useSelector((state) => state.Templates.error);
  const success = useSelector((state) => state.Templates.success);

  const createValidationSchema = Yup.object().shape({
    element_name: Yup.string().required(props.t("Template name is required")),
    content: Yup.string().required(props.t("Content is required")),
  });

  const toggle = () => setOpen(!open);
  const toggleHeaderModal = () => setOpenHeaderModal(!openHeaderModal);
  const handleAddVariableContent = () => {
    if (!tempContentKey || !tempContentValue) return;

    setVariableContent((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.key === tempContentKey);
      if (index !== -1) {
        updated[index].value = tempContentValue;
      } else {
        updated.push({ key: tempContentKey, value: tempContentValue });
      }
      return updated;
    });

    toggle();
    setTempContentKey("");
    setTempContentValue("");
  };

  const handleAddVariableHeader = () => {
    if (!tempKey || !tempValue) return;

    setVariableHeader((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.key === tempKey);
      if (index !== -1) {
        updated[index].value = tempValue;
      } else {
        updated.push({ key: tempKey, value: tempValue });
      }
      return updated;
    });

    // Modal kapat ve inputları sıfırla
    toggleHeaderModal();
    setTempKey("");
    setTempValue("");
  };

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    const filteredData = templates?.filter((position) =>
      columns.some((column) => {
        const value = position[column.accessor];
        // Ensure both value and search term are treated as strings for comparison
        return (
          value !== undefined &&
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
    setFilteredTemplates(filteredData);
  }, [searchTerm, templates]);

  const tableInstance = useTable(
    {
      columns,
      data: filteredTemplates,
      initialState: { pageIndex: 0, pageSize: 10 }, // Default page settings
    },
    usePagination // Enable pagination plugin
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Only the rows for the current page
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state: { pageIndex },
  } = tableInstance;

  const resolveVariables = (text, variables) => {
    if (!variables || variables.length === 0) return text;

    return text.replace(/\{\{(\d+)\}\}/g, (_, key) => {
      const found = variables.find((v) => v.key === key);
      return found ? found.value : `{{${key}}}`;
    });
  };

  const handleCreateSubmit = async (values) => {
    const exampleHeader = resolveVariables(values.header, variableHeader);
    const exampleContent = resolveVariables(values.content, variableContent);

    const template = {
      ...values,
      header: values.header,
      example_header: exampleHeader,
      content: values.content,
      example: exampleContent,
    };

    await dispatch(createTemplate(template)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setCreateTemplateModal(false);
          dispatch(fetchTemplates());
          dispatch(apiTemplateError(null));
          dispatch(apiTemplateSuccess(null));
        }, 3000);
      }
    });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    // Display confirmation dialog
    Swal.fire({
      title: props.t("Are you sure?"),
      text: props.t("You will not be able to recover this template!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: props.t("Yes, delete it!"),
      cancelButtonText: props.t("No, keep it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteTemplate(id));
          if (response) {
            dispatch(fetchTemplates());
            dispatch(apiTemplateError(null));
            dispatch(apiTemplateSuccess(null));
          }
        } catch (error) {
          console.error("Error deleting template:", error);
        }
      }
    });
  };
  return (
    <div className="d-flex justify-content-center">
      <Col xxl={1}></Col>
      <Col xs={12} xl={12} xxl={12} className="container mt-4 ms-4">
        <div className="card shadow-sm">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{props.t("Templates")}</h5>
            <div className="d-flex flex-wrap gap-2 w-50">
              <input
                placeholder={props.t("Search Templates")}
                type="text"
                className="form-control"
                id="template"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  dispatch(apiTemplateError(null));
                  dispatch(apiTemplateSuccess(null));
                  setCreateTemplateModal(true);
                }}
              >
                {props.t("Create Template")}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-4">
              {/* Templates Table Section */}
              <table
                className="table border border-2 table-bordered text-center"
                {...getTableProps()}
              >
                <thead>
                  {headerGroups?.map((headerGroup) => {
                    const { key: headerKey, ...headerProps } =
                      headerGroup.getHeaderGroupProps();
                    return (
                      <tr key={headerKey} {...headerProps}>
                        {headerGroup.headers?.map((column) => {
                          const { key: colKey, ...colProps } =
                            column.getHeaderProps();
                          return (
                            <th key={colKey} {...colProps}>
                              {column.render("Header")}
                            </th>
                          );
                        })}
                        <th>{props.t("Actions")}</th>
                      </tr>
                    );
                  })}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    const { key: rowKey, ...rowProps } = row.getRowProps();
                    return (
                      <tr key={rowKey} {...rowProps}>
                        {row.cells.map((cell) => {
                          const { key: cellKey, ...cellProps } =
                            cell.getCellProps();
                          return (
                            <td
                              key={cellKey}
                              className="text-break"
                              {...cellProps}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-secondary"
                              onClick={(e) => {
                                handleDelete(e, row.original.element_name);
                              }}
                            >
                              {props.t("Delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                {props.t("Previous")}
              </button>
              <span>
                {props.t("Page")} {pageIndex + 1} {props.t("of")}{" "}
                {pageOptions.length}
              </span>
              <button
                className="btn btn-outline-secondary"
                onClick={nextPage}
                disabled={!canNextPage}
              >
                {props.t("Next")}
              </button>
            </div>
          </div>
        </div>
      </Col>
      <Col xxl={1}></Col>
      <CreateTemplateModal
        modal={createTemplateModal}
        toggleModal={() => {
          setCreateTemplateModal(!createTemplateModal);
          dispatch(apiTemplateError(null));
          dispatch(apiTemplateSuccess(null));
        }}
        parentProps={{
          t: props.t,
          error: error,
          success: success,
        }}
        validationSchema={createValidationSchema}
        handleSubmit={handleCreateSubmit}
        open={open}
        setOpen={setOpen}
        toggle={toggle}
        variableContent={variableContent}
        setVariableContent={setVariableContent}
        handleAddVariableContent={handleAddVariableContent}
        openHeaderModal={openHeaderModal}
        setOpenHeaderModal={setOpenHeaderModal}
        toggleHeaderModal={toggleHeaderModal}
        variableHeader={variableHeader}
        setVariableHeader={setVariableHeader}
        handleAddVariableHeader={handleAddVariableHeader}
        tempKey={tempKey}
        setTempKey={setTempKey}
        tempValue={tempValue}
        setTempValue={setTempValue}
        tempContentKey={tempContentKey}
        setTempContentKey={setTempContentKey}
        tempContentValue={tempContentValue}
        setTempContentValue={setTempContentValue}
      />
    </div>
  );
}
