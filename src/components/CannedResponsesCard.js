import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { usePagination, useTable } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCannedResponses,
  createCannedResponse,
  apiTemplateError,
  apiTemplateSuccess,
  updateCannedResponse,
  deleteCannedResponse,
} from "../redux/actions";
import * as Yup from "yup";
import Swal from "sweetalert2";
import CreateCannedResponseModal from "./CreateCannedResponseModal";
import UpdateCannedResponseModal from "./UpdateCannedResponseModal";

const columns = [
  {
    Header: "ID",
    accessor: "id", // accessor is the "key" in the data
  },
  {
    Header: "Canned Response",
    accessor: "name",
    Cell: ({ value }) => {
      return (
        <div className="text-break">
          {value?.length > 50 ? value.substring(0, 50) + "..." : value}
        </div>
      );
    },
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

export default function CannedResponseCard(props) {
  const dispatch = useDispatch();
  const cannedResponses = useSelector(
    (state) => state.Templates.cannedResponses
  ); // Original data

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCannedResponses, setFilteredCannedResponses] =
    useState(cannedResponses);
  const [createCannedResponseModal, setCreateCannedResponseModal] =
    useState(false);
  const [updateCannedResponseModal, setUpdateCannedResponseModal] =
    useState(false);
  const [selectedCannedResponse, setSelectedCannedResponse] = useState(null);
  const error = useSelector((state) => state.Templates.error);
  const success = useSelector((state) => state.Templates.success);

  const createValidationSchema = Yup.object().shape({
    name: Yup.string().required(props.t("Canned response name is required")),
    content: Yup.string().required(props.t("Content is required")),
  });

  const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required(props.t("Canned response name is required")),
    content: Yup.string().required(props.t("Content is required")),
  });

  useEffect(() => {
    dispatch(fetchCannedResponses());
  }, [dispatch]);

  useEffect(() => {
    const filteredData = cannedResponses?.filter((cannedResponse) =>
      columns.some((column) => {
        const value = cannedResponse[column.accessor];
        // Ensure both value and search term are treated as strings for comparison
        return (
          value !== undefined &&
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
    setFilteredCannedResponses(filteredData);
  }, [searchTerm, cannedResponses]);

  const tableInstance = useTable(
    {
      columns,
      data: filteredCannedResponses,
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
    await dispatch(createCannedResponse(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setCreateCannedResponseModal(false);
          dispatch(fetchCannedResponses());
          dispatch(apiTemplateError(null));
          dispatch(apiTemplateSuccess(null));
        }, 3000);
      }
    });
  };

  const handleUpdateSubmit = async (values) => {
    await dispatch(updateCannedResponse(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setUpdateCannedResponseModal(false);
          dispatch(fetchCannedResponses());
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
      text: props.t("You will not be able to recover this canned response!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: props.t("Yes, delete it!"),
      cancelButtonText: props.t("No, keep it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteCannedResponse(id));
          if (response) {
            dispatch(fetchCannedResponses());
            dispatch(apiTemplateError(null));
            dispatch(apiTemplateSuccess(null));
          }
        } catch (error) {
          console.error("Error deleting canned response:", error);
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
            <h5 className="mb-0">{props.t("Canned Responses")}</h5>
            <div className="d-flex flex-wrap gap-2 w-50">
              <input
                placeholder={props.t("Search Canned Responses")}
                type="text"
                className="form-control"
                id="cannedResponse"
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
                  setCreateCannedResponseModal(true);
                }}
              >
                {props.t("Create Canned Response")}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-4">
              {/* Positions Table Section */}
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
                  {page?.map((row) => {
                    prepareRow(row);
                    const { key: rowKey, ...rowProps } = row.getRowProps();
                    return (
                      <tr key={rowKey} {...rowProps}>
                        {row?.cells?.map((cell) => {
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
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedCannedResponse(row.original);
                                dispatch(apiTemplateError(null));
                                dispatch(apiTemplateSuccess(null));
                                setUpdateCannedResponseModal(true);
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
      <CreateCannedResponseModal
        modal={createCannedResponseModal}
        toggleModal={() => {
          setCreateCannedResponseModal(!createCannedResponseModal);
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
      />
      <UpdateCannedResponseModal
        modal={updateCannedResponseModal}
        toggleModal={() => {
          setUpdateCannedResponseModal(!updateCannedResponseModal);
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
        selectedItem={selectedCannedResponse}
      />
    </div>
  );
}
