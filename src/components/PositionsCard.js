import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { useTable } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPositions,
  createPosition,
  apiUserError,
  apiUserSuccess,
  updatePosition,
  deletePosition,
} from "../redux/actions";
import * as Yup from "yup";
import Swal from "sweetalert2";
import CreatePositionModal from "./CreatePositionModal";
import UpdatePositionModal from "./UpdatePositionModal";
import { toast } from "react-toastify";

const columns = [
  {
    Header: "Position",
    accessor: "name",
  },
  {
    Header: "Description",
    accessor: "description",
  },
];

export default function PositionsCard(props) {
  const dispatch = useDispatch();
  const positions = useSelector((state) => state.User.positions); // Original data

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPositions, setFilteredPositions] = useState(positions);
  const [createPositionModal, setCreatePositionModal] = useState(false);
  const [updatePositionModal, setUpdatePositionModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const error = useSelector((state) => state.User.error);
  const success = useSelector((state) => state.User.success);

  const createValidationSchema = Yup.object().shape({
    name: Yup.string().required(props.t("Position name is required")),
    description: Yup.string().required(props.t("Description is required")),
  });

  const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required(props.t("Position name is required")),
    description: Yup.string().required(props.t("Description is required")),
  });

  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  useEffect(() => {
    const filteredData = positions.filter((position) =>
      columns.some((column) => {
        const value = position[column.accessor];
        // Ensure both value and search term are treated as strings for comparison
        return (
          value !== undefined &&
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
    setFilteredPositions(filteredData);
  }, [searchTerm, positions]);

  const tableInstance = useTable({ columns, data: filteredPositions });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleCreateSubmit = async (values) => {
    await dispatch(createPosition(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setCreatePositionModal(false);
          dispatch(fetchPositions());
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }, 3000);
      }
    });
  };

  const handleUpdateSubmit = async (values) => {
    await dispatch(updatePosition(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setUpdatePositionModal(false);
          dispatch(fetchPositions());
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }, 3000);
      }
    });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    // Display confirmation dialog
    Swal.fire({
      title: props.t("Are you sure?"),
      text: props.t("You will not be able to recover this position!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: props.t("Yes, delete it!"),
      cancelButtonText: props.t("No, keep it"),
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deletePosition(id));
          if (response) {
            toast.success("Position deleted successfully!");
            dispatch(fetchPositions());
            dispatch(apiUserError(null));
            dispatch(apiUserSuccess(null));
          }
        } catch (error) {
          console.error("Error deleting position:", error);
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
            <h5 className="mb-0">{props.t("Positions")}</h5>
            <div className="d-flex flex-wrap gap-2 w-50">
              <input
                placeholder={props.t("Search Positions")}
                type="text"
                className="form-control"
                id="position"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  dispatch(apiUserError(null));
                  dispatch(apiUserSuccess(null));
                  setCreatePositionModal(true);
                }}
              >
                {props.t("Create Position")}
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
                  {rows.map((row) => {
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
                          {/* button group for edit and delete */}
                          <div className="btn-group">
                            {/*<button className="btn btn-dark">
                  {t('Users')}
                </button>*/}
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedPosition(row.original);
                                dispatch(apiUserError(null));
                                dispatch(apiUserSuccess(null));
                                setUpdatePositionModal(true);
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
          </div>
        </div>
      </Col>
      <Col xxl={1}></Col>
      <CreatePositionModal
        modal={createPositionModal}
        toggleModal={() => {
          setCreatePositionModal(!createPositionModal);
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }}
        parentProps={{
          t: props.t,
          error: error,
          success: success,
        }}
        validationSchema={createValidationSchema}
        handleSubmit={handleCreateSubmit}
      />
      <UpdatePositionModal
        modal={updatePositionModal}
        toggleModal={() => {
          setUpdatePositionModal(!updatePositionModal);
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }}
        parentProps={{
          t: props.t,
          error: error,
          success: success,
        }}
        validationSchema={updateValidationSchema}
        handleSubmit={handleUpdateSubmit}
        selectedItem={selectedPosition}
      />
    </div>
  );
}
