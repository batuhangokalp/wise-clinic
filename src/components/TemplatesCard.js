import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { usePagination, useTable } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTemplates,
  createTemplate,
  apiTemplateError,
  apiTemplateSuccess,
  updateTemplate,
  deleteTemplate,
} from "../redux/actions";
import * as Yup from "yup";
import Swal from "sweetalert2";
import UpdateTemplateModal from "./UpdateTemplateModal";
import CreateTemplateModal from "./CreateTemplateModal";

const columns = [
  {
    Header: "ID",
    accessor: "id", // accessor is the "key" in the data
  },
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
];

export default function TemplatesCard(props) {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.Templates.templates); // Original data

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const [createTemplateModal, setCreateTemplateModal] = useState(false);
  const [updateTemplateModal, setUpdateTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variableContent, setVariableContent] = useState("");
  const [variableHeader, setVariableHeader] = useState("");
  const [inputVariable, setInputVariable] = useState("");
  const [inputVariableHeader, setInputVariableHeader] = useState("");

  const [open, setOpen] = useState(false);
  const [openHeaderModal, setOpenHeaderModal] = useState(false);

  const error = useSelector((state) => state.Templates.error);
  const success = useSelector((state) => state.Templates.success);

  const createValidationSchema = Yup.object().shape({
    element_name: Yup.string().required(props.t("Template name is required")),
    content: Yup.string().required(props.t("Content is required")),
  });

  const updateValidationSchema = Yup.object().shape({
    element_name: Yup.string().required(props.t("Template name is required")),
    content: Yup.string().required(props.t("Content is required")),
  });

  const toggle = () => setOpen(!open);
  const toggleHeaderModal = () => setOpenHeaderModal(!openHeaderModal);

  const handleAddVariableContent = (inputVar) => {
    setInputVariable(inputVar);
    toggle();
  };
  const handleAddVariableHeader = (inputVar) => {
    setInputVariableHeader(inputVar);
    toggleHeaderModal();
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

  const handleCreateSubmit = async (values) => {
    values.contentVariable = `{{${inputVariable}}}`;
    values.headerVariable = `{{${inputVariableHeader}}}`;
    await dispatch(createTemplate(values)).then((response) => {
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

  const handleUpdateSubmit = async (values) => {
    await dispatch(updateTemplate(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setUpdateTemplateModal(false);
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
                  {headerGroups?.map((headerGroup) => (
                    <tr {...headerGroup?.getHeaderGroupProps()}>
                      {headerGroup?.headers?.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </th>
                      ))}
                      <th>{props.t("Actions")}</th>
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td className="text-break" {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedTemplate(row.original);
                                dispatch(apiTemplateError(null));
                                dispatch(apiTemplateSuccess(null));
                                setUpdateTemplateModal(true);
                              }}
                            >
                              {props.t("Edit")}
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={(e) => {
                                handleDelete(e, row.original.id);
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
      />
      <UpdateTemplateModal
        modal={updateTemplateModal}
        toggleModal={() => {
          setUpdateTemplateModal(!updateTemplateModal);
          dispatch(apiTemplateError(null));
          dispatch(apiTemplateSuccess(null));
        }}
        parentProps={{
          t: props.t,
          error: error,
          success: success,
        }}
        validationSchema={updateValidationSchema}
        handleSubmit={handleUpdateSubmit}
        selectedItem={selectedTemplate}
      />
    </div>
  );
}
